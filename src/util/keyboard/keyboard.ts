import { Keyboard } from "./keyboardjs";
import { Locale } from "./locale";
import { KeyCombo } from "./keyCombo";
import { us } from "./us";

const keyboard = new Keyboard();

keyboard.setLocale("us", us);

keyboard.Keyboard = Keyboard;
keyboard.Locale = Locale;
keyboard.KeyCombo = KeyCombo;

export default keyboard;
