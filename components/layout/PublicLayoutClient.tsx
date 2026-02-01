"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { I18nProvider } from "@/lib/i18n/context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Language } from "@/lib/i18n/config";

interface PublicLayoutClientProps {
  children: React.ReactNode;
  initialLanguage: Language;
}

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
};

export function PublicLayoutClient({
  children,
  initialLanguage,
}: PublicLayoutClientProps) {
  const pathname = usePathname();

  return (
    <I18nProvider initialLanguage={initialLanguage}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={pageTransition.initial}
              animate={pageTransition.animate}
              exit={pageTransition.exit}
              transition={{
                duration: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex flex-col flex-1 min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
