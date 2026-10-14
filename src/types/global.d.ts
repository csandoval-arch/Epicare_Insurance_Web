/**
 * @file global.d.ts
 * @description Contrato de las banderas que el loader publica en `window`. No es estado de React
 * a propósito: el loader se monta y se desmonta, y las secciones que esperan a que termine
 * (el globo, el hero de /go-ams) pueden montarse antes o después que él, así que necesitan un
 * punto de lectura que sobreviva al ciclo de vida de los componentes.
 *
 * Declararlas aquí sustituye los ~20 `(window as any).epicare*` que había repartidos: el mismo
 * JavaScript, pero el compilador ya avisa si alguien escribe mal el nombre de una bandera.
 */
export {};

declare global {
  interface Window {
    /** El loader terminó su salida: la página es interactiva. */
    epicareLoaderFinished?: boolean;
    /** Terminó la cascada de entrada del logo (antes de la salida). */
    epicareLoaderIntroFinished?: boolean;
    /** El globo 3D acabó de montar y tiene datos. */
    epicareGlobeIsReady?: boolean;
    /** `load` del documento ya disparó; lo lee el loader para encadenar su salida. */
    __epicarePageLoaded?: boolean;
    /** Lo publica el loader para que el evento `load` pueda disparar la salida desde fuera. */
    __epicareTriggerOutro?: () => void;
  }
}
