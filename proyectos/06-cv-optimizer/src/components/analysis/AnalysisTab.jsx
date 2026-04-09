import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../../constants/colors.js';
import CircularGauge from '../common/CircularGauge.jsx';
import Card from '../common/Card.jsx';
import IndustryBenchmark from './IndustryBenchmark.jsx';
import KeywordCloud from './KeywordCloud.jsx';

const APPLE_EASE = [0.16, 1, 0.3, 1];

export default function AnalysisTab({ results, isES, jobText }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Score + Stats row */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: APPLE_EASE }}
          style={{
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 200,
            backdropFilter: 'blur(12px)',
          }}
        >
          <CircularGauge score={results.matchScore} />
          <div style={{ marginTop: 12, fontSize: 13, color: COLORS.textDim, textAlign: 'center' }}>
            {results.matchedKeywords}/{results.totalKeywords} {isES ? 'keywords encontradas' : 'keywords matched'}
          </div>
        </motion.div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 250 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
          }}>
            {[
              { value: results.strengths.length, label: isES ? 'Fortalezas' : 'Strengths', color: COLORS.green, bg: COLORS.greenBg, border: COLORS.greenBorder },
              { value: results.weaknesses.length, label: isES ? 'Debilidades' : 'Weaknesses', color: COLORS.red, bg: COLORS.redBg, border: COLORS.redBorder },
              { value: results.recommendations.length, label: isES ? 'Tips' : 'Tips', color: COLORS.yellow, bg: COLORS.yellowBg, border: COLORS.yellowBorder },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: APPLE_EASE }}
                style={{
                  background: stat.bg, border: `1px solid ${stat.border}`,
                  borderRadius: 16, padding: '12px 16px', textAlign: 'center',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: stat.color }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: APPLE_EASE }}
            style={{
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
              borderRadius: 16, padding: 16,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.6 }}>
              {results.matchScore >= 80
                ? (isES ? 'Excelente coincidencia. Tu CV se alinea muy bien con esta vacante.' : 'Excellent match. Your CV aligns very well with this job posting.')
                : results.matchScore >= 60
                  ? (isES ? 'Buena coincidencia con \u00e1reas de mejora. Revisa las recomendaciones para optimizar tu CV.' : 'Good match with areas for improvement. Check the recommendations to optimize your CV.')
                  : (isES ? 'Coincidencia baja. Te recomendamos revisar las debilidades y usar el CV optimizado.' : 'Low match. We recommend reviewing the weaknesses and using the optimized CV.')}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Industry Benchmark */}
      <IndustryBenchmark score={results.matchScore} jobText={jobText} isES={isES} />

      {/* Keyword Cloud */}
      <KeywordCloud results={results} isES={isES} />

      {/* Strengths */}
      {results.strengths.length > 0 && (
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: APPLE_EASE }}
            style={{ fontSize: 16, fontWeight: 700, color: COLORS.green, marginBottom: 12 }}
          >
            {isES ? 'Fortalezas' : 'Strengths'}
          </motion.h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.strengths.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.04, duration: 0.35, ease: APPLE_EASE }}
              >
                <Card color={COLORS.green} borderColor={COLORS.greenBorder} bgColor={COLORS.greenBg}
                  title={s.keyword.charAt(0).toUpperCase() + s.keyword.slice(1)}
                >
                  {s.detail}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {results.weaknesses.length > 0 && (
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: APPLE_EASE }}
            style={{ fontSize: 16, fontWeight: 700, color: COLORS.red, marginBottom: 12 }}
          >
            {isES ? 'Debilidades' : 'Weaknesses'}
          </motion.h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.weaknesses.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.04, duration: 0.35, ease: APPLE_EASE }}
              >
                <Card color={COLORS.red} borderColor={COLORS.redBorder} bgColor={COLORS.redBg}
                  title={w.keyword.charAt(0).toUpperCase() + w.keyword.slice(1)}
                >
                  {w.detail}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {results.recommendations.length > 0 && (
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: APPLE_EASE }}
            style={{ fontSize: 16, fontWeight: 700, color: COLORS.yellow, marginBottom: 12 }}
          >
            {isES ? 'Recomendaciones' : 'Recommendations'}
          </motion.h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.recommendations.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.04, duration: 0.35, ease: APPLE_EASE }}
              >
                <Card color={COLORS.yellow} borderColor={COLORS.yellowBorder} bgColor={COLORS.yellowBg}
                  title={r.title}
                >
                  {r.detail}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
