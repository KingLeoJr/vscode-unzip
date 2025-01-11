import * as vscode from 'vscode';
import AdmZip from 'adm-zip';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // Register the command for unzipping files
  let disposable = vscode.commands.registerCommand('extension.unzip', async (fileUri: vscode.Uri) => {
    // If no file is selected, prompt the user to select one
    if (!fileUri) {
      const selectedFiles = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: 'Unzip',
        filters: {
          'Zip Files': ['zip']
        }
      });

      if (!selectedFiles || selectedFiles.length === 0) {
        return; // User cancelled
      }

      fileUri = selectedFiles[0];
    }

    const zipPath = fileUri.fsPath;
    const defaultExtractPath = zipPath.substring(0, zipPath.lastIndexOf('.'));

    // Ask the user if they want to choose a custom extraction path
    const extractPath = await vscode.window.showInputBox({
      prompt: 'Enter the extraction path (leave blank to extract to the same directory):',
      value: defaultExtractPath
    }) || defaultExtractPath;

    try {
      const zip = new AdmZip(zipPath); // Load the zip file
      const entries = zip.getEntries();
      let extractedCount = 0;

      // Show a progress bar during extraction
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Extracting Zip File...',
        cancellable: false
      }, async (progress) => {
        for (const entry of entries) {
          const entryPath = path.join(extractPath, entry.entryName);
          if (entry.isDirectory) {
            continue; // Skip directories
          }

          progress.report({ message: `Extracting ${entry.entryName}` });
          zip.extractEntryTo(entry.entryName, extractPath, false, true); // Extract the file
          extractedCount++;
        }
      });

      // Show a success message
      vscode.window.showInformationMessage(`Successfully extracted ${extractedCount} files to ${extractPath}!`);
      vscode.commands.executeCommand('workbench.action.files.refreshFilesExplorer'); // Refresh the file explorer

    } catch (error: any) {
      vscode.window.showErrorMessage(`Error extracting zip file: ${error.message}`);
      console.error(error);
    }
  });

  // Register the command to the file explorer context menu
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.unzipFromExplorer', (fileUri: vscode.Uri) => {
      vscode.commands.executeCommand('extension.unzip', fileUri);
    })
  );

  // Add the "Unzip" command to the file explorer context menu
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.addUnzipToContextMenu', () => {
      vscode.commands.executeCommand('setContext', 'unzip.showContextMenu', true);
    })
  );
}