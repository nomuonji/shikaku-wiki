/**
 * Production deploy decision for shikaku-wiki.
 *
 * Cloudflare Pages skips a Git push when the commit message is prefixed with
 * [CF-Pages-Skip] or [skip ci]. That prefix is required on seo/* implementation
 * branches, and squash-merge keeps it on main, so content merges never publish.
 *
 * This module ignores that prefix. Production deploy is path-based:
 * sns-bot state-only commits stay skipped; any SEO/content/build-config change deploys.
 */

const SNS_STATE_PATTERNS = [
  /^sns-bot\/certifications_state\.json$/,
  /^sns-bot\/.*state.*\.json$/,
];

const DEPLOY_PATTERNS = [
  /^docs\//,
  /^blog\//,
  /^src\//,
  /^static\//,
  /^plugins\//,
  /^scripts\//,
  /^\.github\/workflows\/pages-production\.yml$/,
  /^docusaurus\.config\.(ts|js|mjs)$/,
  /^sidebars\.(ts|js)$/,
  /^package\.json$/,
  /^package-lock\.json$/,
  /^tsconfig\.json$/,
  /^requirements\.txt$/,
];

export function isSnsStatePath(path) {
  const normalized = String(path || "").replace(/\\/g, "/").replace(/^\.\//, "");
  return SNS_STATE_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function isDeployPath(path) {
  const normalized = String(path || "").replace(/\\/g, "/").replace(/^\.\//, "");
  return DEPLOY_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * @param {{ changedPaths?: string[], commitMessage?: string, force?: boolean }} input
 * @returns {{ action: "deploy" | "skip", reason: string, deployPaths: string[], skippedStatePaths: string[] }}
 */
export function decidePagesProductionDeploy(input = {}) {
  if (input.force === true) {
    return {
      action: "deploy",
      reason: "explicit_publish_trigger",
      deployPaths: input.changedPaths || [],
      skippedStatePaths: [],
    };
  }

  const changedPaths = Array.isArray(input.changedPaths) ? input.changedPaths : [];
  const deployPaths = changedPaths.filter(isDeployPath);
  const skippedStatePaths = changedPaths.filter(isSnsStatePath);

  if (changedPaths.length === 0) {
    return {
      action: "skip",
      reason: "no_changed_paths",
      deployPaths,
      skippedStatePaths,
    };
  }

  if (deployPaths.length === 0 && skippedStatePaths.length === changedPaths.length) {
    return {
      action: "skip",
      reason: "sns_state_only",
      deployPaths,
      skippedStatePaths,
    };
  }

  if (deployPaths.length > 0) {
    return {
      action: "deploy",
      reason: "seo_or_build_paths",
      deployPaths,
      skippedStatePaths,
    };
  }

  return {
    action: "skip",
    reason: "no_publishable_paths",
    deployPaths,
    skippedStatePaths,
  };
}
