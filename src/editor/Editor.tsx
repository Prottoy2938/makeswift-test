import React from "react";
import { createEditor, Node, Transforms, Editor, Text, Range } from "slate";
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
import isUrl from "is-url";

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
  console.log(element);
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

export function SlateEditor(props: EditorProps) {
  const { value, onChange, ...other } = props;
  const editor = React.useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    [],
  );
  const inputRef = React.useRef(null);

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
}

export { Node };

const toggleFormat = (editor: any, format: string) => {
  const isActive = isFormatActive(editor, format);

  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true },
  );
};

const isFormatActive = (editor: any, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n: any) => n[format] === true,
    mode: "highest",
  });
  return !!match;
};

const withLinks = (editor: any) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element: any) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.insertText = (text: string) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data: any) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const wrapLink = (editor: any, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const insertLink = (editor: any, urlLink: string) => {
  console.log(urlLink);
  if (editor.selection) {
    wrapLink(editor, urlLink);
  }
};

const isLinkActive = (editor: any) => {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === "link" });
  return !!link;
};

const unwrapLink = (editor: any) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === "link" });
};
