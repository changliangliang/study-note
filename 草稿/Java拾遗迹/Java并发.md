---
created: 2023-02-18
updated: 2023-04-18
---

## 线程优先级

可以设置每个线程的优先级，程序在执行的过程中会参考设置的优先级，分配给高优先级的线程相对长的执行时间。

```java
Thread.currentThread().setPriority(Thread.MAX_PRIORITY);
```

需要注意的是优先级高不一定在优先级低的线程之前执行，只是才进行线程调度的时候有更大的概率获得时间片，更详细的内容可以参考操作系统线程调度的相关内容。

通常情况下不需要更改线程的优先级，因为不同的系统对优先级有不同的设置，所有在设置优先级的时候尽量使用 Java 提供的这几个。

```java
Thread.MIN_PRIORITY;  
Thread.MAX_PRIORITY;  
Thread.NORM_PRIORITY;
```

## Join 方法

假设有 A 和 B 连个线程，在 A 线程中调用了 `B.join`，那么 A 线程的执行将会暂停，等待 B 线程执行结束，A 线程才会继续执行。

A 调用 B `join` 方法后，如果有其他线程调用了 B 的 `interupt` 方法，`join` 将会抛出异常，所以使用 `join` 时必须进行异常处理：

```java
try {  
    thread.join();  
} catch (InterruptedException e) {  
    throw new RuntimeException(e);  
}
```

## 捕获异常

异常是不可以跨线程捕获的，所以如果在 `run` 方法中可能有异常出现时，那么就需要在 `run` 方法中捕获。或者使用 `Thread` 的 `setUncaughtExceptionHandler` 方法设置异常是的处理器，如下面的代码片段。不过需要注意的是 `run` 方法签名中没有异常，所以如果程序中有可检异常还是需要在 `run` 中使用 `try` 语句处理掉。

```java
public class Main {  
  
    public static void main(String[] args) {  
        Thread thread = new Thread(new Runnable() {  
            @Override  
            public void run() {  
                throw new RuntimeException("run方法异常");  
            }  
        });  
        thread.setUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {  
            @Override  
            public void uncaughtException(Thread t, Throwable e) {  
                System.out.println(e);  
            }  
        });  
  
        thread.start();  
    }  
}
```

## 线程终止

线程在执行完任务时会自然终止，如果希望线程提前终止可以调用 `interrupt` 方法，不过此刻线程并不会立即终止，因为该方法只是标记了当前线程处于终止状态，具体什么时候会终止，需用根据写在任务中的逻辑来判断。

```java
Thread thread = new Thread(new Runnable() {  
    @Override  
    public void run() {  
  
        while (true) {  
            System.out.println("===");  
            // 判断线程是否终止
            if(Thread.currentThread().isInterrupted()) {  
                return;  
            }  
        }  
    }  
});  
  
thread.start();  
  
Thread.sleep(1000);  

// 标记线程终止了
thread.interrupt();
```

如果将 `isInterrupted` 判断去掉，那么线程将永远不会终止。

其他的情况是线程处于阻塞状态时，如果终止线程会发生什么？

- 如果处于 `sleep`、`wait` 等阻塞状态，那么调用终止方法后，会从方法中跳出，并抛出异常，所以调用的时候需要进行异常处理；

	```java
	try {  
	    Thread.sleep(1000);  
	} catch (InterruptedException e) {  
	    throw new RuntimeException(e);  
	}
	
	
	try {  
	    thread.wait();  
	} catch (InterruptedException e) {  
	    throw new RuntimeException(e);  
	}
	```

- 如果阻塞在获取锁或者 `read` 等 IO 时，调用终止方法后不会打断当前阻塞状态。

## Wait 和 notify

`wait` 和 `notify` 是 `Object` 提供的两个方法，它们的作用类似于条件变量，`wait` 用于等待条件达成，`notify` 用于通知条件达成信息, 下面的代码使用这两个方法实现了交替打印 `AB`。

