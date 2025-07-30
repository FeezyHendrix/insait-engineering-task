#!/bin/sh

print_required_parameters() {
  echo "Usage: $0 [seed]"
  exit 1
}

if [ $# -gt 2 ]; then
  print_required_parameters
fi

echo "Setting up local environment"

echo "Making sure the LocalStack init script is executable"
chmod +x ./scripts/s3_demo_bucket_init.sh

echo "Running databases compose file."
docker compose -f docker-compose-dev.yml up -d

sleep 3

echo "Running prisma migrate"
cd src/prisma && npx prisma generate && npx prisma migrate dev --name migration 


if [ "$1" = "seed" ] || [ "$2" = "seed" ]; then
  echo "Running prisma seed"
  npx prisma db seed
fi

echo "Setup complete"
