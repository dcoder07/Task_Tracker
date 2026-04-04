"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await register(email, password, firstName, lastName);
    if (resp.success) {
      router.push("/");
    } else {
      setError(resp.error);
    }
  };

  return (
    <main className='max-w-md mx-auto py-16 px-4 text-white'>
      <h1 className='text-4xl font-bold mb-4'>Create Account</h1>
      <p className='text-slate-400 mb-8'>Set up your Team TaskTracker account.</p>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='text'
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className='w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none'
            required
          />
          <input
            type='text'
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className='w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none'
            required
          />
        </div>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none'
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none'
          required
          minLength={6}
        />
        {error && <p className='text-red-400'>{error}</p>}
        <button type='submit' className='w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-bold'>
          Register
        </button>
      </form>
      <p className='mt-4 text-slate-300'>
        Already have an account?{' '}
        <a href='/auth/login' className='text-cyan-300 hover:text-cyan-200'>Sign in</a>
      </p>
    </main>
  );
}
