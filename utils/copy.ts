import ClipboardJS from 'clipboard'

const clipboard = new ClipboardJS('.copyCodeBtn')
let copied = false

clipboard.on('success', (e) => {
  const trigger = e.trigger as HTMLElement
  trigger.style.backgroundImage = "url('/images/tick.svg')"
  copied = true
  if (copied) {
    setTimeout(() => {
      trigger.style.backgroundImage = "url('/images/copy.svg')"
      copied = false
    }, 2000)
  }
})
