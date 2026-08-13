import { useState } from 'react'
import Hero from './components/Hero.jsx'
import Bio from './components/Bio.jsx'
import Timeline from './components/Timeline.jsx'
import CTAButtons from './components/CTAButtons.jsx'
import Footer from './components/Footer.jsx'
import TerminalPopup from './components/TerminalPopup.jsx'
import Reveal from './components/Reveal.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

export default function App() {
  const [heroDone, setHeroDone] = useState(false)

  return (
    <>
      <ThemeToggle />
      <Hero onComplete={() => setHeroDone(true)} />
      {/* id is the auto-nudge scroll's landing target, so the hero pushes
          the viewer exactly to the top of this section — no dead gap. */}
      <div id="main-content" className="container">
        {/* Gated on the headline actually finishing, not a guessed timer —
            so these can never appear out of order relative to the headline. */}
        <Reveal gate={heroDone}><Bio /></Reveal>
        {heroDone && <Timeline />}
        <Reveal delay={0.1}><CTAButtons /></Reveal>
        <Reveal delay={0.1}><Footer /></Reveal>
        <TerminalPopup />
      </div>
    </>
  )
}
