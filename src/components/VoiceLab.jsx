import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Play, Square, Volume2 } from 'lucide-react';

export default function VoiceLab() {
  const [text, setText] = useState('Hello there! Welcome to Nebula Animator.');
  const [voices, setVoices] = useState([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef(null);

  function refreshVoices() {
    const list = window.speechSynthesis?.getVoices?.() || [];
    setVoices(list);
  }

  useEffect(() => {
    refreshVoices();
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.addEventListener?.('voiceschanged', refreshVoices);
      return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', refreshVoices);
    }
  }, []);

  function speak() {
    if (!window.speechSynthesis) return;
    stop();
    const u = new SpeechSynthesisUtterance(text);
    const v = voices[voiceIndex];
    if (v) u.voice = v;
    u.pitch = pitch;
    u.rate = rate;
    u.volume = volume;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  function stop() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Mic className="h-5 w-5 text-fuchsia-400"/>
          <h2 className="text-lg font-semibold">AI-Powered Voice Lab</h2>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 bg-neutral-950 border border-neutral-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-fuchsia-500/40"
        />
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <label className="flex flex-col gap-1">Voice
            <select className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1" value={voiceIndex} onChange={(e) => setVoiceIndex(parseInt(e.target.value))}>
              {voices.length === 0 ? <option>No voices</option> : voices.map((v, i) => (
                <option key={v.name + i} value={i}>{v.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">Pitch
            <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} />
          </label>
          <label className="flex flex-col gap-1">Speed
            <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} />
          </label>
          <label className="flex flex-col gap-1">Volume
            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {!speaking ? (
            <button onClick={speak} className="px-3 py-2 rounded bg-fuchsia-500 hover:bg-fuchsia-400 text-neutral-900 text-sm font-medium flex items-center gap-2">
              <Play className="h-4 w-4"/> Generate Voice
            </button>
          ) : (
            <button onClick={stop} className="px-3 py-2 rounded bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-sm font-medium flex items-center gap-2">
              <Square className="h-4 w-4"/> Stop
            </button>
          )}
          <div className="text-neutral-400 text-sm flex items-center gap-2"><Volume2 className="h-4 w-4"/> Uses on-device synthesis for low latency.</div>
        </div>
      </div>

      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
        <h3 className="text-base font-semibold mb-2">Tips for Natural Voices</h3>
        <ul className="list-disc pl-5 text-neutral-300 text-sm space-y-1">
          <li>Use punctuation and line breaks to control pauses and rhythm.</li>
          <li>Lower speed and slightly higher pitch can improve clarity.</li>
          <li>Choose a voice that matches your character’s personality.</li>
          <li>Record multiple takes to build a natural performance.</li>
        </ul>
        <div className="mt-4 text-neutral-400 text-sm">
          Coming soon: neural timbre cloning and emotional prosody control.
        </div>
      </div>
    </section>
  );
}
