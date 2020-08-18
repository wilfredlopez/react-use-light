export class KeyCombo {
  sourceStr: string;
  subCombos: Array<string[]>;
  keyNames: string[];

  comboDeliminator = ">";
  keyDeliminator = "+";
  constructor(keyComboStr) {
    this.sourceStr = keyComboStr;
    this.subCombos = this.parseComboStr(keyComboStr);
    this.keyNames = this.subCombos.reduce(
      (memo, nextSubCombo) => memo.concat(nextSubCombo),
      [],
    );
  }

  check(pressedKeyNames: string[]) {
    let startingKeyNameIndex = 0;
    for (let i = 0; i < this.subCombos.length; i += 1) {
      startingKeyNameIndex = this._checkSubCombo(
        this.subCombos[i],
        startingKeyNameIndex,
        pressedKeyNames,
      );
      if (startingKeyNameIndex === -1) return false;
    }
    return true;
  }

  isEqual(otherKeyCombo: string | KeyCombo) {
    if (
      !otherKeyCombo ||
      typeof otherKeyCombo !== "string" &&
        typeof otherKeyCombo !== "object"
    ) {
      return false;
    }

    if (typeof otherKeyCombo === "string") {
      otherKeyCombo = new KeyCombo(otherKeyCombo);
    }

    if (this.subCombos.length !== otherKeyCombo.subCombos.length) {
      return false;
    }
    for (let i = 0; i < this.subCombos.length; i += 1) {
      if (this.subCombos[i].length !== otherKeyCombo.subCombos[i].length) {
        return false;
      }
    }

    for (let i = 0; i < this.subCombos.length; i += 1) {
      const subCombo = this.subCombos[i];
      const otherSubCombo = otherKeyCombo.subCombos[i].slice(0);

      for (let j = 0; j < subCombo.length; j += 1) {
        const keyName = subCombo[j];
        const index = otherSubCombo.indexOf(keyName);

        if (index > -1) {
          otherSubCombo.splice(index, 1);
        }
      }
      if (otherSubCombo.length !== 0) {
        return false;
      }
    }

    return true;
  }

  parseComboStr(keyComboStr: string) {
    const subComboStrs = this._splitStr(keyComboStr, this.comboDeliminator);
    const combo: Array<string[]> = [];

    for (let i = 0; i < subComboStrs.length; i += 1) {
      combo.push(this._splitStr(subComboStrs[i], this.keyDeliminator));
    }
    return combo;
  }

  _splitStr(str: string, deliminator: string) {
    const s = str;
    const d = deliminator;
    let c = "";
    const ca: string[] = [];

    for (let ci = 0; ci < s.length; ci += 1) {
      if (ci > 0 && s[ci] === d && s[ci - 1] !== "\\") {
        ca.push(c.trim());
        c = "";
        ci += 1;
      }
      c += s[ci];
    }
    if (c) ca.push(c.trim());

    return ca;
  }

  _checkSubCombo(
    subCombo: string[],
    startingKeyNameIndex: number,
    pressedKeyNames: string[],
  ) {
    subCombo = subCombo.slice(0);
    pressedKeyNames = pressedKeyNames.slice(startingKeyNameIndex);

    let endIndex = startingKeyNameIndex;
    for (let i = 0; i < subCombo.length; i += 1) {
      let keyName = subCombo[i];
      if (keyName[0] === "\\") {
        const escapedKeyName = keyName.slice(1);
        if (
          escapedKeyName === this.comboDeliminator ||
          escapedKeyName === this.keyDeliminator
        ) {
          keyName = escapedKeyName;
        }
      }

      const index = pressedKeyNames.indexOf(keyName);
      if (index > -1) {
        subCombo.splice(i, 1);
        i -= 1;
        if (index > endIndex) {
          endIndex = index;
        }
        if (subCombo.length === 0) {
          return endIndex;
        }
      }
    }
    return -1;
  }
}

//   KeyCombo.comboDeliminator = '>';
//   KeyCombo.keyDeliminator   = '+';
