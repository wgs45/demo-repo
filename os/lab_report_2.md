## 🌿 Overview — What This Lab Is Really About

This lab is meant to help you **see how user-space programs (like your C code)** communicate with the **Linux kernel** using **system calls** such as `write()`, `read()`, `fork()`, etc.
You’ll use a tool called **`strace`** that _traces system calls_ — it shows what your program actually asks the kernel to do.

---

## 🧩 Step-by-Step Guide

### 🧭 Part A: Observing System Calls with `strace`

1. **Create the file** `hello.c`:

   ```c
   #include <stdio.h>
   int main() {
       printf("Hello, syscalls!\n");
       return 0;
   }
   ```

2. **Compile and run it:**

   ```bash
   gcc hello.c -o hello
   ./hello
   ```

   You’ll just see:

   ```
   Hello, syscalls!
   ```

3. **Trace it using `strace`:**

   ```bash
   strace ./hello
   ```

4. **Observe the output:**
   Somewhere inside, you’ll find something like:

   ```
   write(1, "Hello, syscalls!\n", 17) = 17
   ```

   🧠 That means `printf()` internally called the **`write()` system call** to output text to file descriptor 1 (standard output).

📝 **In your experimental log**, note:

- The program uses `write()` through `printf()`.
- File descriptor `1` means stdout.
- The kernel performs the actual output operation.

---

### 📂 Part B: File I/O

Here, you’ll compare **two programs**:

1. One uses **system calls directly**
2. The other uses **the C standard I/O library**

---

#### 🔹 fileio_syscall.c

```c
#include <fcntl.h>
#include <unistd.h>

int main() {
    int fd = open("test.txt", O_CREAT | O_WRONLY, 0644);
    write(fd, "Hello, fileio_syscall!\n", 24);
    close(fd);
    return 0;
}
```

**Run:**

```bash
gcc fileio_syscall.c -o fileio_syscall
strace -o trace_syscall.txt ./fileio_syscall
```

---

#### 🔹 fileio_stdio.c

```c
#include <stdio.h>

int main() {
    FILE *f = fopen("test.txt", "w");
    fprintf(f, "Hello, fileio_stdio!\n");
    fclose(f);
    return 0;
}
```

**Run:**

```bash
gcc fileio_stdio.c -o fileio_stdio
strace -o trace_stdio.txt ./fileio_stdio
```

---

**Compare outputs:**

- `trace_syscall.txt` will show direct calls:
  `open`, `write`, `close`
- `trace_stdio.txt` will show:
  `fopen`, `fwrite`, `fclose` → but _underneath_, you’ll see the same system calls (`open`, `write`, `close`) — they just happen later because of buffering.

📝 **In your log**, write something like:

> Both stdio and syscall perform similar operations, but stdio adds buffering and higher-level abstraction on top of system calls.

---

### 👨‍👦 Part C: Process-related System Calls

#### 🔹 proc_syscall.c

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    printf("Parent PID=%d\n", getpid());
    pid_t pid = fork();

    if (pid == 0) {
        printf("Child PID=%d, PPID=%d\n", getpid(), getppid());
        execlp("echo", "echo", "hello-from-child", NULL);
    } else {
        int status;
        waitpid(pid, &status, 0);
    }
    return 0;
}
```

**Run:**

```bash
gcc proc_syscall.c -o proc_syscall
strace -f -o trace_proc.txt ./proc_syscall
```

🧠 Here’s what happens:

- Parent calls `fork()`
- Child calls `execve()` (to run `echo`)
- Parent calls `waitpid()` to wait for the child

📝 **In your log:**

> The parent process creates a child using `fork()`.
> The child replaces itself with the `echo` program via `execve()`.
> The parent waits for the child to finish using `waitpid()`.

---

### ⚙️ Part D: Directly Using `syscall()`

You can call system calls _manually_ using `syscall()`.

#### Example

```c
#include <stdio.h>
#include <sys/syscall.h>
#include <unistd.h>

int main() {
    long tid = syscall(SYS_gettid);
    printf("Thread ID (via syscall) = %ld\n", tid);
    printf("Process ID (via getpid) = %d\n", getpid());
    return 0;
}
```

🧠 Difference:

- `getpid()` is a C library wrapper.
- `syscall(SYS_gettid)` directly calls the kernel function for thread ID.
- `getpid()` may return a cached or slightly different value if threads are involved.

📝 **In your log:**

> `getpid()` is a wrapper provided by libc, while `syscall(SYS_gettid)` invokes the kernel directly without libc’s abstraction.

---

## 📖 Summary Table for Your Report (Optional)

| Experiment          | Observation            | Key System Calls              |
| ------------------- | ---------------------- | ----------------------------- |
| hello.c             | printf → write(1, …)   | write                         |
| fileio_syscall.c    | Direct I/O             | open, write, close            |
| fileio_stdio.c      | Buffered I/O via stdio | open, write, close (indirect) |
| proc_syscall.c      | Process management     | fork, execve, waitpid         |
| syscall(SYS_gettid) | Direct kernel call     | syscall                       |

---

## ✨ Tips

- You can open `.txt` traces with `cat trace_syscall.txt | less`
- Use `man 2 write`, `man 2 fork`, etc. to read about each syscall
- Write a short summary paragraph for each part (that’s what your teacher probably expects)
