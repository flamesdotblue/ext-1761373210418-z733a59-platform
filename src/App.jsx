import React, { useState } from 'react';
import Hero3D from './components/Hero3D';
import Workspace from './components/Workspace';
import VoiceLab from './components/VoiceLab';
import TutorialCenter from './components/TutorialCenter';

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [preset, setPreset] = useState(null);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-inter">
      <header className="sticky top-0 z-50 backdrop-blur bg-neutral-900/70 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-fuchsia-500 to-cyan-400" />
            <span className="text-lg font-semibold tracking-tight">Nebula Animator</span>
          </div>
          <nav className="flex items-center gap-2">
            {[
              { id: 'workspace', label: 'Workspace' },
              { id: 'voicelab', label: 'Voice Lab' },
              { id: 'tutorials', label: 'Tutorials' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  activeTab === t.id ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:bg-neutral-800/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <Hero3D />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'workspace' && (
          <Workspace key={preset?.id || 'default'} preset={preset} />
        )}
        {activeTab === 'voicelab' && <VoiceLab />}
        {activeTab === 'tutorials' && (
          <TutorialCenter
            onLoadExample={(example) => {
              setPreset(example);
              setActiveTab('workspace');
            }}
          />
        )}
      </main>

      <footer className="border-t border-neutral-800 mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Nebula Animator. All rights reserved.</p>
          <p>Built for smooth real-time rendering and cross-platform use.</p>
        </div>
      </footer>
    </div>
  );
}
