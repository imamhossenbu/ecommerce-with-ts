/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, FormEvent, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser } from '../../modules/auth/services'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthResponse } from '@/modules/auth/types'; 

export default function Register() {
  const { login, user } = useAuth();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Creating your beauty profile...");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const res: AuthResponse = await registerUser(payload);

      if (res.success && res.data) {
        const { token, ...userData } = res.data; 
        login(userData, token); 
        toast.success(`Welcome to the family, ${userData.name}!`, { id: loadingToast });
        router.push("/");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed. Try again.";
      setErrorMessage(msg);
      toast.error(msg, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-100/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-50 rounded-full blur-3xl" />

      <div className="w-full max-w-[500px] z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-neutral-900 leading-none">
            Seoul <span className="text-pink-500">Mirage</span>
          </h1>
          <div className="h-1 w-20 bg-pink-500 mx-auto mt-3 rounded-full" />
          <p className="text-neutral-500 mt-4 font-medium tracking-tight">
            Start your journey to radiant skin.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/20">
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50/50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-700 font-medium leading-tight">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Full Name</label>
              <div className="relative group">
                <input 
                  type="text" 
                  required
                  disabled={isLoading}
                  placeholder="Imam Hossen"
                  className="w-full px-5 py-3.5 pl-12 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300 disabled:opacity-60"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-pink-500 transition-colors" size={20} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Email Address</label>
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  disabled={isLoading}
                  placeholder="your@email.com"
                  className="w-full px-5 py-3.5 pl-12 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300 disabled:opacity-60"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-pink-500 transition-colors" size={20} />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Password</label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 pl-12 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300 disabled:opacity-60"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-pink-500 transition-colors" size={20} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Confirm</label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 pl-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300 disabled:opacity-60"
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 px-1 py-2">
              <input 
                type="checkbox" 
                id="agree" 
                required
                className="mt-1 w-5 h-5 rounded-lg border-neutral-200 text-pink-500 focus:ring-pink-500/20 accent-pink-500 cursor-pointer" 
              />
              <label htmlFor="agree" className="text-xs font-medium text-neutral-500 leading-relaxed select-none cursor-pointer">
                I agree to the <span className="text-neutral-900 font-bold underline decoration-pink-500/30">Terms</span> and acknowledge the <span className="text-neutral-900 font-bold underline decoration-pink-500/30">Privacy Policy</span>.
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-neutral-900/10"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  <span className="uppercase tracking-widest text-sm">Create Profile</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center pt-6 border-t border-neutral-50">
            <p className="text-neutral-500 text-sm font-medium">
              Already a member?{' '}
              <Link href="/signin" className="text-neutral-900 font-bold hover:text-pink-500 transition-colors underline underline-offset-4 decoration-pink-500/30">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}