"use client";
import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-brand-600/20 flex items-center justify-center mx-auto mb-6">
          <Flame size={36} className="text-brand-400" />
        </div>
        <h1 className="text-7xl font-bold gradient-text mb-4">404</h1>
        <p className="text-gray-400 text-lg mb-8">
          This page doesn't exist. Maybe it was never forged.
        </p>
        <Link href="/" className="btn-primary mx-auto w-fit">
          <ArrowLeft size={18} /> Back to home
        </Link>
      </div>
    </div>
  );
}
