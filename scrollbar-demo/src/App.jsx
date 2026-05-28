import { useState } from 'react'
import ScrollDemoCard from './components/ScrollDemoCard'
import OverlayScrollbarDemo from './components/OverlayScrollbar'
import SampleContent from './components/SampleContent'
import './App.css'

const SOLUTIONS = [
  {
    id: 'default',
    title: 'Default (The Problem)',
    badge: 'Baseline',
    description:
      'Standard overflow: auto. On macOS scrollbars overlay content; on Windows/Linux they consume ~15–17px of width, shifting layout when they appear.',
    solutionClass: 'solution-default',
    cssSnippet: `.scroll-box {
  overflow-y: auto;
  height: 220px;
  /* Scrollbar takes layout space on Win/Linux */
}`,
    pros: ['Native scrolling behavior', 'Accessible by default', 'Zero extra code'],
    cons: [
      'Layout shift when scrollbar appears (Win/Linux)',
      'Inconsistent cross-platform UX',
      'Content width changes dynamically',
    ],
  },
  {
    id: 'gutter-stable',
    title: 'scrollbar-gutter: stable',
    badge: 'Recommended',
    description:
      'Reserves space for the scrollbar gutter at all times. No layout shift — but the gutter is always visible, even when content does not scroll.',
    solutionClass: 'solution-gutter-stable',
    cssSnippet: `.scroll-box {
  overflow-y: auto;
  scrollbar-gutter: stable;
  height: 220px;
}`,
    pros: [
      'No layout shift (modern browsers)',
      'Pure CSS, no JS',
      'Good accessibility — native scrollbar',
    ],
    cons: [
      'Always reserves gutter space (not true overlay)',
      'Safari added support in 18.2+',
      'Slightly narrower content area always',
    ],
  },
  {
    id: 'negative-margin',
    title: 'Negative Margin Overlay Trick',
    badge: 'Classic hack',
    description:
      'Clip the scrollbar in an outer wrapper while the inner element scrolls wider than the container. Scrollbar renders over the clipped edge — macOS-like overlay on all platforms.',
    solutionClass: 'solution-negative-margin-outer',
    renderScrollArea: (itemCount) => (
      <div className="scroll-box solution-negative-margin-outer">
        <div className="inner-scroll">
          <SampleContent itemCount={itemCount} />
        </div>
      </div>
    ),
    cssSnippet: `.outer {
  overflow: hidden;
  height: 220px;
}
.inner {
  overflow-y: scroll;
  height: 100%;
  margin-right: -17px;  /* hide scrollbar in gutter */
  padding-right: 17px;  /* keep content from going under scrollbar */
}`,
    pros: [
      'True overlay behavior cross-platform',
      'Pure CSS',
      'Native scroll performance',
    ],
    cons: [
      'Magic number (17px) varies by OS/browser',
      'RTL layouts need adjustment',
      'Scrollbar partially clipped on some browsers',
    ],
  },
  {
    id: 'hidden-native',
    title: 'Hide Native Scrollbar',
    badge: 'CSS only',
    description:
      'Hide the system scrollbar entirely. Content never shifts, but users lose the visible scroll indicator unless you add a custom one.',
    solutionClass: 'solution-hidden-scrollbar',
    cssSnippet: `.scroll-box {
  overflow-y: auto;
  height: 220px;
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE/Edge legacy */
}
.scroll-box::-webkit-scrollbar {
  display: none;                /* Chrome, Safari, Edge */
}`,
    pros: ['No layout shift', 'Simple CSS', 'Full content width always'],
    cons: [
      'No visible scroll affordance',
      'Bad UX without custom indicator',
      'Accessibility concerns',
    ],
  },
  {
    id: 'thin-transparent',
    title: 'Thin Transparent Scrollbar',
    badge: 'Styled native',
    description:
      'Style the native scrollbar to be thin and semi-transparent. Still occupies space on Windows, but less visually intrusive. Combine with the negative-margin trick for full overlay.',
    solutionClass: 'solution-thin-scrollbar',
    cssSnippet: `.scroll-box {
  overflow-y: auto;
  height: 220px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.35) transparent;
}
.scroll-box::-webkit-scrollbar {
  width: 8px;
}
.scroll-box::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-box::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.35);
  border-radius: 4px;
}`,
    pros: ['Native scroll + visible thumb', 'Works in most browsers', 'Subtle appearance'],
    cons: [
      'Still takes ~8px on Windows unless combined with overlay trick',
      'WebKit-specific pseudo-elements',
      'Firefox styling is more limited',
    ],
  },
]

