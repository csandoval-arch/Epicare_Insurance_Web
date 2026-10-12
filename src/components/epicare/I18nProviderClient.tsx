"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import esMessages from "../../../messages/es.json";
import enMessages from "../../../messages/en.json";

type Locale = "en" | "es";

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({
  locale: "en",
  setLocale: () => {},
});

export const useLocale = () => useContext(I18nContext);

export default function I18nProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem("NEXT_LOCALE") as Locale;
      if (savedLocale === "en" || savedLocale === "es") {
        setLocaleState(savedLocale);
        document.documentElement.lang = savedLocale;
      } else {
        // Por defecto en inglés al inicio (feedback explícito)
        setLocaleState("en");
        document.documentElement.lang = "en";
      }
    } catch {
      // Ignorar si localStorage está bloqueado
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("NEXT_LOCALE", newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = newLocale;
    } catch {}

    // Refrescar ScrollTrigger ante cambios de altura generados por el idioma
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  };

  const messages = locale === "es" ? esMessages : enMessages;

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
        <React.Fragment key={locale}>
          {children}
        </React.Fragment>
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}
