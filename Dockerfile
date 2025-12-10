# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy UI and Themes package manifests
COPY ui/package*.json ./ui/
COPY themes/package*.json ./themes/

# Copy full source
COPY ui ./ui
COPY themes ./themes

WORKDIR /app/ui
RUN npm install --legacy-peer-deps

# Build UI
RUN npm run build


# ---- Production stage ----
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/ui/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
