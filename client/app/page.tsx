"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

const niches = ["Food", "Parenting", "Content creation"];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("biostack_token")));
    setSessionChecked(true);
  }, []);

  return (
    <main className="paper-grid min-h-screen overflow-hidden px-5 pb-12 pt-6 text-[#17251e] sm:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight" href="/"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#245b43] text-sm text-white">b.</span>biostack</Link>
        <div className="flex min-h-10 items-center gap-3">{sessionChecked && (isLoggedIn ? <Link className="rounded-full bg-[#245b43] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#173c2d]" href="/dashboard">Dashboard <ArrowUpRight className="ml-1 inline" size={15}/></Link> : <><Link href="/login" className="hidden px-4 py-2 text-sm font-bold text-[#44564b] sm:block">Log in</Link><Link className="rounded-full bg-[#245b43] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#173c2d]" href="/register">Get started <ArrowUpRight className="ml-1 inline" size={15}/></Link></>)}</div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-14 pb-20 pt-16 md:grid-cols-[1.03fr_.97fr] md:gap-8 md:pb-28 md:pt-24">
        <div className="relative z-10">
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9dfd5] bg-[#fffefa]/80 px-4 py-2 text-xs font-bold uppercase tracking-[.13em] text-[#35664b]"><Sparkles size={14}/> One link for all your niches</p>
          <h1 className="max-w-2xl font-display text-5xl font-extrabold leading-[1.04] tracking-[-.065em] sm:text-6xl lg:text-[5.4rem]">Your links, <span className="relative inline-block">sorted<span className="absolute -bottom-1 left-0 -z-10 h-3 w-full -rotate-2 bg-[#d6ee82]"/></span> by niche.</h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#66766b]">Make one bio page for your creator business. Group your links and digital products by niche, so every audience can find what they came for.</p>
          <div className="mt-9 flex min-h-12 flex-wrap items-center gap-4">{sessionChecked && <><Link href={isLoggedIn ? "/dashboard" : "/register"} className="rounded-full bg-[#245b43] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#245b43]/15 transition hover:-translate-y-0.5 hover:bg-[#173c2d]">{isLoggedIn ? "Manage your page" : "Create your link page"} <ArrowRight className="ml-2 inline" size={16}/></Link>{!isLoggedIn && <span className="text-sm text-[#718078]">Free to set up</span>}</>}</div>
          <div className="mt-14 border-t border-[#dfe2d9] pt-5"><p className="text-sm text-[#718078]"><b className="text-[#263d30]">One page for your links.</b><br/>Organized around your different niches.</p></div>
        </div>

        <div className="relative mx-auto w-full max-w-[530px] md:ml-auto">
          <div className="absolute -right-5 -top-6 h-36 w-36 rounded-full bg-[#d6ee82] blur-[1px] sm:-right-10 sm:-top-10 sm:h-48 sm:w-48"/>
          <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-[#e8c6a4] sm:-left-12 sm:h-40 sm:w-40"/>
          <div className="relative rotate-[1.5deg] rounded-[2rem] border border-white/80 bg-[#fffefa] p-5 soft-shadow sm:rounded-[2.5rem] sm:p-8">
            <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e6d1b9] font-display text-lg font-extrabold text-[#654a36]">G</div><div><p className="font-display font-extrabold">George Diepiriye</p><p className="mt-0.5 text-xs text-[#839087]">My links, organized by niche</p></div></div>
            <div className="mt-6 rounded-2xl bg-[#f4f3eb] p-4"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#829084]">My niches</p><div className="mt-3 space-y-2">{niches.map((niche, index) => <div key={niche} className="flex items-center gap-3 rounded-xl border border-[#e7e8df] bg-white px-4 py-4"><span className="text-xs font-bold text-[#93a096]">0{index + 1}</span><p className="flex-1 font-display text-sm font-extrabold">{niche}</p><ArrowRight size={16} className="text-[#9ba79c]"/></div>)}</div></div>
            <div className="mt-4 px-1 text-[11px] text-[#9aa49b]">biostack.app/tomi</div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col justify-between gap-5 border-t border-[#dfe2d9] pt-6 text-sm text-[#718078] sm:flex-row"><p>A simple home for your creator links.</p><p className="font-bold text-[#395947]">One link. Organized by niche. <span aria-hidden="true">✳</span></p></section>
    </main>
  );
}
