/**
 * @description Posición de `el` dentro de `ancestor` según el layout (cadena de `offsetParent`).
 * Ignora los `transform`: sirve para medir mientras algo se anima.
 */
export function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}
