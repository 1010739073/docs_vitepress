---
title: 群辉备忘录
---
## nas命令
```
# docker登录主机控制台
ssh Mr-Ning@172.17.0.1

# liunx用户，在不切换用户情况下执行命令
sudo -u Mr-Ning php -v
```
## docker端口服务
|     服务      | 端口号 |                    地址                    |
| :-----------: | :----: | :----------------------------------------: |
| Video Station |  9007  | [Video Station](http://ddns.nsit.top:9007) |
|     青龙      | 10000  |     [青龙](http://ddns.nsit.top:10000)     |
|    vscode     |  8443  |    [vscode](http://ddns.nsit.top:8443)     |
|    openlist     |  5255  |    [openlist](http://ddns.nsit.top:5255)     |
|  phpmyadmin   | 10001  |  [phpmyadmin](http://ddns.nsit.top:10001)  |
|    nginxui    |  8091  |    [nginxui](http://ddns.nsit.top:8091)    |
|    浏览器     | 10002  |   [浏览器](http://ddns.nsit.top:10002/)    |
|     zblog     | 10008  |    [zblog](http://ddns.nsit.top:10008)     |
|    laravel    | 10009  |   [laravel](http://ddns.nsit.top:10009)    |
|    苹果cms    | 10010  |   [苹果cms](http://ddns.nsit.top:10010)    |
|    勾股cms    | 10011  |   [勾股cms](http://ddns.nsit.top:10011)    |
| iptv-sources  | 10012  | [iptv-sources](http://ddns.nsit.top:10012) |
## 添加伪静态
```
1. 先在web station添加网页服务
2. web station添加门户服务
3. 确定nginx配置文件位置
cd /usr/local/etc/nginx/conf.d
ls -ll .serv*
mkdir /usr/local/etc/nginx/conf.d/文件名目录
vim /usr/local/etc/nginx/conf.d/cd1f8ed6-a702-4031-a5cc-e92b5ddd3353/user.conf
4. 确定nginx配置文件位置
cd /usr/local/etc/nginx/conf.d-available
# 通过ls命令升序查看文件修改时间
ls -tr
# 查看配置文件，引入了/usr/local/etc/nginx/conf.d/xxx/user.conf*

## thinkphp伪静态
location / {
    if (!-e $request_filename){
        rewrite  ^(.*)$  /index.php?s=$1  last;   break;
    }
}
```