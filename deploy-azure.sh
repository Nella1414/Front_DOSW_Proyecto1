#!/bin/bash

# SIRHA Frontend - Azure Deployment Script
# This script builds and deploys the SIRHA frontend to Azure Container Apps

set -e

# Configuration
RESOURCE_GROUP="sirha-rg"
LOCATION="eastus"
CONTAINER_APP_NAME="sirha-frontend"
CONTAINER_REGISTRY="sirharegistry"
IMAGE_NAME="sirha-frontend"
TAG="latest"

echo "🚀 Starting SIRHA Frontend deployment to Azure..."

# Step 1: Create resource group if it doesn't exist
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Step 2: Create Azure Container Registry if it doesn't exist
echo "🏗️  Creating Azure Container Registry..."
az acr create --resource-group $RESOURCE_GROUP --name $CONTAINER_REGISTRY --sku Basic --admin-enabled true

# Step 3: Build and push Docker image
echo "🔨 Building Docker image..."
docker build -t $IMAGE_NAME:$TAG .

echo "📤 Pushing image to Azure Container Registry..."
az acr login --name $CONTAINER_REGISTRY
docker tag $IMAGE_NAME:$TAG $CONTAINER_REGISTRY.azurecr.io/$IMAGE_NAME:$TAG
docker push $CONTAINER_REGISTRY.azurecr.io/$IMAGE_NAME:$TAG

# Step 4: Create Container Apps environment
echo "🌐 Creating Container Apps environment..."
az containerapp env create \
  --name sirha-env \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Step 5: Deploy Container App
echo "🚀 Deploying Container App..."
az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment sirha-env \
  --image $CONTAINER_REGISTRY.azurecr.io/$IMAGE_NAME:$TAG \
  --target-port 3000 \
  --ingress external \
  --registry-server $CONTAINER_REGISTRY.azurecr.io \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3

# Step 6: Get the application URL
echo "✅ Deployment completed!"
echo "🌍 Getting application URL..."
az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv

echo "🎉 SIRHA Frontend has been successfully deployed to Azure!"
echo "📝 Note: Make sure to configure your backend API endpoints in the environment variables."