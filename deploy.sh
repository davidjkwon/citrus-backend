#!/bin/bash

# Exit on first error
set -e

# Build the project
npm run build

# Zip each Lambda function
mkdir -p deployment

# List of Lambda functions to deploy
LAMBDAS=(
    "lambdas/websockets/message"
    "lambdas/websockets/sendLocation"
    "lambdas/read_location/getFriends"
    "lambdas/read_location/getFriendsLocations"
    "lambdas/read_location/readLocationHandler"
)

for LAMBDA in "${LAMBDAS[@]}"; do
    # Get the function name from the path
    FUNCTION_NAME=$(basename "$LAMBDA")
    
    # Create deployment package
    cd /Users/ericrudzin/citrus-backend
    zip -r "deployment/${FUNCTION_NAME}.zip" \
        "$LAMBDA.js" \
        node_modules \
        lambdas/aws_components \
        types

    # Deploy to AWS Lambda (replace with your actual function names)
    aws lambda update-function-code \
        --function-name "citrus-${FUNCTION_NAME}" \
        --zip-file "fileb://deployment/${FUNCTION_NAME}.zip"

    echo "Deployed $FUNCTION_NAME successfully"
done

echo "Deployment complete!"
