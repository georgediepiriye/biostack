"use client";

import { ChangeEvent, useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { api } from "../lib/api";

export function CoverImageField() {
  const [coverUrl, setCoverUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Choose an image file.");
    setError("");
    setUploading(true);
    try {
      const signed = await api<{ cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string }>("/uploads/cloudinary-signature", { method: "POST" });
      if (!signed.success || !signed.data) throw new Error(signed.error || "Could not prepare the upload.");
      const body = new FormData();
      body.append("file", file);
      body.append("api_key", signed.data.apiKey);
      body.append("timestamp", String(signed.data.timestamp));
      body.append("folder", signed.data.folder);
      body.append("signature", signed.data.signature);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.data.cloudName}/image/upload`, { method: "POST", body });
      const result = await response.json();
      if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Upload failed. Try again.");
      setCoverUrl(result.secure_url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return <div className="sm:col-span-2">
    <input type="hidden" name="coverImageUrl" value={coverUrl}/>
    <span className="mb-2 block text-xs font-bold text-[#405448]">Cover image <span className="font-normal text-[#8a968c]">(optional)</span></span>
    {coverUrl ? <div className="flex items-center gap-3 rounded-xl border border-[#dfe4d9] bg-white p-2"><img src={coverUrl} alt="Cover preview" className="h-14 w-14 rounded-lg object-cover"/><span className="min-w-0 flex-1 truncate text-xs text-[#718078]">Image ready</span><button type="button" onClick={() => setCoverUrl("")} aria-label="Remove cover image" className="grid h-8 w-8 place-items-center rounded-full text-[#859188] hover:bg-rose-50 hover:text-rose-600"><X size={16}/></button></div> : <label className="flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#cfd8ca] bg-[#fafbf7] px-4 py-3 transition hover:border-[#88a28d] hover:bg-[#f6f8f1]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9efdf] text-[#56715e]">{uploading ? <LoaderCircle size={18} className="animate-spin"/> : <ImagePlus size={18}/>}</span><span className="min-w-0 flex-1"><b className="block text-sm text-[#405448]">{uploading ? "Uploading image…" : "Choose a cover image"}</b><span className="mt-0.5 block text-xs text-[#89958b]">Upload from your device to Cloudinary</span></span><input type="file" accept="image/*" disabled={uploading} onChange={upload} className="sr-only"/></label>}
    {error && <p className="mt-1.5 text-xs text-rose-700">{error}</p>}
  </div>;
}
