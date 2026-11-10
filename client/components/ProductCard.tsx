"use client";
import { ArrowUpRight } from "lucide-react";

export type Product = { _id: string; title: string; description?: string; selarUrl: string; coverImageUrl?: string; price?: number; currency?: string; badgeText?: string };

export function ProductCard({ product, variant = "row" }: { product: Product; variant?: "row" | "tile" }) {
  const open = () => {
    window.open(product.selarUrl, "_blank", "noopener,noreferrer");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000/api");
    void fetch(`${apiUrl}/profiles/links/${product._id}/click`, { method: "POST" }).catch(() => {});
  };
  const price = product.price != null ? new Intl.NumberFormat("en-NG", { style: "currency", currency: product.currency || "NGN", maximumFractionDigits: 0 }).format(product.price) : null;
  if (variant === "tile") return <button onClick={open} className="group flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-[#e5e7de] bg-[#fffefa] text-left transition hover:-translate-y-1 hover:border-[#bbc9b8] hover:shadow-[0_16px_38px_rgba(32,52,41,.1)]">
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e7eddf]">{product.coverImageUrl ? <img src={product.coverImageUrl} alt={`${product.title} cover`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"/> : <div className="grid h-full w-full place-items-center font-display text-5xl font-extrabold text-[#8ba18b]">{product.title.slice(0, 1)}</div>}{product.badgeText && <span className="absolute left-3 top-3 rounded-full bg-[#fffefa]/95 px-3 py-1.5 text-[10px] font-bold text-[#46644e] shadow-sm">{product.badgeText}</span>}</div>
    <div className="flex flex-1 flex-col p-4 sm:p-5"><h3 className="font-display text-base font-extrabold leading-snug text-[#23382a]">{product.title}</h3>{product.description && <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#7a887e]">{product.description}</p>}<div className="mt-auto flex items-end justify-between gap-3 pt-5"><div>{price ? <><span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8a968c]">Price</span><span className="mt-0.5 block text-base font-extrabold text-[#294a36]">{price}</span></> : <span className="text-xs font-medium text-[#7a887e]">Digital product</span>}</div><span className="inline-flex items-center gap-2 rounded-full bg-[#245b43] px-4 py-2.5 text-xs font-bold text-white transition group-hover:bg-[#173c2d]">Buy on Selar <ArrowUpRight size={14}/></span></div></div>
  </button>;
  return <button onClick={open} className="group flex w-full items-center gap-4 rounded-2xl border border-[#e5e7de] bg-[#fffefa] p-3.5 text-left transition hover:-translate-y-0.5 hover:border-[#bbc9b8] hover:shadow-[0_12px_32px_rgba(32,52,41,.08)] sm:p-4">
    <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#e7eddf] font-display text-xl font-extrabold text-[#42634b]">{product.coverImageUrl ? <img src={product.coverImageUrl} alt="" className="h-full w-full object-cover"/> : product.title.slice(0, 1)}</div>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-display truncate font-extrabold text-[#23382a]">{product.title}</h3>{product.badgeText && <span className="rounded-full bg-[#eff2e7] px-2.5 py-1 text-[10px] font-bold text-[#53705b]">{product.badgeText}</span>}</div>{product.description && <p className="mt-1 truncate text-sm text-[#7a887e]">{product.description}</p>}{price && <p className="mt-1.5 text-sm font-bold text-[#386349]">{price}</p>}</div>
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f1f2e9] text-[#6f8174] transition group-hover:bg-[#d6ee82] group-hover:text-[#294d38]"><ArrowUpRight size={17}/></span>
  </button>;
}
