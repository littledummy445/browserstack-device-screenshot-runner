# BrowserStack Device Screenshot Runner

Runs a real mobile device session on **BrowserStack Automate** from **GitHub Actions**, saves PNG screenshots, and uploads them as a workflow artifact. No credentials are stored in code.

## Setup for Anyone Using This Repo

1. **Add GitHub Repository Secrets** (`Settings > Secrets and variables > Actions > New repository secret`):
   - `BROWSERSTACK_USERNAME`
   - `BROWSERSTACK_ACCESS_KEY`
2. **Run the workflow:**
   - Push to `main`, or open **Actions > BrowserStack Device Screenshots > Run workflow** and optionally customize `device_name`, `os_version`, or `target_url`.
3. **Download screenshots:**
   - Open the completed workflow run and download the `device-screenshots` artifact.
