import { formatNumber } from '../../utils/format'

const NBRB_SYMBOL = String.fromCharCode(0xe901)

// Amount with the official NBRB Belarusian ruble symbol (U+E901 in the NBRB font)
export default function Money({ amount, className = '' }) {
  return (
    <span className={className}>
      {formatNumber(amount)} <span className="font-nbrb">{NBRB_SYMBOL}</span>
    </span>
  )
}
