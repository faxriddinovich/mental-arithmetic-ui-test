# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy UI and Themes package manifests
COPY mental-arithmetic-ui-test/package*.json ./ui/
COPY mental-arithmetic-themes/package*.json ./themes/

# Copy full source
COPY mental-arithmetic-ui-test ./ui
COPY mental-arithmetic-themes ./themes

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
