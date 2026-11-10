import { MousePointer2 } from "lucide-react";
export function LinkStat({ clicks }: { clicks: number }) { return <div className="min-w-[74px] rounded-xl border border-[#e6e9e0] bg-[#f8f8f2] px-3 py-2 text-center text-xs font-bold text-[#59715f]"><MousePointer2 className="mx-auto mb-1" size={14}/>{clicks}<span className="ml-1 font-medium text-[#8b978e]">clicks</span></div>; }
