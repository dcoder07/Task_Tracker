import React from "react";
import LoadingIcons from "react-loading-icons";

export default function loading() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center py-10 px-4'>
      <div className='glass-card w-full max-w-2xl p-8 rounded-3xl border border-white/10 text-center'>
        <div className='text-3xl font-semibold flex gap-2 text-center text-cyan-400 items-center justify-center'>
          Loading Create Form
          <LoadingIcons.Oval stroke='#00FFFF' className='loader mt-1' />
        </div>
        <p className='text-sm text-slate-300 mt-4'>Preparing ticket creation form...</p>
      </div>
    </div>
  );
}