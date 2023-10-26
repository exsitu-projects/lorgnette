export const vscode = (window as any).acquireVsCodeApi() as {
    postMessage(message: any): void;
};

// export const vscode = {postMessage: (m: any) => {}}