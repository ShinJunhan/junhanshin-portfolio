import { useState } from 'react'
import Hero from './components/Hero.jsx'
import Timeline from './components/Timeline.jsx'
import CTAButtons from './components/CTAButtons.jsx'
import Footer from './components/Footer.jsx'
import TerminalPopup from './components/TerminalPopup.jsx'
import Reveal from './components/Reveal.jsx'
import NavBar from './components/NavBar.jsx'

export default function App() {
  const [heroDone, setHeroDone] = useState(false)

  return (
    <>
      <NavBar />
      <Hero onComplete={() => setHeroDone(true)} />
      {/* id is the auto-nudge scroll's landing target, so the hero pushes
          the viewer exactly to the top of this section — no dead gap. */}
      <main id="main-content">
        {/* Gated on the headline actually finishing, not a guessed timer —
            so these can never appear out of order relative to the headline. */}
        {heroDone && <Timeline />}
        {/* Timeline's last band is the base tone, so this one alternates
            off it to keep the banding rhythm unbroken. */}
        <section className="band" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <Reveal delay={0.1}><CTAButtons /></Reveal>
            <Reveal delay={0.1}><Footer /></Reveal>
          </div>
        </section>
      </main>
      <TerminalPopup />
    </>
  )
}
