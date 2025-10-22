# Ubuntu Experiment Guide: Zombie and Orphan Process

## Learning Objectives

1. Understand the cause and characteristics of a **Zombie Process**.
2. Understand the cause and characteristics of an **Orphan Process**.
3. Observe both processes through programs and commands on Ubuntu, and analyze their impact on the system.

---

## Part A: Zombie Process

### 1. Write a C program `zombie.c`

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();
    if (pid == 0) {
        // Child process
        printf("Child process exiting...\n");
        exit(0);
    } else {
        // Parent process
        printf("Parent sleeping, PID=%d\n", getpid());
        sleep(60);  // Intentionally not calling wait
    }
    return 0;
}
```

---

### 2. Compile and execute

```bash
gcc zombie.c -o zombie
./zombie &
ps -l | grep zombie
```

---

### 3. Observe the child process state — it should be **Z (zombie)**

#### Discussion Questions

- Why does a **zombie process** exist?
- If a large number of zombie processes appear, what kind of problems might occur in the system?

---

## Part B: Orphan Process

### 1. Write a C program `orphan.c`

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();
    if (pid == 0) {
        // Child process
        while (1) {
            printf("Child PID=%d, Parent PID=%d\n", getpid(), getppid());
            sleep(2);
        }
    } else {
        // Parent process exits immediately
        printf("Parent exiting, PID=%d\n", getpid());
        exit(0);
    }
    return 0;
}
```

---

### 2. Compile and execute

```bash
gcc orphan.c -o orphan
./orphan
```

---

### 3. Observe the child process’s **Parent PID**

After the parent process exits, the child process will be adopted by **init/systemd**.

#### Discussion Questions

- Why is an **orphan process** adopted by **init/systemd**?
- What are the benefits of this design?

---

## Submission Content

1. Submit the `zombie.c` and `orphan.c` source code files.
2. Submit experiment screenshots (including results from `ps` or `htop` observations).
3. Write a short report answering the following questions:
   - What are the differences between a **Zombie Process** and an **Orphan Process**?
   - How do these two types of processes affect system resources?
   - Why is the operating system designed this way?

---

## Report and Discussion

### 1. Difference Between Zombie Process and Orphan Process

| Type               | Description                                                                   | Cause                                                                         | Parent Process              | Child Process                                 |
| ------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------- | --------------------------------------------- |
| **Zombie Process** | A process that has finished executing but still remains in the process table. | The parent process did **not call `wait()`** to read the child's exit status. | Still alive (did not wait). | Finished execution, marked as **Z (Zombie)**. |
| **Orphan Process** | A process whose parent has already terminated while it is still running.      | The **parent process exits** before the child process finishes.               | Terminated.                 | Still running, adopted by **init/systemd**.   |

In short:

- A **zombie** process has _finished_ but still lingers in the system because the parent hasn’t cleaned it up.
- An **orphan** process is still _running_, but its parent has gone, so the system adopts it.

---

### 2. Impact on System Resources

- **Zombie Process:**
  - It still occupies an entry in the process table (PID and exit status remain).
  - If many zombie processes accumulate, the process table can fill up — leading to **no new processes** being able to start.
  - Normally harmless if only a few exist temporarily, but too many can cause **resource exhaustion** or **system instability**.

- **Orphan Process:**
  - It doesn’t waste much system resource, since it is properly managed by **init/systemd**.
  - The system ensures it gets a new parent, so its termination status will be handled correctly.
  - Therefore, orphan processes **don’t harm** the system and are automatically cleaned up when they finish.

---

### 3. Why the Operating System Is Designed This Way

- **For Zombie Processes:**
  - When a child finishes, the OS keeps its exit status so that the parent can call `wait()` to read it.
  - This mechanism allows parents to know whether their children succeeded or failed.
  - Only after the parent collects the status will the OS remove the process entry from memory.
  - Thus, zombies exist as a **temporary state** — a signal that “the parent hasn’t collected me yet.”

- **For Orphan Processes:**
  - The OS automatically reassigns orphans to **init/systemd**.
  - This ensures every process always has a valid parent — preventing untracked processes.
  - `init/systemd` will eventually call `wait()` on them, cleaning them up properly.
  - This design keeps the process hierarchy consistent and avoids zombie accumulation.

---

### 4. Summary

| Concept    | Still Running? | Parent Alive? | Cleaned By            | System Impact            |
| ---------- | -------------- | ------------- | --------------------- | ------------------------ |
| **Zombie** | ❌ No          | ✅ Yes        | Parent (via `wait()`) | Uses process table space |
| **Orphan** | ✅ Yes         | ❌ No         | `init` / `systemd`    | Minimal impact           |

---

### 5. Additional Notes

- You can check zombie processes using:

  ```bash
  ps aux | grep Z
  ```

- You can check orphan processes (adopted by systemd) by observing `PPID=1`:

  ```bash
  ps -ef | grep orphan
  ```

- To prevent zombies in programs, always use:

  ```c
  wait(NULL);
  ```

  or handle signals like `SIGCHLD` properly.
