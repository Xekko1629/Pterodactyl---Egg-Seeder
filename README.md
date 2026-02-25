# Pterodactyl Egg Auto-Importer 🥚🚀

A powerful automation script built with **Puppeteer** to bulk-import game eggs into your Pterodactyl Panel. Since the panel doesn't natively support mass imports, this tool simulates the administrative workflow to save you hours of manual clicking.

---

## ✨ Features

* **Automated Nest Creation**: Automatically creates a new Nest for each game group defined.
* **Bulk Egg Upload**: Iterates through a local repository of JSON eggs and injects them into the panel.
* **Select2 Integration**: Uses custom scripts to handle the complex dropdowns (Select2) used in the Pterodactyl admin UI.
* **Visual Feedback**: Colorful console logs to track the progress and status of each import.

---

## 🛠️ Prerequisites

* **Node.js** (v18 or higher recommended)
* **npm** or **yarn**
* A Pterodactyl Panel with **Admin access**.

---

## ✅ Tested Panel Versions

This tool has been tested and confirmed working with the following Pterodactyl Panel versions:

* **1.12.1** ✓

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/Xekko1629/Pterodactyl---Egg-Seeder](https://github.com/Xekko1629/Pterodactyl---Egg-Seeder)
cd Pterodactyl---Egg-Seeder

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
PANEL_URL=[https://your-panel-url.com](https://your-panel-url.com)
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password

```

> ⚠️ **Important:** Never commit your `.env` file to a public repository! Ensure it is listed in your `.gitignore`.

### 4. Prepare your Eggs

1. Place your egg JSON files in a folder (default: `./game-eggs`).
2. Configure your `eggs.json` to map your games to their respective files:

```json
{
  "Minecraft": ["minecraft/paper.json", "minecraft/purpur.json"],
  "Rust": ["rust/rust.json"]
}

```

### 5. Run the Script

```bash
node index.js

```

---

## ⚙️ How it Works

The script follows a 3-step logic for every entry in your `eggs.json`:

1. **Login**: Authenticates into your panel using the provided admin credentials.
2. **Nest Setup**: Navigates to the Nest creation page and sets up a new Nest based on your category name.
3. **Egg Injection**: Opens the "Import Egg" modal, forces the selection of the correct Nest via jQuery triggers (to bypass Select2 limitations), and uploads the JSON file.

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated! Here's how you can help improve this project:

### Adding New Eggs

1. **Fork the repository** and create a new branch for your contribution
2. Add your egg JSON files in the appropriate game folder structure
3. Update the `eggs.json` file to include your new eggs
4. Test the import process with your additions
5. Submit a **Pull Request** with a clear description of what eggs you've added

### Updating for Panel Versions

If you've tested this tool with a newer version of Pterodactyl Panel:

1. Test the script thoroughly with the new panel version
2. Update the **"Tested Panel Versions"** section in this README
3. If changes to the code were needed, document them clearly in your PR
4. Submit a Pull Request with details about the panel version and any modifications made

### General Guidelines

* Follow the existing code style and structure
* Test your changes before submitting
* Keep egg JSON files properly formatted
* Update documentation when adding new features
* Report bugs by opening an Issue with detailed reproduction steps

Every contribution, whether it's a single egg or a major feature, helps make this tool better for everyone!

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

## ⚠️ Disclaimer

This tool is **not** an official Pterodactyl software. It uses browser automation to interact with the UI. Use it at your own risk. Always back up your database before performing bulk operations on your panel.