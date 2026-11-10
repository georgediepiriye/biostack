import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#17142b", lavender: "#f4f1ff" } } }, plugins: [] } satisfies Config;
