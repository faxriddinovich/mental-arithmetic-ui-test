# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy UI and Themes package manifests
COPY ui/package*.json ./ui/
COPY themes/package*.json ./themes/

# Copy full source
COPY ui ./ui
COPY themes ./themes

# Install dependencies (ui depends on themes via file:../themes)
WORKDIR /app/ui
RUN npm install --legacy-peer-deps

# Build UI
RUN npm run build


# ---- Production stage ----
FROM nginx:stable-alpine

# Clean old nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built UI
COPY --from=builder /app/ui/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
