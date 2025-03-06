import { CreateEditor, InitializeEditor } from "./editor/editor.ts";

const NianceEditor: { 
  CreateEditor: (defaultCode?: string) => void; 
  InitializeEditor: (editor: HTMLElement) => void; 
} = {
  CreateEditor,
  InitializeEditor,
};

export default NianceEditor;

