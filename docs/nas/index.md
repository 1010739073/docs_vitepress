---
title: 群辉备忘录
---
## docker登录主机控制台
```
ssh Mr-Ning@172.17.0.1
```
## docker端口服务
|       服务       |                      地址                      |
| :--------------: | :--------------------------------------------: |
|  Video Station   |   [Video Station](http://ddns.nsit.top:9007)   |
|       青龙       |       [青龙](http://ddns.nsit.top:10000)       |
|      vscode      |      [vscode](http://ddns.nsit.top:8443)       |
|    phpmyadmin    |    [phpmyadmin](http://ddns.nsit.top:10001)    |
|     nginxui      |      [nginxui](http://ddns.nsit.top:8091)      |
|      浏览器      |     [浏览器](http://ddns.nsit.top:10002/)      |
|      zblog       |      [zblog](http://ddns.nsit.top:10008)       |
|     laravel      |     [laravel](http://ddns.nsit.top:10009)      |
|     苹果cms      |     [苹果cms](http://ddns.nsit.top:10010)      |
|     勾股cms      |     [勾股cms](http://ddns.nsit.top:10011)      |
## 添加伪静态
```
cd /usr/local/etc/nginx/conf.d
# 1
ls -ll .serv*

mkdir /usr/local/etc/nginx/conf.d/fad32e89-89f2-498b-aae4-27a564a4141c

vim /usr/local/etc/nginx/conf.d/fad32e89-89f2-498b-aae4-27a564a4141c/user.conf
# 2
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