import React from "react";
import { createEditor, Node, Transforms, Editor, Text } from "slate";
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";

import { DefaultElement } from "./elements";
import { Toolbar } from "./Toolbar";

function renderElement(props: RenderElementProps) {
  const { attributes, children } = props;
  return <DefaultElement {...attributes}>{children}</DefaultElement>;
}

function renderLeaf(props: RenderLeafProps) {
  const { attributes, leaf } = props;
  let { children } = props;

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}

export interface EditorProps {
  value: Node[];
  onChange: (value: Node[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
}

export function SlateEditor(props: EditorProps) {
  const { value, onChange, ...other } = props;
  const editor = React.useMemo(() => withReact(createEditor()), []);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Toolbar open={true} editor={editor} toggleFormat={toggleFormat} />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        {...other} //placeholder, autoFocus, spellCheck
      />
    </Slate>
  );
}

export { Node };

const toggleFormat = (editor: any, format: any) => {
  console.log(format);

  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true },
  );
};

const isFormatActive = (editor: any, format: any) => {
  const [match] = Editor.nodes(editor, {
    match: (n: any) => n[format] === true,
    mode: "all",
  });
  return !!match;
};
