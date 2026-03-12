import { SITE_IDS } from "~constants"
import { SiteAdapter, type ExportConfig } from "./base"

const USER_SEGMENT_SELECTOR = ".segment.segment-user"
const ASSISTANT_MARKDOWN_SELECTOR = ".segment-assistant .markdown"

export class KimiAdapter extends SiteAdapter {
  match(): boolean {
    return window.location.hostname === "www.kimi.com"
  }

  getSiteId(): string {
    return SITE_IDS.KIMI
  }

  getName(): string {
    return "Kimi"
  }

  getExportConfig(): ExportConfig {
    return {
      userQuerySelector: USER_SEGMENT_SELECTOR,
      assistantResponseSelector: ASSISTANT_MARKDOWN_SELECTOR,
      turnSelector: null,
      useShadowDOM: false,
    }
  }

  extractUserQueryText(element: Element): string {
    const contentBox = element.querySelector(".segment-content-box")
    return this.extractTextWithLineBreaks(contentBox || element).trim()
  }

  extractAssistantResponseText(element: Element): string {
    const markdown = element.matches(".markdown") ? element : element.querySelector(".markdown")
    return markdown ? this.extractTextWithLineBreaks(markdown).trim() : super.extractAssistantResponseText(element)
  }

  getScrollContainer(): HTMLElement | null {
    const detail = document.querySelector(".chat-detail-content") as HTMLElement | null
    if (detail && detail.scrollHeight > detail.clientHeight) return detail
    return super.getScrollContainer()
  }
}
