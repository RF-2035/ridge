import { SITE_IDS } from "~constants"
import { SiteAdapter, type ExportConfig } from "./base"

export class ClaudeAdapter extends SiteAdapter {
  match(): boolean {
    return window.location.hostname.includes("claude.ai") || window.location.hostname.includes("claude.com")
  }

  getSiteId(): string {
    return SITE_IDS.CLAUDE
  }

  getName(): string {
    return "Claude"
  }

  getExportConfig(): ExportConfig {
    return {
      userQuerySelector: '[data-testid="user-message"]',
      assistantResponseSelector: ".font-claude-response",
      turnSelector: null,
      useShadowDOM: false,
    }
  }

  extractAssistantResponseText(element: Element): string {
    const markdownContent = element.querySelector(".standard-markdown, .progressive-markdown")
    if (markdownContent) {
      return this.extractTextWithLineBreaks(markdownContent)
    }
    return super.extractAssistantResponseText(element)
  }

  getScrollContainer(): HTMLElement | null {
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      const scrollable = mainContent.querySelector(".overflow-y-scroll")
      if (scrollable) return scrollable as HTMLElement
    }
    return super.getScrollContainer()
  }
}
