---
type: blog
created: 2023-04-28 00:26:27
updated: 2023-04-28 00:26:27
tags: []
categories: []
status: 未发布
---

### change 和 modify 之间的区别

两者使用方式如下：

```sql
alter table <表名> change <旧列名> <新列名> <类型>

alter table <表名> modify <列名> <类型>
```

区别在于：

* `change`：可以同时修改列名和列的类型
* `modify`：只能用于修改列额类型
