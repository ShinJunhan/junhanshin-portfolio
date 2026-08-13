const groups = [
  { label: 'Cloud (AWS)', items: ['EC2', 'S3', 'VPC', 'Route 53', 'ALB', 'RDS', 'IAM', 'CloudWatch', 'DynamoDB', 'Lambda'] },
  { label: 'IaC', items: ['Terraform', 'Ansible'] },
  { label: 'Containers / Orchestration', items: ['Docker', 'Kubernetes', 'Helm', 'KEDA', 'Karpenter', 'EKS'] },
  { label: 'CI/CD & GitOps', items: ['GitHub Actions', 'Jenkins', 'ArgoCD', 'Gitea'] },
  { label: 'Monitoring', items: ['Prometheus', 'Grafana', 'AlertManager'] },
]

export default function Skills() {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem', fontWeight: 500 }}>
        SKILLS
      </h2>
      {groups.map((g) => (
        <div key={g.label} style={{ marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, marginRight: '8px' }}>{g.label}:</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{g.items.join(' · ')}</span>
        </div>
      ))}
    </section>
  )
}
