import { useState } from 'react'
import SampleContent from './SampleContent'

export default function ScrollDemoCard({
  title,
  description,
  solutionClass,
  cssSnippet,
  pros,
  cons,
  badge,
  renderScrollArea,
}) {
  const [itemCount, setItemCount] = useState(8)
  const needsScroll = itemCount > 6

  return (
    <article className="demo-card">
      <header className="demo-card-header">
        <div>
          <h2>{title}</h2>
          {badge && <span className="badge">{badge}</span>}
        </div>
        <p>{description}</p>
      </header>

      <div className="demo-controls">
        <label>
          Items: {itemCount}
          <input
            type="range"
            min={4}
            max={20}
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
          />
        </label>
        <span className={`scroll-hint ${needsScroll ? 'active' : ''}`}>
          {needsScroll ? 'Scrollbar visible' : 'No scrollbar yet'}
        </span>
      </div>

      <div className="demo-preview">
        <div className="width-marker" aria-hidden="true">
          <span>Right edge</span>
        </div>
        {renderScrollArea ? (
          renderScrollArea(itemCount)
        ) : (
          <div className={`scroll-box ${solutionClass}`}>
            <SampleContent itemCount={itemCount} />
          </div>
        )}
      </div>

      <details className="code-details">
        <summary>View CSS</summary>
        <pre><code>{cssSnippet}</code></pre>
      </details>

      <div className="pros-cons">
        <div>
          <strong>Pros</strong>
          <ul>{pros.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <div>
          <strong>Cons</strong>
          <ul>{cons.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      </div>
    </article>
  )
}
