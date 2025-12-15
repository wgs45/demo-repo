## 🌟 What the professor wants (decoded)

You must:

1. **Set up an FTP service on Linux**
2. **Create a local user** who can log in via FTP
3. **Create a text file** with:
   - Your **student ID**
   - Your **name**

4. **Upload the file using FTP**
5. Provide **3 screenshots**:
   - Successful FTP login
   - `put` + `ls` showing the uploaded file
   - Content of the `.txt` file

That’s it. No theory trap. Just execution 💻✨

---

# 🧙‍♀️ Step-by-Step Guide (Beginner-Friendly)

I’ll assume:

- Ubuntu / Debian-based Linux
- You have **sudo** access

If you’re using VM (VirtualBox), this still works.

---

## 🧩 Step 1 — Install FTP Server (vsftpd)

Open **Terminal**:

```bash
sudo apt update
sudo apt install vsftpd
```

Check if it’s running:

```bash
sudo systemctl status vsftpd
```

You should see **“active (running)”** 🌱

📸 **Screenshot #0 (optional, for confidence)**
Terminal showing `vsftpd` running.

---

## 👤 Step 2 — Create a Local FTP User

Create a new user (example: `ftpuser`):

```bash
sudo adduser ftpuser
```

You’ll be asked:

- Password (remember it!)
- Name → can enter your real name or press Enter

📌 This user is the one you’ll log in with via FTP.

---

## 📁 Step 3 — Prepare FTP Directory

Switch to the user:

```bash
su - ftpuser
```

Create a directory for FTP files:

```bash
mkdir ftp_upload
cd ftp_upload
```

---

## 📝 Step 4 — Create the Required Text File

Create the file:

```bash
nano student_info.txt
```

Inside the file, type (example):

```
Student ID: 110123456
Name: Your Full Name
```

Save:

- `Ctrl + O` → Enter
- `Ctrl + X`

Verify:

```bash
cat student_info.txt
```

📸 **Screenshot #3 — Content of the .txt file**
This `cat` output is exactly what your professor wants.

---

## 🔐 Step 5 — Configure FTP for Local Login

Edit vsftpd config:

```bash
sudo nano /etc/vsftpd.conf
```

Make sure these lines are set like this:

```ini
local_enable=YES
write_enable=YES
```

(Optional but recommended)
Uncomment or add:

```ini
chroot_local_user=YES
```

Save and restart FTP:

```bash
sudo systemctl restart vsftpd
```

---

## 🌐 Step 6 — Log in via FTP (THE IMPORTANT PART)

From **another terminal** (or same machine):

```bash
ftp localhost
```

When prompted:

```text
Name: ftpuser
Password: (your password)
```

If you see:

```text
230 Login successful.
```

✨ YOU DID IT ✨

📸 **Screenshot #1 — Successful FTP Login**
Capture the terminal showing `230 Login successful`.

---

## ⬆️ Step 7 — Upload the File via FTP

Inside the FTP prompt:

```ftp
cd ftp_upload
put student_info.txt
ls
```

You should see:

```text
student_info.txt
```

📸 **Screenshot #2 — put + ls**
Must show:

- `put student_info.txt`
- `ls`
- File listed

Exit FTP:

```ftp
bye
```

---

# 📦 What You Submit (Checklist)

✔ Screenshot: FTP login success
✔ Screenshot: `put` + `ls`
✔ Screenshot: `cat student_info.txt` output

Perfect score 💯

---

## 🌸 Key Takeaways (So it sticks)

- **vsftpd** = FTP server
- **local_enable** allows Linux users to log in
- **put** uploads files
- **ls** proves upload worked
- Screenshots = evidence, not magic
