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
  toggleFormat: (editor: any, format: any) => void;
}

export function Toolbar(props: ToolbarProps) {
  const [link, setLink] = React.useState("");
  const s = useStyles();
  const { editor, open, toggleFormat } = props;
  return (
    <Popper className={s.root} open={open}>
      {!link ? (
        /* Formatting controls */
        <ButtonGroup variant="text" color="primary">
          <IconButton
            onMouseDown={(event) => {
              event.preventDefault();
              toggleFormat(editor, "bold");
            }}
            className={s.button}
            size="small"
          >
            <FormatBold fontSize="small" />
          </IconButton>
          <IconButton
            onMouseDown={(event) => {
              event.preventDefault();
              toggleFormat(editor, "italic");
            }}
            className={s.button}
            size="small"
          >
            <FormatItalic fontSize="small" />
          </IconButton>
          <IconButton
            onMouseDown={(event) => {
              event.preventDefault();
              toggleFormat(editor, "underlined");
            }}
            className={s.button}
            size="small"
          >
            <FormatUnderlined fontSize="small" />
          </IconButton>
          <IconButton
            className={s.button}
            size="small"
            onClick={() => setLink("")}
          >
            <Link fontSize="small" />
          </IconButton>
        </ButtonGroup>
      ) : (
        /* URL input field */
        <form onSubmit={(x) => x.preventDefault()}>
          <Input
            className={s.input}
            type="url"
            fullWidth
            value={link}
            onChange={(x) => setLink(x.target.value)}
            endAdornment={
              <Close
                className={s.close}
                fontSize="small"
                onClick={() => setLink("")}
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
