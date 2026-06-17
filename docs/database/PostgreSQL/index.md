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

基础建表、插入、查询、更新、删除等 CRUD 示例已经整理到 [基础入门](1.基础入门.md)。首页只保留最常见操作的入口说明：

| 操作 | 常用语句 | 详细说明 |
|-----|---------|---------|
| 创建表 | `CREATE TABLE` | 见 [基础入门](1.基础入门.md) |
| 插入数据 | `INSERT INTO` | 见 [基础入门](1.基础入门.md) |
| 查询数据 | `SELECT` | 见 [基础入门](1.基础入门.md) |
| 更新数据 | `UPDATE` | 见 [基础入门](1.基础入门.md) |
| 删除数据 | `DELETE`、`DROP TABLE` | 见 [基础入门](1.基础入门.md)，执行前要确认条件和备份情况 |

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

### PostgreSQL 常见命令行工具

除了 `psql` 里的 `\l`、`\d` 这类元命令，PostgreSQL 还自带了一批命令行工具。它们一般在操作系统终端中执行，用来完成连接数据库、备份恢复、初始化集群、维护索引、检查服务状态、搭建主从复制等工作。

可以简单理解为：`psql` 适合进入数据库后执行 SQL 和元命令；`pg_dump`、`pg_restore`、`pg_ctl`、`pg_basebackup` 等工具更适合在终端脚本、运维操作和备份恢复流程中使用。

| 工具 | 主要作用 | 常见场景 | 注意事项 |
|-----|---------|---------|---------|
| `psql` | PostgreSQL 官方交互式客户端，用于连接数据库、执行 SQL、运行元命令 | 日常查询、管理数据库对象、排查问题 | 执行危险 SQL 前要确认当前连接的数据库和用户 |
| `createdb` | 创建数据库，是 `CREATE DATABASE` 的命令行封装 | 初始化业务库、脚本化创建数据库 | 创建前确认库名、编码、属主和模板库 |
| `dropdb` | 删除数据库，是 `DROP DATABASE` 的命令行封装 | 清理测试库、删除废弃库 | 高风险操作，删除前必须确认目标库和备份情况 |
| `createuser` | 创建数据库角色或用户 | 初始化应用账号、创建管理员或只读账号 | 创建后还需要按需授予数据库和对象权限 |
| `dropuser` | 删除数据库角色或用户 | 清理废弃账号 | 删除前确认该角色是否拥有对象或仍被业务使用 |
| `pg_dump` | 逻辑备份单个数据库，可导出 SQL 文本或自定义格式文件 | 单库备份、迁移、导出部分对象 | 备份通常不阻塞读写，恢复前要确认版本和对象依赖 |
| `pg_dumpall` | 逻辑备份整个实例，包括角色、表空间等全局对象 | 整实例迁移、备份全局账号信息 | 数据量大时耗时较长，恢复顺序和权限需要提前规划 |
| `pg_restore` | 恢复 `pg_dump` 生成的自定义、目录或 tar 格式备份 | 恢复 `pg_dump -F c`、`-F d`、`-F t` 备份 | 不用于恢复纯 SQL 文件，纯 SQL 通常用 `psql` 执行 |
| `initdb` | 初始化 PostgreSQL 数据目录，生成基础系统库和配置文件 | 新装 PostgreSQL 后初始化数据目录 | 只在新集群初始化时使用，不要对已有数据目录重复执行 |
| `pg_ctl` | 启动、停止、重启、重新加载服务，也可查看服务状态 | 本机服务管理、脚本化启停、加载配置 | 生产环境操作前要确认影响范围，优先使用规范的服务管理方式 |
| `postgres` | PostgreSQL 服务端主进程 | 底层服务启动、排查启动参数问题 | 通常由 `pg_ctl` 或系统服务管理器启动，不建议日常手动直接运行 |
| `vacuumdb` | 对数据库执行 `VACUUM` 或 `ANALYZE` | 回收死元组、更新统计信息、维护表膨胀 | 大库执行前要关注 IO、锁等待和业务高峰期 |
| `reindexdb` | 重建数据库中的索引 | 处理索引膨胀、索引损坏、维护索引性能 | 重建索引可能占用资源并影响并发访问 |
| `clusterdb` | 按索引重新组织表的物理存储顺序 | 让表数据按常用索引顺序重新排列 | 可能持有较重锁，生产环境需谨慎评估 |
| `pg_isready` | 检查 PostgreSQL 服务是否可以连接 | 健康检查、启动脚本、监控探测 | 只能说明连接状态，不代表业务 SQL 一定正常 |
| `pg_config` | 查看 PostgreSQL 安装路径、编译参数和扩展编译配置 | 安装扩展、排查环境路径、编译插件 | 常用于开发和运维排查，不直接操作数据库数据 |
| `pg_controldata` | 查看数据目录控制文件信息 | 排查数据库状态、检查点、时间线等底层信息 | 需要能访问数据目录，通常用于故障诊断 |
| `pg_resetwal` | 重置 WAL 控制信息 | 极端灾难恢复场景 | 极高风险工具，可能造成数据不一致，不能作为常规修复手段 |
| `pg_basebackup` | 从运行中的主库生成物理基础备份 | 搭建从库、制作物理备份 | 会产生网络和磁盘 IO，需确认复制权限和备份目录 |
| `pg_receivewal` | 持续接收主库 WAL 日志 | WAL 归档、备份链路补充 | 需要关注磁盘空间和 WAL 保留策略 |
| `pg_recvlogical` | 接收逻辑解码产生的变更流 | 逻辑复制、CDC、调试逻辑解码 | 依赖逻辑复制配置和复制槽，长期不用的槽可能堆积 WAL |
| `pg_rewind` | 将旧主库快速同步到新主库时间线 | 主从切换后修复旧主库、重新加入集群 | 执行前必须确认新旧主库关系和数据目录状态 |

