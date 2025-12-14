#!/bin/bash

set -e

export JAVA_HOME=$(/usr/libexec/java_home -v 21)

echo "========================================="
echo "Building TripWise Backend..."
echo "Using Java: $(java -version 2>&1 | head -n 1)"
echo "========================================="

mvn clean install -DskipTests

echo "========================================="
echo "Starting TripWise Backend on port 8080..."
echo "========================================="

java -jar target/tripwise-backend-1.0.0.jar