import React from 'react';
import { Settings, Wand2, Camera, Play } from 'lucide-react';

export default function TutorialCenter({ onLoadExample }) {
  const steps = [
    { title: 'Navigate the Viewport', icon: Camera, body: 'Use right-click or two-finger drag to orbit, scroll to zoom, and shift + drag to pan with Orbit Controls.' },
    { title: 'Transform the Character', icon: Settings, body: 'Select Move, Rotate, or Scale to manipulate the character using the transform gizmo.' },
    { title: 'Create Keyframes', icon: Wand2, body: 'Pose your character, then click Keyframe to record position, rotation, and scale.' },
    { title: 'Preview Animation', icon: Play, body: 'Press Play to see real-time interpolation between keyframes on the timeline.' },
  ];

  const examples = [
    { id: 'orbit-dance', name: 'Orbit Dance', desc: 'A looping orbit animation with accent lighting.' },
  ];

  return (
    <section id="tutorials" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Interactive Tutorial</h2>
        <ol className="space-y-3">
          {steps.map((s, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <s.icon className="h-5 w-5 text-fuchsia-400 mt-0.5"/>
              <div>
                <div className="text-sm font-medium">{idx + 1}. {s.title}</div>
                <p className="text-sm text-neutral-300">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
        <h3 className="text-base font-semibold mb-2">Example Projects</h3>
        <div className="grid grid-cols-1 gap-3">
          {examples.map((ex) => (
            <div key={ex.id} className="flex items-center justify-between p-3 rounded border border-neutral-800 bg-neutral-950">
              <div>
                <div className="text-sm font-medium">{ex.name}</div>
                <div className="text-xs text-neutral-400">{ex.desc}</div>
              </div>
              <button onClick={() => onLoadExample?.(ex)} className="px-3 py-1.5 rounded bg-fuchsia-500 hover:bg-fuchsia-400 text-neutral-900 text-sm font-medium">Load</button>
            </div>
          ))}
        </div>
        <div className="text-neutral-400 text-sm mt-3">Loading an example will configure the workspace scene, lighting, and timeline.</div>
      </div>
    </section>
  );
}
