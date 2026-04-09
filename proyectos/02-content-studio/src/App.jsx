import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";

// ─── Constants ──────────────────────────────────────────────────────────────
import { PLATFORMS, TONES, FORMATS, BRAND_MIN, BRAND_MAX, safeHex } from "./constants/platforms.js";
import { UI } from "./constants/translations.js";
import { TOUR_TEXT } from "./constants/tourSteps.js";

// ─── Services ───────────────────────────────────────────────────────────────
import { generateWithToolUse, generateWithClaude, generateWithGroq, generateWithHuggingFace, generateWithServerAI } from "./services/generateApi.js";
import { agenticGenerate } from "./services/agenticPipeline.js";
import { generateSmartContent } from "./utils/contentGenerator.js";

// ─── Hooks ──────────────────────────────────────────────────────────────────
import { loadHistory, saveToHistory, clearHistory, loadStats, trackGeneration, topEntry } from "./hooks/useContentHistory.js";

// ─── Components ─────────────────────────────────────────────────────────────
import Toast from "./components/common/Toast.jsx";
import CopyCard from "./components/common/CopyCard.jsx";
import MockVisual from "./components/common/MockVisual.jsx";
import ContactBar from "./components/common/ContactBar.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import OnboardingTour from "./components/onboarding/OnboardingTour.jsx";
import ContentCalendar from "./components/calendar/ContentCalendar.jsx";
import TemplateManager from "./components/templates/TemplateManager.jsx";
import PerformancePrediction from "./components/content/PerformancePrediction.jsx";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const APPLE_EASE = [0.16, 1, 0.3, 1];
const GLASS = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 16,
};
const BG_COLOR = "#09090B";

