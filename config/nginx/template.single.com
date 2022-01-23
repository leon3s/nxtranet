# Generated by nxtranet if you wanna edit this file see /etc/nxtranet/config/nginx/template.single.com

server {
    server_name {{domain_name}};
    location / {
        proxy_set_header upgrade $http_upgrade;
        proxy_set_header connection "upgrade";
        proxy_http_version 1.1;
        proxy_set_header x-forwarded-for $proxy_add_x_forwarded_for;
        proxy_set_header host $host;
        proxy_pass http://localhost:{{port}};
    }
}
