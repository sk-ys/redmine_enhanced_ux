# Quick Reference Guide - Playwright Testing

## One-Command Setup

```bash
chmod +x scripts/setup-playwright.sh && ./scripts/setup-playwright.sh
```

## Essential Commands

### Start Environment
```bash
docker-compose -f docker-compose.test.yml up -d
```

### Run Tests
```bash
npm run test:e2e              # Run all tests (headless)
npm run test:e2e:headed       # Run with browser visible
npm run test:e2e:ui           # Interactive Playwright UI
npm run test:e2e:debug        # Debug mode
```

### View Reports
```bash
npm run playwright:report     # Open HTML report
```

### Stop Environment
```bash
docker-compose -f docker-compose.test.yml down -v
```

## Project Structure

```
.github/workflows/playwright.yml    GitHub Actions workflow
tests/
  ├── e2e/basic.spec.ts            Test suite
  └── fixtures/                     Page objects
docs/PLAYWRIGHT_SETUP.md            Full documentation
scripts/setup-playwright.sh         Setup automation
docker-compose.test.yml             Test environment config
playwright.config.ts               Test configuration
package.json                       Dependencies
```

## Common Tasks

### Run specific test file
```bash
npx playwright test tests/e2e/basic.spec.ts
```

### Run specific test by name
```bash
npx playwright test -g "should load project index"
```

### Update snapshots
```bash
npx playwright test --update-snapshots
```

### Check service status
```bash
docker-compose -f docker-compose.test.yml ps
```

### View service logs
```bash
docker-compose -f docker-compose.test.yml logs -f redmine
```

## Configuration Files

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Playwright settings, browsers, reporters |
| `docker-compose.test.yml` | Redmine + MySQL setup |
| `.github/workflows/playwright.yml` | CI/CD automation |
| `package.json` | Node dependencies |

## Test Reports Location

- HTML Report: `playwright-report/index.html`
- JSON Results: `test-results/results.json`
- JUnit XML: `test-results/junit.xml`

## Troubleshooting

**Redmine won't start?**
```bash
docker-compose -f docker-compose.test.yml logs redmine
```

**Port 3000 already in use?**
- Edit `docker-compose.test.yml` port mapping
- Update `baseURL` in `playwright.config.ts`

**Tests timeout?**
- Verify services running: `docker-compose -f docker-compose.test.yml ps`
- Check Redmine is healthy: `curl http://localhost:3000`

**Need help?**
- Full guide: `docs/PLAYWRIGHT_SETUP.md`
- Test overview: `tests/README.md`
- Playwright docs: https://playwright.dev

## GitHub Actions

Tests automatically run on:
- Push to main/master/develop
- Pull requests
- Weekly (Sundays at 00:00 UTC)

Results available in Actions tab → artifacts
