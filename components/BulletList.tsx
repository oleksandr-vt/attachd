export default function BulletList({ items, className = 'grid gap-3.5' }: { items: string[], className?: string }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item}>
          <div className="flex items-start gap-3">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terra" aria-hidden="true" />
            <span className="text-[15px] leading-7 text-dark2">{item}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
