# Smart Tab Cleaner 🧹

Smart Tab Cleaner is a lightweight Chrome extension that helps you clean up your browser by detecting duplicate tabs, identifying old unused tabs, and organizing all open tabs by category.

If you’re the kind of person who ends up with 40+ tabs open, this extension is for you.

---

## ✨ Features

- 🔁 **Duplicate Tab Detection**
  - Groups tabs by domain
  - Highlights duplicate tabs
  - Option to close all duplicates at once or select specific ones

- ⏳ **Old Tab Detection**
  - Identifies tabs that haven’t been accessed for more than 7 days
  - Uses Chrome’s `lastAccessed` timestamp as a proxy
  - One-click option to close old tabs

- 🗂 **Tab Categorization**
  - Automatically categorizes tabs into:
    - Work
    - Social
    - Entertainment
    - Shopping
    - Education
    - News
    - Other
  - Categories are based on domain keyword matching

- ✅ **Selective Cleanup**
  - Select individual tabs using checkboxes
  - Close only what you want

- 🎨 **Clean UI**
  - Simple popup interface
  - Clear stats showing total tabs, duplicates, and old tabs

---

## 🧠 How It Works

1. Fetches all open tabs using the Chrome Tabs API
2. Groups tabs by domain to detect duplicates
3. Categorizes tabs based on predefined keyword rules
4. Marks tabs as “old” if they haven’t been accessed in 7+ days
5. Renders everything in an interactive popup UI

---

## 🛠 Tech Stack

- JavaScript (Vanilla)
- HTML & CSS
- Chrome Extensions API (Manifest v3)

---

## 📁 Project Structure

```text
.
├── manifest.json
├── popup.html
├── popup.js
├── icon1.png
├── icon2.png
├── icon3.png
