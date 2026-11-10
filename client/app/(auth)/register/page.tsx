"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Layers3 } from "lucide-react";
import { api } from "../../../lib/api";
import { GoogleAuthButton } from "../../../components/GoogleAuthButton";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await api<{ token: string }>("/auth/register", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    if (!result.success) return setError(result.error || "Could not create account");
    localStorage.setItem("biostack_token", result.data!.token);
    router.push("/dashboard");
  };
  return <main className="paper-grid grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
    <section className="flex flex-col justify-between p-6 sm:p-10 lg:p-12"><Link href="/" className="flex w-fit items-center gap-2 font-display text-xl font-extrabold"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#245b43] text-sm text-white">b.</span>biostack</Link><div className="my-16 max-w-lg"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#63806b]">A simple link page for creators</p><h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-[-.055em] sm:text-6xl">One link. Every side of your work.</h1><div className="mt-8 space-y-3">{["Group links by niche", "Share one page in your bio", "Give each audience its own collection"].map(item => <p key={item} className="flex items-center gap-3 text-sm text-[#596d60]"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#e2edc7]"><Layers3 size={14} className="text-[#3c674b]"/></span>{item}</p>)}</div></div><Link href="/" className="flex w-fit items-center gap-2 text-sm font-bold text-[#718078] hover:text-[#245b43]"><ArrowLeft size={16}/> Back to BioStack</Link></section>
    <section className="grid place-items-center bg-[#e9ede4] p-5 sm:p-10"><div className="w-full max-w-md rounded-[2rem] border border-white bg-[#fffefa] p-7 soft-shadow sm:p-10"><span className="rounded-full bg-[#eff3e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-[#50705b]">Get started · It’s free</span><h2 className="mt-5 font-display text-3xl font-extrabold">Create your account</h2><p className="mt-2 text-sm text-[#829087]">Use your email or continue with Google.</p><form onSubmit={submit} className="mt-7 space-y-3.5"><label className="block text-xs font-bold text-[#405448]">Email address<input required name="email" type="email" autoComplete="email" placeholder="you@example.com" className="focus-ring mt-2 w-full rounded-xl border border-[#dfe4d9] bg-white px-4 py-3 text-sm"/></label><label className="block text-xs font-bold text-[#405448]">Password<input required minLength={8} name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" className="focus-ring mt-2 w-full rounded-xl border border-[#dfe4d9] bg-white px-4 py-3 text-sm"/></label>{error && <p className="text-sm text-rose-700">{error}</p>}<button className="w-full rounded-xl bg-[#245b43] py-3.5 text-sm font-bold text-white transition hover:bg-[#173c2d]">Create account <ArrowUpRight className="ml-1 inline" size={16}/></button></form><div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#9aa49b]"><span className="h-px flex-1 bg-[#e8ebe3]"/>or<span className="h-px flex-1 bg-[#e8ebe3]"/></div><GoogleAuthButton/><p className="mt-6 text-center text-sm text-[#7a887f]">Already have an account? <Link className="font-bold text-[#245b43]" href="/login">Sign in</Link></p></div></section>
  </main>;
}
