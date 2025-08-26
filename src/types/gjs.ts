export interface ManagerView {
  el?: HTMLElement;
}

export interface StyleManager {
  render(): ManagerView;
  getView?(): ManagerView;
}

export interface TraitManager {
  render(): ManagerView;
}

export interface UndoManager {
  hasUndo(): boolean;
  hasRedo(): boolean;
}

export interface GjsEditor {
  StyleManager: StyleManager;
  TraitManager: TraitManager;
  UndoManager: UndoManager;
  Canvas: {
    getDocument(): Document | null;
    getBody?: () => HTMLElement;
    getElement?: () => HTMLElement;
  };
  runCommand(command: string, value?: unknown): void;
  on(event: string, callback: (...args: unknown[]) => void): void;
  isLoaded?(): boolean;
  getModel?(): unknown;
}

export interface GjsReadyDetail {
  editor: GjsEditor;
}

export interface GjsPanelChangeDetail {
  panelId?: string;
  command?: string;
}

export interface GjsShowDrawerDetail {
  panelType: string;
  pagesElement?: HTMLElement;
  layersElement?: HTMLElement;
  panelElement?: HTMLElement;
}

export interface GjsDeviceChangeDetail {
  device: 'desktop' | 'tablet' | 'mobile';
}

export interface GjsPreviewToggleDetail {
  isPreview: boolean;
}
