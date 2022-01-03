proxy_cache_path /tmp/NGINX_cache/ keys_zone=backcache:10m;

map $http_upgrade $connection_upgrade {
    default upgrade;
    ' '     close;
}

upstream nodejs {
    #ip_hash;
    {{#ports}}
    server 127.0.0.1:{{.}};
    {{/ports}}
}

server {
    listen 8080;
    server_name {{domain_name}};

    location / {
        proxy_pass http://nodejs;
        #proxy_cache backcache;
    }
}
