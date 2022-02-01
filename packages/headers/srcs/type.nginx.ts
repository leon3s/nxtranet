export type NginxSiteAvailable = {
  name: string;
  content: string;
}

export type NginxAccessLog = {
  date_gmt: Date;
  remote_addr: string;
  realip_remote_addr: string;
  proxy_host: string;
  server_protocol: string;
  request_method: string;
  host: string;
  uri: string;
  query_string: string;
  request_body: string;
  content_type: string;
  content_length: number;
  status: number;
  request_time: number;
  body_bytes_sent: number;
  http_referrer: string;
  http_accept_language: string;
  http_user_agent: string;
  geoip_org: string;
  geoip_city: string;
  geoip_city_continent_code: string;
  geoip_city_country_code: string;
  geoip_country_code: string;
  geoip_country_name: string;
  geoip_latitude: string;
  geoip_longitude: string;
}
