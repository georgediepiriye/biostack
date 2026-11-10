const API_URL = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000/api");
export type ApiResult<T> = { success: boolean; data?: T; error?: string };
export function visitorHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  let visitorId = localStorage.getItem("biostack_visitor_id");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("biostack_visitor_id", visitorId);
  }
  return { "X-Visitor-Id": visitorId };
}
export async function api<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("biostack_token") : null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${API_URL}${path}`, { ...options, signal: options.signal || controller.signal, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }, cache: "no-store" });
    const result = await response.json();
    if (!response.ok && result?.success !== false) return { success: false, error: `Request failed (${response.status})` };
    return result;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new Error("The server took too long to respond. Check that the BioStack API is running, then try again.");
    throw new Error("Could not reach the BioStack server. Check that it is running and try again.");
  } finally {
    clearTimeout(timeout);
  }
}
export { API_URL };
