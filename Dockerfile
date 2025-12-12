# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy UI and Themes package manifests
COPY mental-arithmetic-ui-test/package*.json ./mental-arithmetic-ui-test/
COPY mental-arithmetic-themes/package*.json ./mental-arithmetic-themes/

# Copy full source
COPY mental-arithmetic-ui-test ./mental-arithmetic-ui-test
COPY mental-arithmetic-themes ./mental-arithmetic-themes

WORKDIR /app/mental-arithmetic-ui-test
RUN npm install --legacy-peer-deps

# Build UI
RUN npm run build
RUN npm run serve


# ---- Production stage ----
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/mental-arithmetic-ui-test/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
