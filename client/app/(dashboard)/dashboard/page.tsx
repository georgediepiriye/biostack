"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, ExternalLink, Eye, Layers3, Link2, Pencil, Plus, Trash2, X } from "lucide-react";
import { api } from "../../../lib/api";
import { LinkStat } from "../../../components/LinkStat";
import { CoverImageField } from "../../../components/CoverImageField";

type Niche = { _id: string; title: string; creatorName?: string; slug: string; shareSlug?: string; uniqueVisitorCount?: number; description?: string };
type ProductLink = { _id: string; title: string; nicheSegmentId: string; clickCount: number; selarUrl: string; coverImageUrl?: string };

export default function Dashboard() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [links, setLinks] = useState<ProductLink[]>([]);
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [coverResetKey, setCoverResetKey] = useState(0);
  const [editingNicheId, setEditingNicheId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ kind: "link"; item: ProductLink } | { kind: "niche"; item: Niche } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [nicheResult, linkResult, profileResult] = await Promise.all([
        api<Niche[]>("/niches"), api<ProductLink[]>("/links"), api<any>("/profiles/me/profile"),
      ]);
      if (!profileResult.success) {
        if (profileResult.error?.toLowerCase().includes("auth") || profileResult.error?.toLowerCase().includes("token")) {
          localStorage.removeItem("biostack_token");
          return location.assign("/login");
        }
        throw new Error(profileResult.error || "Could not load your profile.");
      }
      if (!nicheResult.success) throw new Error(nicheResult.error || "Could not load your niches.");
      if (!linkResult.success) throw new Error(linkResult.error || "Could not load your links.");
      setNiches(nicheResult.data || []);
      setLinks(linkResult.data || []);
      setProfile(profileResult.data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addNiche = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const result = await api("/niches", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    if (result.success) { form.reset(); setMessage(""); await load(); }
    else setMessage(result.error || "Could not add niche");
  };

  const addLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const result = await api("/links", { method: "POST", body: JSON.stringify(data) });
    if (result.success) { form.reset(); setCoverResetKey(key => key + 1); setMessage(""); await load(); }
    else setMessage(result.error || "Could not add link");
  };

  const confirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    const { kind, item } = pendingDelete;
    const result = kind === "link"
      ? await api(`/links/${item._id}`, { method: "DELETE" })
      : await api(`/niches/${item._id}`, { method: "DELETE" });
    setDeleting(false);
    if (result.success) {
      setPendingDelete(null);
      setMessage("");
      await load();
    } else setMessage(result.error || `Could not delete ${kind}`);
  };

  const updateNiche = async (event: FormEvent<HTMLFormElement>, id: string) => {
    event.preventDefault();
    const form = event.currentTarget;
    const result = await api(`/niches/${id}`, { method: "PATCH", body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    if (result.success) { setEditingNicheId(null); setMessage(""); await load(); }
    else setMessage(result.error || "Could not update niche");
  };

  const copyNicheUrl = async (niche: Niche) => {
    const url = `${window.location.origin}/n/${niche.shareSlug || niche.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Niche link copied.");
    } catch {
      setMessage("Could not copy link. Open the niche page and copy its address.");
    }
  };

  if (loading && !profile) return <main className="grid min-h-screen place-items-center bg-[#f5f3ed] text-[#718078]">Loading your dashboard…</main>;
  if (!profile) return <main className="grid min-h-screen place-items-center bg-[#f5f3ed] px-5 text-[#718078]"><div className="max-w-md text-center"><h1 className="font-display text-2xl font-extrabold text-[#17251e]">Dashboard couldn’t load</h1><p className="mt-2 text-sm">{loadError || "Could not load your account."}</p><button onClick={load} className="mt-5 rounded-xl bg-[#245b43] px-5 py-3 text-sm font-bold text-white">Try again</button></div></main>;

  return <main className="min-h-screen bg-[#f5f3ed] text-[#17251e]">
    <header className="sticky top-0 z-20 border-b border-[#e4e6dd] bg-[#fffefa]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="/" className="flex items-center gap-2 font-display text-lg font-extrabold"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#245b43] text-sm text-white">b.</span>biostack</a>
        <a target="_blank" rel="noreferrer" href={`/${profile.username}`} className="inline-flex items-center gap-2 rounded-full bg-[#245b43] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#173c2d]">View my page <ExternalLink size={14}/></a>
      </div>
    </header>

    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-11">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#68816d]">Your dashboard</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-.055em] sm:text-5xl">Hi, {profile.profile.displayName || profile.username}</h1><p className="mt-2 text-[#79867d]">Manage your links and organize them by niche.</p></div>
        <div className="flex gap-2"><div className="min-w-24 rounded-xl border border-[#e1e5db] bg-[#fffefa] px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#89958b]">Niches</p><p className="mt-0.5 font-display text-xl font-extrabold">{niches.length}</p></div><div className="min-w-24 rounded-xl border border-[#e1e5db] bg-[#fffefa] px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#89958b]">Links</p><p className="mt-0.5 font-display text-xl font-extrabold">{links.length}</p></div></div>
      </div>

      {message && <div role="status" className={`mt-5 flex items-center justify-between gap-3 rounded-xl border p-3 text-sm ${message === "Niche link copied." ? "border-[#cfe0ce] bg-[#edf5ed] text-[#315c3d]" : "border-rose-200 bg-rose-50 text-rose-700"}`}><p>{message}</p><button type="button" onClick={() => setMessage("")} aria-label="Dismiss notification" className="grid h-7 w-7 shrink-0 place-items-center rounded-full transition hover:bg-black/5"><X size={16}/></button></div>}

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div className="space-y-6">
          <form onSubmit={addLink} className="rounded-[1.6rem] border border-[#e1e4da] bg-[#fffefa] p-5 shadow-[0_8px_30px_rgba(32,52,41,.035)] sm:p-7">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8efdc] text-[#4d6f56]"><Plus size={19}/></span><div><h2 className="font-display text-xl font-extrabold">Add a link</h2><p className="text-sm text-[#849087]">Add a destination and choose which niche it belongs to.</p></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold text-[#405448]">Link title<input required name="title" placeholder="e.g. My digital course" className="focus-ring mt-2 w-full rounded-xl border border-[#dfe4d9] bg-white px-4 py-3 text-sm font-normal"/></label>
              <label className="text-xs font-bold text-[#405448]">Niche<select required name="nicheSegmentId" defaultValue="" className="focus-ring mt-2 w-full rounded-xl border border-[#dfe4d9] bg-white px-4 py-3 text-sm font-normal text-[#57685d]"><option value="" disabled>Choose a niche</option>{niches.map(niche => <option key={niche._id} value={niche._id}>{niche.title}</option>)}</select></label>
              <label className="text-xs font-bold text-[#405448] sm:col-span-2">Destination URL<input required name="selarUrl" type="url" placeholder="https://example.com" className="focus-ring mt-2 w-full rounded-xl border border-[#dfe4d9] bg-white px-4 py-3 text-sm font-normal"/></label>
              <CoverImageField key={coverResetKey}/>
            </div>
            {!niches.length && <p className="mt-3 rounded-lg bg-[#f7f5ec] px-3 py-2 text-xs text-[#7a7560]">Create a niche first, then you can add links to it.</p>}
            <button disabled={!niches.length} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#245b43] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#173c2d] disabled:cursor-not-allowed disabled:opacity-45"><Plus size={16}/> Add link</button>
          </form>

          <section className="rounded-[1.6rem] border border-[#e1e4da] bg-[#fffefa] p-5 shadow-[0_8px_30px_rgba(32,52,41,.035)] sm:p-7">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#8a968c]">Your content</p><h2 className="mt-1 font-display text-xl font-extrabold">All links</h2></div><span className="rounded-full bg-[#f0f2e9] px-3 py-1.5 text-xs font-bold text-[#607565]">{links.length}</span></div>
            <div className="mt-5 space-y-3">{links.map(link => <article key={link._id} className="flex items-center gap-3 rounded-2xl border border-[#edf0e9] bg-white p-3 sm:gap-4 sm:p-4"><div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#e7eddf] font-display font-extrabold text-[#54705c]">{link.coverImageUrl ? <img src={link.coverImageUrl} alt="" className="h-full w-full object-cover"/> : link.title.slice(0, 1)}</div><div className="min-w-0 flex-1"><b className="block truncate text-sm">{link.title}</b><span className="mt-1 block truncate text-xs text-[#819087]">{niches.find(niche => niche._id === link.nicheSegmentId)?.title || "Niche removed"}</span></div><LinkStat clicks={link.clickCount}/><a href={link.selarUrl} target="_blank" rel="noreferrer" aria-label={`Open ${link.title}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#829087] hover:bg-[#f0f2e9] hover:text-[#245b43]"><ExternalLink size={15}/></a><button onClick={() => setPendingDelete({ kind: "link", item: link })} aria-label={`Delete ${link.title}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#98a19a] transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16}/></button></article>)}{!links.length && <div className="rounded-xl border border-dashed border-[#d9dfd5] py-12 text-center"><span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-[#f1f3eb] text-[#819283]"><Link2 size={18}/></span><p className="mt-3 text-sm font-bold text-[#596d60]">No links yet</p><p className="mt-1 text-xs text-[#8a968c]">Add your first one above.</p></div>}</div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className="overflow-hidden rounded-[1.6rem] bg-[#173c2d] p-5 text-white sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#b8cabb]">Public page</p><h2 className="mt-2 font-display text-xl font-extrabold">Your BioStack link</h2></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10"><Link2 size={17}/></span></div><a target="_blank" rel="noreferrer" href={`/${profile.username}`} className="mt-5 flex items-center justify-between gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-[#f7faf6] hover:bg-white/15"><span className="truncate">biostack.app/{profile.username}</span><ArrowUpRight size={16} className="shrink-0"/></a><p className="mt-3 text-xs text-[#c7d5ca]">Share this link in your social bios.</p></section>

          <section className="rounded-[1.6rem] border border-[#e1e4da] bg-[#fffefa] p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e8efdc] text-[#4d6f56]"><Layers3 size={17}/></span><div><h2 className="font-display text-lg font-extrabold">Your niches</h2><p className="text-xs text-[#849087]">Manage niche pages for different audiences.</p></div></div><form onSubmit={addNiche} className="mt-4"><input required name="title" placeholder="Niche name" className="focus-ring w-full rounded-xl border border-[#dfe4d9] bg-white px-4 py-3 text-sm"/><input name="creatorName" maxLength={80} placeholder="Creator name for this niche (optional)" className="focus-ring mt-2 w-full rounded-xl border border-[#dfe4d9] bg-white px-4 py-3 text-sm"/><input name="description" placeholder="Short description (optional)" className="focus-ring mt-2 w-full rounded-xl border border-[#dfe4d9] bg-white px-4 py-3 text-sm"/><button className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#d6ee82] px-4 py-2.5 text-sm font-extrabold text-[#294a36] transition hover:bg-[#cce773]"><Plus size={15}/> Add niche</button></form>
            {niches.length ? <ul className="mt-4 divide-y divide-[#edf0e9]">{niches.map((niche, index) => <li key={niche._id} className="py-3"><div className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eff2e8] text-[10px] font-extrabold text-[#6e8172]">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{niche.title}</p><p className="truncate text-[11px] text-[#849087]">Creator: {niche.creatorName?.trim() || profile.profile.displayName || profile.username}</p><span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#607565]"><Eye size={12}/>{(niche.uniqueVisitorCount || 0).toLocaleString()} unique visitors</span><a target="_blank" rel="noreferrer" href={`/n/${niche.shareSlug || niche.slug}`} className="mt-0.5 block truncate text-xs text-[#61806a] hover:text-[#245b43]">biostack.app/n/{niche.shareSlug || niche.slug}</a></div><a target="_blank" rel="noreferrer" href={`/n/${niche.shareSlug || niche.slug}`} aria-label={`View ${niche.title}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#839087] hover:bg-[#eff2e8] hover:text-[#245b43]"><ExternalLink size={14}/></a><button type="button" onClick={() => copyNicheUrl(niche)} aria-label={`Copy ${niche.title} link`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#839087] hover:bg-[#eff2e8] hover:text-[#245b43]"><Copy size={14}/></button><button type="button" onClick={() => setEditingNicheId(editingNicheId === niche._id ? null : niche._id)} aria-label={`Edit ${niche.title}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#839087] hover:bg-[#eff2e8] hover:text-[#245b43]"><Pencil size={14}/></button><button type="button" onClick={() => setPendingDelete({ kind: "niche", item: niche })} aria-label={`Delete ${niche.title} niche`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#98a19a] transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15}/></button></div>{editingNicheId === niche._id && <form onSubmit={event => updateNiche(event, niche._id)} className="ml-11 mt-3 space-y-2 rounded-xl bg-[#f6f6ef] p-3"><input required name="title" defaultValue={niche.title} aria-label="Niche name" className="focus-ring w-full rounded-lg border border-[#dfe4d9] bg-white px-3 py-2 text-sm"/><input name="creatorName" maxLength={80} defaultValue={niche.creatorName || ""} placeholder="Creator name for this niche" aria-label="Creator name" className="focus-ring w-full rounded-lg border border-[#dfe4d9] bg-white px-3 py-2 text-sm"/><input name="description" defaultValue={niche.description || ""} placeholder="Short description" aria-label="Niche description" className="focus-ring w-full rounded-lg border border-[#dfe4d9] bg-white px-3 py-2 text-sm"/><div className="flex gap-2"><button className="inline-flex items-center gap-1 rounded-lg bg-[#245b43] px-3 py-2 text-xs font-bold text-white"><Check size={13}/> Save</button><button type="button" onClick={() => setEditingNicheId(null)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-[#718078]"><X size={13}/> Cancel</button></div></form>}</li>)}</ul> : <p className="mt-4 rounded-xl bg-[#f6f6ef] p-3 text-xs text-[#849087]">Your niche pages will appear here.</p>}
          </section>
        </aside>
      </div>
    </section>
    {pendingDelete && <div className="fixed inset-0 z-50 grid place-items-center bg-[#13251c]/55 px-4 py-6 backdrop-blur-sm" onMouseDown={event => { if (event.target === event.currentTarget && !deleting) setPendingDelete(null); }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description" className="w-full max-w-md rounded-3xl border border-[#e1e4da] bg-[#fffefa] p-6 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600"><Trash2 size={19}/></span><h2 id="delete-title" className="mt-4 font-display text-xl font-extrabold text-[#17251e]">Delete {pendingDelete.kind === "link" ? "link" : "niche"}?</h2></div><button type="button" disabled={deleting} onClick={() => setPendingDelete(null)} aria-label="Close confirmation" className="grid h-9 w-9 place-items-center rounded-full text-[#78867b] hover:bg-[#f0f2e9] disabled:opacity-50"><X size={18}/></button></div>
        <p id="delete-description" className="mt-2 text-sm leading-6 text-[#718078]">{pendingDelete.kind === "link" ? <>“{pendingDelete.item.title}” will be permanently deleted.</> : <>“{pendingDelete.item.title}” and its {links.filter(link => link.nicheSegmentId === pendingDelete.item._id).length} associated {links.filter(link => link.nicheSegmentId === pendingDelete.item._id).length === 1 ? "link" : "links"} will be permanently deleted.</>} This action can’t be undone.</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" disabled={deleting} onClick={() => setPendingDelete(null)} className="rounded-xl border border-[#dfe4d9] px-4 py-3 text-sm font-bold text-[#52665a] hover:bg-[#f6f6ef] disabled:opacity-50">Cancel</button><button type="button" disabled={deleting} onClick={confirmDelete} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700 disabled:cursor-wait disabled:opacity-60"><Trash2 size={15}/>{deleting ? "Deleting…" : "Delete permanently"}</button></div>
      </section>
    </div>}
  </main>;
}
