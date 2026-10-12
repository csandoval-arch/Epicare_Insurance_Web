"use client";

/**
 * @description El formulario de solicitud (embed de GoHighLevel) en una hoja blanca, sin cabecera propia
 * (la etiqueta mono "Solicitud · …" se quitó a pedido del usuario). Lo enmarca el hero. El script oficial de embed
 * (`form_embed.js`) se inyecta una sola vez y ajusta el alto del iframe a su contenido.
 * El interior del iframe (campos, idioma, botón) se edita en GoHighLevel, no aquí.
 */

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FORM_HOST, FORMS } from "../joinUsData";
import type { RoleProps } from "../types";

const SCRIPT_ID = "epicare-form-embed";

/** Alto que declara el formulario en GoHighLevel (`data-height`), en px; el script lo reajusta al cargar. */
const FORM_HEIGHT = 612;

export default function JoinForm({ role, className = "" }: RoleProps & { className?: string }) {
  const t = useTranslations("joinUs.form");
  const { formId, formName } = FORMS[role];
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Evitar que form_embed.js (iFrameResizer) secuestre el scroll y devuelva la página a 0
    type ResizerFn = (opts: Record<string, unknown>, target: unknown) => void;
    const win = window as unknown as { iFrameResize?: ResizerFn };
    let internalResizer = win.iFrameResize;

    try {
      Object.defineProperty(window, "iFrameResize", {
        configurable: true,
        enumerable: true,
        get() {
          return (options: Record<string, unknown>, target: unknown) => {
            const safeOptions = {
              ...options,
              scrollCallback: () => false, // Impide que iFrameResizer llame a window.scrollTo
            };
            return internalResizer ? internalResizer(safeOptions, target) : undefined;
          };
        },
        set(fn: ResizerFn) {
          internalResizer = fn;
        },
      });
    } catch {
      // Ignorar si la propiedad no es redefinible
    }

    // 2. Guardián contra llamadas imprevistas de window.scrollTo(0, 0) mientras el usuario está haciendo scroll
    const originalScrollTo = window.scrollTo.bind(window);
    const patchedScrollTo = function (optionsOrX?: ScrollToOptions | number, y?: number): void {
      if (typeof optionsOrX === "number" && typeof y === "number") {
        // Si un script de terceros intenta forzar un scroll a y <= 10 mientras el usuario ya scrolleó (> 80px):
        if (y <= 10 && window.scrollY > 80) {
          return;
        }
        return originalScrollTo(optionsOrX, y);
      }
      if (typeof optionsOrX === "object" && optionsOrX !== null) {
        if (typeof optionsOrX.top === "number" && optionsOrX.top <= 10 && window.scrollY > 80) {
          return;
        }
        return originalScrollTo(optionsOrX);
      }
      return originalScrollTo();
    };
    window.scrollTo = patchedScrollTo;

    // Inyectar el script de GoHighLevel una sola vez
    if (!document.getElementById(SCRIPT_ID)) {
      const script = Object.assign(document.createElement("script"), {
        id: SCRIPT_ID,
        src: `${FORM_HOST}/js/form_embed.js`,
        async: true,
      });
      document.body.appendChild(script);
    }

    return () => {
      window.scrollTo = originalScrollTo;
    };
  }, []);

  // El iframe cambia de alto al cargar: diferir el refresco de triggers para no interrumpir el scroll actual
  const onLoad = () => {
    setLoaded(true);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  };

  return (
    <div className={`flex flex-col bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)] text-[var(--color-text-primary)] ${className}`}>
      <div className="relative flex-1 min-h-[38.25rem]">
        {!loaded && (
          <p role="status" className="absolute inset-0 flex items-center justify-center text-meta text-[var(--color-text-secondary)]">
            {t("loading")}
          </p>
        )}
        <iframe
          key={formId}
          src={`${FORM_HOST}/widget/form/${formId}`}
          id={`inline-${formId}`}
          title={formName || t("iframeTitle")}
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name={formName}
          data-height={FORM_HEIGHT}
          data-layout-iframe-id={`inline-${formId}`}
          data-form-id={formId}
          onLoad={onLoad}
          className={`block w-full h-full min-h-[38.25rem] border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}
