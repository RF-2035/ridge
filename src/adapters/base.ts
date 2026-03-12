/**
 * 站点适配器基类 (Simplified for Copy Markdown Only)
 */

import { DOMToolkit } from "~utils/dom-toolkit"

export interface ExportConfig {
  userQuerySelector: string
  assistantResponseSelector: string
  turnSelector: string | null
  useShadowDOM: boolean
}

export interface ExportLifecycleContext {
  conversationId: string
  format: "markdown" | "json" | "txt" | "clipboard"
  includeThoughts: boolean
}

export abstract class SiteAdapter {
  /** 检测当前页面是否匹配该站点 */
  abstract match(): boolean

  /** 返回站点标识符 */
  abstract getSiteId(): string

  /** 返回站点显示名称 */
  abstract getName(): string

  /** 获取当前会话 ID */
  getSessionId(): string {
    const urlWithoutQuery = window.location.href.split("?")[0]
    const parts = urlWithoutQuery.split("/").filter((p) => p)
    return parts.length > 0 ? parts[parts.length - 1] : "default"
  }

  /** 获取导出配置 */
  abstract getExportConfig(): ExportConfig | null

  /** 导出前生命周期钩子 */
  async prepareConversationExport(_context: ExportLifecycleContext): Promise<unknown> {
    return null
  }

  /** 导出后生命周期钩子 */
  async restoreConversationAfterExport(
    _context: ExportLifecycleContext,
    _state: unknown,
  ): Promise<void> {}

  /** 提取文本，保留块级元素和 <br> 的换行 */
  protected extractTextWithLineBreaks(element: Element): string {
    const result: string[] = []
    const blockTags = new Set([
      "div", "p", "li", "h1", "h2", "h3", "h4", "h5", "h6",
      "pre", "blockquote", "tr", "section", "article",
    ])

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result.push(node.textContent || "")
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element
        const tag = el.tagName.toLowerCase()

        if (tag === "br") {
          result.push("\n")
          return
        }

        for (const child of el.childNodes) {
          walk(child)
        }

        if (blockTags.has(tag) && result.length > 0) {
          const lastChar = result[result.length - 1]
          if (typeof lastChar === 'string' && !lastChar.endsWith("\n")) {
            result.push("\n")
          }
        }
      }
    }

    walk(element)
    return result.join("").replace(/\n{3,}/g, "\n\n").trim()
  }

  /** 从用户提问元素中提取文本 */
  extractUserQueryText(element: Element): string {
    return this.extractTextWithLineBreaks(element)
  }

  /** 从AI回复元素中提取文本 */
  extractAssistantResponseText(element: Element): string {
    return this.extractTextWithLineBreaks(element)
  }

  /** 获取滚动容器 */
  getScrollContainer(): HTMLElement | null {
    const selectors = [
      "infinite-scroller.chat-history",
      ".chat-mode-scroller",
      "main",
      '[role="main"]',
      ".conversation-container",
      ".chat-container",
      "div.content-container",
    ]

    for (const selector of selectors) {
      const container = document.querySelector(selector) as HTMLElement
      if (container && container.scrollHeight > container.clientHeight) {
        return container
      }
    }
    return null
  }

  /** 穿透 Shadow DOM 查找元素 */
  protected findElementBySelectors(selectors: string[]): HTMLElement | null {
    return DOMToolkit.query(selectors, { shadow: true }) as HTMLElement | null
  }
}
