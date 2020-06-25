import React from "react";
import { createEditor, Node } from "slate";
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";

import { DefaultElement } from "./utils/DefaultElement";
import { Toolbar } from "./utils/Toolbar";
import { withHistory } from "slate-history";
import { insertLink, toggleFormat, withLinks } from "./utils/HelperFunction";

export interface EditorProps {
  value: Node[];
  onChange: (value: Node[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
}

function renderElement(props: RenderElementProps) {
  const {
    attributes,
    children,
    element,
  }: { attributes: any; children: any; element: any } = props;
  switch (element.type) {
    case "link":
      return (
        <a {...attributes} href={element.url}>
          {children}
        </a>
      );
    default:
      return <DefaultElement {...attributes}>{children}</DefaultElement>;
  }
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

export const SlateEditor: React.FC<EditorProps> = (props: EditorProps) => {
  const { value, onChange, ...other } = props;
  const editor = React.useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    [],
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Toolbar
        open={true}
        editor={editor}
        toggleFormat={toggleFormat}
        insertLink={insertLink}
      />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        {...other} //placeholder, autoFocus, spellCheck
      />
    </Slate>
  );
};

export { Node };
