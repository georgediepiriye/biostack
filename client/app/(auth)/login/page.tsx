"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { api } from "../../../lib/api";
import { GoogleAuthButton } from "../../../components/GoogleAuthButton";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await api<{ token: string }>("/auth/login", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    if (!result.success) return setError(result.error || "Could not sign in");
    localStorage.setItem("biostack_token", result.data!.token);
    router.push("/dashboard");
  };
  return <main className="paper-grid grid min-h-screen lg:grid-cols-[1fr_.85fr]">
    <section className="flex flex-col justify-between p-6 sm:p-10 lg:p-12"><Link href="/" className="flex w-fit items-center gap-2 font-display text-xl font-extrabold"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#245b43] text-sm text-white">b.</span>biostack</Link><div className="my-16 max-w-xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#63806b]">Your creator link page</p><h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-[-.055em] sm:text-6xl">All your niches, easy to manage.</h1><p className="mt-5 max-w-md leading-7 text-[#718078]">Sign in to update your links and organize them for each audience.</p></div><Link href="/" className="flex w-fit items-center gap-2 text-sm font-bold text-[#718078] hover:text-[#245b43]"><ArrowLeft size={16}/> Back to BioStack</Link></section>
    <section className="grid place-items-center bg-[#e9ede4] p-5 sm:p-10"><div className="w-full max-w-md rounded-[2rem] border border-white bg-[#fffefa] p-7 soft-shadow sm:p-10"><span className="rounded-full bg-[#eff3e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-[#50705b]">Welcome back</span><h2 className="mt-5 font-display text-3xl font-extrabold">Sign in to BioStack</h2><p className="mt-2 text-sm text-[#829087]">Use your email or continue with Google.</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-xs font-bold text-[#405448]">Email address<input required name="email" placeholder="you@example.com" type="email" autoComplete="email" className="focus-ring mt-2 w-full rounded-xl border border-[#dfe4d9] bg-white px-4 py-3.5 text-sm"/></label><label className="block text-xs font-bold text-[#405448]">Password<input required name="password" placeholder="Your password" type="password" autoComplete="current-password" className="focus-ring mt-2 w-full rounded-xl border border-[#dfe4d9] bg-white px-4 py-3.5 text-sm"/></label>{error && <p className="text-sm text-rose-700">{error}</p>}<button className="w-full rounded-xl bg-[#245b43] py-3.5 text-sm font-bold text-white transition hover:bg-[#173c2d]">Sign in <ArrowUpRight className="ml-1 inline" size={16}/></button></form><div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#9aa49b]"><span className="h-px flex-1 bg-[#e8ebe3]"/>or<span className="h-px flex-1 bg-[#e8ebe3]"/></div><GoogleAuthButton/><p className="mt-6 text-center text-sm text-[#7a887f]">New here? <Link className="font-bold text-[#245b43]" href="/register">Create an account</Link></p></div></section>
  </main>;
}
