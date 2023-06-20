---
标题: "基于token的登陆验证机制 - 程序员自由之路 - 博客园"
创建时间: 2023-05-08 16:26
笔记ID: H837H29
---

## 基于token的登陆验证机制 - 程序员自由之路 - 博客园 
 #五彩插件 2023-05-08 16:26 [原文](https://www.cnblogs.com/54chensongxia/p/13491214.html)

## 页面笔记
%%begin pagenote%%

%%end pagenote%%

## 划线列表
%%begin highlights%%
> <font color="#FFC7BA">█</font> public static String token (String username,String password){

        String token = "";
        try {
            //过期时间
            Date date = new Date(System.currentTimeMillis()+EXPIRE_DATE);
            //秘钥及加密算法
            Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
            //设置头部信息
%%end highlights%%

## 其他