```java
public class Main {  
    private static Object condition = new Object();  
    public static void f() throws InterruptedException {  
  
        while (true) {  
            synchronized (condition) {  
                condition.notify();  
                System.out.println("A");  
                condition.wait();  
  
            }  
        }  
  
  
  
    }  
  
    public static void g() throws InterruptedException {  
        while (true) {  
            synchronized (condition) {  
                condition.notify();  
                System.out.println("B");  
                condition.wait();  
            }  
        }  
    }  
  
    public static void main(String[] args) throws InterruptedException {  
  
        new Thread(new Runnable() {  
            @Override  
            public void run() {  
                try {  
                    g();  
                } catch (InterruptedException e) {  
                    throw new RuntimeException(e);  
                }  
            }  
        }).start();  
        new Thread(new Runnable() {  
            @Override  
            public void run() {  
                try {  
                    f();  
                } catch (InterruptedException e) {  
                    throw new RuntimeException(e);  
                }  
            }  
        }).start();  
        }  
}
```

- 两个方法必须在获取锁后才能调用；
- `wait` 方法会释放当前获取的锁，然后阻塞线程，被唤醒后会重新区获取锁，如果获取失败则重新进入阻塞；
- `wait` 方法有一个带时间参数的重载，阻塞相应的时间后会自动唤醒；
- `notify` 会随机唤醒一个被 `wait` 阻塞的线程；
- `notifyAll` 会唤醒所有被 `wait` 阻塞的线程，但线程唤醒后只有一个可以重新获取锁。

## DelayQueue

`DelayQueue` 中存放的数据为 `Delayed` 类型，每个数据都有一个 `getDelay` 方法，用与获取当前还有多长的时延，只有当时延归 0 的时候，才能将数据从队列中取出，否则线程将会被阻塞。

```java
class Data implements Delayed {  
  
    public Data(int sec) {  
  
        delayTime = TimeUnit.SECONDS.convert(System.currentTimeMillis(), TimeUnit.MILLISECONDS) + sec;  
        System.out.println(delayTime);  
  
    }  
  
    private long delayTime;  
    @Override  
    public long getDelay(TimeUnit unit) {  
        long a = delayTime - TimeUnit.SECONDS.convert(System.currentTimeMillis(), TimeUnit.MILLISECONDS);  
        return a;  
    }  
  
    @Override  
    public int compareTo(Delayed o) {  
  
        return (int) (this.getDelay(null) - o.getDelay(null));  
    }  
}  
  
public class Main {  
  
    public static void main(String[] args) {  
  
        DelayQueue<Data> datas = new DelayQueue<>();  
  
        new Thread(new Runnable() {  
            @Override  
            public void run() {  
                for(int i = 0;i < 10; i++) {  
                    datas.put(new Data(i));  
                }  
            }  
        }).start();  
  
        new Thread(new Runnable() {  
            @Override  
            public void run() {  
                for(int i = 0;i < 10; i++) {  
                    Data poll = null;  
                    try {  
                        poll = datas.take();  
                    } catch (InterruptedException e) {  
                        throw new RuntimeException(e);  
                    }  
                    System.out.println(poll);  
  
  
                }  
            }  
        }).start();  
  
  
    }  
}
```

## Exchanger

` Exchanger` 用于两个线程之间的数据交换，`exchange` 方法参数为传递的数据，该方法调用后会阻塞当前线程，指导其他线程调用了该方法。下面的例子中线程 A 会传递 `A` 给 B，同样的线程 B 会传递 `B` 给 A。

```java
public class Main {  
  
    public static void main(String[] args) throws InterruptedException {  
        Exchanger<String> exchanger = new Exchanger<>();  

		// 线程A
        new Thread(new Runnable() {  
            @Override  
            public void run() {  
                while (true) {  
                    String a = null;  
                    try {  
                        Thread.sleep(1000);  
                        a = exchanger.exchange("A");  
                    } catch (InterruptedException e) {  
                        throw new RuntimeException(e);  
                    }  
                    System.out.println(a);  
                }  
            }  
        }).start();  
		// 线程B
        while (true) {  
            String a = null;  
            try {  
                a = exchanger.exchange("B");  
            } catch (InterruptedException e) {  
                throw new RuntimeException(e);  
            }  
            System.out.println(a);  
        }  
    }  
}
```
