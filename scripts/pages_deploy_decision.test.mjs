import assert from "node:assert/strict";
import { decidePagesProductionDeploy } from "./pages_deploy_decision.mjs";

const snsOnly = decidePagesProductionDeploy({
  changedPaths: ["sns-bot/certifications_state.json"],
  commitMessage: "chore(sns-bot): update state [skip ci]",
});
assert.equal(snsOnly.action, "skip");
assert.equal(snsOnly.reason, "sns_state_only");

const snsOnlyWithoutSkipToken = decidePagesProductionDeploy({
  changedPaths: ["sns-bot/certifications_state.json"],
  commitMessage: "chore(sns-bot): update state",
});
assert.equal(snsOnlyWithoutSkipToken.action, "skip");
assert.equal(snsOnlyWithoutSkipToken.reason, "sns_state_only");

const seoMerge = decidePagesProductionDeploy({
  changedPaths: [
    "docs/technology/General/aws-certification-path.md",
    "scripts/verify_built_site.mjs",
  ],
  commitMessage: "[CF-Pages-Skip] Add AWS certification choice hub (#26)",
});
assert.equal(seoMerge.action, "deploy");
assert.equal(seoMerge.reason, "seo_or_build_paths");

const buildConfig = decidePagesProductionDeploy({
  changedPaths: ["docusaurus.config.ts", "package.json"],
  commitMessage: "[CF-Pages-Skip] adjust build",
});
assert.equal(buildConfig.action, "deploy");
assert.equal(buildConfig.reason, "seo_or_build_paths");

const mixed = decidePagesProductionDeploy({
  changedPaths: [
    "sns-bot/certifications_state.json",
    "docs/safety-environment/Safety/bousai/shoubou-setsubishi-koushu-4rui.md",
  ],
  commitMessage: "[skip ci] mixed",
});
assert.equal(mixed.action, "deploy");
assert.equal(mixed.reason, "seo_or_build_paths");

const workflowRepair = decidePagesProductionDeploy({
  changedPaths: [
    ".github/workflows/pages-production.yml",
    "scripts/pages_deploy_decision.mjs",
  ],
  commitMessage: "[CF-Pages-Skip] path-based production deploy",
});
assert.equal(workflowRepair.action, "deploy");

const force = decidePagesProductionDeploy({
  changedPaths: ["sns-bot/certifications_state.json"],
  force: true,
});
assert.equal(force.action, "deploy");
assert.equal(force.reason, "explicit_publish_trigger");

const empty = decidePagesProductionDeploy({ changedPaths: [] });
assert.equal(empty.action, "skip");
assert.equal(empty.reason, "no_changed_paths");

console.log("pages_deploy_decision fixtures passed");
