---
description: How to build and verify the project for deployment
---

# Workflow: Project Build & Verification

Use this workflow to ensure the project is ready for a real-world launch by running the build and tests.

1. Install all dependencies (if not already done)
```powershell
npm install
```

2. Run the type-checker and build process to catch any compilation errors.
// turbo
```powershell
npm run build
```

3. Run existing tests to ensure no regressions.
// turbo
```powershell
npm test
```

4. If all steps pass, the `dist` folder is ready for extraction and deployment to your hosting provider.
