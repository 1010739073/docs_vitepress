---
title: SQL Server
description: Microsoft SQL Server 数据库学习笔记
---

# SQL Server

SQL Server 是 Microsoft 公司开发的关系型数据库管理系统，广泛应用于企业级应用开发。本系列文档将详细介绍 SQL Server 的核心概念、技术特性和最佳实践。

## SQL Server 特点

| 特性 | 说明 |
|-----|------|
| **高性能** | 优化的查询引擎，支持列存储索引，适合大规模数据分析 |
| **高可用** | 支持 AlwaysOn、数据库镜像、复制等多种高可用方案 |
| **安全性** | 集成 Windows 身份验证，支持行级安全、透明数据加密 |
| **可扩展性** | 支持分区表、内存优化表，易于扩展 |
| **商业智能** | 集成 SSAS、SSIS、SSRS，提供完整的 BI 解决方案 |
| **云服务** | Azure SQL Database 提供托管的云数据库服务 |

## 数据类型概览

| 类别 | 数据类型 | 说明 |
|-----|---------|------|
| **整数类型** | TINYINT, SMALLINT, INT, BIGINT | 不同范围的整型数据 |
| **小数类型** | DECIMAL, NUMERIC, FLOAT, REAL | 精确和近似的小数 |
| **字符串类型** | CHAR, VARCHAR, NCHAR, NVARCHAR | 定长和变长字符串 |
| **日期时间** | DATE, TIME, DATETIME, DATETIME2, DATETIMEOFFSET | 日期和时间数据 |
| **二进制** | BINARY, VARBINARY | 二进制数据 |
| **布尔值** | BIT | 布尔类型（0 或 1） |
| **XML** | XML | XML 数据 |
| **JSON** | JSON（通过 NVARCHAR 存储） | JSON 数据 |
| **其他** | UNIQUEIDENTIFIER, MONEY, GEOGRAPHY | 特殊用途类型 |

## 与其他数据库对比

| 特性 | SQL Server | MySQL | PostgreSQL |
|-----|-----------|-------|------------|
| **许可证** | 商业软件 | GPL | PostgreSQL License |
| **主键自增** | IDENTITY | AUTO_INCREMENT | SERIAL / SEQUENCE |
| **字符串区分大小写** | 默认不区分 | 可配置 | 默认区分 |
| **窗口函数** | 完整支持 | 支持 | 支持 |
| **JSON 支持** | 通过 NVARCHAR | 原生 JSON | JSON/JSONB 原生支持 |
| **存储过程** | T-SQL | 支持 | PL/pgSQL |
| **全文搜索** | 原生支持 | 支持 | 支持 |
| **索引类型** | B-tree, 列存储, 全文, 空间 | B-tree, 全文, 空间 | B-tree, Hash, GiST, GIN 等 |
| **MVCC** | 快照隔离 | 基于锁 | 原生 MVCC |

## 学习路径

1. **[基础入门](1.基础入门.md)** - 安装配置、基本操作
2. **[索引与性能](2.索引与性能.md)** - 索引原理、查询优化
3. **[事务与并发](3.事务与并发.md)** - 事务隔离、锁机制
4. **[存储过程与函数](4.存储过程与函数.md)** - T-SQL 编程
5. **[备份与恢复](5.备份与恢复.md)** - 数据保护、高可用
6. **[常见问题处理](6.常见问题处理.md)** - 问题排查、故障处理
7. **[知识点总结](9.知识点.md)** - 核心知识点回顾
8. **[大厂面试题](大厂面试题.md)** - 面试题与答案

## 适用场景

SQL Server 特别适合以下场景：

- **企业级应用**：需要高可用性、强安全性的企业应用
- **数据仓库**：大规模数据分析和报表
- **Windows 环境**：与 Windows 生态深度集成
- **商业智能**：需要完整的 BI 解决方案
- **混合云部署**：本地和云端无缝迁移

## 参考资源

- [SQL Server 官方文档](https://docs.microsoft.com/en-us/sql/)
- [Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/)
- [SQL Server 博客](https://techcommunity.microsoft.com/t5/sql-server/bg-p/SQLServer)