export interface ViewLike {
  el?: HTMLElement;
}

export interface ManagerLike {
  render(): ViewLike;
  getView?(): ViewLike;
  addSectors?(sectors: unknown): void;
  addSector?(id: string, opts: unknown): void;
  addProperty?(sectorId: string, property: unknown): void;
  getSectors?(): { reset?(): void } | undefined;
}

export interface CanvasLike {
  getDocument(): Document | null;
}

export interface UndoManagerLike {
  hasUndo(): boolean;
  hasRedo(): boolean;
}

export interface GrapesJSEditor {
  BlockManager: ManagerLike;
  LayerManager: ManagerLike;
  Pages: ManagerLike;
  AssetManager: ManagerLike;
  StyleManager: ManagerLike;
  TraitManager: ManagerLike;
  Styles?: ManagerLike;
  Canvas: CanvasLike;
  UndoManager: UndoManagerLike;
  on(event: string, callback: (...args: unknown[]) => void): void;
  runCommand(command: string): void;
  destroy(): void;
  isLoaded?(): boolean;
  getModel?(): unknown;
}
