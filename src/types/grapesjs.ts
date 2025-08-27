export interface ManagerView {
  el: HTMLElement;
}

export interface Manager {
  render(): ManagerView;
  getView?(): ManagerView;
}

export interface GrapesJSEditor {
  StyleManager?: Manager;
  Styles?: Manager;
  TraitManager?: Manager;
  UndoManager: {
    hasUndo(): boolean;
    hasRedo(): boolean;
  };
  Canvas: {
    getDocument(): Document | null;
  };
  runCommand(command: string): void;
  on(event: string, callback: (...args: unknown[]) => void): void;
  isLoaded?(): boolean;
  getModel?(): unknown;
}
