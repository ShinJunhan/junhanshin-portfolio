import CodeViewer from '../CodeViewer.jsx'
import EmptySlot from './EmptySlot.jsx'

// The config that decides what happens when an alert fires — which script
// runs, how many times it retries, how long it waits before trying again.
// Its own section rather than part of Terraform Code: these are not Terraform
// files, and the policy is a decision worth reading on its own.
export default function RecoveryPolicySection({ project }) {
  const files = project.recoveryPolicy ?? []

  if (files.length === 0) {
    return <EmptySlot>No recovery policy added yet.</EmptySlot>
  }

  return <CodeViewer files={files} />
}
