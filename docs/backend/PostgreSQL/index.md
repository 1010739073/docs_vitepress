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
8. **[知识点总结](9.知识点.md)** - 核心知识点回顾
9. **[大厂面试题](大厂面试题.md)** - 面试题与答案

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
