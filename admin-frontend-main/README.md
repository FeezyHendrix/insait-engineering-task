# Admin Frontend

Welcome to the Admin-Frontend repository! This project serves as the frontend component of the Admin Application. Please read this file carefully to familiarize yourself with any unfamiliar technologies and follow the instructions for setting up, testing, and running the app.

## Prerequisites

- **Node.js**: v20 or higher (LTS recommended)
- **npm**: v10 or higher (comes with Node.js)
- **TypeScript**: Project uses TypeScript for type safety
- **Git**: Latest version
- **Docker**: For running containerized services (configuration service, etc.) (optional)
- **AWS CLI**: Optional if using the configuration service (optional)

## Table of Contents

1. [Quick Start](#quick-start)
2. [Detailed Setup Guide](#detailed-setup-guide)
   - [Clone the Repository](#clone-the-repository)
   - [Install Dependencies](#install-dependencies)
   - [Environment Configuration](#environment-configuration)
   - [Configure Local Hostname](#configure-local-hostname)
   - [Backend Setup](#backend-setup)
   - [Configuration Service (Optional)](#configuration-service-optional)
   - [Start the Application](#start-the-application)
3. [Development Workflow](#development-workflow)
4. [Running Tests](#running-tests)
5. [Technology Stack](#technology-stack)
6. [API Communication](#api-communication)
7. [Troubleshooting](#troubleshooting)
8. [Recommended Tools](#recommended-tools)
9. [Contributing Guidelines](#contributing-guidelines)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/insait-io/admin-frontend.git
cd admin-frontend

# Install dependencies
npm install

# Copy the example environment file and modify as needed
cp .env.example .env

# Start the development server
npm run dev

# Access the application
# Open http://localhost:5173 in your browser
```

> **Note**: For production builds, use `npm run build` which runs TypeScript checks and builds the application for production.

## Detailed Setup Guide

### Clone the Repository

```bash
git clone https://github.com/insait-io/admin-frontend.git
cd admin-frontend
```

### Install Dependencies

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory using `.env.example` as a template:

```bash
cp .env.example .env
```

Edit the `.env` file to include the following variables:

```
# API Configuration
VITE_BACKEND_PORT=5050

# Authentication Settings
# Set to "true" to use MSW without requiring the backend server
VITE_MSW_ENABLED=true

# Environment Mode
# Set to "development" to bypass Keycloak authentication
VITE_MODE=development
```

> **Note**: All environment variables must start with `VITE_` to be accessible in the frontend code.

### Configure Local Hostname (Optional)

This step is optional when running in development mode with authentication bypassed.

Update your hosts file to map `test-company.insait.com` to localhost:

**Linux/Mac**:
```bash
sudo nano /etc/hosts
```
Add the following line:
```
127.0.0.1 test-company.insait.com
```

**Windows**:
Edit `C:\Windows\System32\drivers\etc\hosts` as administrator and add:
```
127.0.0.1 test-company.insait.com
```

If assistance for this step is needed, please refer to https://dev.to/hidaytrahman/serve-localhost-with-custom-domain-3c3d

### Backend Setup

While the frontend can run with mock data using MSW (Mock Service Worker), a full development experience requires the backend:

```bash
# Clone the backend repository
git clone https://github.com/insait-io/admin-backend.git
cd admin-backend

# Follow backend setup instructions to run the database and server
```

Refer to the admin-backend repository's README for detailed backend setup instructions.

### Configuration Service (OPTIONAL)

The configuration service allows you to get the application configuration settings remotely. This is optional for local development unless you need to test configuration-dependent features.

If you need to use the configuration service locally:

1. Ensure you're logged into AWS:
   ```bash
   # Install AWS CLI if not already installed
   # https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
   
   # Configure AWS credentials
   aws configure
   # Enter your Access Key ID and Secret Access Key when prompted
   
   # Log in to ECR
   aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 211125495813.dkr.ecr.us-east-2.amazonaws.com
   ```

2. Start the configuration service:
   ```bash
   docker compose -f docker-compose-configuration.yml up -d
   ```

3. Configure the service by making a POST request with your desired configuration:
   ```bash
   # Example using curl
   curl -X POST http://localhost:4000/api/configuration \
     -H "Content-Type: application/json" \
     -d '{"key": "value"}'
   ```
   See `useCompanyConfig.tsx` for an example default configuration.

### Start the Application

```bash
npm run dev
```

The application will be available at:
- http://localhost:5173 (default)
- http://test-company.insait.com:5173 (if hosts file is configured)


### STANDALONE Mode (for On-Prem / Private Cloud Deployments)

> [!CAUTION]
> **When deploying in standalone mode (e.g., on-premise or private cloud without a reverse proxy), you must set `STANDALONE=true`.**
> Without this, static files will not be correctly served under the configured base path (e.g., `/admin`).
> In SaaS environments, do **not** set this variable — external proxies handle routing.

In standalone deployments, where this container is served **directly** (not behind a reverse proxy), static assets must be made available under the specified base path.
To support this, set the following environment variable at runtime:

```bash
STANDALONE=true
```

When `STANDALONE=true` and `BASENAME` is set to a non-root path (e.g., `/admin`), the container’s entrypoint script will copy static files into `/usr/share/nginx/html${BASENAME}` to ensure correct asset resolution.


## Development Workflow

1. **Run the development server**:
   ```bash
   npm run dev
   ```
   This starts Vite with hot module replacement (HMR) for instant updates as you modify files.

2. **Authentication**:
   - In development mode (`VITE_MODE=development`), you can bypass Keycloak authentication

3. **Making changes**:
   - Edit files in the `src` directory
   - Changes will automatically refresh in the browser
   - Check the terminal for any build errors

4. **Linting and Type-checking**:
   ```bash
   # Run ESLint
   npm run lint
   
   # Run TypeScript type-checking
   npm run type-check
   ```

## Running Tests

This project uses Playwright for end-to-end testing with Mock Service Worker for API mocking.

```bash
# Run all tests
npm run test

# Run tests with coverage reporting
npm run test:coverage
```

Playwright uses `.env.test` for environment variables during testing. The Mock Service Worker is configured to intercept API requests during tests, so no actual backend is required to run the tests.

### MSW Configuration

The project uses MSW for mocking API requests during development and testing. The MSW worker is configured to run from the `public` directory as specified in the `package.json`:

```json
"msw": {
  "workerDirectory": [
    "public"
  ]
}
```

## Technology Stack

- **TypeScript**: Strongly typed JavaScript
- **React**: UI framework (v18.3.1)
- **Vite**: Build tool and development server (v4.4.5)
- **TailwindCSS**: Utility-first CSS framework
- **Keycloak**: Authentication and authorization
- **React Router**: For application routing (v6.18.0)
- **Redux Toolkit**: State management (v1.9.7)
- **React-Toastify**: For notifications
- **Chart Libraries**: ApexCharts and Recharts for data visualization
- **Socket.io**: For real-time communication
- **MSW (Mock Service Worker)**: API mocking for development and testing
- **Playwright**: End-to-end testing
- **i18next**: Internationalization
- **React Dropzone**: File uploads
- **Code Editors**: Monaco Editor, CodeMirror for code editing capabilities
- **Sentry**: Error tracking and monitoring

## API Communication

The frontend communicates with the backend API in the following ways:

- API base URL is configured in the `.env` file via `VITE_BACKEND_PORT`
- In VITE_MSW_ENABLED mode, API requests can be intercepted by MSW for mocking
- Authentication tokens from Keycloak are automatically attached to API requests
- The application uses axios for data fetching

## Troubleshooting

### Common Issues

1. **"Cannot access test-company.insait.com:5173"**:
   - Ensure your hosts file is correctly configured
   - Check that no other services are using port 5173
   - Try accessing using localhost:5173 instead

2. **Authentication Issues**:
   - Set `VITE_MODE=development` in your `.env` file to bypass authentication
   - Ensure Keycloak is running if using authentication in non-development mode
   - Check that you have valid credentials to the Keycloak server, and contact Insait to get access if needed

3. **Build Errors**:
   - Run `npm ci` to ensure a clean installation of dependencies
   - Check for TypeScript errors with `npm run typecheck`

4. **Configuration Service Connection Issues**:
   - Verify AWS credentials are valid
   - Check Docker is running and the container is up with `docker ps`

## Recommended Tools

- **VSCode Extensions**:
  - ESLint
  - Prettier
  - TypeScript Hero
  - Tailwind CSS IntelliSense
  - React Developer Tools
  - GitHub Copilot (optional)

- **Browser Extensions**:
  - React Developer Tools
  - Redux DevTools
  - Sentry Browser Extension (optional)

- **Package Management**:
  - Consider using `npm ci` instead of `npm install` for exact dependency versions


## Contributing Guidelines

This section outlines the process for contributing to the Admin Frontend project. Following these guidelines helps maintain code quality and ensures a smooth review process.

### Branch Naming Convention

- Copy branch name directly from ClickUp - under the activity icon, click on the GitHub Icon to copy the branch name
- This automatically links the ClickUp issue to your PR when created
- The branch name will follow ClickUp's standard format which includes the task ID


### Pull Request Process

1. **Create a PR linked to ClickUp**
   - Each PR should address the specific ClickUp issue it is related to
   - Write meaningful commit messages that describe what was changed and why

2. **Commit Guidelines**
   - Maintain a single commit per PR
   - If you have multiple commits, rebase them into one:
     ```bash
     git rebase -i HEAD~N  # Where N is the number of commits to squash


3. **Version Management**
   - Increment the package version in `package.json` for each PR
   - Follow [Semantic Versioning](https://semver.org/) principles:
     - PATCH (1.0.x) for backwards-compatible bug fixes
     - MINOR (1.x.0) for new functionality that's backwards-compatible
     - MAJOR (x.0.0) for breaking changes

4. **PR Requirements**
   - Provide a clear description of changes
   - Include a demo of the functionality (screenshots or Loom video)
   - List any new dependencies added
   - List any new required environment variables
   - Document any configuration changes
   - Ensure all automated checks pass before requesting review

### Code Review Process

1. PRs require approval from at least one team member
2. Address any feedback or requested changes promptly
3. Maintain respectful and constructive communication

### Development Standards

- Follow the project's coding style and formatting guidelines
- Write tests for new features and bug fixes
- Update documentation to reflect your changes
- Make your code as accessible as possible
- Ensure new functionalities work with MSW

### CI/CD Checks

All PRs undergo automated checks:
- Type checking
- Unit and integration tests
- Build verification

Only PRs that pass all checks will be considered for review.

### Demo Requirements

A visual demonstration helps reviewers understand your changes:
- For UI changes: Include before/after screenshots
- For complex features: Record a short Loom video demonstration
- For performance improvements: Include metrics or benchmarks

By following these guidelines, you'll help maintain the quality of the codebase and expedite the review process. Thank you for your contributions!
---

For any additional help, please reach out to the development team

Other useful commands:

```bash
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run build        # Build for production
```

## Typical Development Workflow

1. Start the backend services
2. Run `npm run dev` to start the frontend development server
3. Make your changes to the codebase
4. Verify changes in the browser (hot reload is enabled)
5. Run tests to ensure your changes don't break existing functionality
6. Commit your changes following project conventions