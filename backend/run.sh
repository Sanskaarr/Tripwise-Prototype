#!/bin/bash

echo "Starting TripWise Backend..."
echo "================================"

# Load environment variables from parent .env if exists
if [ -f "../.env" ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
    echo "✓ Loaded environment variables from .env"
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java 17+ required. Current version: $JAVA_VERSION"
    exit 1
fi

echo "✓ Java version: $JAVA_VERSION"

# Build and run
echo ""
echo "Building application..."
mvn clean install -DskipTests

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Build successful!"
    echo "Starting Spring Boot application on port 8080..."
    echo "================================"
    mvn spring-boot:run
else
    echo "❌ Build failed"
    exit 1
fi
