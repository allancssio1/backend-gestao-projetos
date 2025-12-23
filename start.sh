#!/bin/sh

echo "Waiting for postgres..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL started"

echo "Running migrations..."
npm run migrate

echo "Starting server..."
node dist/server.js
