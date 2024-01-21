# Steg 1: Bygg React-appen
FROM node:latest as build-stage
WORKDIR /app
COPY . .

RUN npm install

ARG REACT_APP_API_KEY

ENV REACT_APP_API_KEY=$REACT_APP_API_KEY

RUN npm run build   

# Steg 2: Sätt upp Nginx för att servera den byggda appen
FROM nginx:alpine

# Skapa en ny nginx konfigurationsfil
RUN echo $'server {\n\
    listen       80;\n\
    location / {\n\
        root   /usr/share/nginx/html;\n\
        index  index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    error_page   500 502 503 504  /50x.html;\n\
    location = /50x.html {\n\
        root   /usr/share/nginx/html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Kopiera den byggda appen till Nginx-servern
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
