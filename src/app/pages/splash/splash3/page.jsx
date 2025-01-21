"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/pages/splash/splash3"); // Replace with your target page
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen min-w-full bg-brand-blue flex items-center justify-center">
      <h1 className="text-white text-5xl font-bold">Splash Dashboard</h1>
    </div>
  );
}