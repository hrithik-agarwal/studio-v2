import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ICU from "i18next-icu";

await i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    resources: {
      en: { common: { hello: "Hello", projects: "Projects" } },
    },
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });

export default i18n;
