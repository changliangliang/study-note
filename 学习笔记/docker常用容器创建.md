---
created: 2023-04-18
updated: 2023-04-18
---


### MySQL 容器创建

需用通过 `-e` 命令传递 `root` 用户的初始密码。

```bash
docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```

