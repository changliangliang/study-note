## File 类

Java 中使用 `File` 来表示文件系统中的一个文件或者目录，它提供了与文件相关的一些方法，如 `isFile` 判断当前文件是普通文件还是目录，`list` 可以列出当前目录下所有文件的文件名。

```java
public static void main(String[] args) {  
    File file = new File("D:/code");  
  
    System.out.println(file.isFile());  
    for (String s : file.list()) {  
  
        System.out.println(s);  
    }  
}
```

还有诸如获取文件大小、文件最后修改时间、文件路径、绝对路径等方法，此处不一一列举。

```java
file.length();  
file.lastModified();  
file.getPath();  
file.getAbsoluteFile();
```

与其他编程语言不同的地方可能在于 Java 中将所有的数据输出数据都看做是流，所有对文件的读写必须通过流来进行，而不是直接对文件进行操作，因此 `File` 没有 `read` 和 `write` 之类的读写方法。

## 输入输出流

Java 将输入输出时的数据抽象成“流”，将流进当前程序的数据叫输入流，将流出当前程序的数据叫输出流，分别对应了 `InputStrean` 和 `OutputStream` 两个接口。下面分别演示了文件输入流和输出流：

```java
FileInputStream fileInputStream = new FileInputStream(new File("./test.txt"));  
int read = fileInputStream.read();  
  
FileOutputStream fileOutputStream = new FileOutputStream(new File("test.txt"));  
fileOutputStream.write("sdsd".getBytes());
```

因为流这样一个概念是由方向的，所有只能从输入流中读取数据，向输出流写入数据。针对不同的数据源，Java 中提供了不同类型的输入输出流：

![](附件/Pasted%20image%2020230121210103.png)

![](附件/Pasted%20image%2020230121210155.png)

## 装饰器

原始的输入输出流功能比较简单，比如没有缓冲功能，每次都是直接从数据源中读取，又比如读到的数据全是字节，需要我们手动转换为需要的类型。针对这种情况，Java 提供了各种功能的装饰器：

![](附件/Pasted%20image%2020230121210852.png)

`DataInputStream` 这个装饰器使得我们能够从流中直接读取基本数据类型，它的使用方法如下，其他的装饰器也大致如此。

```java
DataInputStream dataInputStream = new DataInputStream(fileInputStream);  
dataInputStream.readByte();  
dataInputStream.readInt();
```

同样的也有针对输出流的装饰器：

![](附件/Pasted%20image%2020230121211039.png)

在流的设计上 Java 采用了装饰器模式，这样做的好处是可以自由的组合需要的功能，如想要一个带缓冲区并且能读取基本数据类型的输入流：

```java
DataInputStream dataInputStream = new DataInputStream(new BufferedInputStream(fileInputStream));
```

## 字符输入输出流

在编程过程中通常要处理大量的文件内容，直接使用字节流来操作比较复杂，要处理编解码等问题，所有 Java 中直接提供了针对文本的相关输入输出流。

![](附件/Pasted%20image%2020230121212923.png)

![](附件/Pasted%20image%2020230121213008.png)

使用方法与普通的输入输出流类似，只不读取出的都是字符而已。

```java
FileReader fileReader = new FileReader(new File("test.txt"));  
int read = fileReader.read();
```

## RandomAccessFile

`RandomAccessFile` 是一个比较特殊类，其他的输入输出流只能按顺序读写数据，如果想要的数据在文件中部，那么此时使用 `RandomAccessFile` 比较合适，它的 `seek` 方法可以用来调整当前读写的位置。

```java
RandomAccessFile randomAccessFile = new RandomAccessFile(new File("tes.txt"),"wr");  
randomAccessFile.seek(100);  
randomAccessFile.read();
```

## 标准 IO

标准 IO 的术语来自 Unxi 中“程序所使用的单一信息流”这个概念。标准 IO 可以分为标准输入、标准输出和标准错误，在 Java 中分别对应 `System.in` 、`System.out` 和 `System.err`，下面是我们常用的输出语句，它使用的就是标准输出。

```java
System.out.println("chang")
```

有时候我们希望将文件中的内容作为程序的输入内容，那么就可以使用到 IO 重定向，它可以将标准输入关联到一个文件上, 标准输出和标准错误也有着类似的功能。

```java
System.setIn(new FileInputStream(new File("txt.txt")));
```