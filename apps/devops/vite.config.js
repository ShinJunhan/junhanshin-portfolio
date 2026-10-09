import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // A port of its own so this can run alongside the root app during dev.
    port: 5174,
    fs: {
      // The Cloud Resume Challenge page reads its Terraform out of the
      // repository's own infra/ directory rather than from a copy under
      // src/content/, because that project's infrastructure lives in this
      // repository and a copy would drift from the thing the page claims to be
      // showing. Every other project's source genuinely is in another repo, so
      // those stay as copies.
      allow: ['..', '../..'],
    },
  },
})