function CustomOverlaySection() {
  const [itemCount, setItemCount] = useState(8)
  const needsScroll = itemCount > 6

  return (
    <article className="demo-card demo-card-featured">
      <header className="demo-card-header">
        <div>
          <h2>Custom React Overlay Scrollbar</h2>
          <span className="badge badge-accent">Full overlay</span>
        </div>
        <p>
          Hide the native scrollbar and render a floating thumb with JavaScript.
          Matches macOS overlay behavior on every platform — at the cost of
          custom scroll logic.
        </p>
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
          {needsScroll ? 'Custom thumb visible' : 'No scroll needed'}
        </span>
      </div>

      <div className="demo-preview">
        <div className="width-marker" aria-hidden="true">
          <span>Right edge</span>
        </div>
        <OverlayScrollbarDemo itemCount={itemCount} />
      </div>

      <details className="code-details">
        <summary>View approach</summary>
        <pre><code>{`// Hide native scrollbar on scroll container
// Position absolute track + thumb over content
// Sync thumb size/position from scrollTop / scrollHeight

// Libraries: OverlayScrollbars, simplebar-react, react-custom-scrollbars`}</code></pre>
      </details>

      <div className="pros-cons">
        <div>
          <strong>Pros</strong>
          <ul>
            <li>True overlay on all platforms</li>
            <li>Full control over appearance</li>
            <li>No layout shift ever</li>
          </ul>
        </div>
        <div>
          <strong>Cons</strong>
          <ul>
            <li>Requires JavaScript</li>
            <li>Must handle resize, drag, keyboard</li>
            <li>Use a battle-tested library for production</li>
          </ul>
        </div>
      </div>
    </article>
  )
}

export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <h1>Scrollbar Layout Shift Solutions</h1>
        <p className="hero-subtitle">
          macOS uses overlay scrollbars that float over content. Windows and Linux
          use classic scrollbars that consume width — causing layout shift when
          overflow appears. Compare fixes below.
        </p>
        <div className="hero-tip">
          <strong>How to test:</strong> Drag the item slider in each card. Watch the
          red <em>Right edge</em> marker — if it moves when the scrollbar appears,
          you have layout shift.
        </div>
      </header>

      <section className="platform-note">
        <h3>Why this happens</h3>
        <div className="platform-grid">
          <div className="platform-item platform-mac">
            <span className="platform-label">macOS</span>
            <p>Overlay scrollbars — hidden until scroll, never affect layout width.</p>
          </div>
          <div className="platform-item platform-win">
            <span className="platform-label">Windows / Linux</span>
            <p>Classic scrollbars — always reserve ~15–17px when content overflows.</p>
          </div>
        </div>
      </section>

      <section className="demos">
        {SOLUTIONS.map((solution) => (
          <ScrollDemoCard key={solution.id} {...solution} />
        ))}
        <CustomOverlaySection />
      </section>

      <footer className="recommendations">
        <h3>Quick recommendations</h3>
        <table>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Best approach</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Prevent shift, OK with reserved gutter</td>
              <td><code>scrollbar-gutter: stable</code></td>
            </tr>
            <tr>
              <td>True macOS-like overlay, pure CSS</td>
              <td>Negative margin wrapper trick</td>
            </tr>
            <tr>
              <td>Production overlay + theming</td>
              <td>Library: <code>overlayscrollbars-react</code> or <code>simplebar-react</code></td>
            </tr>
            <tr>
              <td>Full-width content, no scrollbar UI</td>
              <td>Hide native scrollbar (+ custom indicator)</td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  )
}
