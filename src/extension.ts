// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { cssFileContent, htmlFileContent, jsFileContent } from "./fileContents";
import { writeFile } from "fs/promises";

function getCurrentWorkspacePath(): string | null {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    return null;
  }

  const [
    {
      uri: { fsPath },
    },
  ] = workspaceFolders;

  return fsPath;
}

async function createFileInWorkspace(
  workspacePath: string,
  name: string,
  content: string
): Promise<void> {
  writeFile(workspacePath + "/" + name, content);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "extension.generate",
    async () => {
      // The code you place here will be executed every time your command is executed
      const workspacePath = getCurrentWorkspacePath();

      if (!workspacePath) {
        vscode.window.showErrorMessage(
          "Please ensure you have opened a folder."
        );
        return;
      }

      try {
        await createFileInWorkspace(
          workspacePath,
          "index.html",
          htmlFileContent
        );
        await createFileInWorkspace(
          workspacePath,
          "styles.css",
          cssFileContent
        );
        await createFileInWorkspace(workspacePath, "app.js", jsFileContent);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Whoopsie an error has occurred! ${error}`
        );
      } finally {
        vscode.window.showInformationMessage(
          "Created all files. Enjoy your day! 😃"
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
