import deselectCurrent from "./toggleSelection";

const clipboardToIE11Formatting = {
  "text/plain": "Text",
  "text/html": "Url",
  "default": "Text",
} as const;

const defaultMessage = "Copy to clipboard: #{key}, Enter";

function format(message: string) {
  const copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
  return message.replace(/#{\s*key\s*}/g, copyKey);
}

interface CopyToClipboardOptions {
  debug?: boolean;
  format?: keyof typeof clipboardToIE11Formatting;
  onCopy?: (event: ClipboardEvent["clipboardData"]) => void;
  message?: string;
}

export default function (text: string, options: CopyToClipboardOptions = {}) {
  let debug: boolean,
    message: string,
    reselectPrevious: Function,
    range,
    selection,
    mark,
    success = false;
  if (!options) {
    options = {};
  }
  debug = options.debug || false;
  try {
    reselectPrevious = deselectCurrent();

    range = document.createRange();
    selection = document.getSelection();

    mark = document.createElement("span");
    mark.textContent = text;
    // reset user styles for span element
    mark.style.all = "unset";
    // prevents scrolling to the end of the page
    mark.style.position = "fixed";
    mark.style.top = 0;
    mark.style.clip = "rect(0, 0, 0, 0)";
    // used to preserve spaces and line breaks
    mark.style.whiteSpace = "pre";
    // do not inherit user-select (it may be `none`)
    mark.style.webkitUserSelect = "text";
    mark.style.MozUserSelect = "text";
    mark.style.msUserSelect = "text";
    mark.style.userSelect = "text";
    mark.addEventListener("copy", function (e: ClipboardEvent) {
      e.stopPropagation();
      if (options.format) {
        e.preventDefault();
        if (typeof e.clipboardData === "undefined") { // IE 11
          debug && console.warn("unable to use e.clipboardData");
          debug && console.warn("trying IE specific stuff");
          const clipboardData = window
            //@ts-ignore
            .clipboardData as ClipboardEvent["clipboardData"];

          clipboardData?.clearData();
          let format = clipboardToIE11Formatting[options.format] ||
            clipboardToIE11Formatting["default"];
          clipboardData?.setData(format, text);
        } else { // all other browsers
          e.clipboardData?.clearData();
          e.clipboardData?.setData(options.format, text);
        }
      }
      if (options.onCopy) {
        e.preventDefault();
        options.onCopy(e.clipboardData);
      }
    });

    document.body.appendChild(mark);

    range.selectNodeContents(mark);
    selection.addRange(range);

    let successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("copy command was unsuccessful");
    }
    success = true;
  } catch (err) {
    debug && console.error("unable to copy using execCommand: ", err);
    debug && console.warn("trying IE specific stuff");
    try {
      const clipboardData =
        //@ts-ignore
        (window.clipboardData) as ClipboardEvent["clipboardData"];
      //   window.clipboardData.setData(options.format || "text", text);
      clipboardData?.setData(options.format || "text", text);

      options.onCopy && options.onCopy(clipboardData);
      success = true;
    } catch (err) {
      debug && console.error("unable to copy using clipboardData: ", err);
      debug && console.error("falling back to prompt");
      message = format(options.message ? options.message : defaultMessage);
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == "function") {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }

    //@ts-ignore
    if (typeof reselectPrevious !== "undefined") {
      reselectPrevious();
    }
  }

  return success;
}
