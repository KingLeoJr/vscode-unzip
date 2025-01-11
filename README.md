# Unzip - VS Code Extension

A powerful and lightweight VS Code extension to easily extract zip files directly within the editor. Perfect for developers who want to manage compressed files without leaving their coding environment.

![Banner](images/banner.png)

## Features

- **Extract Zip Files**: Unzip files directly in the VS Code file explorer.
- **Progress Indication**: Visual progress bar for large zip files.
- **Overwrite Options**: Choose to overwrite or skip existing files.
- **Custom Extraction Path**: Select a specific directory for extraction.
- **Refresh Explorer**: Automatically refresh the file explorer after extraction.

## Installation

1. Open **VS Code**.
2. Go to the **Extensions** view by clicking on the Extensions icon in the Activity Bar or pressing `Ctrl+Shift+X`.
3. Search for **"Unzip"**.
4. Click **Install** to add the extension to your VS Code.

## Usage

1. **Right-Click on a `.zip` File**:

   - In the VS Code file explorer, right-click on a `.zip` file.
   - Select **"Unzip"** from the context menu.
2. **Extraction Process**:

   - The files will be extracted to the same directory by default.
   - A popup will allow you to specify a custom extraction path (optional).
3. **Progress Bar**:

   - A progress bar will be shown during extraction.
4. **Completion**:

   - A success message will be displayed, and the file explorer will be refreshed.

## Configuration

You can customize the extension behavior by adding the following settings to your `settings.json` file:

```json
{
  "unzip.defaultExtractionPath": "./extracted",
  "unzip.overwriteExistingFiles": true,
  "unzip.showProgressBar": true
}
```
