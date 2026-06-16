---
title: PostgreSQL
description: PostgreSQL 数据库学习笔记
---

# PostgreSQL

PostgreSQL 是一个功能强大的开源对象关系型数据库系统，以其可靠性、功能健壮性和性能而闻名。

## PostgreSQL 特点

| 特性 | 说明 |
|-----|------|
| **开源免费** | BSD 许可证，可自由使用和修改 |
| **标准兼容** | 高度兼容 SQL 标准 |
| **扩展性强** | 支持自定义数据类型、函数、操作符 |
| **并发控制** | 原生 MVCC，读写不阻塞 |
| **数据完整性** | 支持外键、约束、触发器 |
| **全文搜索** | 内置全文搜索功能 |
| **地理信息** | PostGIS 扩展支持地理数据 |
| **JSON 支持** | 原生 JSON/JSONB 支持 |
| **复制与高可用** | 流复制、逻辑复制、多种高可用方案 |

## 数据类型概览

| 类别 | 数据类型 | 说明 |
|-----|---------|------|
| **整数** | SMALLINT, INTEGER, BIGINT | 不同范围的整数 |
| **小数** | DECIMAL, NUMERIC, REAL, DOUBLE | 精确和浮点小数 |
| **字符串** | CHAR, VARCHAR, TEXT | 定长、变长、无限制文本 |
| **日期时间** | DATE, TIME, TIMESTAMP, TIMESTAMPTZ, INTERVAL | 日期和时间 |
| **布尔** | BOOLEAN | true/false/null |
| **二进制** | BYTEA | 二进制数据 |
| **JSON** | JSON, JSONB | JSON 数据 |
| **数组** | ARRAY | 数组类型 |
| **范围** | INT4RANGE, TSRANGE, DATERANGE 等 | 范围类型 |
| **UUID** | UUID | 通用唯一标识符 |
| **几何** | POINT, LINE, CIRCLE, POLYGON | 几何图形 |
| **网络** | INET, CIDR, MACADDR | 网络地址 |
| **文本搜索** | TSVECTOR, TSQUERY | 全文搜索 |

## 常用命令

PostgreSQL 常用命令主要分为两类：一类是在 `psql` 交互终端中使用的元命令，例如 `\l`、`\c`、`\dt`；另一类是标准 SQL 语句，例如 `SELECT`、`CREATE TABLE`、`INSERT`。

### 登录与退出

```bash
# 使用 postgres 用户连接默认数据库
psql -U postgres

# 指定主机、端口、用户和数据库
psql -h 127.0.0.1 -p 5432 -U postgres -d postgres
```

进入 `psql` 后，可以使用下面的命令查看当前连接信息或退出：

```sql
\conninfo
\q
```

| 命令 | 说明 |
|-----|------|
| `psql -U postgres` | 使用指定用户连接数据库 |
| `psql -h 127.0.0.1 -p 5432 -U postgres -d postgres` | 指定主机、端口、用户和数据库连接 |
| `\conninfo` | 查看当前连接信息 |
| `\q` | 退出 `psql` |

### 数据库操作

查看所有数据库：

```sql
\l
\list
SELECT datname FROM pg_database;
```

切换数据库：

```sql
\c 数据库名
\connect 数据库名
```

PostgreSQL 不能像 MySQL 一样使用 `USE 数据库名;` 切换数据库。在 `psql` 中切换数据库，本质上是重新连接到目标数据库，常用 `\c 数据库名`。

### 表名查询与表结构

查看当前数据库中的表：

```sql
\dt
\dt public.*
```

查看表结构：

```sql
\d 表名
\d+ 表名
```

也可以使用 SQL 查询表名：

