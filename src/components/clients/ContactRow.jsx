function normalizePhone(phone) {
  return phone.replace(/[^\d+]/g, '')
}

function PhoneGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A17 17 0 0 1 4 6.1 1.5 1.5 0 0 1 5.5 3.5Z" />
    </svg>
  )
}

function ViberGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.5c4.7 0 8.5 2.9 8.5 7.6s-3.8 7.6-8.5 7.6c-.6 0-1.2 0-1.7-.1L7 21v-2.8c-2.1-1.3-3.5-3.5-3.5-7.1C3.5 6.4 7.3 3.5 12 3.5Z" />
      <path d="M9.6 8.2c.5-.2.8 0 1 .4l.5 1c.2.4 0 .7-.3 1l-.4.4c.5 1 1.4 1.9 2.4 2.4l.4-.5c.3-.3.6-.4 1-.3l1 .5c.4.2.6.6.4 1-.3.8-1.1 1.3-1.9 1.1-2.4-.5-4.4-2.4-4.9-4.9-.2-.8.2-1.6 1-1.9Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WhatsAppGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />
      <path d="M9.4 7.9c.4-.2.7 0 .9.4l.5 1c.1.3 0 .6-.2.9l-.4.4c.5 1 1.3 1.8 2.3 2.3l.4-.4c.3-.3.6-.4.9-.2l1 .5c.4.2.5.5.4.9-.3.8-1 1.3-1.8 1.1-2.3-.5-4.2-2.3-4.7-4.7-.2-.8.3-1.5 1.1-1.8Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TelegramGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.7 4.2 3.9 10.8c-.9.35-.85 1.6.06 1.9l4.1 1.3 1.55 4.7c.28.83 1.33 1 1.9.33l2.1-2.5 4.2 3.1c.7.5 1.7.14 1.9-.72l2.4-12.6c.2-1-.75-1.83-1.7-1.46ZM9.2 13.4l8.1-5.5c.3-.2.6.2.35.45l-6.6 6.3-.3 2.9-1.55-4.15Z" />
    </svg>
  )
}

const ITEMS = [
  { label: 'Позвонить', color: '#202020', Glyph: PhoneGlyph, href: (clean) => `tel:${clean}` },
  { label: 'Viber', color: '#7360F2', Glyph: ViberGlyph, href: (_c, digits) => `viber://chat?number=%2B${digits}` },
  { label: 'WhatsApp', color: '#1FAF53', Glyph: WhatsAppGlyph, href: (_c, digits) => `https://wa.me/${digits}`, external: true },
  { label: 'Telegram', color: '#229ED9', Glyph: TelegramGlyph, href: (_c, digits) => `https://t.me/+${digits}`, external: true },
]

export default function ContactRow({ phone }) {
  const clean = normalizePhone(phone)
  const digits = clean.replace(/\D/g, '')

  return (
    <div className="mt-4 flex justify-around">
      {ITEMS.map(({ label, color, Glyph, href, external }) => (
        <a
          key={label}
          href={href(clean, digits)}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          className="press flex flex-col items-center gap-1.5"
        >
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            <Glyph className="h-6 w-6" />
          </span>
          <span className="text-[11px] font-medium text-text-secondary">{label}</span>
        </a>
      ))}
    </div>
  )
}
