import RichText from '../../lib/richText.jsx'
import { techIcon } from '../../data/tech.js'
import ReflectionVisual from './ReflectionVisuals.jsx'

// The `story` Reflection (Midam). The same paragraphs as the plain layout,
// set in four numbered chapters. The first chapters, which have nothing to
// draw, run down a timeline as text. The team and next-time chapters pair
// each paragraph with its own diagram, switching sides from row to row.
// Paragraphs are picked by index from `reflection.learned` and
// `reflection.differently`, so the wording lives in one place.

// Keep the last two words of a split half together, so a justified line never
// ends on one word. The full paragraphs already carry their own no-break space.
function tie(text) {
  return text.replace(/ (?=[^ ]+$)/, ' ')
}

function Paragraph({ children }) {
  return (
    <p className="rstory-text">
      <RichText>{children}</RichText>
    </p>
  )
}

function Chapter({ number, children }) {
  return (
    <h3 className="rstory-chapter">
      <b>{number}</b>
      {children}
    </h3>
  )
}

// Cards alternate left and right of the line, two to a row, the right card
// set lower so the pair reads as a sequence. A later chapter's label sits on
// the line as a pill.
function Timeline({ chapters, first, reflection }) {
  let row = 0
  const cells = []
  chapters.forEach((chapter, c) => {
    if (c > 0) {
      row += 1
      cells.push(
        <span className="rstory-pill" style={{ gridRow: row }} key={chapter.label}>
          <b>{String(first + c).padStart(2, '0')}</b>
          {chapter.label}
        </span>
      )
    }
    chapter.items.forEach((item, k) => {
      const right = k % 2 === 1
      if (!right) row += 1
      const icon = item.icon && techIcon(item.icon)
      cells.push(
        <div className={'rstory-card' + (right ? ' rstory-card--right' : '')} style={{ gridRow: row }} key={item.title}>
          <h4 className="rstory-card__title">{item.title}</h4>
          <Paragraph>{reflection.learned[item.paragraph]}</Paragraph>
        </div>,
        <span className={'rstory-dot' + (right ? ' rstory-dot--right' : '')} style={{ gridRow: row }} key={item.title + '-dot'} aria-hidden="true">
          {icon ? <img src={icon} alt="" /> : item.mark}
        </span>
      )
    })
  })
  return <div className="rstory-timeline">{cells}</div>
}

// A next-time paragraph splits where the plan starts, so what happened and
// what I would do each get a label.
function Halves({ text, split }) {
  const at = text.indexOf(split)
  if (at < 0) return <Paragraph>{text}</Paragraph>
  return (
    <>
      <div className="rstory-half">
        <span className="rstory-half__label">During the project</span>
        <Paragraph>{tie(text.slice(0, at).trim())}</Paragraph>
      </div>
      <div className="rstory-half rstory-half--next">
        <span className="rstory-half__label">Next time</span>
        <Paragraph>{text.slice(at)}</Paragraph>
      </div>
    </>
  )
}

function Paired({ chapter, reflection }) {
  return chapter.items.map((item, k) => {
    const text = reflection[chapter.source][item.paragraph]
    return (
      <div className={'rstory-pair' + (k % 2 ? ' rstory-pair--flip' : '')} key={item.title}>
        <div className="rstory-pair__text">
          {item.eyebrow && <span className="rstory-eyebrow">{item.eyebrow}</span>}
          <h4 className="rstory-pair__title">{item.title}</h4>
          {item.split ? <Halves text={text} split={item.split} /> : <Paragraph>{text}</Paragraph>}
        </div>
        <div className="rstory-pair__visual">
          <ReflectionVisual name={item.visual} />
        </div>
      </div>
    )
  })
}

export default function ReflectionStory({ reflection }) {
  const { chapters } = reflection.story
  const blocks = []
  for (let i = 0; i < chapters.length; i += 1) {
    const chapter = chapters[i]
    const number = String(i + 1).padStart(2, '0')
    if (chapter.kind === 'timeline') {
      // Consecutive timeline chapters share one line.
      const run = [chapter]
      while (chapters[i + 1]?.kind === 'timeline') run.push(chapters[(i += 1)])
      blocks.push(
        <section className="rstory-block" key={chapter.label}>
          <Chapter number={number}>{chapter.label}</Chapter>
          <Timeline chapters={run} first={Number(number)} reflection={reflection} />
        </section>
      )
    } else {
      blocks.push(
        <section className="rstory-block" key={chapter.label}>
          <Chapter number={number}>{chapter.label}</Chapter>
          <Paired chapter={chapter} reflection={reflection} />
        </section>
      )
    }
  }
  return <div className="rstory">{blocks}</div>
}
