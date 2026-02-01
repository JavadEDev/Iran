"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { formatDateForHeader } from "@/lib/utils/date";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/", labelEn: "Home", labelFa: "خانه" },
  { href: "/news", labelEn: "News", labelFa: "اخبار" },
  { href: "/statements", labelEn: "Statements", labelFa: "بیانیه‌ها" },
  { href: "/media", labelEn: "Media", labelFa: "رسانه" },
  { href: "/victims", labelEn: "Victims", labelFa: "شهدا" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const { language, isRTL } = useI18n();
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const updateDate = () => {
      const locale = language === "fa" ? "fa-IR" : "en-US";
      setCurrentDate(formatDateForHeader(locale));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    if (mounted) {
      const locale = language === "fa" ? "fa-IR" : "en-US";
      setCurrentDate(formatDateForHeader(locale));
    }
  }, [mounted, language]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const t = (item: (typeof NAV_ITEMS)[number]) =>
    language === "fa" ? item.labelFa : item.labelEn;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-green-800/30",
        "bg-slate-900/50 backdrop-blur-xl supports-backdrop-filter:bg-slate-900/40",
        "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.2)]"
      )}
      dir={isRTL ? "rtl" : "ltr"}
      role="banner"
      aria-label={language === "fa" ? "هدر سایت" : "Site header"}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 lg:h-18 items-center justify-between gap-4">
          {/* Logo + site title */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 no-underline outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            aria-label={language === "fa" ? "برو به صفحه اصلی" : "Go to home"}
          >
            <motion.img
              src="/assets/flag.svg"
              alt={language === "fa" ? "پرچم ایران" : "Iranian Flag"}
              className="h-9 w-auto lg:h-10 cursor-pointer"
              whileHover={{ scale: 1.5, x: language === "fa" ? 15 : -15 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onMouseEnter={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play().catch((err) => {
                    // Ignore play() errors (e.g., user hasn't interacted with page yet)
                    console.debug("Audio play failed:", err);
                  });
                }
              }}
              onMouseLeave={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }
              }}
            />
            <span className="text-base font-semibold tracking-tight text-slate-100 transition-colors group-hover:text-green-400 lg:text-lg">
              {language === "fa"
                ? "یادبود انقلاب ایران"
                : "Iranian Revolution Memorial"}
            </span>
            <audio
              ref={audioRef}
              src="/assets/ey_Iran.mp3"
              preload="auto"
              style={{ display: "block" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label={language === "fa" ? "منوی اصلی" : "Main navigation"}
          >
            {NAV_ITEMS.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <motion.div
                  key={item.href}
                  className="relative"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative block px-4 py-2.5 text-sm font-medium rounded-lg outline-none transition-colors duration-200",
                      "focus-visible:ring-2 focus-visible:ring-green-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                      active
                        ? "text-green-400"
                        : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/50"
                    )}
                  >
                    <span className="relative z-10">{t(item)}</span>
                    {active && (
                      <motion.span
                        layoutId="nav-active-desktop"
                        className="absolute inset-0 rounded-lg bg-green-500/20 ring-1 ring-green-500/40"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Right: date + lang + mobile menu button */}
          <div className="flex items-center gap-3 sm:gap-4">
            <time
              dateTime={new Date().toISOString()}
              className="hidden sm:block text-xs text-slate-200 tabular-nums"
              aria-label={language === "fa" ? "تاریخ امروز" : "Today's date"}
              suppressHydrationWarning
            >
              {mounted ? currentDate : ""}
            </time>
            <div className="hidden lg:block">
              <LanguageSwitcher variant="header" />
            </div>

            {/* Mobile menu button */}
            <motion.button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex lg:hidden size-10 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-green-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              aria-expanded={mobileOpen}
              aria-label={
                mobileOpen
                  ? language === "fa"
                    ? "بستن منو"
                    : "Close menu"
                  : language === "fa"
                    ? "باز کردن منو"
                    : "Open menu"
              }
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col gap-1.5">
                <motion.span
                  animate={
                    mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="block h-0.5 w-5 rounded-full bg-current"
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { opacity: 0, scaleX: 0 }
                      : { opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.15 }}
                  className="block h-0.5 w-5 rounded-full bg-current"
                />
                <motion.span
                  animate={
                    mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="block h-0.5 w-5 rounded-full bg-current"
                />
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile nav overlay + panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.nav
              role="navigation"
              aria-label={
                language === "fa" ? "منوی موبایل" : "Mobile navigation"
              }
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className={cn(
                "fixed left-0 right-0 top-16 z-40 lg:hidden",
                "max-h-[calc(100dvh-4rem)] overflow-y-auto",
                "border-b border-green-800/30 bg-slate-900/70 backdrop-blur-xl",
                "shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3)]"
              )}
              style={isRTL ? { left: 0, right: 0 } : {}}
            >
              <div className="container mx-auto px-4 py-4 space-y-1">
                {NAV_ITEMS.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium outline-none transition-colors",
                          "focus-visible:ring-2 focus-visible:ring-green-500/80 focus-visible:ring-inset",
                          active
                            ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/40"
                            : "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                        )}
                      >
                        {active && (
                          <span
                            className="size-2 shrink-0 rounded-full bg-green-400"
                            aria-hidden
                          />
                        )}
                        {t(item)}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="mt-4 pt-4 border-t border-slate-700/60">
                  <div className="px-2">
                    <LanguageSwitcher variant="header" />
                  </div>
                  {mounted && (
                    <p className="mt-3 px-2 text-xs text-slate-200 tabular-nums">
                      {currentDate}
                    </p>
                  )}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