常见低风险查看类命令示例：

```bash
# 查看 PostgreSQL 客户端版本
psql --version

# 检查本机 5432 端口上的 PostgreSQL 是否可连接
pg_isready -h 127.0.0.1 -p 5432

# 查看 PostgreSQL 安装和编译配置信息
pg_config

# 备份单个数据库为 SQL 文件
pg_dump -h 127.0.0.1 -p 5432 -U postgres -d postgres -f postgres.sql
```

备份、恢复、启停服务、删除数据库、重置 WAL、主从修复等操作都可能影响数据安全或服务可用性。生产环境执行前，应先确认当前环境、目标实例、目标数据库、登录用户、备份文件、权限范围和回滚方案。

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

### 主从复制与复制槽

主从复制状态、复制延迟、复制槽 Slot、WAL 位点等内容已经整理到 [主从复制](8.主从复制.md)。首页只保留常用入口：

| 主题 | 常用对象或函数 | 详细说明 |
|-----|--------------|---------|
| 判断主库或从库 | `pg_is_in_recovery()` | 见 [主从复制](8.主从复制.md) |
| 查看主库复制状态 | `pg_stat_replication` | 见 [主从复制](8.主从复制.md) |
| 查看从库 WAL 接收状态 | `pg_stat_wal_receiver` | 见 [主从复制](8.主从复制.md) |
| 查看复制槽 | `pg_replication_slots` | 见 [主从复制](8.主从复制.md) |
| 查看 WAL 位点 | `pg_current_wal_lsn()`、`pg_last_wal_receive_lsn()`、`pg_last_wal_replay_lsn()` | 见 [主从复制](8.主从复制.md) |

复制槽长期 inactive 可能导致主库持续保留 WAL，严重时会占满磁盘。删除复制槽、主从切换、旧主库修复等操作都属于高风险操作，执行前需要确认依赖关系和恢复方案。

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
