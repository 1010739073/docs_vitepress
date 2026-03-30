---
title: 问题知识点汇总
description: 面试题知识点汇总
---
# 问题知识点汇总

一、PHP 高频面试题

1. 说说 PHP 中的 SAPI

常见：
CLI：命令行
FPM：FastCGI 进程管理器，主流生产环境
CGI：旧模式，性能差
Apache2Handler：mod_php 模式
3. PHP 中的 7 大超全局变量

$_GET、$_POST、$_REQUEST、$_COOKIE、$_SESSION、$_SERVER、$_FILES
4. isset() 和 empty() 区别

isset()：判断变量是否存在且不为 null
empty()：判断是否为 “空”，0、''、false、null、[] 都会返回 true
5. 静态变量 static

函数内 static 变量只初始化一次，多次调用函数值会保留。
类静态属性属于类，不属于实例，所有实例共享。
6. 魔术方法常见

__construct、__destruct、__get、__set、__call、__toString、__invoke
7. 依赖注入、IOC、AOP 简单理解

DI：外部传入依赖，不自己 new
IOC：控制反转，把对象创建交给容器
AOP：面向切面，统一处理日志、事务、权限等横切逻辑
8. PHP-FPM 调优重点

pm = dynamic
pm.max_children 最大进程数
pm.start_servers 启动进程数
pm.min/max_spare_servers 空闲进程
进程太少扛不住并发，太多耗内存。
9. PHP 性能优化

开启 Opcache
减少文件包含、自动加载优化
数据库慢查询优化、索引
减少循环内 SQL
使用 Redis 缓存热点数据
图片 / 静态资源走 CDN
10. 协程在 PHP 中的情况

PHP 原生无协程，Swoole 提供协程。
协程是用户态轻量级线程，IO 阻塞时自动切换，高并发 IO 场景性能提升明显。
二、Go 语言高频面试题

1. Goroutine 是什么

Go runtime 管理的轻量级线程，栈很小（KB 级），可轻松开启上万。
由 M:P:G 模型调度，无需内核上下文切换，开销小。
2. Channel 的作用

用于Goroutine 通信，遵循 “不要通过共享内存通信，要通过通信共享内存”。
可同步、可异步，防止竞态条件。
3. Go 内存分配与 GC

分 Tcmalloc 风格分配，分堆、栈。
栈在 Goroutine，无 GC；堆对象由 GC 回收。
使用三色标记法 + 混合写屏障，低停顿。
4. make 和 new 区别

new(T)：返回 *T，零值，不初始化
make：仅用于 slice、map、chan，返回引用类型并初始化
5. Map 并发安全吗？如何安全使用

不安全，并发读写会 panic。
方案：
加 sync.Mutex / sync.RWMutex
使用 sync.Map（适合读多写少）
6. defer 执行顺序

先进后出（栈），函数返回前执行。
若有 return，先赋值返回值，再执行 defer，最后返回。
7. Go 中的空接口 interface {}

可表示任意类型，类似泛型。
类型断言：v, ok := i.(T)
8. Go 逃逸分析

编译器决定变量分配在栈还是堆。
若变量被外部引用、返回指针、过大，会逃逸到堆。
栈分配性能远高于堆，无 GC 开销。
9. context 用途

控制 Goroutine 生命周期：取消、超时、传值。
常用：context.WithCancel、WithTimeout、WithValue
10. Go 实现高并发后端优势

原生协程高并发
编译型，性能远超 PHP
部署简单，单二进制文件
内置网络库，适合微服务、API、网关、推送等场景
三、MySQL 高频面试题

1. InnoDB vs MyISAM

InnoDB：支持事务、行锁、外键、崩溃恢复，默认
MyISAM：表锁，不支持事务，查询快，不适合高并发写
2. 事务四大特性 ACID

Atomicity 原子性
Consistency 一致性
Isolation 隔离性
Durability 持久性
3. 事务隔离级别