export default function ContentGenerator() {
  const [lang, setLang] = useState("es");
  const [brand, setBrand] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("Profesional");
  const [format, setFormat] = useState("Producto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("copy");
  const [loadingStep, setLoadingStep] = useState("");
  const [toast, setToast] = useState({ message: "", visible: false });
  const [generationCount, setGenerationCount] = useState(0);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("cs_apikey") || "");
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [hfToken, setHfToken] = useState(() => localStorage.getItem("cs_hftoken") || "");
  const [showHfKey, setShowHfKey] = useState(false);
  const [usedAI, setUsedAI] = useState(false);
  const [contentSource, setContentSource] = useState("templates");
  const [history, setHistory] = useState(() => loadHistory());
  const [showHistory, setShowHistory] = useState(false);
  const [variants, setVariants] = useState(null);
  const [favoriteVariant, setFavoriteVariant] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(() => loadStats());
  const [exportOpen, setExportOpen] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);
  const [lastHookType, setLastHookType] = useState(null);
  const [mainTab, setMainTab] = useState("content");

  // ── ONBOARDING TOUR STATE ──
  const [tourActive, setTourActive] = useState(true);
  const [tourStep, setTourStep] = useState(0);
  const [tourLang, setTourLang] = useState("en");
  const tourT = TOUR_TEXT[tourLang];

  const [scrollProgress, setScrollProgress] = useState(0);

  const s = UI[lang];
  const generationIdRef = useRef(0);

  // ── LENIS SMOOTH SCROLL ──
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // ── SCROLL PROGRESS ──
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── TOUR REFS ──
  const platformRef = useRef(null);
  const toneFormatRef = useRef(null);
  const brandRef = useRef(null);
  const generateBtnRef = useRef(null);
  const resultCopyRef = useRef(null);
  const resultVisualRef = useRef(null);
  const variantBtnRef = useRef(null);
  const calendarTabRef = useRef(null);
  const templateRef = useRef(null);
  const tourTimeoutsRef = useRef([]);

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2200);
  };

  // ── TOUR HELPERS (NexusForge pattern) ──
  const [tourActionRunning, setTourActionRunning] = useState(false);

  const addTourTimeout = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    tourTimeoutsRef.current.push(id);
    return id;
  }, []);

  const clearTourTimeouts = useCallback(() => {
    tourTimeoutsRef.current.forEach(t => clearTimeout(t));
    tourTimeoutsRef.current = [];
  }, []);

  // Helper: type into React controlled input
  const typeIntoInput = useCallback((ref, text) => {
    if (!ref?.current) return;
    const el = ref.current.querySelector("textarea") || ref.current.querySelector("input") || ref.current;
    if (!el) return;
    const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set
      || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    if (nativeSet) {
      nativeSet.call(el, text);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, []);

  // ── TOUR ACTIONS ──
  const endTour = useCallback(() => {
    clearTourTimeouts();
    setTourActionRunning(false);
    // FIRST reset tabs (before hiding tour, so UI updates correctly)
    setMainTab("content");
    setActiveTab("copy");
    // THEN hide tour
    setTourStep(-1);
    setTourActive(false);
    // Scroll after a tick to ensure tab switch rendered
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  }, [clearTourTimeouts]);

  const restartTour = useCallback(() => {
    clearTourTimeouts();
    setTourActionRunning(false);
    // Reset state for a fresh tour
    setBrand("");
    setResult(null);
    setVariants(null);
    setFavoriteVariant(null);
    setMainTab("content");
    setActiveTab("copy");
    setPlatform("instagram");
    setTone("Profesional");
    setFormat("Producto");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTourActive(true);
    setTourStep(0);
  }, [clearTourTimeouts]);

  const tourNext = useCallback(async () => {
    const step = tourStep;
    clearTourTimeouts();

    if (step === 0) {
      // Welcome -> Step 1: Type brand
      setLang(tourLang);
      setMainTab("content");
      setTourStep(1);
      setTourActionRunning(true);
      addTourTimeout(() => {
        brandRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      // Type the sample brand text character by character (simulated)
      addTourTimeout(() => {
        const sampleText = TOUR_TEXT[tourLang].sampleBrand;
        setBrand(sampleText);
      }, 500);
      addTourTimeout(() => {
        setTourActionRunning(false);
      }, 1200);

    } else if (step === 1) {
      // Step 1 -> Step 2: Click Instagram
      setTourStep(2);
      setTourActionRunning(true);
      addTourTimeout(() => {
        platformRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      addTourTimeout(() => {
        setPlatform("instagram");
        setTourActionRunning(false);
      }, 600);

    } else if (step === 2) {
      // Step 2 -> Step 3: Click Profesional
      setTourStep(3);
      setTourActionRunning(true);
      addTourTimeout(() => {
        toneFormatRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      addTourTimeout(() => {
        setTone("Profesional");
        setFormat("Producto");
        setTourActionRunning(false);
      }, 600);

    } else if (step === 3) {
      // Step 3 -> Step 4: Show generate button
      setTourStep(4);
      addTourTimeout(() => {
        generateBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);

    } else if (step === 4) {
      // Step 4: Click Generate -> content appears
      setTourActionRunning(true);
      setTourStep(-1); // Hide overlay during generation
      const currentGenId = ++generationIdRef.current;
      const nextCount = 0;
      setGenerationCount(nextCount);
      setLoading(true);
      setError("");
      setResult(null);
      setVariants(null);
      setFavoriteVariant(null);

      const currentS = UI[tourLang];
      for (let i = 0; i < currentS.loadingSteps.length; i++) {
        if (generationIdRef.current !== currentGenId) return;
        setLoadingStep(currentS.loadingSteps[i]);
        await new Promise(r => setTimeout(r, 400));
      }
      if (generationIdRef.current !== currentGenId) return;

      const tourBrandText = brand.trim().length >= BRAND_MIN ? brand : TOUR_TEXT[tourLang].sampleBrand;
      let finalResult = agenticGenerate(tourBrandText, "instagram", "Profesional", "Producto", tourLang, lastHookType);
      if (finalResult?._allHooks?.[0]) setLastHookType(finalResult._allHooks[0].type);
      if (!finalResult) {
        finalResult = generateSmartContent(tourBrandText, "instagram", "Profesional", "Producto", nextCount, tourLang);
        finalResult._source = 'templates';
      }
      finalResult._toolUse = false;
      setUsedAI(false);
      setContentSource(finalResult._source || 'agentic');
      setResult(finalResult);
      setActiveTab("copy");
      setLoading(false);
      setLoadingStep("");
      const newStats = trackGeneration("instagram", "Profesional", "Producto", false);
      setStats(newStats);
      const entry = {
        id: Date.now(),
        brand: (brand || TOUR_TEXT[tourLang].sampleBrand).substring(0, 60),
        platform: "instagram", tone: "Profesional", format: "Producto",
        timestamp: new Date().toISOString(), usedAI: false, result: finalResult,
      };
      const newHist = saveToHistory(entry);
      setHistory(newHist);

      addTourTimeout(() => {
        setTourActionRunning(false);
        setTourStep(5);
        resultCopyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);

    } else if (step === 5) {
      // Step 5 -> Step 6: Switch to Visual tab
      setTourStep(6);
      setTourActionRunning(true);
      addTourTimeout(() => {
        setActiveTab("visual");
      }, 300);
      addTourTimeout(() => {
        resultVisualRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTourActionRunning(false);
      }, 600);

    } else if (step === 6) {
      // Step 6 -> Step 7: Generate variants
      setActiveTab("copy");
      setTourStep(7);
      setTourActionRunning(true);
      addTourTimeout(() => {
        variantBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
      addTourTimeout(() => {
        if (result) {
          const variantResults = [];
          for (let v = 0; v < 2; v++) {
            const tourBrandV = (brand || TOUR_TEXT[tourLang].sampleBrand) + ` [v${v + 1}]`;
            const agVar = agenticGenerate(tourBrandV, "instagram", "Profesional", "Producto", tourLang, lastHookType);
            if (agVar) { variantResults.push({ ...agVar, source: "agentic" }); continue; }
            const varResult = generateSmartContent(brand || TOUR_TEXT[tourLang].sampleBrand, "instagram", "Profesional", "Producto", generationCount + 100 + v * 37, tourLang);
            variantResults.push({ ...varResult, source: "template" });
          }
          setVariants(variantResults);
          setFavoriteVariant(null);
        }
        setTourActionRunning(false);
      }, 800);

    } else if (step === 7) {
      // Step 7 -> Step 8: Switch to Calendar tab
      setTourStep(8);
      setTourActionRunning(true);
      addTourTimeout(() => {
        setMainTab("calendar");
      }, 300);
      addTourTimeout(() => {
        calendarTabRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTourActionRunning(false);
      }, 700);

    } else if (step === 8) {
      // Step 8 -> Step 9: Show templates
      setTourStep(9);
      setTourActionRunning(true);
      addTourTimeout(() => {
        setMainTab("content");
      }, 200);
      addTourTimeout(() => {
        templateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTourActionRunning(false);
      }, 600);

    } else if (step === 9) {
      // Step 9 -> Completion: scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTourStep(10); // triggers completion modal
    }
  }, [tourStep, tourLang, brand, result, generationCount, endTour, clearTourTimeouts, addTourTimeout]);

  const brandTooShort = brand.trim().length > 0 && brand.trim().length < BRAND_MIN;
  const canGenerate = brand.trim().length >= BRAND_MIN && !loading;

  const getDisabledReason = () => {
    if (loading) return s.generatingBtn;
    if (!brand.trim()) return s.describePrompt;
    if (brandTooShort) return s.minChars(BRAND_MIN, BRAND_MIN - brand.trim().length);
    return "";
  };

  const generate = async (isRegenerate = false) => {
    if (!canGenerate) return;
    const currentGenId = ++generationIdRef.current;
    const nextCount = isRegenerate ? generationCount + 1 : 0;
    setGenerationCount(nextCount);
    setLoading(true);
    setError("");
    setResult(null);
    setVariants(null);
    setFavoriteVariant(null);

    let aiUsed = false;

    for (let i = 0; i < s.loadingSteps.length; i++) {
      if (generationIdRef.current !== currentGenId) return;
      setLoadingStep(s.loadingSteps[i]);
      await new Promise(r => setTimeout(r, 400));
    }
    if (generationIdRef.current !== currentGenId) return;

    let claudeResult = null;
    let toolUseMode = false;
    let source = 'templates';

    // Try Groq first (free, fast) — use GROQ_API_KEY from env or hardcoded for demo
    const groqKey = import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key') || '';
    if (groqKey) {
      claudeResult = await generateWithGroq(groqKey, brand, platform, tone, format, lang);
      if (generationIdRef.current !== currentGenId) return;
      if (claudeResult) source = 'groq';
    }

    // Fallback to Claude if Groq fails
    if (!claudeResult && apiKey.trim()) {
      claudeResult = await generateWithToolUse(apiKey.trim(), brand, platform, tone, format, lang);
      if (generationIdRef.current !== currentGenId) return;
      if (claudeResult) toolUseMode = true;
      if (!claudeResult) {
        claudeResult = await generateWithClaude(apiKey.trim(), brand, platform, tone, format, lang);
        if (generationIdRef.current !== currentGenId) return;
      }
      if (claudeResult && source !== 'groq') source = 'claude';
    }

    let serverResult = null;
    if (!claudeResult) {
      serverResult = await generateWithServerAI(brand, platform, tone, format, lang);
      if (generationIdRef.current !== currentGenId) return;
      if (serverResult) source = serverResult._source || 'server-ai';
    }

    let hfResult = null;
    if (!claudeResult && !serverResult) {
      hfResult = await generateWithHuggingFace(brand, platform, tone, format, lang, hfToken.trim() || null, setLoadingStep);
      if (generationIdRef.current !== currentGenId) return;
      if (hfResult) source = 'huggingface';
    }

    let agenticResult = null;
    if (!claudeResult && !serverResult && !hfResult) {
      agenticResult = agenticGenerate(brand, platform, tone, format, lang, lastHookType);
      if (agenticResult) {
        source = 'agentic';
        if (agenticResult._allHooks?.[0]) setLastHookType(agenticResult._allHooks[0].type);
      }
    }

    let finalResult;
    if (claudeResult) { aiUsed = true; finalResult = claudeResult; }
    else if (serverResult) { aiUsed = true; finalResult = serverResult; }
    else if (hfResult) { aiUsed = true; finalResult = hfResult; }
    else if (agenticResult) { finalResult = agenticResult; source = 'agentic'; }
    else { finalResult = generateSmartContent(brand, platform, tone, format, nextCount, lang); source = 'templates'; }
    finalResult._toolUse = toolUseMode;
    finalResult._source = source;

    setUsedAI(aiUsed);
    setContentSource(source);
    setResult(finalResult);
    setActiveTab("copy");
    setLoading(false);
    setLoadingStep("");

    const newStats = trackGeneration(platform, tone, format, aiUsed);
    setStats(newStats);

    const entry = {
      id: Date.now(), brand: brand.substring(0, 60), platform, tone, format,
      timestamp: new Date().toISOString(), usedAI: aiUsed, result: finalResult,
    };
    const newHist = saveToHistory(entry);
    setHistory(newHist);
  };

  const handlePlatformChange = (id) => { if (!loading) setPlatform(id); };

  const exportAll = () => {
    if (!result) return;
    const text = [
      `=== ContentStudio — ${PLATFORMS.find(p => p.id === platform)?.label} ===`, "",
      `HEADLINE: ${result.headline}`, `SUBHEADLINE: ${result.subheadline}`, "",
      `${s.bodyExport}:`, result.body, "",
      `CTA: ${result.cta}`, "",
      `HASHTAGS: ${(result.hashtags || []).map(t => `#${t}`).join(" ")}`, "",
      `PALETA: ${(result.color_palette || []).join(" | ")}`,
      `EMOJIS: ${(result.emoji_set || []).join(" ")}`, "",
      `DALL-E PROMPT:`, result.dalle_prompt, "",
      `${s.bestTimeExport}:`, result.posting_time,
    ].join("\n");
    navigator.clipboard.writeText(text);
    showToast(s.allExported);
  };

  const exportJSON = () => {
    if (!result) return;
    const obj = { platform, tone, format, brand: brand.substring(0, 100), generatedWith: contentSource === 'claude' ? "Claude AI" : contentSource === 'cloudflare-ai' ? "Cloudflare Llama 3.1" : contentSource === 'huggingface-server' ? "Server Mistral 7B" : contentSource === 'huggingface' ? "HF Mistral 7B" : contentSource === 'agentic' ? "Agentic Pipeline" : "Smart Templates", ...result };
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    showToast(lang === "es" ? "JSON copiado al portapapeles" : "JSON copied to clipboard");
    setExportOpen(false);
  };

  const exportMarkdown = () => {
    if (!result) return;
    const md = [
      `# ${result.headline}`, `### ${result.subheadline}`, "", result.body, "",
      `**CTA:** ${result.cta}`, "",
      `**Hashtags:** ${(result.hashtags || []).map(t => `#${t}`).join(" ")}`, "",
      `**Best Time:** ${result.posting_time}`, "",
      `**DALL-E Prompt:** ${result.dalle_prompt}`, "", `---`,
      `*Generated with ContentStudio ${contentSource === 'claude' ? "(Claude AI)" : contentSource === 'cloudflare-ai' ? "(Cloudflare Llama 3.1)" : contentSource === 'huggingface-server' ? "(Server Mistral 7B)" : contentSource === 'huggingface' ? "(HF Mistral)" : contentSource === 'agentic' ? "(Agentic Pipeline)" : "(Templates)"}*`,
    ].join("\n");
    navigator.clipboard.writeText(md);
    showToast(lang === "es" ? "Markdown copiado al portapapeles" : "Markdown copied to clipboard");
    setExportOpen(false);
  };

  const generateVariantsFn = async () => {
    if (!result) return;
    const variantResults = [];
    for (let v = 0; v < 2; v++) {
      if (apiKey.trim()) {
        const claudeVar = await generateWithClaude(apiKey.trim(), brand, platform, tone, format, lang);
        if (claudeVar) { variantResults.push({ ...claudeVar, source: "claude" }); continue; }
      }
      const serverVar = await generateWithServerAI(brand, platform, tone, format, lang);
      if (serverVar) { variantResults.push({ ...serverVar, source: serverVar._source || "server-ai" }); continue; }
      const hfVar = await generateWithHuggingFace(brand, platform, tone, format, lang, hfToken.trim() || null, null);
      if (hfVar) { variantResults.push({ ...hfVar, source: "huggingface" }); continue; }
      const agVar = agenticGenerate(brand + ` [v${v + 1}]`, platform, tone, format, lang, lastHookType);
      if (agVar) { variantResults.push({ ...agVar, source: "agentic" }); continue; }
      const varResult = generateSmartContent(brand, platform, tone, format, generationCount + 100 + v * 37, lang);
      variantResults.push({ ...varResult, source: "template" });
    }
    setVariants(variantResults);
    setFavoriteVariant(null);
  };

  const restoreFromHistory = (entry) => {
    setResult(entry.result); setBrand(entry.brand); setPlatform(entry.platform);
    setTone(entry.tone); setFormat(entry.format); setUsedAI(entry.usedAI);
    setShowHistory(false); setActiveTab("copy"); setVariants(null); setFavoriteVariant(null);
  };

  const handleClearHistory = () => { clearHistory(); setHistory([]); };
  const handleApiKeyChange = (val) => { setApiKey(val); localStorage.setItem("cs_apikey", val); };
  const handleHfTokenChange = (val) => { setHfToken(val); localStorage.setItem("cs_hftoken", val); };

  const handleLoadTemplate = (tmpl) => {
    if (tmpl.brand) setBrand(tmpl.brand);
    if (tmpl.platform) setPlatform(tmpl.platform);
    if (tmpl.tone) setTone(tmpl.tone);
    if (tmpl.format) setFormat(tmpl.format);
  };

  const hasApiKey = apiKey.trim().length > 0;
  const hasHfToken = hfToken.trim().length > 0;
  const selectedPlatform = useMemo(() => PLATFORMS.find(p => p.id === platform), [platform]);
  const accent = "#6366F1";
  const copyCards = useMemo(() => {
    if (!result) return [];
    return [
      { label: "Headline", content: result.headline },
      { label: "Subheadline", content: result.subheadline },
      { label: "body", content: result.body, useLangLabel: true },
      { label: "CTA", content: result.cta },
      { label: "Hashtags", content: result.hashtags },
    ];
  }, [result]);

  return (
    <>
    {/* SCROLL PROGRESS BAR */}
    <div style={{ position: "fixed", top: 0, left: 0, width: `${scrollProgress}%`, height: 2, background: `linear-gradient(90deg, ${accent}, #818CF8)`, zIndex: 9999, transition: "width 0.1s linear" }} />

    {/* FILM GRAIN OVERLAY */}
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9998, opacity: 0.035 }}>
      <filter id="cs-grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
      <rect width="100%" height="100%" filter="url(#cs-grain)" />
    </svg>

    <div style={{ minHeight: "100vh", background: BG_COLOR, fontFamily: "'DM Sans', sans-serif", padding: "20px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes progressAnim { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } }
        @keyframes tabFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 8px rgba(99,102,241,0.3); } 50% { box-shadow: 0 0 16px rgba(99,102,241,0.6); } }
        * { box-sizing: border-box; }
        button { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        button:hover { opacity: 0.85; }
        textarea:focus, input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <Toast message={toast.message} visible={toast.visible} />

      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 32, paddingTop: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
            <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#F8F4E8", letterSpacing: "-0.03em", lineHeight: 1 }}>
              Content<span style={{ color: accent }}>Studio</span>
            </h1>
            <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: accent, border: `1px solid ${accent}40`, borderRadius: 4, padding: "3px 8px", letterSpacing: "0.1em" }}>AI-POWERED</span>
            {hasApiKey && (<span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#8B5CF6", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 4, padding: "3px 8px", letterSpacing: "0.08em" }}>Claude</span>)}
            {hasHfToken && (<span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#F59E0B", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 4, padding: "3px 8px", letterSpacing: "0.08em" }}>Mistral 7B</span>)}
            {!hasApiKey && !hasHfToken && (<span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#F59E0B", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 4, padding: "3px 8px", letterSpacing: "0.08em" }}>{s.agenticBadge}</span>)}
            <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: hasApiKey ? "#4ADE80" : "#F59E0B", background: hasApiKey ? "rgba(74,222,128,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${hasApiKey ? "rgba(74,222,128,0.3)" : "rgba(245,158,11,0.3)"}`, borderRadius: 4, padding: "3px 8px", letterSpacing: "0.08em", cursor: "pointer" }} onClick={() => setShowStats(!showStats)}>
              {hasApiKey ? s.aiMode : hasHfToken ? 'HF Mode' : s.agenticMode} {stats.total > 0 ? `\u00b7 ${stats.total}` : ""}
            </span>
            {/* LANGUAGE TOGGLE */}
            <div style={{ marginLeft: "auto", display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <button onClick={() => setLang("es")} aria-label="Cambiar a Espanol" aria-selected={lang === "es"} style={{ background: lang === "es" ? `${accent}20` : "transparent", border: "none", padding: "5px 12px", fontSize: 12, fontWeight: lang === "es" ? 700 : 400, color: lang === "es" ? accent : "rgba(255,255,255,0.35)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>ES</button>
              <button onClick={() => setLang("en")} aria-label="Switch to English" aria-selected={lang === "en"} style={{ background: lang === "en" ? `${accent}20` : "transparent", border: "none", padding: "5px 12px", fontSize: 12, fontWeight: lang === "en" ? 700 : 400, color: lang === "en" ? accent : "rgba(255,255,255,0.35)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>EN</button>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "0.03em" }}>
            {s.headerSub} &middot; {hasApiKey ? 'Claude API + ' : ''}Cloudflare AI + {hasHfToken ? 'HF + ' : ''}Agentic Pipeline + DALL-E 3
          </p>
        </div>

        {/* STATS PANEL */}
        {showStats && stats.total > 0 && (
          <div style={{ marginBottom: 16, padding: "12px 16px", ...GLASS, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", animation: "fadeUp 0.3s ease" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 700, color: accent }}>{stats.total}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>{s.totalGens}</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{topEntry(stats.platforms)}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>{s.mostPlatform}</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{topEntry(stats.tones)}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>{s.mostTone}</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{stats.ai} / {stats.template}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>{s.aiRatio}</div></div>
          </div>
        )}

        {/* MAIN TAB TOGGLE: Content / Calendar */}
        <div ref={calendarTabRef} style={{ display: "flex", gap: 4, marginBottom: 16, ...GLASS, padding: 4 }}>
          <button onClick={() => setMainTab("content")} aria-label={s.tabCopy} aria-selected={mainTab === "content"} role="tab" style={{ flex: 1, padding: "8px", background: mainTab === "content" ? "rgba(99,102,241,0.15)" : "transparent", border: mainTab === "content" ? `1px solid ${accent}` : "1px solid transparent", borderRadius: 12, fontSize: 12, fontWeight: mainTab === "content" ? 700 : 400, color: mainTab === "content" ? accent : "#6B7280", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: mainTab === "content" ? `0 0 12px rgba(99,102,241,0.2)` : "none" }}>
            {s.tabCopy}
          </button>
          <button onClick={() => setMainTab("calendar")} aria-label={s.calendarTab} aria-selected={mainTab === "calendar"} role="tab" style={{ flex: 1, padding: "8px", background: mainTab === "calendar" ? "rgba(99,102,241,0.15)" : "transparent", border: mainTab === "calendar" ? `1px solid ${accent}` : "1px solid transparent", borderRadius: 12, fontSize: 12, fontWeight: mainTab === "calendar" ? 700 : 400, color: mainTab === "calendar" ? accent : "#6B7280", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: mainTab === "calendar" ? `0 0 12px rgba(99,102,241,0.2)` : "none" }}>
            {s.calendarTab}
          </button>
        </div>

        <AnimatePresence mode="wait">
        {mainTab === "calendar" && (
          <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: APPLE_EASE }}>
          <ErrorBoundary lang={lang}>
            <ContentCalendar s={s} lang={lang} result={result} platform={platform} onToast={showToast} />
          </ErrorBoundary>
          </motion.div>
        )}

        {mainTab === "content" && <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: APPLE_EASE }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* LEFT PANEL — INPUTS */}
          <ErrorBoundary lang={lang}><div style={{ ...GLASS, padding: 20 }}>
            {/* Brand Input */}
            <div ref={brandRef} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label htmlFor="brand-input" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>{s.productLabel}</label>
                <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: brand.length > BRAND_MAX ? "#F87171" : brand.length >= BRAND_MIN ? "#4ADE80" : "rgba(255,255,255,0.25)" }}>{brand.length}/{BRAND_MAX}</span>
              </div>
              <textarea id="brand-input" value={brand} onChange={e => { if (e.target.value.length <= BRAND_MAX) setBrand(e.target.value); }} placeholder={s.placeholder} rows={4} aria-label={s.productLabel} aria-invalid={brandTooShort} aria-describedby={brandTooShort ? "brand-error" : undefined} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${brandTooShort ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, padding: "12px 14px", color: "#F8F4E8", fontSize: 13, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", resize: "none", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = brandTooShort ? "rgba(248,113,113,0.6)" : `${accent}60`} onBlur={e => e.target.style.borderColor = brandTooShort ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)"} />
              {brandTooShort && (<p id="brand-error" role="alert" style={{ margin: "6px 0 0", fontSize: 11, color: "#FCA5A5", fontFamily: "'DM Sans', sans-serif" }}>{s.describeMin(BRAND_MIN, BRAND_MIN - brand.trim().length)}</p>)}
            </div>

            {/* Platform */}
            <div ref={platformRef} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>{s.platformLabel}</label>
              <div role="listbox" aria-label={s.platformLabel} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => handlePlatformChange(p.id)} aria-label={`${s.platformLabel}: ${p.label}`} aria-selected={platform === p.id} role="option" style={{ background: platform === p.id ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid ${platform === p.id ? accent : "rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: platform === p.id ? `0 0 16px rgba(99,102,241,0.15)` : "none" }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: platform === p.id ? accent : "#9CA3AF" }}>{p.label}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>{p.dims}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone & Format */}
            <div ref={toneFormatRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { label: s.toneLabel, options: TONES, value: tone, setter: setTone },
                { label: s.formatLabel, options: FORMATS, value: format, setter: setFormat },
              ].map(({ label, options, value, setter }) => (
                <div key={label}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>{label}</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {options.map(o => (
                      <button key={o} onClick={() => { if (!loading) setter(o); }} role="option" aria-selected={value === o} aria-label={`${label}: ${label === s.toneLabel ? (s.toneNames[o] || o) : (s.formatNames[o] || o)}`} style={{ background: value === o ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: `1px solid ${value === o ? accent : "rgba(255,255,255,0.06)"}`, borderRadius: 10, padding: "6px 10px", fontSize: 12, color: value === o ? accent : "#6B7280", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, textAlign: "left", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: value === o ? `0 0 12px rgba(99,102,241,0.12)` : "none" }}>{label === s.toneLabel ? (s.toneNames[o] || o) : (s.formatNames[o] || o)}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Generate Button */}
            <button ref={generateBtnRef} onClick={() => generate(false)} disabled={!canGenerate} aria-label={loading ? (loadingStep || s.generatingBtn) : s.generateBtn} aria-busy={loading} style={{ width: "100%", padding: "14px", background: canGenerate ? `linear-gradient(135deg, ${accent}, #818CF8)` : "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: canGenerate ? "#FFFFFF" : "#4B5563", cursor: canGenerate ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: canGenerate ? `0 0 32px rgba(99,102,241,0.4)` : "none" }}>
              {loading ? loadingStep || s.generatingBtn : `\u26a1 ${s.generateBtn}`}
            </button>
            {!canGenerate && !loading && (<p style={{ margin: "8px 0 0", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>{getDisabledReason()}</p>)}

            {error && (
              <div role="alert" style={{ marginTop: 12, padding: "12px 16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, textAlign: "center" }}>
                <p style={{ color: "#FCA5A5", fontSize: 12, margin: "0 0 8px" }}>{error}</p>
                <button onClick={() => generate(false)} aria-label={s.retry} style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontSize: 12, color: "#FCA5A5", fontFamily: "'DM Sans', sans-serif" }}>{s.retry}</button>
              </div>
            )}

            {/* ADVANCED: API Keys */}
            <details style={{ marginTop: 16, borderTop: '1px solid #334155', paddingTop: 12 }}>
              <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: 12, fontFamily: "'DM Mono', monospace", listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, transition: 'transform 0.2s', display: 'inline-block' }}>&#9654;</span>
                {lang === 'es' ? '\u2699\uFE0F Avanzado: Conecta tus propios modelos de IA' : '\u2699\uFE0F Advanced: Connect your own AI models'}
              </summary>
              <div style={{ marginTop: 12 }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: hasApiKey ? '#4ADE80' : 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>{s.apiKeyLabel} {hasApiKey ? '\u2713' : ''}</label>
                  <input type="password" value={apiKey} onChange={e => handleApiKeyChange(e.target.value)} placeholder={s.apiKeyPlaceholder} aria-label={s.apiKeyLabel} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${hasApiKey ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '8px 12px', color: '#F8F4E8', fontSize: 12, fontFamily: "'DM Mono', monospace" }} />
                  <p style={{ margin: '4px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{s.apiKeyHint}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: hasHfToken ? '#F59E0B' : 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>{lang === 'en' ? 'HUGGING FACE TOKEN' : 'TOKEN HUGGING FACE'} {hasHfToken ? '\u2713' : ''}</label>
                  <input type="password" value={hfToken} onChange={e => handleHfTokenChange(e.target.value)} placeholder={lang === 'en' ? 'hf_... (optional)' : 'hf_... (opcional)'} aria-label={lang === 'en' ? 'Hugging Face Token' : 'Token Hugging Face'} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${hasHfToken ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '8px 12px', color: '#F8F4E8', fontSize: 12, fontFamily: "'DM Mono', monospace" }} />
                  <p style={{ margin: '4px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{lang === 'en' ? 'Mistral 7B via Hugging Face' : 'Mistral 7B via Hugging Face'}</p>
                </div>
              </div>
            </details>

            {/* TEMPLATE MANAGER */}
            <div ref={templateRef}>
            <TemplateManager s={s} lang={lang} brand={brand} platform={platform} tone={tone} format={format} onLoadTemplate={handleLoadTemplate} onToast={showToast} />
            </div>
          </div></ErrorBoundary>

          {/* RIGHT PANEL — RESULT */}
          <ErrorBoundary lang={lang}><div style={{ ...GLASS, padding: 20 }}>
            {/* Visual Preview */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>{s.previewLabel} &middot; {selectedPlatform?.label}</label>
                {result && (<span style={{ fontSize: 10, color: accent, fontFamily: "'DM Mono', monospace" }}>{selectedPlatform?.dims}</span>)}
              </div>
              <MockVisual colors={result?.color_palette} headline={result?.headline} platform={platform} loading={loading} loadingStep={loadingStep} s={s} />
              {result && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(232,197,71,0.06)", border: "1px solid rgba(232,197,71,0.15)", borderRadius: 8 }}>
                  <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                    <span style={{ color: accent }}>DALL-E prompt:</span>{" "}{result.dalle_prompt?.substring(0, 100)}...
                  </p>
                </div>
              )}
            </div>

            {/* Content Tabs */}
            {result && (
              <div ref={resultCopyRef} aria-live="polite" style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", padding: "3px 10px", borderRadius: 4, fontFamily: "'DM Mono', monospace",
                    background: contentSource === 'claude' ? "rgba(74,222,128,0.12)" : contentSource === 'cloudflare-ai' || contentSource === 'huggingface-server' ? "rgba(249,115,22,0.12)" : contentSource === 'huggingface' || contentSource === 'agentic' ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)",
                    color: contentSource === 'claude' ? "#4ADE80" : contentSource === 'cloudflare-ai' || contentSource === 'huggingface-server' ? "#F97316" : contentSource === 'huggingface' || contentSource === 'agentic' ? "#F59E0B" : "#6B7280",
                    border: `1px solid ${contentSource === 'claude' ? "rgba(74,222,128,0.25)" : contentSource === 'cloudflare-ai' || contentSource === 'huggingface-server' ? "rgba(249,115,22,0.25)" : contentSource === 'huggingface' || contentSource === 'agentic' ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.08)"}`,
                  }}>
                    {contentSource === 'claude' ? (result?._toolUse ? s.aiToolUseBadge : s.aiBadge) : contentSource === 'cloudflare-ai' ? 'Llama 3.1' : contentSource === 'huggingface-server' ? 'Mistral 7B' : contentSource === 'huggingface' ? (lang === 'en' ? 'HF Model' : 'Modelo HF') : contentSource === 'agentic' ? s.agenticBadge : s.templateBadge}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 4, marginBottom: 12, background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: 3, border: "1px solid rgba(255,255,255,0.04)" }}>
                  {["copy", "visual", "schedule"].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} role="tab" aria-selected={activeTab === tab} aria-label={tab === "copy" ? s.tabCopy : tab === "visual" ? s.tabVisual : s.tabTiming} style={{ flex: 1, padding: "7px 4px", background: activeTab === tab ? "rgba(99,102,241,0.12)" : "transparent", border: activeTab === tab ? `1px solid ${accent}` : "1px solid transparent", borderRadius: 10, fontSize: 11, fontWeight: 600, color: activeTab === tab ? accent : "#6B7280", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: activeTab === tab ? "0 0 12px rgba(99,102,241,0.15)" : "none" }}>
                      {tab === "copy" ? s.tabCopy : tab === "visual" ? s.tabVisual : s.tabTiming}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: APPLE_EASE }}>
                  {activeTab === "copy" && (
                    <div>
                      {result._viralScore && (
                        <div style={{marginBottom:8,display:'flex',alignItems:'center',gap:8}}>
                          <span style={{background:'#10B98122',color:'#10B981',padding:'2px 8px',borderRadius:12,fontSize:11,fontWeight:600}}>Viral: {result._viralScore}/100</span>
                          {result._allHooks && result._allHooks[0] && (<span style={{fontSize:10,color:'#94a3b8',textTransform:'capitalize'}}>Hook: {result._allHooks[0].type}</span>)}
                        </div>
                      )}
                      <CopyCard label="Headline" content={result.headline} accent={accent} onCopied={showToast} s={s} />
                      <CopyCard label="Subheadline" content={result.subheadline} accent={accent} onCopied={showToast} s={s} />
                      <CopyCard label={s.bodyLabel} content={result.body} accent={accent} onCopied={showToast} s={s} />
                      <CopyCard label="CTA" content={result.cta} accent={accent} onCopied={showToast} s={s} />
                      <CopyCard label="Hashtags" content={result.hashtags} accent={accent} onCopied={showToast} s={s} />
                    </div>
                  )}

                  {activeTab === "visual" && (
                    <div ref={resultVisualRef}>
                      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
                        <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, fontFamily: "'DM Mono', monospace" }}>{s.colorPalette}</p>
                        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                          {result.color_palette?.map((c, i) => {
                            const safe = safeHex(c, ["#1a1a2e", "#16213e", "#0f3460"][i]);
                            return (<div key={i} style={{ flex: 1, textAlign: "center" }}><div style={{ height: 40, borderRadius: 6, background: safe, marginBottom: 4 }} /><span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>{safe}</span></div>);
                          })}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>{result.emoji_set?.map((e, i) => (<span key={i} style={{ fontSize: 24 }}>{e}</span>))}</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px" }}>
                        <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, fontFamily: "'DM Mono', monospace" }}>{s.dallePromptLabel}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{result.dalle_prompt}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "schedule" && (
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px" }}>
                      <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, fontFamily: "'DM Mono', monospace" }}>{s.bestTime}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "#E2E8F0", lineHeight: 1.65 }}>{result.posting_time}</p>
                      <div style={{ marginTop: 16, padding: "12px", background: "rgba(232,197,71,0.06)", borderRadius: 8, border: "1px solid rgba(232,197,71,0.12)" }}>
                        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}><strong style={{ color: accent }}>Tip:</strong> {s.tip}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
                </AnimatePresence>

                {/* Pipeline Visualization */}
                {result._pipeline && (
                  <div style={{ marginTop: 16 }}>
                    <button onClick={() => setShowPipeline(!showPipeline)} aria-label={s.pipelineTitle} aria-expanded={showPipeline} style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 8, padding: "8px 14px", cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: "#F59E0B", transition: "all 0.2s" }}>
                      {showPipeline ? '\u25bc' : '\u25b6'} {s.pipelineTitle}
                    </button>
                    {showPipeline && (
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginTop: 8, animation: "fadeUp 0.3s ease" }}>
                        {result._pipeline.map((step, i) => (
                          <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid #1e293b', background: 'rgba(255,255,255,0.02)', borderRadius: i === 0 ? '8px 8px 0 0' : i === result._pipeline.length - 1 ? '0 0 8px 8px' : '0' }}>
                            <strong style={{ color: '#6366F1', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.05em' }}>{`${i + 1}. ${step.agent}`}</strong>
                            <div style={{ marginTop: 4, fontSize: 11, color: 'rgba(255,255,255,0.4)', wordBreak: 'break-word' }}>
                              {typeof step.output === 'object'
                                ? Object.entries(step.output).filter(([k]) => !k.startsWith('_')).slice(0, 4).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v).slice(0, 60) : String(v).slice(0, 60)}`).join(' | ')
                                : String(step.output).slice(0, 150)}
                            </div>
                          </div>
                        ))}
                        {result._allHooks && (
                          <div style={{marginTop:12}}>
                            <div style={{fontSize:12,color:'#6366F1',fontWeight:700,marginBottom:8}}>{lang === 'en' ? 'Hook Candidates (ranked by viral score):' : 'Candidatos de Hook (por score viral):'}</div>
                            {result._allHooks.map((h, i) => (
                              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0',fontSize:12,color: i===0 ? '#10B981' : '#64748b'}}>
                                <span style={{width:36,textAlign:'right',fontWeight:700}}>{h.score}</span>
                                <div style={{width:60,height:6,background:'#1e293b',borderRadius:3,overflow:'hidden'}}><div style={{width:`${h.score}%`,height:'100%',background: i===0 ? '#10B981' : '#334155',borderRadius:3}}/></div>
                                <span style={{textTransform:'capitalize',width:80,color:'#94a3b8'}}>{h.type}</span>
                                <span>{h.hook}</span>
                                {i === 0 && <span style={{color:'#10B981',fontSize:10,fontWeight:700}}>&#9733; WINNER</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Regenerate + Export + Variants */}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => generate(true)} disabled={loading} aria-label={s.regenerate} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#E2E8F0", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", opacity: loading ? 0.5 : 1 }}>
                    {s.regenerate}{generationCount > 0 && (<span style={{ marginLeft: 6, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>#{generationCount + 1}</span>)}
                  </button>
                  <div style={{ flex: 1, position: "relative" }}>
                    <button onClick={() => setExportOpen(!exportOpen)} aria-label={s.copyAll} aria-expanded={exportOpen} style={{ width: "100%", padding: "10px", background: "rgba(232,197,71,0.08)", border: `1px solid ${accent}30`, borderRadius: 8, fontSize: 12, fontWeight: 600, color: accent, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>{s.copyAll} &#9662;</button>
                    {exportOpen && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#1E293B", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, overflow: "hidden", zIndex: 50, animation: "fadeUp 0.15s ease" }}>
                        <button onClick={() => { exportAll(); setExportOpen(false); }} style={{ width: "100%", padding: "8px 12px", background: "none", border: "none", color: "#E2E8F0", fontSize: 11, textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{s.copyAll}</button>
                        <button onClick={exportJSON} style={{ width: "100%", padding: "8px 12px", background: "none", border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", color: "#E2E8F0", fontSize: 11, textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{s.exportJSON}</button>
                        <button onClick={exportMarkdown} style={{ width: "100%", padding: "8px 12px", background: "none", border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", color: "#E2E8F0", fontSize: 11, textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{s.exportMD}</button>
                      </div>
                    )}
                  </div>
                </div>

                <button ref={variantBtnRef} onClick={generateVariantsFn} aria-label={s.generateVariants} style={{ width: "100%", padding: "9px", marginTop: 8, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#818CF8", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>{s.generateVariants}</button>

                {/* Variants Display */}
                <AnimatePresence>
                {variants && variants.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: APPLE_EASE }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                    {variants.map((v, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: i * 0.1, ease: APPLE_EASE }} role="button" tabIndex={0} aria-label={`${s.variantLabel(i + 1)}: ${v.headline}`} onClick={() => { setFavoriteVariant(i); setResult(v); setUsedAI(v.source === "claude" || v.source === "huggingface" || v.source === "cloudflare-ai" || v.source === "huggingface-server"); setContentSource(v.source || "templates"); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFavoriteVariant(i); setResult(v); setUsedAI(v.source === "claude" || v.source === "huggingface" || v.source === "cloudflare-ai" || v.source === "huggingface-server"); setContentSource(v.source || "templates"); } }} style={{ padding: "10px 12px", ...GLASS, background: favoriteVariant === i ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${favoriteVariant === i ? accent : "rgba(255,255,255,0.06)"}`, cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: accent, fontFamily: "'DM Mono', monospace" }}>{s.variantLabel(i + 1)}</span>
                          {favoriteVariant === i && <span style={{ fontSize: 12, color: accent, animation: "pulseGlow 2s ease infinite" }}>&#9733;</span>}
                        </div>
                        <p style={{ margin: 0, fontSize: 11, color: "#E2E8F0", lineHeight: 1.4 }}>{v.headline}</p>
                        <p style={{ margin: "4px 0 0", fontSize: 10, color: "#6B7280" }}>{v.cta}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                </AnimatePresence>

                <button onClick={() => setShowHistory(!showHistory)} aria-label={`${s.historyTitle} (${history.length})`} aria-expanded={showHistory} style={{ width: "100%", padding: "8px", marginTop: 10, background: "none", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.35)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{s.historyTitle} ({history.length})</button>

                {/* PERFORMANCE PREDICTION */}
                <PerformancePrediction result={result} platform={platform} tone={tone} lang={lang} />
              </div>
            )}

            {/* History Panel */}
            {showHistory && (
              <div style={{ marginTop: 10, padding: "12px", ...GLASS, maxHeight: 250, overflowY: "auto", animation: "fadeUp 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.historyTitle}</span>
                  {history.length > 0 && (<button onClick={handleClearHistory} style={{ background: "none", border: "none", fontSize: 10, color: "#F87171", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{s.clearHistory}</button>)}
                </div>
                {history.length === 0 && (<p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0, textAlign: "center", padding: "12px 0" }}>{s.noHistory}</p>)}
                {history.map((h) => {
                  const plat = PLATFORMS.find(p => p.id === h.platform);
                  return (
                    <button key={h.id} onClick={() => restoreFromHistory(h)} style={{ width: "100%", padding: "8px 10px", marginBottom: 4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 6, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{plat?.icon || ""}</span>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ fontSize: 11, color: "#E2E8F0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.brand}</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>{h.tone} &middot; {new Date(h.timestamp).toLocaleDateString()}</div>
                      </div>
                      {h.result?._source === 'agentic' && <span style={{ fontSize: 8, color: "#F59E0B", fontFamily: "'DM Mono', monospace", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 3, padding: "1px 4px" }}>{'\ud83e\udd16'}</span>}
                      {h.usedAI && <span style={{ fontSize: 8, color: h.result?._source === 'huggingface' || h.result?._source === 'huggingface-server' ? "#F59E0B" : h.result?._source === 'cloudflare-ai' ? "#F97316" : "#4ADE80", fontFamily: "'DM Mono', monospace", border: `1px solid ${h.result?._source === 'huggingface' || h.result?._source === 'huggingface-server' ? "rgba(245,158,11,0.25)" : h.result?._source === 'cloudflare-ai' ? "rgba(249,115,22,0.25)" : "rgba(74,222,128,0.25)"}`, borderRadius: 3, padding: "1px 4px" }}>{h.result?._source === 'cloudflare-ai' ? 'CF' : h.result?._source === 'huggingface-server' ? 'SRV' : h.result?._source === 'huggingface' ? 'HF' : 'AI'}</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {!result && !loading && !showHistory && (
              <div style={{ height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 10 }}>
                <p style={{ fontSize: 28, margin: "0 0 8px" }}>{'\u2726'}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>{s.emptyState}</p>
              </div>
            )}
          </div></ErrorBoundary>
        </div></motion.div>}
        </AnimatePresence>

        {/* FOOTER */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.12)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>
            CLAUDE API · CLOUDFLARE AI · HUGGING FACE · AGENTIC PIPELINE · DALL-E 3 · MAKE.COM READY
          </p>
        </div>
      </div>
    </div>
    <ContactBar s={s} />
    {tourActive && <OnboardingTour step={tourStep} t={tourT} tourLang={tourLang} setTourLang={setTourLang} actionRunning={tourActionRunning} onNext={tourNext} onSkip={endTour} onRestart={restartTour} onExplore={endTour} refs={{ platformRef, toneFormatRef, brandRef, generateBtnRef, resultCopyRef, resultVisualRef, variantBtnRef, calendarTabRef, templateRef }} />}
    </>
  );
}
