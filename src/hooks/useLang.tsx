"use client";

import React, { createContext, useContext, useState } from "react";

export type Lang = "en" | "hi";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

// In-memory only (§6.4: no browser storage).
export const LangProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<Lang>("en");
    return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
