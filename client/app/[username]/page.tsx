"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { NicheTabs, type Niche } from "../../components/NicheTabs";
import { ProductCard, type Product } from "../../components/ProductCard";
import { API_URL } from "../../lib/api";

type Profile = {
  user: { username: string; profile: { displayName: string; bio: string; avatarUrl?: string; themeColor?: string } };
  niches: Niche[];
  links: (Product & { nicheSegmentId: string })[];
};

export default function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [active, setActive] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(({ username }) => fetch(`${API_URL}/profiles/${username}`).then(response => response.json()).then(result => {
      if (!result.success) setError(result.error);
      else { setProfile(result.data); setActive(result.data.niches[0]?._id || ""); }
    }).catch(() => setError("Unable to load this profile")));
  }, [params]);

  if (error) return <main className="grid min-h-screen place-items-center bg-[#f5f3ed] text-[#718078]">{error}</main>;
  if (!profile) return <main className="grid min-h-screen place-items-center bg-[#f5f3ed] text-[#718078]">Loading BioStack…</main>;
  const { user, niches, links } = profile;
  return <main className="paper-grid min-h-screen px-5 py-8 text-[#17251e] sm:py-14">
    <section className="mx-auto max-w-[600px]">
      <nav className="mb-10 flex items-center justify-between"><span className="flex items-center gap-2 font-display text-sm font-extrabold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#245b43] text-[11px] text-white">b.</span>biostack</span><span className="rounded-full border border-[#dfe3d9] bg-[#fffefa]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#79867c]">Creator collections</span></nav>
      <header className="rounded-[2rem] border border-white bg-[#fffefa] p-7 text-center soft-shadow sm:p-10">
        <div className="mx-auto mb-4 flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[25px] bg-[#e7d5bf] font-display text-2xl font-extrabold text-[#634d39]">{user.profile.avatarUrl ? <img src={user.profile.avatarUrl} alt="" className="h-full w-full object-cover"/> : user.profile.displayName?.slice(0, 1)}</div>
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#69816f]">A little bit of everything</p><h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-.05em]">{user.profile.displayName || user.username}</h1><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#78867c]">{user.profile.bio || "Explore my curated collections and finds."}</p>
      </header>
      <div className="mb-3 mt-9 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#829084]">Pick what you’re here for</p><h2 className="mt-1 font-display text-xl font-extrabold">Browse by interest</h2></div><span className="text-xs font-semibold text-[#96a098]">{niches.length} collections</span></div>
      {niches.length ? <><NicheTabs niches={niches} activeId={active} onChange={setActive}/><div className="mb-4 mt-3 flex items-center gap-2 px-1 text-xs text-[#849087]"><Layers3 size={14}/><span>{niches.find(niche => niche._id === active)?.description || "Links for this niche."}</span></div><div className="space-y-3">{links.filter(link => link.nicheSegmentId === active).map(product => <ProductCard product={product} key={product._id}/>)}{!links.some(link => link.nicheSegmentId === active) && <div className="rounded-2xl border border-dashed border-[#cfd7cb] py-10 text-center text-sm text-[#839087]">No links added here yet.</div>}</div></> : <p className="rounded-2xl border border-dashed border-[#cfd7cb] p-8 text-center text-sm text-[#839087]">This creator hasn’t published any niches yet.</p>}
      <footer className="mt-12 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#9ba59c]">Made with <span className="font-display font-extrabold text-[#5d7965]">BioStack</span><ArrowUpRight size={12}/></footer>
    </section>
  </main>;
}
