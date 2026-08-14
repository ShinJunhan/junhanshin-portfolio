import { useState, useRef, useEffect } from 'react'
import { motion, useDragControls } from 'framer-motion'

const COMMANDS = {
  help: () =>
    'Available commands: whoami, experience, skills, certs, contact, help',
  whoami: () =>
    "Junhan Shin — career-changer moving from program leadership into cloud infrastructure. Currently completing a 6-month cloud infra bootcamp in Korea, relocating to Methuen, MA in Sept 2026.",
  experience: () =>
    [
      'Team Lead, Wellness College (O2 Footprint) — Feb 2025-Mar 2026',
      '  Ran a government-funded workforce program: ~1.7B KRW annual budget,',
      '  vendor negotiation, 770+ students managed across 15 program cycles.',
      '',
      'Freelance Math Tutor — Apr 2020-Feb 2023',
      '  1-on-1 and group instruction, zero student attrition.',
      '',
      'Yoga Instructor / Studio Receptionist — 2014-2019',
      '',
      'Type "skills" or "certs" for the technical side.',
    ].join('\n'),
  skills: () =>
    'Terraform, Ansible, Docker, Kubernetes, Helm, ArgoCD, GitHub Actions, AWS (EC2/S3/VPC/Lambda/DynamoDB/IAM), Prometheus/Grafana.',
  certs: () => 'AWS Certified Solutions Architect – Associate.',
  contact: () => 'Email: junhanshin17@gmail.com — see the footer for LinkedIn, GitHub, and more.',
}

export default function TerminalPopup() {
  const [open, setOpen] = useState(false)
  // Drag is started only from the grip and the title bar, so selecting text
  // in the log or typing in the input never turns into a drag.
  const dragControls = useDragControls()
  const [history, setHistory] = useState([
    { type: 'output', text: 'Type "help" to see available commands.' },
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    const handler = COMMANDS[cmd]
    const output = handler ? handler() : `Command not found: ${cmd}. Type "help" for options.`
    setHistory((h) => [...h, { type: 'input', text: cmd }, { type: 'output', text: output }])
  }

  function handleSubmit(e) {
    e.preventDefault()
    runCommand(input)
    setInput('')
  }

  return (
    <>
      {/* Floating trigger — fixed position, bottom-right, follows scroll, static icon */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: open ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '7px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setOpen(true)}
          aria-label="Open terminal — ask me about Junhan"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'var(--accent-base)',
            color: 'white',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '18px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,52,73,0.25)',
          }}
        >
          &gt;_
        </button>
        {/* Caption floats free under the icon — no chrome of its own. */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          Ask me about JunHan
        </span>
      </div>

      {/* Side panel, Notion-style: no backdrop, so the page behind stays
          scrollable and clickable while the terminal is open. */}
      <motion.aside
        className="term-panel"
        aria-hidden={open ? undefined : 'true'}
        aria-label="Terminal"
        initial={false}
        animate={{ x: open ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 36 }}
        drag="x"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ left: 0, right: 0 }}
        /* Rubber-bands to the right only; it can't be pulled past its open
           position to the left. */
        dragElastic={{ left: 0, right: 0.85 }}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (info.offset.x > 90 || info.velocity.x > 520) setOpen(false)
        }}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        {/* Swipe handle: drag this (or the title bar) right to dismiss. */}
        <div
          className="term-panel__grip"
          onPointerDown={(e) => dragControls.start(e)}
          role="presentation"
        >
          <span className="term-panel__grip-bar" />
        </div>

        <div
          className="term-panel__bar"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <span style={{ color: 'var(--terminal-ink)', fontSize: '12px', opacity: 0.75 }}>
            junhan@portfolio: ~
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close terminal"
            style={{ background: 'none', border: 'none', color: 'var(--terminal-ink)', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <div className="term-panel__log">
          {history.map((line, i) => (
            <div key={i} style={{ whiteSpace: 'pre-wrap', marginBottom: '6px' }}>
              {line.type === 'input' ? <span style={{ color: '#4FA88F' }}>$ {line.text}</span> : line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="term-panel__form">
          <span style={{ color: '#4FA88F', marginRight: '8px' }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#E2E7ED',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </motion.aside>
    </>
  )
}
