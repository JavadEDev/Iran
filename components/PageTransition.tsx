"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";

  return (
    <motion.div
      key={page}
      initial={{ opacity: 0, y: 6, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
