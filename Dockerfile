# Build the Vite app, then serve the static files with Nginx.
# Client routes (/vote, /dashboard/..., etc.) fall back to index.html.

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Backend API address, baked into the build (set it as a build argument in Dokploy),
# e.g. https://api.bfoundation.rw/api/v1
ARG VITE_API_URL=http://localhost:5000/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
