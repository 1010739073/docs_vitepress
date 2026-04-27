---
title: Nginx
description: Nginx 高性能 Web 服务器与反向代理
---

# Nginx

Nginx 是一款高性能的 HTTP 和反向代理服务器，也是一个 IMAP/POP3/SMTP 代理服务器。

## 文档列表

- [大厂面试题与高并发场景](./大厂面试题.md) - Nginx 大厂面试题与高并发场景详解

## 核心特性

- **高性能**：采用事件驱动、异步非阻塞架构，能够处理数万并发连接
- **低内存消耗**：处理 10,000 个没有活动的连接，仅占用约 2.5MB 内存
- **负载均衡**：支持多种负载均衡策略
- **反向代理**：支持 HTTP、FastCGI、uwsgi、SCGI、memcached 的反向代理
- **静态文件服务**：高效的静态文件服务
- **SSL/TLS 支持**：支持 SSL/TLS 终止
- **压缩**：支持 Gzip 压缩
- **限流**：支持连接和请求限流

## 常用配置示例

### 基本配置

```nginx
server {
    listen 80;
    server_name example.com;
    
    root /var/www/html;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 反向代理

```nginx
server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 负载均衡

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://backend;
    }
}
```

### SSL 配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    location / {
        root /var/www/html;
    }
}
```

## 学习资源

- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Nginx 中文文档](http://www.nginx.cn/doc/)
- [Nginx 入门教程](https://nginx.org/en/docs/beginners_guide.html)