```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public';

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

| 命令 | 说明 |
|-----|------|
| `\dt` | 查看当前 schema 下的普通表 |
| `\dt public.*` | 查看 `public` schema 下的表 |
| `\d 表名` | 查看表字段、索引等基础结构 |
| `\d+ 表名` | 查看表的详细结构和存储信息 |

### 常用表与数据操作

创建表：

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

插入数据：

```sql
INSERT INTO users (name) VALUES ('张三');
```

查询数据：

```sql
SELECT * FROM users;
SELECT * FROM users LIMIT 10;
SELECT id, name FROM users WHERE id = 1;
```

更新数据：

```sql
UPDATE users SET name = '李四' WHERE id = 1;
```

删除数据和删除表：

```sql
DELETE FROM users WHERE id = 1;
DROP TABLE users;
```

`DELETE` 和 `DROP TABLE` 都会删除数据，执行前要确认条件和备份情况。尤其是 `DELETE` 不带 `WHERE` 条件时会删除整张表的数据，`DROP TABLE` 会直接删除表结构和表数据。

### 常用辅助命令

```sql
\dn
\du
\di
\x
\timing
```

| 命令 | 说明 |
|-----|------|
| `\dn` | 查看 schema 列表 |
| `\du` | 查看用户和角色 |
| `\di` | 查看索引列表 |
| `\x` | 开启或关闭扩展展示模式，适合查看字段较多的结果 |
| `\timing` | 开启或关闭 SQL 执行耗时显示 |

如果不确定某个 `psql` 元命令怎么用，可以使用 `\?` 查看帮助；如果想查看 SQL 语法帮助，可以使用 `\h SQL关键字`，例如 `\h SELECT`。

### 系统数据库与系统目录

PostgreSQL 安装完成后，通常会看到 `postgres`、`template1`、`template0` 这几个默认数据库。它们主要用于管理连接和创建新数据库，不建议把业务表随意建在这些系统默认库里。

| 数据库 | 存储或用途 | 是否建议直接操作 |
|-------|-----------|----------------|
| `postgres` | 默认管理数据库，常用于管理员连接、执行维护命令、查看实例状态 | 可以连接使用，但不建议长期存放业务数据 |
| `template1` | 创建新数据库时默认复制的模板库，新库会继承其中的对象和配置 | 不建议随意修改，除非明确希望所有新库继承这些改动 |
| `template0` | 原始模板库，通常保持干净状态，常用于创建指定编码或恢复干净模板 | 不建议修改 |

需要注意的是，PostgreSQL 没有像 MySQL 那样独立的 `mysql` 系统库。PostgreSQL 的系统元数据主要放在每个数据库内部的系统 schema 中：

| schema | 说明 |
|-------|------|
| `pg_catalog` | PostgreSQL 自带系统 schema，保存系统表、系统视图、内置函数、数据类型等元数据 |
| `information_schema` | SQL 标准定义的信息 schema，用标准方式展示表、字段等元数据，兼容性更好 |

一般情况下，业务表应放在业务数据库的业务 schema 中，例如默认的 `public`，不要直接修改 `pg_catalog` 里的系统表。

常见系统目录表如下：

| 系统表 | 存储内容 |
|-------|----------|
| `pg_database` | 当前实例中的数据库信息，例如数据库名、编码、属主、连接权限 |
| `pg_class` | 表、索引、序列、视图、物化视图等关系对象信息 |
| `pg_namespace` | schema 信息，例如 `public`、`pg_catalog`、`information_schema` |
| `pg_attribute` | 表字段信息，例如字段名、字段类型、字段序号、是否删除 |
| `pg_type` | 数据类型信息，包括内置类型、自定义类型、枚举类型等 |
| `pg_roles` | 角色和用户信息，常用于查看角色名、权限属性 |
| `pg_authid` | 角色认证信息，包含密码等敏感字段，普通用户通常不能直接查看 |
| `pg_index` | 索引和表字段之间的关联信息 |
| `pg_constraint` | 主键、外键、唯一约束、检查约束等约束信息 |
| `pg_proc` | 函数和存储过程信息 |

常见统计视图和信息视图如下：

| 视图 | 存储或展示内容 |
|-----|----------------|
| `pg_stat_activity` | 当前连接、会话状态、正在执行的 SQL、等待事件等信息 |
| `pg_stat_database` | 数据库级统计信息，例如事务提交、回滚、读写块、连接数 |
| `pg_stat_user_tables` | 用户表访问统计，例如扫描次数、插入行数、更新行数、删除行数 |
| `pg_indexes` | 索引名称、所属表、schema 和索引定义 |
| `information_schema.tables` | 标准 SQL 视图，用于查看表和视图信息 |
| `information_schema.columns` | 标准 SQL 视图，用于查看字段名、数据类型、是否允许为空等信息 |

常用查询示例：

```sql
-- 查看实例中有哪些数据库
SELECT datname, datdba, encoding
FROM pg_database;

-- 查看当前数据库有哪些 schema
SELECT nspname
FROM pg_namespace;

-- 查看 public schema 下有哪些表
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public';

-- 查看当前连接和正在执行的 SQL
SELECT pid, usename, datname, state, query
FROM pg_stat_activity;

