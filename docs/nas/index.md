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
| yinshun  | 10013  | [yinshun](http://ddns.nsit.top:10013) |

## frpc映射
<!-- UPDATE_START -->

| 平台 | 名称 | 地址 | 原端口 | 端口 | 访问地址 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| github | 文档站 | - | - | - | https://nsit.de5.net |
| chmlfrp | openlist | 82.156.215.91 | 5255 | 25255 | http://82.156.215.91:25255 |
| chmlfrp | nas | 82.156.215.91 | 5000 | 55000 | http://82.156.215.91:55000 |
| chmlfrp | vscode | 82.156.215.91 | 8443 | 28443 | http://82.156.215.91:28443 |
| chmlfrp | cloud_piercer_manager | 82.156.215.91 | 8088 | 38088 | http://82.156.215.91:38088 |
| 88frp | AF1rU9JLDSks | 39.104.66.49 | 8443 | 58443 | http://39.104.66.49:58443 |
| 88frp | ixWY7P20xeQm | 39.104.66.49 | 12000 | 12000 | http://39.104.66.49:12000 |
| 88frp | QuplISudDvr8 | 39.104.66.49 | 3306 | 23306 | http://39.104.66.49:23306 |
| 88frp | UdDxb7qymyTR | 39.104.66.49 | 8091 | 28091 | http://39.104.66.49:28091 |
| 88frp | FktYCTouFmlN | 39.104.66.49 | 22300 | 22300 | http://39.104.66.49:22300 |
| wispbyte | blog | nlog.de5.net | 10008 | 13610 | http://nlog.de5.net:13610 |
| wispbyte | game | game.nlog.de5.net | 10018 | 13610 | http://game.nlog.de5.net:13610 |
| hayfrp | vscode | CN.HK.CN2.hayfrp.qzz.io | 8443 | 58443 | http://CN.HK.CN2.hayfrp.qzz.io:58443 |
| hayfrp | radio | CN.HK.CN2.hayfrp.qzz.io | 10016 | 50016 | http://CN.HK.CN2.hayfrp.qzz.io:50016 |
| hayfrp | nas | CN.HK.CN2.hayfrp.qzz.io | 5000 | 55000 | http://CN.HK.CN2.hayfrp.qzz.io:55000 |
| hayfrp | game | CN.HK.CN2.hayfrp.qzz.io | 10018 | 50018 | http://CN.HK.CN2.hayfrp.qzz.io:50018 |

<!-- UPDATE_END -->
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