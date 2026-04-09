#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════╗
║           SETUP MAESTRO — Portafolio Christian Hernandez     ║
║           Instala, configura y lanza cualquier proyecto      ║
║           con un solo comando                                ║
╚══════════════════════════════════════════════════════════════╝

Uso:
    python setup.py                    # Menú interactivo
    python setup.py --all              # Instala todos los proyectos
    python setup.py --project 1        # Instala y lanza proyecto 1
    python setup.py --build            # Construye con sistema multiagente
    python setup.py --status           # Estado de todos los proyectos
"""

import os
import sys
import json
import shutil
import subprocess
import argparse
from pathlib import Path

# ─── COLORES ──────────────────────────────────────────────────────────────────
R = "\033[0m"
B = "\033[1m"
C = "\033[96m"
G = "\033[92m"
Y = "\033[93m"
RD = "\033[91m"
M = "\033[95m"
GR = "\033[90m"

# ─── CONFIGURACIÓN DE PROYECTOS ───────────────────────────────────────────────
PROJECTS = {
    1: {
        "name":    "Chatbot Multiagente de Atención al Cliente",
        "slug":    "01-chatbot-multiagente",
        "type":    "react+node",
        "port":    3001,
        "color":   C,
        "icon":    "🤖",
        "stack":   ["React", "Node.js", "n8n", "Claude API"],
        "env_vars": {
            "ANTHROPIC_API_KEY": "sk-ant-TU_CLAVE_AQUI",
            "TELEGRAM_BOT_TOKEN": "TU_TOKEN_TELEGRAM",
            "TWILIO_ACCOUNT_SID": "TU_SID_TWILIO",
            "TWILIO_AUTH_TOKEN":  "TU_TOKEN_TWILIO",
            "NOTION_API_KEY":     "secret_TU_NOTION_KEY",
            "PORT": "3001",
        },
        "run_cmd":   "npm run dev",
        "build_cmd": "npm run build",
        "n8n_workflow": "workflow-multiagente.json",
    },
    2: {
        "name":    "ContentStudio — Generador de Contenido Visual con IA",
        "slug":    "02-content-studio",
        "type":    "react",
        "port":    3002,
        "color":   Y,
        "icon":    "🎨",
        "stack":   ["React", "Claude API", "DALL-E 3"],
        "env_vars": {
            "VITE_ANTHROPIC_API_KEY": "sk-ant-TU_CLAVE_AQUI",
            "VITE_OPENAI_API_KEY":    "sk-TU_CLAVE_OPENAI",
        },
        "run_cmd":   "npm run dev",
        "build_cmd": "npm run build",
    },
    3: {
        "name":    "FinanceAI — Dashboard Financiero con Detección de Anomalías",
        "slug":    "03-finance-ai",
        "type":    "react",
        "port":    3003,
        "color":   G,
        "icon":    "📊",
        "stack":   ["React", "Claude API", "Python", "Pandas"],
        "env_vars": {
            "VITE_ANTHROPIC_API_KEY": "sk-ant-TU_CLAVE_AQUI",
        },
        "run_cmd":   "npm run dev",
        "build_cmd": "npm run build",
    },
    4: {
        "name":    "HRScout — Sistema de Filtrado de CVs con LLMs",
        "slug":    "04-hr-scout",
        "type":    "react",
        "port":    3004,
        "color":   M,
        "icon":    "👥",
        "stack":   ["React", "Claude API"],
        "env_vars": {
            "VITE_ANTHROPIC_API_KEY": "sk-ant-TU_CLAVE_AQUI",
        },
        "run_cmd":   "npm run dev",
        "build_cmd": "npm run build",
    },
    5: {
        "name":    "ClientHub — Portal de Clientes No-Code con IA",
        "slug":    "05-client-hub",
        "type":    "react",
        "port":    3005,
        "color":   C,
        "icon":    "🏢",
        "stack":   ["React", "Airtable", "Claude API"],
        "env_vars": {
            "VITE_ANTHROPIC_API_KEY": "sk-ant-TU_CLAVE_AQUI",
            "VITE_AIRTABLE_API_KEY":  "TU_AIRTABLE_KEY",
            "VITE_AIRTABLE_BASE_ID":  "TU_BASE_ID",
        },
        "run_cmd":   "npm run dev",
        "build_cmd": "npm run build",
    },
}

BASE_DIR = Path(__file__).parent

# ─── HELPERS ──────────────────────────────────────────────────────────────────
def header():
    print(f"""
{C}{B}╔══════════════════════════════════════════════════════════════╗
║       🤖 PORTAFOLIO SETUP — Christian Hernandez             ║
║       Especialista en IA & Automatización                   ║
╚══════════════════════════════════════════════════════════════╝{R}
""")

def log(icon, msg, color=G):
    print(f"  {color}{icon}{R}  {msg}")

def run_cmd(cmd, cwd=None, silent=False):
    try:
        result = subprocess.run(
            cmd, shell=True, cwd=cwd,
            capture_output=silent,
            text=True
        )
        return result.returncode == 0
    except Exception as e:
        log("✗", f"Error: {e}", RD)
        return False

def check_node():
    result = subprocess.run("node --version", shell=True, capture_output=True, text=True)
    return result.returncode == 0

def check_npm():
    result = subprocess.run("npm --version", shell=True, capture_output=True, text=True)
    return result.returncode == 0

# ─── SETUP DE PROYECTO ────────────────────────────────────────────────────────
def setup_project(pid: int, launch: bool = True):
    p    = PROJECTS[pid]
    pdir = BASE_DIR / "proyectos" / p["slug"]
    col  = p["color"]

    print(f"\n{col}{B}{'─' * 60}{R}")
    print(f"{col}{B}  {p['icon']} [{pid}] {p['name']}{R}")
    print(f"{col}{B}{'─' * 60}{R}\n")

    # 1. Verificar directorio
    if not pdir.exists():
        log("✗", f"Directorio no encontrado: {pdir}", RD)
        log("💡", "Ejecuta primero: python setup.py --build", Y)
        return False

    # 2. Crear package.json si no existe
    pkg_path = pdir / "package.json"
    if not pkg_path.exists():
        log("📦", "Creando package.json...")
        _create_package_json(pdir, p, pid)

    # 3. Crear vite.config.js si no existe
    vite_path = pdir / "vite.config.js"
    if not vite_path.exists():
        log("⚙️ ", "Creando vite.config.js...")
        _create_vite_config(pdir)

    # 4. Crear index.html si no existe
    html_path = pdir / "index.html"
    if not html_path.exists():
        log("📄", "Creando index.html...")
        _create_index_html(pdir, p)

    # 5. Crear main.jsx si no existe
    main_path = pdir / "src" / "main.jsx"
    if not main_path.exists():
        log("⚛️ ", "Creando src/main.jsx...")
        _create_main_jsx(pdir)

    # 6. Crear/actualizar .env
    env_path = pdir / ".env"
    env_ex   = pdir / ".env.example"
    if not env_path.exists():
        log("🔑", "Creando .env desde template...")
        env_content = "\n".join([f"{k}={v}" for k, v in p["env_vars"].items()])
        env_path.write_text(env_content)
        env_ex.write_text(env_content)
        log("⚠️ ", f"Edita {pdir}/.env con tus API keys reales", Y)

    # 7. npm install
    node_modules = pdir / "node_modules"
    if not node_modules.exists():
        log("📦", "Instalando dependencias npm...")
        ok = run_cmd("npm install", cwd=pdir, silent=True)
        if ok:
            log("✓", "Dependencias instaladas", G)
        else:
            log("✗", "Error en npm install. Verifica que Node.js esté instalado.", RD)
            return False
    else:
        log("✓", "node_modules ya existe, saltando install", GR)

    log("✓", f"Proyecto configurado en: {pdir}", G)

    # 8. Lanzar servidor de desarrollo
    if launch:
        log("🚀", f"Lanzando en http://localhost:{p['port']}...")
        run_cmd(f"PORT={p['port']} {p['run_cmd']}", cwd=pdir)

    return True

# ─── CREAR ARCHIVOS DE CONFIGURACIÓN ─────────────────────────────────────────
def _create_package_json(pdir: Path, p: dict, pid: int):
    pkg = {
        "name": p["slug"],
        "version": "1.0.0",
        "description": p["name"],
        "type": "module",
        "scripts": {
            "dev":   f"vite --port {p['port']}",
            "build": "vite build",
            "preview": "vite preview",
        },
        "dependencies": {
            "react":     "^18.2.0",
            "react-dom": "^18.2.0",
        },
        "devDependencies": {
            "@vitejs/plugin-react": "^4.2.0",
            "vite": "^5.0.0",
        }
    }
    (pdir / "package.json").write_text(
        json.dumps(pkg, indent=2, ensure_ascii=False)
    )

def _create_vite_config(pdir: Path):
    config = '''import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    cors: true,
  },
});
'''
    (pdir / "vite.config.js").write_text(config)

def _create_index_html(pdir: Path, p: dict):
    html = f'''<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{p["name"]}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'''
    (pdir / "index.html").write_text(html)

def _create_main_jsx(pdir: Path):
    src_dir = pdir / "src"
    src_dir.mkdir(exist_ok=True)

    # Mover App.jsx a src/ si está en raíz
    root_app = pdir / "App.jsx"
    src_app  = src_dir / "App.jsx"
    if root_app.exists() and not src_app.exists():
        shutil.move(str(root_app), str(src_app))

    main = '''import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
'''
    (src_dir / "main.jsx").write_text(main)

# ─── STATUS ───────────────────────────────────────────────────────────────────
def show_status():
    header()
    print(f"{B}  📋 ESTADO DE PROYECTOS{R}\n")
    print(f"  {'#':<4} {'Proyecto':<44} {'Node':<8} {'Deps':<8} {'Env'}")
    print(f"  {'─'*4} {'─'*44} {'─'*8} {'─'*8} {'─'*6}")

    for pid, p in PROJECTS.items():
        pdir = BASE_DIR / "proyectos" / p["slug"]
        has_dir  = "✅" if pdir.exists() else "❌"
        has_deps = "✅" if (pdir / "node_modules").exists() else "⚪"
        has_env  = "✅" if (pdir / ".env").exists() else "⚠️ "
        col      = p["color"]
        print(f"  {col}[{pid}]{R} {p['icon']} {p['name'][:40]:<42} {has_dir:<8} {has_deps:<8} {has_env}")

    print(f"\n  {GR}Leyenda: ✅ Listo  ⚪ Pendiente  ❌ No encontrado  ⚠️  Sin .env{R}\n")

# ─── MENÚ INTERACTIVO ─────────────────────────────────────────────────────────
def interactive_menu():
    header()
    while True:
        print(f"\n{B}  ¿Qué quieres hacer?{R}\n")
        print(f"  {G}[1-5]{R}  Configurar y lanzar un proyecto específico")
        print(f"  {C}[a]{R}    Configurar todos los proyectos")
        print(f"  {Y}[b]{R}    Construir con sistema multiagente (requiere Python + API key)")
        print(f"  {M}[s]{R}    Ver estado de todos los proyectos")
        print(f"  {GR}[q]{R}    Salir\n")

        choice = input(f"  {B}→ {R}").strip().lower()

        if choice in ["1", "2", "3", "4", "5"]:
            setup_project(int(choice))
        elif choice == "a":
            for pid in PROJECTS:
                setup_project(pid, launch=False)
            log("✅", "Todos los proyectos configurados. Ejecuta cada uno con: npm run dev", G)
        elif choice == "b":
            print(f"\n{Y}  Construyendo con sistema multiagente...{R}")
            agent_dir = BASE_DIR / "multi-agent-system"
            run_cmd(f"python orchestrator.py", cwd=agent_dir)
        elif choice == "s":
            show_status()
        elif choice == "q":
            print(f"\n  {G}¡Hasta luego! 🚀{R}\n")
            break
        else:
            log("⚠️ ", "Opción no válida", Y)

# ─── ENTRY POINT ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Setup Maestro — Portafolio IA")
    parser.add_argument("--all",     action="store_true", help="Configurar todos los proyectos")
    parser.add_argument("--project", type=int, choices=[1,2,3,4,5], help="Número de proyecto")
    parser.add_argument("--build",   action="store_true", help="Construir con multiagente")
    parser.add_argument("--status",  action="store_true", help="Ver estado")
    args = parser.parse_args()

    # Verificar Node.js
    if not check_node():
        print(f"\n{RD}{B}  ❌ Node.js no encontrado.{R}")
        print(f"  Instálalo desde: https://nodejs.org\n")
        sys.exit(1)

    if args.status:
        show_status()
    elif args.project:
        header()
        setup_project(args.project)
    elif args.all:
        header()
        for pid in PROJECTS:
            setup_project(pid, launch=False)
        log("✅", "Todos configurados. Entra a cada carpeta y ejecuta: npm run dev", G)
    elif args.build:
        header()
        agent_dir = BASE_DIR / "multi-agent-system"
        run_cmd(f"python orchestrator.py", cwd=agent_dir)
    else:
        interactive_menu()
