const prefix = '_create_global_style';
/**
 * Creates CSS Styles and appends it to the document's head.
 * @param code css to to append to head as <style></style>
 * @example
 * createStyle(`
 *  body{
 *   background: red;
 *  }
 * `)
 * //OR
 *  createStyle({
 *    body: {
 *      backgroundColor: 'red'
 *      }
 *  })
 * @returns id of the style tag.
 */
export function createGlobalStyle(code: string | Record<string, React.CSSProperties>) {
  const styleEl = document.createElement('style');
  const id = prefix + hash(JSON.stringify(code));
  removeGlobalStyle(id);
  let codeString = '';
  if (typeof code === 'string') {
    codeString = code;
  } else {
    codeString = turnToKebab(code);
  }
  const codeEl = document.createTextNode(codeString);
  styleEl.type = 'text/css';
  styleEl.id = id;
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
  return id;
}

/**
 *
 * @param id element id returns by createGlobalStyle
 */
export function removeGlobalStyle(id: string) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
    return true;
  }
  return false;
}

function hash(str: string) {
  let hashText = 5381,
    i = str.length;

  while (i) hashText = (hashText * 33) ^ str.charCodeAt(--i);

  return '_' + (hashText >>> 0).toString(36);
}

const KEBAB_REGEX = /[A-Z]/g;

// const raw = ''
// const pfx = '_'

function turnToKebab(props: Record<string, React.CSSProperties>) {
  let output = '';
  for (let key in props) {
    output += key; //body
    output += '{'; // body{
    const prop = props[key];
    for (let keyofProp in prop) {
      let value = prop[keyofProp as keyof React.CSSProperties];

      if (typeof value === 'number') {
        value = `${value}px`;
      }
      output += declareRule(keyofProp, JSON.stringify(value)); // body{"background-color": "red";
    }
    output += '}'; // body{"background-color": "red";}
  }
  //REPLACE QUOTES ("")
  return replaceQuotes(output); // body{background-color: red;};
}

function replaceQuotes(str: string) {
  return str.replace(/"/gim, '');
}

function kebab(prop: string) {
  return prop.replace(KEBAB_REGEX, '-$&').toLowerCase();
}

function declareRule(key: string, value: string) {
  key = kebab(key);
  return key + ':' + value + ';';
}
