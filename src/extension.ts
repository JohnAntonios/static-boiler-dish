import * as vscode from "vscode";
import { writeFile } from "fs/promises";
import { cssFileContent, htmlFileContent, jsFileContent } from "./fileContents";

function getCurrentWorkspacePath(): string | null {
  const { workspaceFolders } = vscode.workspace;

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

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.generate",
    async () => {
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
        vscode.window.showInformationMessage("Created all files!");
      }
    }
  );

  context.subscriptions.push(disposable);
}
