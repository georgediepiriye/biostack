"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: { theme: string; size: string; shape: string; text: string; width: number }) => void;
        };
      };
    };
  }
}

export function GoogleAuthButton() {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!scriptReady || !clientId || !buttonRef.current || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        setError("");
        const result = await api<{ token: string }>("/auth/google", { method: "POST", body: JSON.stringify({ credential }) });
        if (!result.success) return setError(result.error || "Could not sign in with Google");
        localStorage.setItem("biostack_token", result.data!.token);
        router.push("/dashboard");
      },
    });
    buttonRef.current.replaceChildren();
    window.google.accounts.id.renderButton(buttonRef.current, { theme: "outline", size: "large", shape: "pill", text: "continue_with", width: Math.min(360, buttonRef.current.clientWidth || 360) });
  }, [clientId, router, scriptReady]);

  return <div className="w-full">
    {clientId ? <><Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setScriptReady(true)}/><div ref={buttonRef} className="flex min-h-10 justify-center"/></> : <div className="text-center"><button type="button" disabled className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dfe4d9] bg-white py-3 text-sm font-semibold text-[#68776d] opacity-70"><span className="font-display text-base font-extrabold text-[#4285f4]">G</span>Continue with Google</button><p className="mt-2 text-[11px] text-[#8a968c]">Add Google OAuth client ID to enable Google sign-in.</p></div>}
    {error && <p className="mt-2 text-center text-sm text-rose-700">{error}</p>}
  </div>;
}
