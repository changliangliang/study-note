---
type: blog
status: 未发布
created: 2022-12-19 13:30:52
updated: 2022-12-21 16:23:52
tags: 计算机网络
categories:  
---



多个线程操作 socket 的时候是可能出现线程安全问题，如下面图示中的展示的那样，当线程 1 通过 socket 连接向服务器发送信息，这时候线程 2 恰好通过 socket 连接在读取服务端的数据，那么本该由线程 1 接收并处理的信息就被线程 2 读取到了。

![](附件/image/socket连接不安全的原因_image_1.png)

下面使用代码模拟这个过程：​

```java
//服务端代码
try ( ServerSocket serverSocket = new ServerSocket(1996)){

    // 监听连接请求
    Socket socket = serverSocket.accept();

    // 获取请求信息
    InputStream inputStream = socket.getInputStream();
    byte[] bytes = new byte[10234];
    int len = inputStream.read(bytes);

    // 打印请求信息
    System.out.println("收到信息：" + new String(bytes, 0, len));

    // 写回响应信息
    OutputStream outputStream = socket.getOutputStream();
    outputStream.write("服务端返回信息".getBytes());

    Thread.sleep(10000000);
} catch (IOException | InterruptedException e) {
    throw new RuntimeException(e);
}
```

```java
//客户端代码
Socket socket = new Socket("127.0.0.1", 1996);

// 模拟线程1
new Thread(()->{
    try {
        //线程1发送信息
        socket.getOutputStream().write("线程1发送的信息".getBytes());

        // 线程1进行其他操作
        Thread.sleep(5000);

        byte[] bytes = new byte[10234];
        int len = socket.getInputStream().read(bytes);
        System.out.println("线程1收到的信息："+new String(bytes, 0 , len));

    } catch (IOException | InterruptedException e) {
        throw new RuntimeException(e);
    }
}).start();

// 模拟线程2
Thread.sleep(1000);
byte[] bytes = new byte[10234];
int len = socket.getInputStream().read(bytes);
System.out.println("线程2收到的信息："+new String(bytes, 0 , len));
```

服务端的运行结果为：​

![](附件/image/socket连接不安全的原因_image_2.png)

客户端运行结果为：​

![](附件/image/socket连接不安全的原因_image_3.png)

从运行结果中也可以看到，本该由线程 1 接收的信息被线程 2 收到了。​