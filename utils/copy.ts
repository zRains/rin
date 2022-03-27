import ClipboardJS from 'clipboard'

const clipboard = new ClipboardJS('.copyCodeBtn')
let copied = false

clipboard.on('success', function (e) {
  const trigger = e.trigger as HTMLElement
  trigger.style.backgroundImage = `url('/images/tick.svg')`
  copied = true
  if (copied) {
    setTimeout(() => {
      trigger.style.backgroundImage = `url('/images/copy.svg')`
      copied = false
    }, 2000)
  }
})

clipboard.on('error', function (e) {
  console.error('Action:', e.action)
  console.error('Trigger:', e.trigger)
})
