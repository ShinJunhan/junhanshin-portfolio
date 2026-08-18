import EmptySlot from './EmptySlot.jsx'

// The repo layout, as a plain monospace tree on a dark surface — the same
// terminal treatment the landing page's popup uses, since this is the one
// place on a project page showing literal filesystem output.
//
// The tree is a single string in the project's data, kept exactly as it would
// look in a terminal. It is rendered in a <pre> so the box-drawing characters
// and indentation land where the author put them.
export default function FolderStructureSection({ project }) {
  if (!project.folderStructure) {
    return <EmptySlot>No folder structure added yet.</EmptySlot>
  }

  return (
    <div className="tree">
      <pre className="tree__body">
        <code>{project.folderStructure.trim()}</code>
      </pre>
    </div>
  )
}