Read Uncommitted（读未提交）
Read Committed（读已提交）默认
Repeatable Read（可重复读）
Serializable（串行化）
问题：
脏读、不可重复读、幻读
4. 索引类型

主键索引、唯一索引、普通索引、联合索引、全文索引
InnoDB 主键是聚簇索引，叶子节点存整行数据
二级索引叶子存主键，回表查询
5. 最左前缀原则

联合索引 (a,b,c)
能用到：a、a,b、a,b,c
用不到：b、c、b,c
6. 什么是回表、覆盖索引

回表：通过二级索引查到主键，再查主键索引拿数据
覆盖索引：查询字段都在索引里，不需要回表，速度极快
7. 慢查询优化步骤

开启慢查询日志
explain 分析 SQL
看是否走索引、type/key/extra
建合适索引、避免 select *
避免 like '% xx%'、in 过多、子查询嵌套
大表分页优化：用主键 id 分页
8. MVCC 多版本并发控制

InnoDB 实现非锁并发读
通过 undo log 版本链 + read view
读写不阻塞，读读不阻塞，提升并发
9. 数据库锁

表锁、行锁、间隙锁、临键锁（解决幻读）
行锁基于索引，无索引会退化为表锁
10. 主从复制原理

master 写 binlog
slave IO 线程拉取 binlog 到 relay log
slave SQL 线程重放
最终一致性，有延迟。
四、Redis 高频面试题

1. Redis 为什么快

纯内存操作
单线程避免锁竞争
IO 多路复用
高效数据结构
2. Redis 数据类型

String、List、Hash、Set、ZSet、HyperLogLog、Geo、Stream
3. 缓存雪崩、击穿、穿透

雪崩：大量缓存同时过期 / Redis 宕机，流量打垮 DB
解决：过期时间随机、集群、多级缓存、限流降级
击穿：热点 key 过期，大量请求打 DB
解决：互斥锁、永不过期、预热
穿透：查询不存在数据，缓存不命中，直接查 DB
解决：布隆过滤器、缓存空值、参数校验
4. Redis 持久化

RDB：快照，全量备份，恢复快，丢数据多
AOF：记录每一条写命令，实时性高，文件大
混合持久化（推荐）：RDB + AOF
5. Redis 过期策略

惰性删除：访问时检查
定期删除：定时抽查
内存淘汰：volatile-lru、allkeys-lru 等
6. Redis 集群方案

主从
哨兵（高可用）
Redis Cluster（分片集群，16384 槽）
7. Redis 分布式锁

SET key value NX EX
防止锁超时误删：用唯一值 + Lua 脚本删除
红锁（多机分布式锁）
8. Redis 单线程为什么还能高并发

IO 多路复用（epoll/kqueue），网络等待不阻塞主线程。
五、Memcache 高频面试题

1. Memcache 与 Redis 区别

Memcache：纯内存、简单 KV、多线程、无持久化、无复杂数据结构
Redis：丰富结构、持久化、主从、集群、事务、脚本
2. Memcache 过期机制

Lazy Expiration + LRU 淘汰
不主动删除，访问时判断过期
3. 内存管理

Slab Allocation：预先分配不同大小内存块，减少内存碎片。
4. 一致性哈希

用于集群扩容缩容，减少缓存失效。
六、后端通用 & 架构题

1. 接口幂等性如何保证

唯一单号 + 防重表
分布式锁
状态机控制
前端防重复提交
2. 高并发优化思路

缓存（Redis）
异步（MQ）
分库分表
读写分离
限流、熔断、降级
负载均衡
3. 消息队列作用

异步解耦
流量削峰
异步通知
4. 如何设计一个短链接服务

长链接哈希 / 自增 ID
转 62 进制字符串
302 跳转
去重、统计、过期
七、项目常问（必准备）

你负责的模块、难点
遇到线上问题怎么排查
接口性能优化做了什么
高并发场景怎么处理
为什么用 Go/PHP，各自适合什么场景
