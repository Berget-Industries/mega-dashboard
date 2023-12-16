# Steg 1: Bygg React-appen
FROM node:latest as build-stage
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Steg 2: Sätt upp Nginx för att servera den byggda appen
FROM nginx:alpine

# Kopiera den byggda appen till Nginx-servern
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
