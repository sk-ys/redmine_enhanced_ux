# Playwright Configuration Guide

This project uses Playwright for end-to-end testing of the Redmine Enhanced UX plugin.

## Setup

### Prerequisites
- Node.js 18+
- Docker and Docker Compose

### Installation

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npm run playwright:install
```

## Running Tests

### Local Development

```bash
# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run tests headless (default CI mode)
npm run test:e2e
```

### With Docker

Start the test environment:

```bash
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be ready
sleep 20

# Run tests
npm run test:e2e
```

Stop the test environment:

```bash
docker-compose -f docker-compose.test.yml down -v
```

## Configuration

### playwright.config.ts

Key settings:
- **baseURL**: Redmine instance URL (default: `http://localhost:3000`)
- **retries**: Number of retries for failed tests (2 in CI, 0 locally)
- **workers**: Parallel test workers (1 in CI, multiple locally)
- **projects**: Browser configurations (Chromium, Firefox, WebKit)
- **webServer**: Auto-starts Docker compose before tests

### Test Structure

Tests are located in `tests/e2e/`:
- `basic.spec.ts` - Basic functionality tests for enhanced UX features

## Writing Tests

Example test:

```typescript
import { test, expect } from '@playwright/test';

test('should display enhanced project list', async ({ page }) => {
  await page.goto('/projects');
  await expect(page).toHaveTitle(/Projects/);
});
```

### Page Objects Pattern

For complex interactions, create page objects in `tests/fixtures/`:

```typescript
export class ProjectPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/projects');
  }

  async getProjectList() {
    return this.page.locator('[class*="projects"]');
  }
}
```

## Reports

After running tests, view reports:

```bash
# HTML report
npm run playwright:report

# JSON report location
cat test-results/results.json

# JUnit XML report
cat test-results/junit.xml
```

## GitHub Actions

Tests automatically run on:
- Push to main/master/develop
- Pull requests to main/master/develop
- Weekly schedule (Sunday at 00:00 UTC)

Results are uploaded as artifacts and commented on PRs.

## Troubleshooting

### Tests fail to start
Ensure Docker services are running:
```bash
docker-compose -f docker-compose.test.yml ps
```

### Tests timeout
Increase the `timeout` in `playwright.config.ts` or adjust `webServer.timeout`.

### Port conflicts
Change the port in `docker-compose.test.yml` (default: 3000).

### Need to inspect test failures
Run tests with:
```bash
npm run test:e2e:headed  # See what's happening
npm run test:e2e:debug   # Step through tests
```

## Best Practices

1. **Use data-testid attributes** for reliable element selection
2. **Keep tests isolated** - each test should be independent
3. **Use meaningful test names** that describe what's being tested
4. **Avoid hardcoded waits** - use `waitFor` methods instead
5. **Screenshot on failure** - automatically captured in CI
6. **Use fixtures** for common test setup/teardown

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions for Playwright](https://playwright.dev/docs/ci)
