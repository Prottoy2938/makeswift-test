import { Transforms, Editor, Text, Range } from "slate";

export const insertLink = (editor: any, urlLink: string): void => {
  console.log(urlLink);
  if (editor.selection) {
    wrapLink(editor, urlLink);
  }
};

export const isLinkActive = (editor: any): boolean => {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === "link" });
  return !!link;
};

export const unwrapLink = (editor: any): void => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === "link" });
};

export const toggleFormat = (editor: any, format: string): void => {
  const isActive = isFormatActive(editor, format);

  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true },
  );
};

export const isFormatActive = (editor: any, format: string): boolean => {
  const [match] = Editor.nodes(editor, {
    match: (n: any) => n[format] === true,
    mode: "highest",
  });
  return !!match;
};

export const withLinks = (editor: any): any => {
  const { isInline } = editor;
  editor.isInline = (element: any) => {
    return element.type === "link" ? true : isInline(element);
  };
  return editor;
};

export const wrapLink = (editor: any, url: string): void => {
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
