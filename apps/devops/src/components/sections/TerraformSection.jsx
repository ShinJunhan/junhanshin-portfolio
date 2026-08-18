import CodeViewer from '../CodeViewer.jsx'
import EmptySlot from './EmptySlot.jsx'
import { ExternalIcon } from '../icons.jsx'

// The project's main.tf file(s), inline. Deliberately only the main.tf —
// variables.tf, outputs.tf and the rest are supporting files, and the link
// below the viewer covers them without turning this into a file browser.
export default function TerraformSection({ project }) {
  const files = project.terraform ?? []

  if (files.length === 0) {
    return <EmptySlot>No Terraform code added yet.</EmptySlot>
  }

  return (
    <CodeViewer
      files={files}
      footer={
        project.links?.terraform && (
          <a
            className="code__link"
            href={project.links.terraform}
            target="_blank"
            rel="noreferrer"
          >
            View full terraform/ directory on GitHub <ExternalIcon />
          </a>
        )
      }
    />
  )
}
