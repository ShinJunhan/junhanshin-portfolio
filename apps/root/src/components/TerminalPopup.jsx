import { useState, useRef, useEffect } from 'react'
import { motion, useDragControls } from 'framer-motion'

const START_HINT = 'Type "help" to see available commands.'

// Each command maps a flag to its output. '' is the bare, no-flag form; a
// command with only '' takes no arguments at all.
const COMMANDS = {
  whoami: {
    '': [
      'My name is Junhan Shin. I am an emerging Cloud/DevOps Engineer with a',
      "Bachelor's in Information and Statistics and a minor in Computer Science",
      'and Engineering. I spent 10+ years working as a teacher and a',
      'public-private operator before going back to school for an accelerated',
      'program in cloud infrastructure.',
    ].join('\n'),
  },

  experience: {
    '': [
      'KT Cloud TECH UP Enterprise Fellowship',
      'Cloud Infrastructure Engineer & Interim Squad Lead (Aug-Oct 2026)',
      '',
      'Public-Private Operations Senior Manager (Mar 2025-Mar 2026)',
      'Public-Private Operations Manager (Mar 2023-Feb 2025)',
      'Student Academic Advisor_Mathematics Specialty (May 2021-Feb 2023)',
      'Licensed Mathematics Academic Coach (Apr 2020-Feb 2023)',
      'Certified Yoga Teacher & Sound Bath Practitioner (Mar 2014-Aug 2019)',
      'Administrative Assistant (Jun 2018-Aug 2019)',
      'Mathematics Private Instructor (Mar 2010-Mar 2011)',
      '',
      'Type "education --college", "education --latest", "education --highschool",',
      '"projects", or "skills" for more.',
    ].join('\n'),
  },

  education: {
    '': [
      'Advanced Cloud Infrastructure & Architecture Accelerated Program',
      'The National Institute for High-Tech Industry Engineering, Class of 2026',
      '--',
      'Bachelor of Science, Information and Statistics',
      'Chungnam National University, Class of 2018',
      '--',
      'Shintanjin High School, Class of 2009',
      '--',
      'Type "education --college", "education --latest", or "education --highschool" for details.',
    ].join('\n'),
    '--college': [
      'Major: Bachelor of Science, Information and Statistics',
      'Minor: Computer Science and Engineering',
      'Chungnam National University, Class of 2018',
      'GPA: 4.273 / 4.5',
      '',
      'Relevant coursework: Data Structures, Algorithms, Operating Systems,',
      'Database Systems, Computer Architectures, Object-Oriented Design.',
    ].join('\n'),
    // "Track" here is deliberate, not a stale copy of the summary's
    // "Accelerated Program" wording. Confirmed with Junhan.
    '--latest': [
      'Advanced Cloud Infrastructure & Architecture Track',
      'The National Institute for High-Tech Industry Engineering',
      'KDT Framework, Class of 2026',
      '',
      'Relevant coursework: Python, Linux, PostgreSQL, AWS (EC2, S3, VPC,',
      'Route 53, RDS), Docker, Kubernetes, Helm, Terraform, GitHub Actions,',
      'ArgoCD, Jenkins, Cisco networking.',
    ].join('\n'),
    '--highschool': ['Shintanjin High School, Class of 2009', 'Daejeon, South Korea'].join('\n'),
  },

  projects: {
    '': 'Visit devops.junhanshin.com',
  },

  skills: {
    '': [
      'Technical: Terraform, Kubernetes, AWS, and more.',
      '--',
      'Soft: Leadership, Adaptability, Critical Thinking, and more.',
      '--',
      'Office: Microsoft Office, Google Workspace, Slack, and more.',
      '--',
      'Design: Figma, Canva, DaVinci Resolve, and more.',
      '--',
      'Management: Fiscal Planning, Grant Writing, and more.',
      '--',
      'Type "skills --technical", "skills --soft", "skills --office",',
      '"skills --design", or "skills --management" for details.',
    ].join('\n'),
    '--technical': [
      'CI/CD & Source Control: ArgoCD, Blue-Green Deployment, Gitea, Git/GitHub,',
      'GitHub Actions, Jenkins',
      '',
      'Cloud (AWS): ACM, ALB, Auto Scaling Groups, CloudFront, CloudWatch,',
      'DynamoDB, EC2, ECR, IAM, Lambda, RDS, Route 53, S3, Secrets Manager,',
      'Session Manager, SQS, VPC',
      '',
      'Containers & Orchestration: Docker, EKS, Helm, Karpenter, KEDA, Kubernetes',
      '',
      'Databases: DBeaver, MS-SQL Server, PostgreSQL',
      '',
      'Dev Tools: Harbor, OpenStack, VMware, VS Code',
      '',
      'IaC & Automation: Ansible, Jinja, Terraform',
      '',
      'Languages & Scripting: Go, Java, Python, Shell/Bash, YAML',
      '',
      'Load Testing: Locust',
      '',
      'Monitoring & Observability: AlertManager, Grafana, Loki, Prometheus',
      '',
      'Networking & Service Mesh: Cisco networking, Kiali, NAT Gateway/Instance',
      'cost optimization, Tailscale, VPC design & subnetting',
      '',
      'Security Tooling: Bandit (SAST), fail2ban, Nginx rate limiting,',
      'OWASP ZAP (DAST), Trivy (image scanning)',
    ].join('\n'),
    '--soft': [
      'Active Listening, Adaptability, Attention to Detail, Budget & Vendor',
      'Negotiation, Business Development, Client Relationship Management,',
      'Conflict De-escalation, Critical Thinking, Cross-Functional',
      'Collaboration, Delegation, Leadership, Resilience, Task Management,',
      'Team Player, Time Management, Works Independently',
    ].join('\n'),
    '--office': [
      'Google Workspace (Forms, Sheets, Docs, Drive, Meet), Microsoft Office',
      '(Excel, Word, PowerPoint), Notion, Slack',
    ].join('\n'),
    '--design': 'CapCut, Canva, DaVinci Resolve, Figma, Miricanvas, Premiere Pro',
    '--management': [
      'Curriculum Development, Data Tracking & Reporting, Event & Logistics',
      'Coordination, Fiscal Planning, Grant Writing & Compliance Documentation,',
      'Program Budget Management',
    ].join('\n'),
  },

  languages: {
    '': ['English: Fluent', 'Korean: Native', 'Japanese: Intermediate'].join('\n'),
  },

  certs: {
    '': 'AWS Certified Solutions Architect, Associate.',
  },

  contact: {
    '': [
      'Email: junhanshin17@gmail.com',
      'Phone: 999-999-999',
      'LinkedIn: linkedin.com/in/[placeholder]',
      'GitHub: github.com/[placeholder]',
    ].join('\n'),
  },

  // Handled in runCommand: it clears the log rather than printing anything.
  clear: {
    '': '',
  },

  help: {
    '': [
      'whoami      : short intro',
      'experience  : work history',
      'education   : degree, program, and school (--college, --latest, --highschool)',
      'projects    : link to devops.junhanshin.com',
      'skills      : technical, soft, office, design, and management (--technical, --soft, --office, --design, --management)',
      'languages   : language proficiency',
      'certs       : certifications',
      'contact     : email, phone, LinkedIn, GitHub',
      'clear       : clear the screen',
      'help        : this list',
    ].join('\n'),
  },
}

