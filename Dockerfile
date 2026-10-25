# Build stage: produce the static site in /app/build.
# Never build under /workspace: the CI Kaniko build mounts that path and drops it from the image.
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage: serve the static site with nginx as a non-root user.
FROM nginx:1.27-alpine

# Upgrade every OS package so the Trivy scan does not block on HIGH/CRITICAL CVEs.
# A fixed package list misses new CVEs in packages it doesn't name.
# `apk update` runs first because it fails when an index cannot be fetched;
# `apk upgrade` alone exits 0 on a fetch failure and silently upgrades nothing.
RUN apk update \
    && apk upgrade \
    && rm -rf /var/cache/apk/*

# The platform requires a UID between 10000 and 20000.
RUN addgroup -g 10001 -S choreouser \
    && adduser -u 10001 -G choreouser -S -D -H choreouser

COPY --chown=10001:10001 nginx.conf /etc/nginx/nginx.conf
COPY --chown=10001:10001 --from=builder /app/build /usr/share/nginx/html

RUN chown -R 10001:10001 /var/cache/nginx /etc/nginx

USER 10001
EXPOSE 8080
CMD ["nginx", "-g", "daemon off; pid /tmp/nginx.pid;"]
