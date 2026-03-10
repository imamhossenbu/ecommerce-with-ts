/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, FormEvent } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { forgetPassword } from '../../modules/auth/services';
import Image from 'next/image';
import Link from 'next/link';
import logo from "@/public/shared/logo.png";

export default function ForgetPassword() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading("Requesting reset link...");
    
    try {
      const res = await forgetPassword(email);
    //   console.log(res)
      if (res.data.success) {
        setIsSubmitted(true);
        toast.success("Reset link sent to your email!", { id: loadingToast });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "User not found";
      toast.error(msg, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-50/60 rounded-full blur-3xl" />

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/20 text-center">
          
          <Link href="/signin">
             <Image src={logo} alt="Seoul Mirage Logo" className="w-28 mx-auto mb-8 hover:opacity-80 transition-opacity" />
          </Link>

          {!isSubmitted ? (
            <>
              <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900 mb-2 italic">
                Reset <span className="text-pink-500">Password</span>
              </h1>
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 leading-relaxed">
                Enter your email to receive a <br /> secure recovery link
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-left">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-pink-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      placeholder="your@email.com" 
                      required
                      disabled={isLoading}
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all font-medium text-sm placeholder:text-neutral-300 disabled:opacity-60"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-neutral-900/10"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="py-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-black uppercase italic mb-3">Check Your <span className="text-pink-500">Inbox</span></h2>
              <p className="text-neutral-500 text-sm font-medium mb-8 leading-relaxed">
                We've sent a password reset link to <br /> 
                <span className="text-neutral-900 font-bold">{email}</span>
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-pink-500 transition-colors"
              >
                Didn't get the email? Try again
              </button>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-neutral-50">
            <Link href="/signin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Sign In
            </Link>
          </div>
        </div>

        <p className="mt-10 text-[10px] text-neutral-400 text-center uppercase tracking-[0.2em] font-bold">
          &copy; 2026 Seoul Mirage Support
        </p>
      </div>
    </section>
  );
}