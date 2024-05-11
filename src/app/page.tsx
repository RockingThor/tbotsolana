"use client";
import App from "@/components/app";
import { RecoilRoot } from "recoil";

export default function Home() {
  return (
    <RecoilRoot>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <App />
      </main>
    </RecoilRoot>
  );
}
