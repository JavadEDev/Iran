"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

export function BackgroundMusicPlayer() {
  const { language } = useI18n();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Auto-play when component mounts
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          // Autoplay was prevented by browser policy
          // User will need to click play button
          console.debug("Auto-play prevented:", err);
        }
      }
    };

    // Small delay to ensure audio element is ready
    const timer = setTimeout(() => {
      playAudio();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.debug("Play failed:", err);
      });
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const labels = {
    fa: {
      play: "پخش",
      pause: "توقف",
      stop: "ایست",
      music: "موسیقی",
    },
    en: {
      play: "Play",
      pause: "Pause",
      stop: "Stop",
      music: "Music",
    },
  };

  const t = labels[language];

  const songInfo = {
    name: "ای ایران",
    lyrics: `
    ای ایران ای مرز پرگهر		ای خاکت سرچشمه هنر
دور از تو اندیشه بدان		پاینده مانی تو جاودان
ای دشمن! اَر تو سنگ خاره‌ای، من آهنم		جان من فدای خاک پاک میهنم
مهر تو چون شد پیشه‌ام
دور از تو نیست اندیشه‌ام
در راه تو کی ارزشی دارد این جان ما؟
پاینده باد خاک ایران ما
 
سنگ کوهت درّ و گوهر است		خاک دشتت بهتر از زَر است
مهرت از دل کی برون کنم؟		برگو، بی مهرِ تو چون کنم؟
تا گردش جهان (زمین) و دور آسمان به‌پاست		نورِ ایزدی همیشه رهنمای ماست
مهر تو چون شد پیشه‌ام
دور از تو نیست اندیشه‌ام
در راه تو کی ارزشی دارد این جان ما؟
پاینده باد خاک ایران ما
 
ایران ای خرّم بهشت من		روشن از تو سرنوشت من
گر آتش بارد به پیکرم		جز مهرت در دل نپرورم
از آب و خاک و مهر تو سرشته شد گلم		مهر اگر برون رود، گِلی شود دلم
مهر تو چون شد پیشه‌ام
دور از تو نیست اندیشه‌ام
در راه تو کی ارزشی دارد این جان ما؟
پاینده باد خاک ایران ما
    `,
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 w-80 max-w-[90vw] bg-slate-900 text-white rounded-lg shadow-2xl p-4 border border-slate-700">
          <div className="space-y-3">
            <div className="border-b border-slate-700 pb-2">
              <h3 className="font-bold text-lg text-green-400">{songInfo.name}</h3>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-line text-slate-200 font-medium">
              {songInfo.lyrics}
            </div>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute bottom-0 right-4 transform translate-y-full">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-900"></div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t.music}</span>
            <div className="flex gap-2">
              {!isPlaying ? (
                <button
                  onClick={handlePlay}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                  aria-label={t.play}
                >
                  {t.play}
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-3 py-1.5 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium"
                  aria-label={t.pause}
                >
                  {t.pause}
                </button>
              )}
              <button
                onClick={handleStop}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                aria-label={t.stop}
              >
                {t.stop}
              </button>
            </div>
          </div>
          <audio
            ref={audioRef}
            src="/assets/ey_Iran.mp3"
            loop
            preload="auto"
            style={{ display: "display-inside" }}
          />
        </div>
      </div>
    </div>
  );
}