// Flag names contain hyphens, and a line is allowed to break right after one:
// left alone, a wrapped help row can read "(-" then "-college" on the next
// line. Every token carrying a flag is held together so that can't happen.
function renderHelpRow(row) {
  return row.split(/(\s+)/).map((part, i) =>
    part.includes('--') ? (
      <span key={i} style={{ whiteSpace: 'nowrap' }}>
        {part}
      </span>
    ) : (
      part
    ),
  )
}

// Formats the "that flag doesn't exist" line, listing the ones that do.
function unknownFlagMessage(name, flag) {
  const flags = Object.keys(COMMANDS[name]).filter((f) => f)
  if (!flags.length) return `${name} takes no options.`
  return `Unknown option "${flag}" for ${name}. Try ${flags.join(', ')}.`
}

export default function TerminalPopup() {
  const [open, setOpen] = useState(false)
  // Drag can start anywhere on the panel except the input and buttons, so a
  // slide works from wherever the pointer happens to be.
  const dragControls = useDragControls()
  const [history, setHistory] = useState([
    { type: 'output', text: START_HINT },
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Slide in from the right edge of the window to open. Tracked manually
  // rather than with a framer drag because the strip is only a few pixels
  // wide — there is nothing meaningful to drag, just a gesture to detect.
  const edgeStart = useRef(null)

  function onEdgePointerDown(e) {
    edgeStart.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function onEdgePointerMove(e) {
    const start = edgeStart.current
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    // Leftward, and more horizontal than vertical, so a page scroll that
    // happens to begin near the edge doesn't yank the panel open.
    if (dx < -46 && Math.abs(dx) > Math.abs(dy)) {
      edgeStart.current = null
      setOpen(true)
    }
  }

  function endEdgeGesture() {
    edgeStart.current = null
  }

  // Drag starts from anywhere on the panel that isn't a control — typing and
  // button clicks keep working, everything else is grabbable.
  function onPanelPointerDown(e) {
    if (e.target.closest('input, button, textarea, a')) return
    dragControls.start(e)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  function runCommand(raw) {
    const line = raw.trim()
    if (!line) return
    const [name, ...args] = line.toLowerCase().split(/\s+/)
    const command = COMMANDS[name]

    // clear wipes the scrollback and puts the opening hint back, so the panel
    // is never a blank screen with no way in. Nothing to confirm: like a real
    // shell, it hides history rather than destroying anything.
    if (command && name === 'clear' && !args.length) {
      setHistory([{ type: 'output', text: START_HINT }])
      return
    }

    let output
    if (!command) {
      output = `Command not found: ${name}. Type "help" for options.`
    } else if (args.length > 1) {
      output = `${name} takes one option at a time.`
    } else {
      const flag = args[0] || ''
      output = flag in command ? command[flag] : unknownFlagMessage(name, flag)
    }

    setHistory((h) => [
      ...h,
      { type: 'input', text: line },
      // help is the one tabular output, so it wraps with a hanging indent.
      { type: 'output', text: output, hang: name === 'help' },
    ])
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
          Ask me about Junhan
        </span>
      </div>

      {/* Invisible strip down the right edge: slide left from here to open. */}
      <div
        className="term-edge"
        aria-hidden="true"
        style={{ display: open ? 'none' : 'block' }}
        onPointerDown={onEdgePointerDown}
        onPointerMove={onEdgePointerMove}
        onPointerUp={endEdgeGesture}
        onPointerCancel={endEdgeGesture}
        onPointerLeave={endEdgeGesture}
      />

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
        onPointerDown={onPanelPointerDown}
        dragConstraints={{ left: 0, right: 0 }}
        /* Rubber-bands to the right only; it can't be pulled past its open
           position to the left. */
        dragElastic={{ left: 0, right: 0.85 }}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (info.offset.x > 70 || info.velocity.x > 420) setOpen(false)
        }}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        {/* Swipe handle: drag this (or the title bar) right to dismiss. */}
        <div className="term-panel__grip" role="presentation">
          <span className="term-panel__grip-bar" />
        </div>

        <div className="term-panel__bar">
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
              {line.type === 'input' ? (
                <span style={{ color: '#4FA88F' }}>$ {line.text}</span>
              ) : line.hang ? (
                // One row per element, so the hanging indent applies to each.
                line.text.split('\n').map((row, j) => (
                  <div key={j} className="term-hang">
                    {renderHelpRow(row)}
                  </div>
                ))
              ) : (
                line.text
              )}
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
