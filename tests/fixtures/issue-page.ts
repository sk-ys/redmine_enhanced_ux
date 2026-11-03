import { Page } from '@playwright/test';

export class IssuePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/issues');
  }

  async getPageTitle() {
    return this.page.title();
  }

  async getIssueList() {
    return this.page.locator('table.issues');
  }

  async getIssueCount() {
    const rows = this.page.locator('table.issues tbody tr');
    return rows.count();
  }

  async clickIssue(issueId: number) {
    await this.page.click(`a[href*="/issues/${issueId}"]`);
  }

  async getHeadersPosition() {
    const thead = this.page.locator('thead');
    if (await thead.isVisible()) {
      return thead.evaluate((el) => window.getComputedStyle(el).position);
    }
    return null;
  }
}
