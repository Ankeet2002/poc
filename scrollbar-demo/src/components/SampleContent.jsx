export default function SampleContent({ itemCount = 12 }) {
  return (
    <ul className="sample-list">
      {Array.from({ length: itemCount }, (_, i) => (
        <li key={i}>
          <span className="sample-index">{String(i + 1).padStart(2, '0')}</span>
          <span>
            Item {i + 1} — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </span>
        </li>
      ))}
    </ul>
  )
}
