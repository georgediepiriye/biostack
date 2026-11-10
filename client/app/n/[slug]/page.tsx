"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Layers3 } from "lucide-react";
import { ProductCard, type Product } from "../../../components/ProductCard";
import { API_URL, visitorHeaders } from "../../../lib/api";

type Collection = {
  user: { username: string; profile: { displayName: string; bio: string; avatarUrl?: string; themeColor?: string } };
  niche: { title: string; creatorName?: string; description?: string };
  links: Product[];
};

export default function PublicNichePage({ params }: { params: Promise<{ slug: string }> }) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(({ slug }) => fetch(`${API_URL}/profiles/n/${slug}`, { headers: visitorHeaders() }).then(response => response.json()).then(result => {
      if (!result.success) setError(result.error || "Niche not found");
      else setCollection(result.data);
    }).catch(() => setError("Unable to load this page")));
  }, [params]);

  if (error) return <main className="grid min-h-screen place-items-center bg-[#f5f3ed] text-[#718078]">{error}</main>;
  if (!collection) return <main className="grid min-h-screen place-items-center bg-[#f5f3ed] text-[#718078]">Loading page…</main>;

  const { user, niche, links } = collection;
  const creatorName = niche.creatorName?.trim() || user.profile.displayName || user.username;
  return <main className="min-h-screen bg-[#f5f4ee] px-4 pb-16 pt-5 text-[#17251e] sm:px-7 sm:pt-8">
    <div className="mx-auto max-w-6xl">
      <nav className="mb-4 flex justify-end">
        <Link href="/" aria-label="BioStack home" className="flex items-center gap-2 rounded-full border border-[#e3e6dc] bg-[#fffefa] px-3 py-2 font-display text-xs font-extrabold text-[#284d38] shadow-sm transition hover:border-[#cbd6c8]">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#245b43] text-[10px] text-white">b.</span>biostack
        </Link>
      </nav>
      <header className="relative overflow-hidden rounded-[1.5rem] bg-[#173c2d] px-5 py-6 text-white sm:px-8 sm:py-7">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-white/[.04]"/><div className="absolute -bottom-28 right-28 h-64 w-64 rounded-full bg-[#d6ee82]/[.08] blur-2xl"/>
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#d6ee82]">{creatorName}</p><h1 className="mt-1.5 font-display text-3xl font-extrabold leading-tight tracking-[-.04em] sm:text-4xl">{niche.title}</h1>{niche.description && <p className="mt-2 max-w-2xl text-sm leading-5 text-[#d0ddd2]">{niche.description}</p>}</div>
          <div className="relative flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[.07] px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d6ee82] text-[#294a36]"><BookOpen size={17}/></span><div><span className="block font-display text-lg font-extrabold">{links.length}</span><span className="block text-[10px] font-bold uppercase tracking-wider text-[#c0d0c4]">{links.length === 1 ? "item" : "items"}</span></div></div>
        </div>
      </header>

      <section className="mt-9 sm:mt-12">
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#779080]">Picked for you</p><h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-.045em] sm:text-3xl">Books, courses & resources</h2></div><span className="hidden items-center gap-2 text-xs font-medium text-[#849087] sm:inline-flex"><Layers3 size={14}/>{links.length} {links.length === 1 ? "listing" : "listings"}</span></div>
        {links.length ? <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">{links.map(product => <ProductCard product={product} variant="tile" key={product._id}/>)}</div> : <div className="rounded-2xl border border-dashed border-[#cfd7cb] bg-[#fffefa] px-6 py-16 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[#e8efdc] text-[#54705c]"><Layers3 size={19}/></span><h2 className="mt-4 font-display text-lg font-extrabold">Nothing listed yet</h2><p className="mt-1 text-sm text-[#839087]">This creator hasn’t added any items to this niche.</p></div>}
      </section>

      <footer className="mt-14 border-t border-[#e2e5dc] pt-5 text-center text-xs font-medium text-[#929c93]">Curated by {creatorName} <span className="mx-1.5">·</span> Made with <Link href="/" className="font-display font-extrabold text-[#5d7965] hover:text-[#245b43]">BioStack</Link></footer>
    </div>
  </main>;
}
