# Playwright Automation

Production-grade browser automation system for scraping, scheduling, persistence, and test execution.

## Overview
Playwright Automation is a Python-based automation suite designed for repeatable browser workflows, real scraping jobs, SQLite persistence, and E2E verification. Zero mocks — all scrapers hit real websites.

## Problem
Many operational web tasks are repetitive, fragile, and manually executed. Teams need reliable automation with persistence and verification.

## Solution
This project automates browser-driven workflows through:
- 3 real scrapers (GitHub repos, e-commerce prices, form submission)
- Scheduled job execution with SQLite
- CLI interface for manual runs
- E2E test coverage for the portfolio
- GitHub Actions CI integration

## System Architecture

```text
CLI / Scheduler
      ↓
Scrapers (3 real targets)
      ↓
Playwright Browser Engine
      ↓
Target Websites (GitHub, e-commerce, forms)
      ↓
SQLite Storage
```

## Key Features
- 3 production scrapers (zero mocks)
- SQLite persistence layer
- Cron-style scheduler
- CLI interface
- E2E test suite (54 tests)
- GitHub Actions CI/CD

## Engineering Decisions

### Why zero mocks?
To ensure scrapers work against real websites, catching real-world failures that mocked tests miss.

### Why SQLite?
Lightweight persistence for scraping results without requiring a separate database server.

### Why Playwright over Selenium?
Modern API, better auto-waiting, faster execution, built-in browser management.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Language | Python 3.12 |
| Automation | Playwright |
| Storage | SQLite |
| Testing | pytest, pytest-playwright |
| CI/CD | GitHub Actions |
| Infra | Docker |

## Repo Structure
```
scrapers/         # 3 real scraper modules
scheduler/        # Job scheduling logic
storage/          # SQLite persistence
tests/            # Unit tests
e2e/              # E2E browser tests
utils/            # Shared utilities
web/              # Portfolio E2E targets
.github/workflows/ # CI pipeline
```

## Key Metrics
| Metric | Value |
|--------|-------|
| Real Scrapers | 3 |
| E2E Tests | 54 |
| Mock Count | 0 (zero) |
| Commits | 7 |

## How to Run
```bash
pip install -r requirements.txt
python cli.py
```

## Why This Matters
This repo demonstrates production-style automation engineering — not just AI demos but reliable operational systems.

## Roadmap
- [ ] Agent-triggered automation
- [ ] Richer dashboarding
- [ ] Retry policies
- [ ] Multi-tenant run history

---
Built by [Christian Hernandez](https://ch65-portfolio.vercel.app) · AI Engineer
