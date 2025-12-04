# Deployment Instructions

This project is configured for deployment on [Vercel](https://vercel.com).

## Prerequisites

- A Vercel account.
- The Vercel CLI installed (optional, but recommended): `npm i -g vercel`

## Step-by-Step Deployment

### Option 1: Using Vercel CLI (Recommended)

1.  Open a terminal in the project root.
2.  Run the deploy command:
    ```bash
    vercel
    ```
3.  Follow the prompts:
    - Set up and deploy? **Y**
    - Which scope? (Select your account)
    - Link to existing project? **N**
    - What’s your project’s name? (Press Enter for default)
    - In which directory is your code located? (Press Enter for default `.`)
    - Want to modify these settings? **N** (The `vercel.json` file handles configuration)
4.  Wait for the deployment to complete. You will get a production URL.

### Option 2: Using Vercel Dashboard (Git Integration)

1.  Push this code to a GitHub/GitLab/Bitbucket repository.
2.  Log in to Vercel and click **"Add New..."** -> **"Project"**.
3.  Import your repository.
4.  Vercel should automatically detect the configuration from `vercel.json`.
    - **Framework Preset**: Create React App (or Next.js if detected, but `vercel.json` overrides)
    - **Root Directory**: `.`
5.  Click **Deploy**.

## Configuration Details

- **Frontend**: Located in `frontend/`. Built using `npm run build`.
- **Backend**: Located in `api/`. Serverless functions handling API requests.
- **Routing**: `vercel.json` routes `/api/*` to the Python backend and everything else to the React frontend.
