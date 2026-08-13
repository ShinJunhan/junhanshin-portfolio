import { useState } from 'react'
import Hero from './components/Hero.jsx'
import Bio from './components/Bio.jsx'
import StatCards from './components/StatCards.jsx'
import Skills from './components/Skills.jsx'
import CTAButtons from './components/CTAButtons.jsx'
import Footer from './components/Footer.jsx'
import TerminalPopup from './components/TerminalPopup.jsx'
import Reveal from './components/Reveal.jsx'

export default function App() {
  const [heroDone, setHeroDone] = useState(false)

  return (
    <div className="container">
      <Hero onComplete={() => setHeroDone(true)} />
      {/* Gated on the headline actually finishing, not a guessed timer —
          so these can never appear out of order relative to the headline. */}
      <Reveal gate={heroDone}><Bio /></Reveal>
      {heroDone && <StatCards />}
      <Reveal><Skills /></Reveal>
      <Reveal delay={0.1}><CTAButtons /></Reveal>
      <Reveal delay={0.1}><Footer /></Reveal>
      <TerminalPopup />
    </div>
  )
}
