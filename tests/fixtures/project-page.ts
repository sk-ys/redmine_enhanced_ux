import { Page } from '@playwright/test';

export class ProjectPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/projects');
  }

  async getPageTitle() {
    return this.page.title();
  }

  async getProjectList() {
    return this.page.locator('[class*="projects"]');
  }

  async getProjectCount() {
    const projects = this.page.locator('a[href*="/projects/"]');
    return projects.count();
  }
}