-- 查看 public schema 下的字段信息
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public';
```

这些系统表和视图主要用于查询数据库元数据和运行状态。日常排查可以查询它们，但不要直接 `UPDATE`、`DELETE` 或手动修改 `pg_catalog` 中的系统表，否则可能导致数据库元数据异常。

### 主从库常用命令

下面的命令主要用于查看主从复制状态和排查复制延迟，只包含查询操作，不包含主从切换、提升从库、删除复制槽等高风险操作。

判断当前节点是主库还是从库：

```sql
SELECT pg_is_in_recovery();
```

| 返回值 | 说明 |
|-------|------|
| `false` | 当前节点是主库 |
| `true` | 当前节点是从库，或当前节点处于恢复模式 |

在主库查看从库连接和复制状态：

```sql
SELECT pid, usename, application_name, client_addr, state, sync_state,
       sent_lsn, write_lsn, flush_lsn, replay_lsn
FROM pg_stat_replication;
```

`pg_stat_replication` 通常在主库上查询，用来确认从库是否已连接到主库，以及 WAL 发送、写入、刷盘、回放进度。

在从库查看 WAL 接收状态：

```sql
SELECT status, receive_start_lsn, received_lsn, latest_end_lsn,
       last_msg_send_time, last_msg_receipt_time
FROM pg_stat_wal_receiver;
```

`pg_stat_wal_receiver` 通常在从库上查询，用来确认从库是否正在接收主库发送过来的 WAL 日志，以及最近一次消息发送和接收时间。

在主库查看从库回放延迟：

```sql
SELECT application_name, client_addr, state, sync_state,
       pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS replay_delay_bytes
FROM pg_stat_replication;
```

在从库查看最后一次事务回放时间延迟：

```sql
SELECT now() - pg_last_xact_replay_timestamp() AS replay_delay_time;
```

`replay_delay_bytes` 表示主库当前 WAL 位点和从库回放位点相差多少字节。`replay_delay_time` 表示从库最后回放事务距离当前时间的间隔，如果主库长时间没有写入，时间延迟可能看起来较大，需要结合业务写入情况判断。

#### 复制槽 Slot

Replication Slot（复制槽）是 PostgreSQL 用来记录复制消费进度的机制。主库通过 slot 知道从库或逻辑订阅端已经消费到哪个 WAL 位点。

使用 slot 后，即使从库或订阅端短暂断开，主库也会保留它尚未消费的 WAL，避免 WAL 被提前清理后导致从库无法继续同步。

常见 slot 类型：

| 类型 | 说明 | 常见场景 |
|-----|------|----------|
| `physical` | 物理复制槽，按 WAL 物理日志保留复制所需内容 | 流复制、主从复制 |
| `logical` | 逻辑复制槽，配合逻辑解码插件按逻辑变更消费 WAL | 逻辑复制、CDC、数据同步工具 |

查看复制槽信息：

```sql
SELECT slot_name, slot_type, active, restart_lsn, confirmed_flush_lsn
FROM pg_replication_slots;
```

查看复制槽详细信息：

```sql
SELECT slot_name, plugin, slot_type, datoid, database, temporary, active,
       active_pid, xmin, catalog_xmin, restart_lsn, confirmed_flush_lsn,
       wal_status, safe_wal_size, two_phase
FROM pg_replication_slots;
```

查看每个 slot 当前大约保留了多少 WAL：

```sql
SELECT slot_name, slot_type, active, restart_lsn,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal
FROM pg_replication_slots
WHERE restart_lsn IS NOT NULL;
```

查看当前未被客户端使用的 inactive slot：

```sql
SELECT slot_name, slot_type, active, restart_lsn
FROM pg_replication_slots
WHERE active = false;
```

如果 slot 长期处于 inactive 状态，并且没有消费者继续推进消费位点，主库会持续保留相关 WAL 文件，严重时可能导致磁盘被 WAL 占满。删除 slot 前必须确认没有从库、订阅端或数据同步任务依赖它；本文只提供查询命令，不提供删除 slot 的操作。

查看 WAL 位点：

```sql
-- 主库当前 WAL 位点
SELECT pg_current_wal_lsn();

-- 从库最近接收的 WAL 位点
SELECT pg_last_wal_receive_lsn();

