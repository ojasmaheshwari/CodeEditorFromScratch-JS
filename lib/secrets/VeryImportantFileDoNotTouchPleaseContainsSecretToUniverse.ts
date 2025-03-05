// HAHA YOU FOUND THE EASTER EGG
// Since One Punch Man S3 is gonna release soon, HERES THE SURPRISEE
// NOW HIT "CTRL + shift + o" to activate ONE PUNCH MODE

import DOMElements from "../global/DOMElements.ts";
import { OPMModeSettings } from "../global/Global.ts";


export function OnePunchhhhhhhhhhhhh(editor: HTMLElement): void {
  const { suggestionContainer } = DOMElements;

  document.body.classList.toggle("opm-background");
  editor.classList.toggle("opm-editor");
  suggestionContainer?.classList.toggle("___opm-suggestion-container___");


  OPMModeSettings.active = true;


  const color = document.documentElement.style.getPropertyValue('--col-scrollbar');
  if (color !== '#d55959') {
    document.documentElement.style.setProperty('--col-scrollbar', '#d55959');
  } else {
    document.documentElement.style.setProperty('--col-scrollbar', '#569cd6');
  }
}
