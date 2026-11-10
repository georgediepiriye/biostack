"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type Niche = { _id: string; title: string; description?: string };

export function NicheTabs({ niches, activeId, onChange }: { niches: Niche[]; activeId: string; onChange: (id: string) => void }) {
  return <div className="flex gap-2 overflow-x-auto pb-2">
    {niches.map((niche, index) => <button key={niche._id} onClick={() => onChange(niche._id)} className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${activeId === niche._id ? "text-white" : "border border-[#e4e7dd] bg-[#fffefa] text-[#65746a] hover:border-[#bdc9b8] hover:text-[#245b43]"}`}>
      {activeId === niche._id && <motion.span layoutId="active-niche" className="absolute inset-0 rounded-full bg-[#245b43]" transition={{ type: "spring", bounce: 0.18, duration: 0.45 }} />}
      <span className="relative opacity-65">0{index + 1}</span><span className="relative">{niche.title}</span>{activeId === niche._id && <ArrowUpRight className="relative" size={14}/>}
    </button>)}
  </div>;
}
