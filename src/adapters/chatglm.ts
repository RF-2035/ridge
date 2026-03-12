import { SITE_IDS } from "~constants"
import { SiteAdapter, type ExportConfig } from "./base"

const USER_QUERY_SELECTOR = ".conversation.question"
const ASSISTANT_MARKDOWN_SELECTOR = ".answer-content-wrap .markdown-body"

export class ChatGLMAdapter extends SiteAdapter {
  match(): boolean {
    return window.location.hostname === "chatglm.cn"
  }

  getSiteId(): string {
    return SITE_IDS.CHATGLM
  }

  getName(): string {
    return "智谱清言"
  }

  getExportConfig(): ExportConfig {
    return {
      userQuerySelector: USER_QUERY_SELECTOR,
      assistantResponseSelector: ASSISTANT_MARKDOWN_SELECTOR,
      turnSelector: null,
      useShadowDOM: false,
    }
  }

  extractUserQueryText(element: Element): string {
    const text = element.querySelector(".question-txt") || element
    return this.extractTextWithLineBreaks(text).trim()
  }

  extractAssistantResponseText(element: Element): string {
    const markdown = element.matches(".markdown-body") ? element : element.querySelector(".markdown-body")
    return markdown ? this.extractTextWithLineBreaks(markdown).trim() : super.extractAssistantResponseText(element)
  }

  getScrollContainer(): HTMLElement | null {
    const list = document.querySelector(".conversation-list") as HTMLElement | null
    if (list && list.scrollHeight > list.clientHeight) return list
    const chatScroll = document.querySelector(".chatScrollContainer") as HTMLElement | null
    if (chatScroll && chatScroll.scrollHeight > chatScroll.clientHeight) return chatScroll
    return super.getScrollContainer()
  }
}
