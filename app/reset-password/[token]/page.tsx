/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, FormEvent } from "react";
import { Lock, Loader2, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { resetPassword } from "@/modules/auth/services"; 
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/shared/logo.png";
import { data } from "framer-motion/client";

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    const loadingToast = toast.loading("Updating your security credentials...");
    
    try {
      setIsLoading(true);
      const res = await resetPassword(token, password);
    
      if (res?.data?.success) {
        toast.success("Password updated successfully!", { id: loadingToast });
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      } else {
        toast.error(res?.data?.message || "Failed to update password", { id: loadingToast });
        setIsLoading(false); 
      }
      
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(msg, { id: loadingToast });
      setIsLoading(false); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-50/60 rounded-full blur-3xl" />

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/20">
          
          <div className="text-center mb-10">
            <Link href="/">
              <Image src={logo} alt="Seoul Mirage" className="w-28 mx-auto mb-8 hover:opacity-80 transition-opacity" />
            </Link>
            <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900 italic">
              New <span className="text-pink-500">Beginning</span>
            </h1>
            <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
              Set a strong password for your account
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 ml-1">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all font-medium text-sm disabled:opacity-60"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all font-medium text-sm disabled:opacity-60"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <CheckCircle2 size={14} className={password.length >= 6 ? "text-green-500" : "text-neutral-200"} />
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">At least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-neutral-900/10 group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Processing...</span>
                </div>
              ) : (
                <>
                  Update Password
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-10 text-[10px] text-neutral-400 text-center uppercase tracking-[0.2em] font-bold">
          Secure Encryption Active <span className="mx-2 text-neutral-200">•</span> Seoul Mirage
        </p>
      </div>
    </section>
  );
}