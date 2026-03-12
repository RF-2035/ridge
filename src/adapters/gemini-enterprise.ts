import { SITE_IDS } from "~constants"
import { SiteAdapter, type ExportConfig } from "./base"
import { DOMToolkit } from "~utils/dom-toolkit"

export class GeminiEnterpriseAdapter extends SiteAdapter {
  match(): boolean {
    return window.location.hostname.includes("business.gemini.google")
  }

  getSiteId(): string {
    return SITE_IDS.GEMINI_ENTERPRISE
  }

  getName(): string {
    return "Gemini Enterprise"
  }

  getExportConfig(): ExportConfig {
    return {
      userQuerySelector: ".question-block",
      assistantResponseSelector: "ucs-summary",
      turnSelector: ".turn",
      useShadowDOM: true,
    }
  }

  extractUserQueryText(element: Element): string {
    const markdown = element.querySelector("ucs-fast-markdown")
    if (!markdown || !markdown.shadowRoot) {
      return this.extractTextWithLineBreaks(element)
    }
    const markdownDoc = markdown.shadowRoot.querySelector(".markdown-document")
    if (markdownDoc) {
      return this.extractTextWithLineBreaks(markdownDoc)
    }
    return this.extractTextWithLineBreaks(element)
  }

  extractAssistantResponseText(element: Element): string {
    const markdownDoc = this.extractSummaryContent(element)
    if (markdownDoc) {
      return this.extractTextWithLineBreaks(markdownDoc)
    }
    return super.extractAssistantResponseText(element)
  }

  private extractSummaryContent(ucsSummary: Element): Element | null {
    const findMarkdownDocument = (root: Element | ShadowRoot, depth = 0): Element | null => {
      if (depth > 10 || !root) return null
      const shadowRoot = (root as Element).shadowRoot || (root.nodeType === 11 ? root : null)
      const searchRoot = shadowRoot || root
      if ("querySelector" in searchRoot) {
        const markdownDoc = searchRoot.querySelector(".markdown-document")
        if (markdownDoc) return markdownDoc
      }
      const elements = "querySelectorAll" in searchRoot ? searchRoot.querySelectorAll("*") : []
      for (const el of Array.from(elements)) {
        if (el.shadowRoot) {
          const found = findMarkdownDocument(el.shadowRoot, depth + 1)
          if (found) return found
        }
      }
      return null
    }
    return findMarkdownDocument(ucsSummary)
  }

  getScrollContainer(): HTMLElement | null {
    return (DOMToolkit.query(".chat-mode-scroller", { shadow: true }) as HTMLElement) || super.getScrollContainer()
  }
}
