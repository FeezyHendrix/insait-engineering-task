# Admin Backend

This is a backend application of various tools for a company's employee to perform administrative tasks.

## Stack

This Application uses: NodeJs, Postgres, and Typescript

## Run Application Locally

### Clone the repository

```bash
gh repo clone insait-io/admin-backend
```

### Preparation

Ensure Docker is installed and running on your system.

### Setting up environment

Create and Populate a .env file in the root directory. See .env.example.

Run database container:

```bash
docker compose -f docker-compose-dev.yml up -d dashboard-db
```

Install required packages:

```bash
npm i
```

Run this script to run the database docker container and trigger Prisma migrations. To seed fake data into the database, add "seed":

```bash
./local_setup.sh seed
```

### Runing the backend locally:

```bash
npm run dev
```

### Configuration service

By default, the configuration service is mocked using MSW, as long as the application is not run with RUN_MODE=PRODUCTION

### Accessing the Application

The application will be accessible at `http://your_host:5050`.

### local Stack Setup

To ensure the LocalStack S3 initialization script runs correctly, make sure the script has the necessary executable permissions.
Run the following command:

```bash
chmod +x scripts/s3_test_bucket_init.sh
```

### Standalone Mode

Set `STAND_ALONE=1` in `.env` to serve routes with the `/admin/api` prefix (e.g., `/admin/api/health`). If `STAND_ALONE=0` or unset, routes are served without the prefix (e.g., `/health`).
