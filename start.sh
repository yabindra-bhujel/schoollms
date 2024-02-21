#!/bin/bash

# start.sh

cd backend
./start-backend.sh &  # Run backend startup script asynchronously

echo "Backend startup initiated"

cd ..

cd frontend
./start-frontend.sh  # Run frontend startup script