-- 从库最近回放的 WAL 位点
SELECT pg_last_wal_replay_lsn();
```

常见复制状态字段说明：

| 字段 | 说明 |
|-----|------|
| `state` | 复制连接状态，常见值是 `streaming` |
| `sync_state` | 同步状态，常见值有 `async`、`sync`、`quorum` |
| `sent_lsn` | 主库已经发送给从库的 WAL 位点 |
| `write_lsn` | 从库已经写入本地文件系统的 WAL 位点 |
| `flush_lsn` | 从库已经刷盘的 WAL 位点 |
| `replay_lsn` | 从库已经回放完成的 WAL 位点 |
| `client_addr` | 从库连接到主库时使用的客户端地址 |

常见 slot 字段说明：

| 字段 | 说明 |
|-----|------|
| `slot_name` | 复制槽名称 |
| `slot_type` | 复制槽类型，常见值为 `physical` 或 `logical` |
| `plugin` | 逻辑解码插件，逻辑复制槽常见字段，物理复制槽通常为空 |
| `database` | 逻辑复制槽所属数据库，物理复制槽通常为空 |
| `temporary` | 是否为临时复制槽 |
| `active` | 当前是否有客户端正在使用该 slot |
| `active_pid` | 正在使用该 slot 的进程 PID |
| `xmin` | 该 slot 需要保留的事务 ID 下界 |
| `catalog_xmin` | 逻辑复制需要保留的系统目录事务 ID 下界 |
| `restart_lsn` | 为该 slot 保留 WAL 的起始位点 |
| `confirmed_flush_lsn` | 逻辑复制槽已确认消费的 WAL 位点，物理复制槽通常为空 |
| `wal_status` | WAL 保留状态，较新版本 PostgreSQL 可见 |
| `safe_wal_size` | 在变成危险状态前还能写入的大致 WAL 大小，较新版本 PostgreSQL 可见 |
| `two_phase` | 是否支持两阶段提交解码，部分版本或逻辑复制场景可见 |

不同 PostgreSQL 版本中，`wal_status`、`safe_wal_size`、`two_phase` 等字段可能不存在。如果查询报字段不存在，可以先用 `\d pg_replication_slots` 查看当前版本实际支持的字段。

## 与其他数据库对比

| 特性 | PostgreSQL | MySQL | SQL Server |
|-----|-----------|-------|------------|
| **许可证** | PostgreSQL | GPL | 商业软件 |
| **主键自增** | SERIAL / IDENTITY / SEQUENCE | AUTO_INCREMENT | IDENTITY |
| **字符串区分大小写** | 默认区分 | 可配置 | 默认不区分 |
| **窗口函数** | 完整支持 | 支持 | 完整支持 |
| **JSON 支持** | JSON/JSONB 原生 | 原生 JSON | NVARCHAR |
| **存储过程** | PL/pgSQL | 支持 | T-SQL |
| **全文搜索** | 原生支持 | 支持 | 原生支持 |
| **索引类型** | B-tree, Hash, GiST, GIN, BRIN 等 | B-tree, 全文, 空间 | B-tree, 列存储 |
| **MVCC** | 原生 MVCC | 基于锁 | 快照隔离 |
| **扩展性** | 极强 | 中等 | 有限 |

## 学习路径

1. **[基础入门](1.基础入门.md)** - 安装配置、基本操作
2. **[索引与性能](2.索引与性能.md)** - 索引原理、查询优化
3. **[事务与并发](3.事务与并发.md)** - 事务隔离、锁机制
4. **[存储过程与函数](4.存储过程与函数.md)** - PL/pgSQL 编程
5. **[高级特性](5.高级特性.md)** - 分区表、全文搜索、JSONB、窗口函数等
6. **[备份与恢复](6.备份与恢复.md)** - 数据保护、高可用
7. **[常见问题处理](7.常见问题处理.md)** - 问题排查、故障处理
8. **[主从复制](8.主从复制.md)** - WAL 原理、流复制、逻辑复制
9. **[高可用与故障处理](9.高可用与故障处理.md)** - Patroni 方案、故障场景处理
10. **[主从高可用面试题](10.主从高可用面试题.md)** - 面试题与解答
11. **[知识点总结](11.知识点.md)** - 核心知识点回顾
12. **[大厂面试题](大厂面试题.md)** - 面试题与答案

## 适用场景

PostgreSQL 特别适合以下场景：

- **复杂查询**：需要复杂 SQL 和窗口函数的应用
- **数据仓库**：大规模数据分析和报表
- **地理信息系统**：需要 PostGIS 扩展的应用
- **JSON 文档存储**：混合关系型和文档型数据
- **金融系统**：需要强数据一致性和完整性
- **科学计算**：复杂数据类型和自定义函数

## 参考资源

- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [PostgreSQL 中文社区](http://www.postgres.cn/)
- [PostGIS 文档](https://postgis.net/documentation/)
