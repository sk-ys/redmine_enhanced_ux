# Playwright Testing Infrastructure - Getting Started

This directory now contains a complete, production-ready Playwright testing infrastructure for the Redmine Enhanced UX plugin.

## 📌 Start Here

1. **First time?** → Read [`PLAYWRIGHT_QUICK_REFERENCE.md`](PLAYWRIGHT_QUICK_REFERENCE.md)
2. **Need details?** → Read [`docs/PLAYWRIGHT_SETUP.md`](docs/PLAYWRIGHT_SETUP.md)
3. **Writing tests?** → See [`tests/README.md`](tests/README.md)

## 🚀 Quick Start (30 seconds)

```bash
# 1. Auto-setup environment
chmod +x scripts/setup-playwright.sh && ./scripts/setup-playwright.sh

# 2. Start services
docker-compose -f docker-compose.test.yml up -d

# 3. Run tests
npm run test:e2e

# 4. View results
npm run playwright:report
```

## 📁 File Guide

| File | Purpose |
|------|---------|
| `package.json` | Node.js dependencies (Playwright v1.46.0) |
| `playwright.config.ts` | Test configuration, browsers, reporters |
| `docker-compose.test.yml` | Redmine + MySQL test environment |
| `.github/workflows/playwright.yml` | GitHub Actions CI/CD workflow |
| `tests/e2e/basic.spec.ts` | Test suite (add your tests here) |
| `tests/fixtures/*` | Page objects for reusable components |
| `docs/PLAYWRIGHT_SETUP.md` | Full setup guide & troubleshooting |
| `PLAYWRIGHT_QUICK_REFERENCE.md` | Common commands & quick fixes |
| `scripts/setup-playwright.sh` | Automated environment setup |

## 🎯 What's Included

✅ **Multi-browser testing** (Chrome, Firefox, Safari)  
✅ **Docker-based test environment** (Redmine + MySQL)  
✅ **GitHub Actions integration** (auto-test on push/PR)  
✅ **Comprehensive reports** (HTML, JSON, JUnit XML)  
✅ **Page Object Models** (maintainable test code)  
✅ **Debug & UI modes** (interactive test execution)  
✅ **Full documentation** (setup guides & best practices)  

## 📖 Documentation

- **[PLAYWRIGHT_QUICK_REFERENCE.md](PLAYWRIGHT_QUICK_REFERENCE.md)** - Essential commands & troubleshooting
- **[docs/PLAYWRIGHT_SETUP.md](docs/PLAYWRIGHT_SETUP.md)** - Complete setup guide & best practices
- **[tests/README.md](tests/README.md)** - Writing and organizing tests

## ⚡ Common Commands

```bash
npm run test:e2e              # Run all tests (headless)
npm run test:e2e:headed       # Run with visible browser
npm run test:e2e:ui           # Interactive Playwright UI
npm run test:e2e:debug        # Debug/step-through mode
npm run playwright:report     # View HTML test report
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose -f docker-compose.test.yml up -d

# View logs
docker-compose -f docker-compose.test.yml logs -f redmine

# Stop services
docker-compose -f docker-compose.test.yml down -v
```

## 🔄 GitHub Actions

Tests automatically run on:
- Push to main/master/develop
- Pull requests
- Weekly schedule (Sunday 00:00 UTC)

Results appear in:
- Actions tab (workflow runs)
- PR comments (test summary)
- Artifacts (30-day retention)

## ✨ Key Features

| Feature | Benefit |
|---------|---------|
| Multi-browser | Ensure compatibility across platforms |
| Docker isolation | Reproducible, clean test environment |
| Page Objects | Maintainable, reusable test code |
| CI/CD | Automated quality checks |
| Reporting | Visual test results & debugging info |
| Debug mode | Interactive test development |
| PR integration | Visibility into test results |

## 🆘 Need Help?

| Issue | Solution |
|-------|----------|
| Tests won't run | See **PLAYWRIGHT_QUICK_REFERENCE.md** troubleshooting |
| Docker issues | Check `docker-compose ps` & `docker logs` |
| Need test guide | Read **docs/PLAYWRIGHT_SETUP.md** |
| Writing tests | See **tests/README.md** examples |

## 📊 Test Reports Location

After running tests:
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`

View with: `npm run playwright:report`

## 🚀 Next Steps

1. **Local Testing**: Follow "Quick Start" above
2. **Write Tests**: Add tests to `tests/e2e/`
3. **Integrate CI**: Push to GitHub and check Actions tab
4. **Expand Suite**: Create new test files as needed

---

**Ready to test?** Start with: `npm run test:e2e`

For questions, see the documentation files or review the configuration in `playwright.config.ts`.
