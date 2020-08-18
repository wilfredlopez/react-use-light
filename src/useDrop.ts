/* eslint-disable */
import * as React from "react";

const { useState, useMemo, useCallback, useEffect } = React;

export interface DropAreaState {
  over: boolean;
}

export interface DropAreaBond {
  onDragOver: React.DragEventHandler;
  onDragEnter: React.DragEventHandler;
  onDragLeave: React.DragEventHandler;
  onDrop: React.DragEventHandler;
  onPaste: React.ClipboardEventHandler;
}

export interface DropAreaOptions {
  onFiles?: (files: File[], event?) => void;
  onText?: (text: string, event?) => void;
  onUri?: (url: string, event?) => void;
}

const noop = () => {};

const createProcess = (options: DropAreaOptions) =>
  (dataTransfer: DataTransfer, event) => {
    const uri = dataTransfer.getData("text/uri-list");

    if (uri) {
      (options.onUri || noop)(uri, event);
      return;
    }

    if (dataTransfer.files && dataTransfer.files.length) {
      (options.onFiles || noop)(Array.from(dataTransfer.files), event);
      return;
    }

    if (event.clipboardData) {
      const text = event.clipboardData.getData("text");
      (options.onText || noop)(text, event);
      return;
    }
  };

/**
 * 
 * @param options 
 * @param args 
 * @example
 * const Demo = () => {
  const state = useDrop({
    onFiles: files => console.log('files', files),
    onUri: uri => console.log('uri', uri),
    onText: text => console.log('text', text),
  });

  return (
    <div>
      Drop something on the page.
    </div>
  );
};
 */
const useDrop = (options: DropAreaOptions = {}, args = []): DropAreaState => {
  const { onFiles, onText, onUri } = options;
  const [over, setOverRaw] = useState<boolean>(false);
  const setOver = useCallback(setOverRaw, []);
  const process = useMemo(
    () => createProcess(options),
    [onFiles, onText, onUri],
  );

  useEffect(() => {
    const onDragOver = (event) => {
      event.preventDefault();
      setOver(true);
    };

    const onDragEnter = (event) => {
      event.preventDefault();
      setOver(true);
    };

    const onDragLeave = () => {
      setOver(false);
    };

    const onDragExit = () => {
      setOver(false);
    };

    const onDrop = (event) => {
      event.preventDefault();
      setOver(false);
      process(event.dataTransfer, event);
    };

    const onPaste = (event) => {
      process(event.clipboardData, event);
    };

    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragenter", onDragEnter);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("dragexit", onDragExit);
    document.addEventListener("drop", onDrop);
    if (onText) {
      document.addEventListener("paste", onPaste);
    }

    return () => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("dragenter", onDragEnter);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("dragexit", onDragExit);
      document.removeEventListener("drop", onDrop);
      document.removeEventListener("paste", onPaste);
    };
  }, [process, ...args]);

  return { over };
};

export default useDrop;
