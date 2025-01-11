"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const path = __importStar(require("path"));
function activate(context) {
    // Register the command for unzipping files
    let disposable = vscode.commands.registerCommand('extension.unzip', async (fileUri) => {
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
            const zip = new adm_zip_1.default(zipPath); // Load the zip file
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
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error extracting zip file: ${error.message}`);
            console.error(error);
        }
    });
    // Register the command to the file explorer context menu
    context.subscriptions.push(vscode.commands.registerCommand('extension.unzipFromExplorer', (fileUri) => {
        vscode.commands.executeCommand('extension.unzip', fileUri);
    }));
    // Add the "Unzip" command to the file explorer context menu
    context.subscriptions.push(vscode.commands.registerCommand('extension.addUnzipToContextMenu', () => {
        vscode.commands.executeCommand('setContext', 'unzip.showContextMenu', true);
    }));
}
//# sourceMappingURL=extension.js.map