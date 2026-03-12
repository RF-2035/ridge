import { SITE_IDS } from "~constants"
import { SiteAdapter, type ExportConfig } from "./base"

export class ChatGPTAdapter extends SiteAdapter {
  match(): boolean {
    return window.location.hostname.includes("chatgpt.com") || window.location.hostname.includes("chat.openai.com")
  }

  getSiteId(): string {
    return SITE_IDS.CHATGPT
  }

  getName(): string {
    return "ChatGPT"
  }

  getExportConfig(): ExportConfig {
    return {
      userQuerySelector: '[data-message-author-role="user"]',
      assistantResponseSelector: '[data-message-author-role="assistant"]',
      turnSelector: '[data-testid^="conversation-turn"]',
      useShadowDOM: false,
    }
  }

  protected extractTextWithLineBreaks(element: Element): string {
    const clone = element.cloneNode(true) as Element
    clone.querySelectorAll(".sr-only").forEach(el => el.remove())
    return super.extractTextWithLineBreaks(clone)
  }

  getScrollContainer(): HTMLElement | null {
    return document.querySelector('[class*="scrollbar-gutter"], [class*="@container/main"] > div') || super.getScrollContainer()
  }
}
