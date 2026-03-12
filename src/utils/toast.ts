/**
 * 轻量级 Toast 提示 (Simplified)
 */

export function showToast(message: string, duration = 2000) {
  const existing = document.getElementById("ophel-toast")
  if (existing) existing.remove()

  const styleId = "ophel-toast-style"
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style")
    style.id = styleId
    style.textContent = `
      .ophel-toast {
        position: fixed !important;
        bottom: 80px !important;
        right: 24px !important;
        background: #333;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      .ophel-toast.show { opacity: 1; }
    `
    document.head.appendChild(style)
  }

  const toast = document.createElement("div")
  toast.id = "ophel-toast"
  toast.className = "ophel-toast"
  toast.textContent = message
  document.body.appendChild(toast)

  requestAnimationFrame(() => toast.classList.add("show"))

  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => toast.remove(), 300)
  }, duration)
}
