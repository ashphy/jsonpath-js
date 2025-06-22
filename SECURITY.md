# Security Policy

## Supported Versions
We provide security updates for the following versions of this project:

| Version | Status | Notes |
|---------|--------|-------|
| 0.x.x | ✅ Supported | Receives all security fixes. |

## Reporting a Vulnerability

If you believe you have found a security issue, please report it **privately via GitHub Security Advisories**.
**Do not open a public GitHub Issue or Pull Request.**

- Go to: [Report a vulnerability](https://github.com/ashphy/jsonpath-js/security/advisories/new)

We follow a responsible disclosure process. Reports will remain confidential until a fix is released and users have had a reasonable upgrade window.

## Initial Response
We aim to acknowledge security reports as quickly as reasonably possible.
Our first reply will confirm receipt and may request additional information or reproduction steps.

When possible, please include:

- Affected file(s) or function(s)
- Steps to reproduce the issue
- Impact assessment (e.g., RCE, XSS, DoS, data leakage)
- Proof-of-concept or patch (if available)

## Patch Release Policy
- Fixes are released as soon as reasonably possible for supported versions.
- If the main branch contains breaking changes, we will back-port the fix to the current stable branch and publish a patch release (e.g., `vX.Y.Z`).
- Release notes will describe the vulnerability (severity, impact, CVSS) without full exploit details until a reasonable upgrade window has passed.

## Disclosure Policy
We follow **Coordinated Vulnerability Disclosure (CVD)**:

1. Vulnerability reported privately.
2. Maintainers develop and test a fix.
3. Patch release and public advisory are published.
4. Detailed technical information may be released later to allow users time to upgrade.
