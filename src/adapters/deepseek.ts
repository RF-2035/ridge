import { SITE_IDS } from "~constants"
import { SiteAdapter, type ExportConfig } from "./base"

export class DeepSeekAdapter extends SiteAdapter {
  match(): boolean {
    return window.location.hostname === "chat.deepseek.com"
  }

  getSiteId(): string {
    return SITE_IDS.DEEPSEEK
  }

  getName(): string {
    return "DeepSeek"
  }

  getExportConfig(): ExportConfig {
    return {
      userQuerySelector: ".ds-message:not(:has(.ds-markdown))",
      assistantResponseSelector: ".ds-message:has(.ds-markdown) .ds-markdown",
      turnSelector: null,
      useShadowDOM: false,
    }
  }

  extractUserQueryText(element: Element): string {
    const clone = element.cloneNode(true) as HTMLElement
    clone.querySelectorAll("button, [role=button], svg, .ds-icon-button, [aria-hidden=true]").forEach(node => node.remove())
    return this.extractTextWithLineBreaks(clone).trim()
  }

  getScrollContainer(): HTMLElement | null {
    const firstMessage = document.querySelector(".ds-message")
    if (firstMessage) {
      const scrollArea = firstMessage.closest(".ds-scroll-area") as HTMLElement | null
      if (scrollArea && scrollArea.scrollHeight > scrollArea.clientHeight) {
        return scrollArea
      }
    }
    return super.getScrollContainer()
  }
}
