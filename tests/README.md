# Playwright Testing Infrastructure

This directory structure sets up a comprehensive E2E testing framework for the Redmine Enhanced UX plugin using Playwright and GitHub Actions.

## 📁 Directory Structure

```
.
├── .github/
│   └── workflows/
│       └── playwright.yml              # GitHub Actions workflow
├── tests/
│   ├── e2e/
│   │   └── basic.spec.ts              # Basic E2E test suite
│   └── fixtures/
│       ├── issue-page.ts              # Issue page object model
│       └── project-page.ts            # Project page object model
├── docs/
│   └── PLAYWRIGHT_SETUP.md            # Setup and usage guide
├── scripts/
│   └── setup-playwright.sh            # Local environment setup script
├── test-results/                      # Test results directory
├── docker-compose.test.yml            # Test environment configuration
├── playwright.config.ts               # Playwright configuration
└── package.json                       # Node.js dependencies
```

## 🚀 Quick Start

### 1. Local Setup

```bash
# Run the setup script
chmod +x scripts/setup-playwright.sh
./scripts/setup-playwright.sh

# Or manually:
npm ci
npm run playwright:install
```

### 2. Start Test Environment

```bash
docker-compose -f docker-compose.test.yml up -d
```

### 3. Run Tests

```bash
# Run all tests headless
npm run test:e2e

# Run with browser visible
npm run test:e2e:headed

# Interactive UI mode
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

### 4. View Reports

```bash
npm run playwright:report
```

## 📋 What's Included

- ✅ **Playwright Configuration** - Multi-browser testing (Chrome, Firefox, Safari)
- ✅ **Docker Setup** - Isolated test environment with Redmine instance
- ✅ **GitHub Actions Workflow** - Automated testing on push/PR
- ✅ **Page Object Models** - Reusable test fixtures
- ✅ **Test Reporting** - HTML, JSON, and JUnit XML reports
- ✅ **PR Integration** - Automatic test results comments on PRs

## 🔧 Configuration Files

### playwright.config.ts
- Configures test runners, reporters, and browser selection
- Sets up automatic webServer startup via Docker Compose
- Configures retries, timeouts, and test workers

### docker-compose.test.yml
- Redmine container (latest)
- MySQL database container
- Volume management for data persistence
- Health checks for service readiness

### .github/workflows/playwright.yml
- Triggers: push to main/master/develop, PRs, weekly schedule
- Installs dependencies and Playwright browsers
- Starts Docker services with health checks
- Runs tests and uploads reports as artifacts
- Comments on PRs with test results

## 📝 Writing Tests

Basic test example:

```typescript
import { test, expect } from '@playwright/test';

test('should load project index', async ({ page }) => {
  await page.goto('/projects');
  await expect(page).toHaveTitle(/Projects/);
});
```

Using page objects:

```typescript
import { test } from '@playwright/test';
import { ProjectPage } from '../fixtures/project-page';

test('should display projects', async ({ page }) => {
  const projectPage = new ProjectPage(page);
  await projectPage.goto();
  const projectCount = await projectPage.getProjectCount();
  console.log(`Found ${projectCount} projects`);
});
```

## 🐛 Troubleshooting

### Docker services won't start
```bash
docker-compose -f docker-compose.test.yml ps
docker-compose -f docker-compose.test.yml logs redmine
```

### Tests timeout
- Increase `webServer.timeout` in `playwright.config.ts`
- Check Redmine startup logs
- Verify port 3000 is available

### Port conflicts
Change port in `docker-compose.test.yml` and update `baseURL` in `playwright.config.ts`

## 📖 Documentation

- [Playwright Setup Guide](docs/PLAYWRIGHT_SETUP.md) - Detailed setup and best practices
- [Playwright Documentation](https://playwright.dev)
- [GitHub Actions Guide](https://docs.github.com/en/actions)

## 🔄 CI/CD Integration

Tests run automatically on:
- ✅ Push to main/master/develop branches
- ✅ Pull requests to main/master/develop
- ✅ Weekly schedule (Sunday 00:00 UTC)

Results are:
- ✅ Uploaded as artifacts (30-day retention)
- ✅ Commented on PRs with summary
- ✅ Available in Actions tab

## 📊 Test Reports

After test execution:
- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`

View HTML report locally:
```bash
npm run playwright:report
```

## ✨ Features

- **Multi-browser Testing**: Chrome, Firefox, Safari
- **Parallel Execution**: Tests run in parallel (configurable)
- **Automatic Retries**: Failed tests retry automatically in CI
- **Screenshots on Failure**: Automatic capture of failed test states
- **Trace Recording**: Full browser traces for debugging
- **Page Objects**: Reusable test components
- **Docker Isolation**: Tests run in isolated environment

## 📝 Notes

- Tests use `base URL: http://localhost:3000` by default
- Docker Compose automatically manages MySQL and Redmine startup
- Playwright browsers are cached for faster CI runs
- Test workers default to 1 in CI, parallel locally

## 🤝 Contributing

When adding new tests:
1. Create tests in `tests/e2e/`
2. Use page objects from `tests/fixtures/`
3. Follow existing test patterns
4. Update documentation if adding new features

---

For detailed setup and best practices, see [PLAYWRIGHT_SETUP.md](docs/PLAYWRIGHT_SETUP.md)
