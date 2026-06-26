---
title: MySQL
description: MySQL 数据库学习笔记
---

# MySQL

MySQL 是目前最流行的开源关系型数据库，广泛应用于 Web 应用、互联网业务和企业系统。

## MySQL 特点

| 特性 | 说明 |
|-----|------|
| **开源免费** | GPL 协议，社区版免费使用 |
| **高性能** | InnoDB 存储引擎，支持高并发读写 |
| **高可用** | 主从复制、组复制、MGR 多种高可用方案 |
| **生态成熟** | 工具链完善，社区活跃，文档丰富 |
| **多存储引擎** | InnoDB、MyISAM、Memory 等可按需选择 |
| **MVCC** | 基于 Undo Log 实现多版本并发控制 |
| **全文搜索** | InnoDB 和 MyISAM 均支持全文索引 |
| **JSON 支持** | 5.7+ 原生 JSON 类型 |

## 数据类型概览

| 类别 | 数据类型 | 说明 |
|-----|---------|------|
| **整数** | TINYINT, SMALLINT, INT, BIGINT | 不同范围整数，可选 UNSIGNED |
| **小数** | DECIMAL, FLOAT, DOUBLE | DECIMAL 精确计算，FLOAT/DOUBLE 近似值 |
| **字符串** | CHAR, VARCHAR, TEXT | 定长、变长、长文本 |
| **日期时间** | DATE, TIME, DATETIME, TIMESTAMP | 日期、时间、时间戳 |
| **二进制** | BINARY, VARBINARY, BLOB | 二进制数据 |
| **JSON** | JSON | 5.7+ 原生 JSON，支持路径查询 |
| **枚举** | ENUM, SET | 固定值集合 |

## 学习路径

1. **[事务](1.事务.md)** - 事务特性（ACID）、隔离级别
2. **[锁](2.锁.md)** - 行锁、表锁、间隙锁、意向锁
3. **[MVCC](3.MVCC.md)** - 多版本并发控制原理
4. **[索引](4.索引.md)** - B+ 树、覆盖索引、联合索引、索引优化
5. **[分库分表与分片](5.分库分表与分片.md)** - 水平拆分、垂直拆分、分片策略
6. **[主从复制](6.主从复制.md)** - 主从状态检查、启停同步、变更主节点
7. **[高频面试题](9.知识点.md)** - 核心知识点回顾
8. **[问题排查](10.问题排查.md)** - 慢 SQL、长事务、死锁排查
9. **[大厂面试题](大厂面试题.md)** - 面试题与答案

## 与其他数据库对比

| 特性 | MySQL | PostgreSQL | SQL Server |
|-----|-------|-----------|------------|
| **许可证** | GPL | PostgreSQL License | 商业软件 |
| **主键自增** | AUTO_INCREMENT | SERIAL / SEQUENCE | IDENTITY |
| **MVCC** | Undo Log | 原生 MVCC | 快照隔离 |
| **JSON 支持** | 原生 JSON（5.7+） | JSON/JSONB 原生 | 通过 NVARCHAR |
| **全文搜索** | 支持 | 支持 | 原生支持 |
| **存储过程** | 支持 | PL/pgSQL | T-SQL |
| **窗口函数** | 8.0+ 支持 | 完整支持 | 完整支持 |
| **扩展性** | 中等 | 极强 | 有限 |

## 参考资源

- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [MySQL 中文文档](https://www.mysqlzh.com/)
- [面试题参考](https://blog.csdn.net/qq_36255346/article/details/138261019)
