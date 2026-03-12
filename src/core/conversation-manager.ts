import type { SiteAdapter, ExportLifecycleContext } from "~adapters/base"
import { DOMToolkit } from "~utils/dom-toolkit"
import { createExportMetadata, formatToMarkdown, htmlToMarkdown } from "~utils/exporter"
import { showToast } from "~utils/toast"
import { t } from "~utils/i18n"

export class ConversationManager {
  private siteAdapter: SiteAdapter

  constructor(siteAdapter: SiteAdapter) {
    this.siteAdapter = siteAdapter
  }

  public async exportConversationToClipboard(): Promise<boolean> {
    const config = this.siteAdapter.getExportConfig?.()
    if (!config) {
      showToast("Export not supported on this site")
      return false
    }

    const sessionId = this.siteAdapter.getSessionId()
    const exportContext: ExportLifecycleContext = {
      conversationId: sessionId,
      format: "clipboard",
      includeThoughts: true,
    }

    let exportLifecycleEnabled = false
    let exportLifecycleState: unknown = null

    try {
      if (this.siteAdapter.prepareConversationExport) {
        exportLifecycleEnabled = true
        exportLifecycleState = await this.siteAdapter.prepareConversationExport(exportContext)
      }

      const messages = this.extractConversationMessages(config)
      if (messages.length === 0) {
        showToast("No messages found to export")
        return false
      }

      const metadata = createExportMetadata(
        document.title || "Conversation",
        this.siteAdapter.getName(),
        sessionId,
      )

      const content = formatToMarkdown(metadata, messages)
      await navigator.clipboard.writeText(content)
      showToast(t("copySuccess") || "Copied to clipboard!")
      return true
    } catch (error) {
      console.error("[ConversationManager] Export failed:", error)
      showToast("Export failed")
      return false
    } finally {
      if (exportLifecycleEnabled && this.siteAdapter.restoreConversationAfterExport) {
        try {
          await this.siteAdapter.restoreConversationAfterExport(exportContext, exportLifecycleState)
        } catch (restoreErr) {
          console.warn("[ConversationManager] Export state restore failed:", restoreErr)
        }
      }
    }
  }

  private extractConversationMessages(config: any): Array<{ role: "user" | "assistant"; content: string }> {
    const messages: Array<{ role: "user" | "assistant"; content: string }> = []
    const { userQuerySelector, assistantResponseSelector, useShadowDOM } = config

    const userMessages = (DOMToolkit.query(userQuerySelector, {
      all: true,
      shadow: useShadowDOM,
    }) as Element[]) || []

    const aiMessages = (DOMToolkit.query(assistantResponseSelector, {
      all: true,
      shadow: useShadowDOM,
    }) as Element[]) || []

    const maxLen = Math.max(userMessages.length, aiMessages.length)
    for (let i = 0; i < maxLen; i++) {
      if (userMessages[i]) {
        const userContent = this.siteAdapter.extractUserQueryText ? this.siteAdapter.extractUserQueryText(userMessages[i]) : userMessages[i].textContent?.trim() || ""
        messages.push({ role: "user", content: userContent })
      }
      if (aiMessages[i]) {
        let aiContent = ""
        if (this.siteAdapter.extractAssistantResponseText) {
          aiContent = this.siteAdapter.extractAssistantResponseText(aiMessages[i])
        }
        if (!aiContent) {
          aiContent = htmlToMarkdown(aiMessages[i]) || aiMessages[i].textContent?.trim() || ""
        }
        messages.push({ role: "assistant", content: aiContent })
      }
    }

    return messages
  }
}
