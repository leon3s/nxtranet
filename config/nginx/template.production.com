proxy_cache_path /tmp/NGINX_cache/ keys_zone={{cache_name}}:10m;

map $http_upgrade $connection_upgrade {
    default upgrade;
    ' '     close;
}

upstream {{upstream}} {
    #ip_hash;
    {{#ports}}
    server 127.0.0.1:{{.}};
    {{/ports}}
}

server {
    server_name {{domain_name}};

    location / {
        proxy_pass http://{{upstream}};
        #proxy_cache {{cache_name}};
    }
}
