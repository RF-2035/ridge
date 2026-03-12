import { SITE_IDS } from "~constants"
import { SiteAdapter, type ExportConfig } from "./base"

const USER_QUERY_SELECTOR = '[data-testid="send_message"], [data-testid="message_content"].justify-end'

export class DoubaoAdapter extends SiteAdapter {
  match(): boolean {
    return window.location.hostname === "www.doubao.com"
  }

  getSiteId(): string {
    return SITE_IDS.DOUBAO
  }

  getName(): string {
    return "豆包"
  }

  getExportConfig(): ExportConfig {
    return {
      userQuerySelector: USER_QUERY_SELECTOR,
      assistantResponseSelector: '[data-testid="receive_message"]',
      turnSelector: null,
      useShadowDOM: false,
    }
  }

  extractUserQueryText(element: Element): string {
    const textContainer = element.querySelector('[data-testid="message_text_content"]') || element
    return textContainer.textContent?.trim() || ""
  }

  extractAssistantResponseText(element: Element): string {
    const markdown = element.querySelector(".flow-markdown-body")
    return markdown ? this.extractTextWithLineBreaks(markdown).trim() : super.extractAssistantResponseText(element)
  }

  getScrollContainer(): HTMLElement | null {
    const messageList = document.querySelector('[data-testid="message-list"]')
    if (messageList) {
      let current: HTMLElement | null = messageList.parentElement
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current)
        if ((style.overflowY === "scroll" || style.overflowY === "auto") && current.scrollHeight > current.clientHeight) {
          return current
        }
        current = current.parentElement
      }
    }
    return document.querySelector('[data-testid="scroll_view"]') as HTMLElement | null
  }
}
