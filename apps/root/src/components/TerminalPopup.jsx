import { useState, useRef, useEffect } from 'react'

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

      {open && (
        <div
          className="terminal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(37,52,73,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '520px',
              maxWidth: '92vw',
              height: '420px',
              maxHeight: '80vh',
              background: '#1E2530',
              borderRadius: 'var(--radius)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'var(--font-mono)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              borderBottom: '1px solid #2E3846',
            }}>
              <span style={{ color: '#8FA3BD', fontSize: '12px' }}>junhan@portfolio: ~</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close terminal"
                style={{ background: 'none', border: 'none', color: '#8FA3BD', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', fontSize: '13px', color: '#E2E7ED' }}>
              {history.map((line, i) => (
                <div key={i} style={{ whiteSpace: 'pre-wrap', marginBottom: '4px' }}>
                  {line.type === 'input' ? <span style={{ color: '#4FA88F' }}>$ {line.text}</span> : line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} style={{ borderTop: '1px solid #2E3846', padding: '10px 14px', display: 'flex' }}>
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
          </div>
        </div>
      )}

      {/* Full-screen takeover on mobile per DESIGN.md terminal spec */}
      <style>{`
        @media (max-width: 640px) {
          .terminal-overlay > div {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </>
  )
}
