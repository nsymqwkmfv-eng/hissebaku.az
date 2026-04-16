"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type BrandHeaderProps = {
  searchDraft: string;
  onSearchDraftChange: (value: string) => void;
  onApplySearch: (value?: string) => void;
  onClearAll: () => void;
  suggestionPool: string[];
  onOpenAdvancedFilters: () => void;
  resultCount: number;
};

export function BrandHeader({
  searchDraft,
  onSearchDraftChange,
  onApplySearch,
  onClearAll,
  suggestionPool,
  onOpenAdvancedFilters,
  resultCount,
}: BrandHeaderProps) {
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<any | null>(null);
  const showClear = searchDraft.trim().length > 0;

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }
      setSession(data.session ?? null);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const suggestions = useMemo(() => {
    const normalized = searchDraft.toLowerCase().trim();

    if (!normalized) {
      return [];
    }

    return suggestionPool
      .map((value) => {
        const normalizedValue = value.toLowerCase();
        const words = normalizedValue.split(/\s+/);
        let score = 5;

        if (normalizedValue === normalized) {
          score = 0;
        } else if (normalizedValue.startsWith(normalized)) {
          score = 1;
        } else if (words.some((word) => word.startsWith(normalized))) {
          score = 2;
        } else if (normalizedValue.includes(normalized)) {
          score = 3;
        }

        return { value, score, length: value.length };
      })
      .filter((item) => item.score < 5)
      .sort((a, b) => {
        if (a.score !== b.score) {
          return a.score - b.score;
        }
        return a.length - b.length;
      })
      .slice(0, 6)
      .map((item) => item.value);
  }, [searchDraft, suggestionPool]);

  return (
    <header className="dashboard-reveal relative z-[70] w-full border-b border-zinc-200 bg-white isolate">
      <div className="site-shell flex w-full flex-col gap-3 py-3 lg:min-h-[82px] lg:flex-row lg:flex-wrap lg:items-center">
        <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:shrink-0">
          <Link href="/" className="block">
            {!logoError ? (
              <div className="relative h-11 w-[164px] overflow-hidden lg:h-12 lg:w-[178px]">
                <Image
                  src="/images/hissebaku.png"
                  alt="Hissə Baku loqosu"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="178px"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <span className="text-sm font-medium text-zinc-800">
                HİSSƏ BAKI
              </span>
            )}
          </Link>
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
              aria-label="Menyu"
            >
              <Menu className="size-4" />
            </button>
            <a
              href="https://wa.me/994503919290?text=Salam%21%20Sifaris%20ucun%20yaziram."
              className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-2xl bg-[linear-gradient(120deg,#da1919_0%,#b91111_100%)] px-4 py-2 text-xs font-semibold leading-none tracking-[0.01em] text-white shadow-[0_10px_22px_rgba(213,20,20,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(185,17,17,0.22)]"
            >
              İndi sifariş et
            </a>
            <Link
              href="/account"
              className="inline-flex size-9 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
              aria-label="Profil"
            >
              <User className="size-4" />
            </Link>
          </div>
        </div>

        <nav className="hidden shrink-0 items-center gap-6 text-sm font-medium lg:flex">
          <Link
            href="/"
            className={`transition ${
              pathname === "/" || pathname.startsWith("/kataloq")
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Kataloq
          </Link>
          <Link
            href="/endirimler"
            className={`transition ${
              pathname === "/endirimler"
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Endirimlər
          </Link>
          <Link
            href="/brendler"
            className={`transition ${
              pathname === "/brendler"
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Brendlər
          </Link>
          <Link
            href="/elaqe"
            className={`transition ${
              pathname === "/elaqe"
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Əlaqə
          </Link>
        </nav>

        <div className="relative z-[90] w-full min-w-0 flex-1 basis-full lg:ml-auto lg:max-w-[540px]">
          <div
            className={`flex w-full items-center gap-2 rounded-full border bg-zinc-50 px-4 py-2 shadow-[0_8px_22px_rgba(24,24,27,0.05)] transition-all duration-300 lg:ml-auto ${
              isSearchFocused
                ? "border-zinc-300 bg-white/90 lg:max-w-[620px]"
                : "border-zinc-200 lg:max-w-[420px]"
            }`}
          >
            <Search className="size-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Model, OEM və ya kateqoriya üzrə axtar"
              value={searchDraft}
              onFocus={() => {
                setIsSuggestionOpen(true);
                setIsSearchFocused(true);
              }}
              onChange={(event) => {
                onSearchDraftChange(event.target.value);
                setIsSuggestionOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onApplySearch(searchDraft.trim());
                  setIsSuggestionOpen(false);
                }
              }}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full min-w-0 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-500"
            />

            <button
              type="button"
              className="group relative inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
              onClick={() => {
                if (showClear) {
                  onClearAll();
                  setIsSuggestionOpen(false);
                  return;
                }

                onApplySearch(searchDraft.trim());
                setIsSuggestionOpen(false);
              }}
              aria-label={showClear ? "Axtarışı sıfırla" : "Axtar"}
            >
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(213,20,20,0.12),transparent_60%)] opacity-0 transition duration-300 group-hover:opacity-100" />
              {showClear ? <X className="relative size-4" /> : <Search className="relative size-4" />}
            </button>

          </div>

          {isSuggestionOpen && suggestions.length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_22px_40px_rgba(24,24,27,0.16)]">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onSearchDraftChange(suggestion);
                    onApplySearch(suggestion);
                    setIsSuggestionOpen(false);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          <Link
            href="/account"
            className="inline-flex size-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
            aria-label="Profil"
          >
            <User className="size-4" />
          </Link>
          <a
            href="https://wa.me/994503919290?text=Salam%21%20Sifaris%20ucun%20yaziram."
            className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-2xl bg-[linear-gradient(120deg,#da1919_0%,#b91111_100%)] px-5 py-2.5 text-sm font-semibold leading-none tracking-[0.01em] text-white shadow-[0_10px_22px_rgba(213,20,20,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(185,17,17,0.22)]"
          >
            İndi sifariş et
          </a>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Menyunu bagla"
          />
          <div className="fixed inset-x-0 top-0 z-[70] origin-top animate-[menuDrop_240ms_ease-out] rounded-b-[28px] border-b border-zinc-200 bg-white px-6 pb-6 pt-5 shadow-[0_20px_40px_rgba(24,24,27,0.18)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Menyu</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="mt-4 grid gap-2">
              {[
                { href: "/", label: "Kataloq" },
                { href: "/endirimler", label: "Endirimlər" },
                { href: "/brendler", label: "Brendlər" },
                { href: "/elaqe", label: "Əlaqə" },
                { href: "/xidmetler/catdirilma-sertleri", label: "Çatdırılma şərtləri" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    pathname === item.href
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  <span className="text-xs text-zinc-400">→</span>
                </Link>
              ))}
            </nav>
            <div className="mt-5 grid gap-3">
              <Link
                href="/account"
                className="inline-flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {session ? "Profil" : "Daxil ol"}
                <User className="size-4" />
              </Link>
              <a
                href="https://wa.me/994503919290?text=Salam%21%20Sifaris%20ucun%20yaziram."
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(120deg,#da1919_0%,#b91111_100%)] px-4 py-3 text-sm font-semibold text-white"
              >
                İndi sifariş et
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
