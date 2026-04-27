---
title: Linux
description: Linux 系统管理与运维
---

# Linux

Linux 系统管理与运维相关文档。

## 文档列表

- [大厂面试题与实战命令](./大厂面试题.md) - Linux 大厂面试题与实战命令详解

## 常用命令速查

### 文件操作

```bash
ls -la                     # 列出文件详细信息
cd /path/to/dir            # 切换目录
pwd                        # 显示当前目录
mkdir -p /path/to/dir      # 创建目录（包括父目录）
rm -rf /path/to/dir        # 删除目录及其内容
cp -r /src /dest           # 复制目录
mv /src /dest              # 移动或重命名文件
```

### 进程管理

```bash
ps aux                     # 查看所有进程
top                        # 实时查看进程
kill 1234                  # 终止进程
kill -9 1234               # 强制终止进程
```

### 端口管理

```bash
netstat -tlnp              # 查看所有监听的 TCP 端口
lsof -i :80                # 查看端口 80 的占用情况
ss -tlnp | grep :80        # 查看端口 80 的占用情况
```

### 系统监控

```bash
free -h                    # 查看内存使用情况
df -h                      # 查看磁盘使用情况
top                        # 实时查看系统状态
htop                       # 交互式系统监控
```

## 学习资源

- [Linux 命令大全](https://linux.die.net/)
- [Linux 手册页](https://man7.org/linux/man-pages/)
- [Arch Linux Wiki](https://wiki.archlinux.org/)