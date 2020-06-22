import React from "react";
import {
  Popper,
  PopperProps,
  ButtonGroup,
  IconButton,
  Input,
} from "@material-ui/core";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Link,
  Close,
  EditRounded,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.common.black,
  },
  button: {
    color: theme.palette.common.white,
    opacity: 0.75,
    "&:hover": {
      opacity: 1,
    },
    paddingTop: 8,
    paddingBottom: 8,
  },
  input: {
    color: theme.palette.common.white,
    padding: theme.spacing(0.25, 1),
  },
  close: {
    opacity: 0.75,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  },
}));

export interface ToolbarProps extends Omit<PopperProps, "children"> {
  editor: any;
  toggleFormat: (editor: any, format: string) => void;
  insertLink: (editor: any, urlLink: string) => void;
}

export function Toolbar(props: ToolbarProps) {
  const [link, setLink] = React.useState(false);
  const [urlLink, setUrlLink] = React.useState("");
  //capturing text selection for `add url feature`
  const [captureSelection, setCPSelection] = React.useState([]);
  const s = useStyles();
  const { editor, open, toggleFormat, insertLink } = props;

  const handleMouseDown = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    format: string,
  ) => {
    event.preventDefault();
    toggleFormat(editor, format);
  };

  const handleUrlSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    urlLink: string,
  ) => {
    e.preventDefault();
    editor.selection = captureSelection;
    if (!urlLink) return;
    insertLink(editor, urlLink);
  };

  return (
    <Popper className={s.root} open={open}>
      {!link ? (
        /* Formatting controls */
        <ButtonGroup variant="text" color="primary">
          <IconButton
            onMouseDown={(event) => handleMouseDown(event, "bold")}
            className={s.button}
            size="small"
          >
            <FormatBold fontSize="small" />
          </IconButton>
          <IconButton
            onMouseDown={(event) => handleMouseDown(event, "italic")}
            className={s.button}
            size="small"
          >
            <FormatItalic fontSize="small" />
          </IconButton>
          <IconButton
            onMouseDown={(event) => handleMouseDown(event, "underlined")}
            className={s.button}
            size="small"
          >
            <FormatUnderlined fontSize="small" />
          </IconButton>
          <IconButton
            className={s.button}
            size="small"
            onClick={() => {
              setCPSelection(editor.selection);
              setLink(true);
            }}
          >
            <Link fontSize="small" />
          </IconButton>
        </ButtonGroup>
      ) : (
        /* URL input field */
        <form onSubmit={(e) => handleUrlSubmit(e, urlLink)}>
          <Input
            className={s.input}
            type="url"
            fullWidth
            value={urlLink}
            onChange={(x) => setUrlLink(x.target.value)}
            endAdornment={
              <Close
                className={s.close}
                fontSize="small"
                onClick={() => setLink(false)}
              />
            }
            placeholder="https://"
            disableUnderline
            autoFocus
          />
        </form>
      )}
    </Popper>
  );
}
