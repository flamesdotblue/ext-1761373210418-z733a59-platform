import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero3D() {
  return (
    <section className="relative w-full h-[420px] sm:h-[520px] md:h-[620px] overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/20 to-neutral-950 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-end pb-10">
        <div className="backdrop-blur-sm bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 sm:p-6 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">Design, Rig, and Animate in a Modern 3D Workspace</h1>
          <p className="text-neutral-300 mt-2 text-sm sm:text-base">
            Intuitive mesh editing, powerful rigging, precise keyframing, and an AI-powered voice lab — optimized for real-time performance.
          </p>
          <div className="mt-4 flex gap-2">
            <a href="#workspace" className="px-4 py-2 rounded-md bg-fuchsia-500 hover:bg-fuchsia-400 text-neutral-900 text-sm font-medium transition-colors">Open Workspace</a>
            <a href="#tutorials" className="px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium transition-colors">Start Tutorials</a>
          </div>
        </div>
      </div>
    </section>
  );
}
