const branch = process.env.CURRENT_BRANCH || "main";

if (!branch) {
    throw new Error("CURRENT_BRANCH not set");
}

const isMain = branch === "main";

/**
 * @type {import("semantic-release").GlobalConfig}
 */
const config = {
    branches: ["main"],
    repositoryUrl: "https://github.com/JamsRepos/Jamfin.git",
    plugins: [
        [
            "@semantic-release/exec",
            {
                // use semantic-release logger to print the branch name
                prepareCmd: 'echo "Branch: ${branch}"',
            },
        ],
        [
            "@semantic-release/commit-analyzer",
            {
                // Modify default release rules to include types that are not breaking change, feat, or fix as a patch release
                // Default rules: https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js
                releaseRules: [
                    {
                        scope: "no-release",
                        release: false,
                    },
                    {
                        type: "build",
                        release: "patch",
                    },
                    {
                        type: "ci",
                        release: "patch",
                    },
                    {
                        type: "chore",
                        release: "patch",
                    },
                    {
                        type: "docs",
                        release: "patch",
                    },
                    {
                        type: "refactor",
                        release: "patch",
                    },
                    {
                        type: "style",
                        release: "patch",
                    },
                    {
                        breaking: true,
                        release: "major",
                    },
                ],
            },
        ],
        [
            "@semantic-release/release-notes-generator",
            {
                preset: "conventionalcommits",
                presetConfig: {
                    types: [
                        { type: "feat", section: "New Features" },
                        { type: "fix", section: "Bug Fixes" },
                        { type: "perf", section: "Performance Improvements", hidden: false },
                        { type: "revert", section: "Commit Reverts", hidden: false },
                        { type: "build", section: "Build System", hidden: false },
                        { type: "ci", section: "Continuous Integration", hidden: false },
                        { type: "chore", section: "Chores", hidden: false },
                        { type: "docs", section: "Documentation", hidden: false },
                        { type: "style", section: "Style Changes", hidden: false },
                        { type: "refactor", section: "Code Refactoring", hidden: false },
                        { type: "test", section: "Test Cases", hidden: true },
                    ],
                },
            },
        ],
        [
            "@semantic-release/changelog",
            {
                changelogFile: "CHANGELOG.md",
            },
        ],
        [
            "@semantic-release/exec",
            {
                prepareCmd: 'echo "${nextRelease.version}" > VERSION.txt',
                successCmd: `
                    NEW_VERSION=\${nextRelease.version} &&
                    echo "Updating CDN links to version \${NEW_VERSION}" &&
                    find . -name "README.md" -type f -exec sed -i "s|https://cdn.jsdelivr.net/gh/JamsRepos/Jamfin@[0-9.]*|https://cdn.jsdelivr.net/gh/JamsRepos/Jamfin@\${NEW_VERSION}|g" {} \; &&
                    find . -name "complete.css" -type f -exec sed -i "s|https://cdn.jsdelivr.net/gh/JamsRepos/Jamfin@[0-9.]*|https://cdn.jsdelivr.net/gh/JamsRepos/Jamfin@\${NEW_VERSION}|g" {} \;
                `
            },
        ],
        [
            "@semantic-release/git",
            {
                assets: ["CHANGELOG.md", "VERSION.txt", "README.md", "theme/complete.css"],
                message: "chore: 🧹 ${nextRelease.version}\n\n${nextRelease.notes}",
            },
        ],
    ],
};

if (isMain) {
    config.plugins.splice(-2, 0, "@semantic-release/github");
}

module.exports = config;
