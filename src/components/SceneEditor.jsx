import React, { useMemo, useState } from 'react';
import { Camera, Lightbulb, MousePointer, Plus } from 'lucide-react';

const palette = [
  { id: 'bg-grid', label: 'Grid Backdrop' },
  { id: 'bg-nebula', label: 'Nebula Sky' },
  { id: 'prop-crate', label: 'Sci‑Fi Crate' },
  { id: 'prop-console', label: 'Control Console' },
];

export default function SceneEditor() {
  const [elements, setElements] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [ambient, setAmbient] = useState(0.4);
  const [directional, setDirectional] = useState(0.8);
  const [point, setPoint] = useState(0.6);
  const [lightColor, setLightColor] = useState('#a78bfa');
  const [cameraMode, setCameraMode] = useState('Perspective');

  const onDragStart = (item) => (e) => {
    setDragging(item.id);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const onDrop = (e) => {
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    const paletteItem = palette.find((p) => p.id === id);
    if (!paletteItem) return;
    const newItem = { ...paletteItem, uid: `${id}-${Date.now()}` };
    setElements((prev) => [...prev, newItem]);
    setDragging(null);
  };

  const onDragOver = (e) => e.preventDefault();

  const ambientStyle = useMemo(() => ({ boxShadow: `0 0 ${ambient * 30}px ${ambient * 10}px ${lightColor}80` }), [ambient, lightColor]);

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <MousePointer className="h-5 w-5 text-cyan-400" />
          <h2 className="font-semibold">Scene Editor</h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300">Drag & Drop</span>
          <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300">Lighting</span>
          <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300">Camera</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        <aside className="col-span-12 md:col-span-3 p-3 border-r border-neutral-800">
          <h3 className="font-medium mb-2">Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {palette.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={onDragStart(item)}
                className={`group rounded-md border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-sm cursor-grab active:cursor-grabbing ${dragging === item.id ? 'opacity-70' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <Plus className="h-4 w-4 text-neutral-400 group-hover:text-white" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="font-medium flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-300" /> Lighting</h3>
            <label className="text-sm text-neutral-300">Ambient {ambient.toFixed(2)}</label>
            <input type="range" min="0" max="1" step="0.01" value={ambient} onChange={(e) => setAmbient(parseFloat(e.target.value))} />
            <label className="text-sm text-neutral-300">Directional {directional.toFixed(2)}</label>
            <input type="range" min="0" max="1" step="0.01" value={directional} onChange={(e) => setDirectional(parseFloat(e.target.value))} />
            <label className="text-sm text-neutral-300">Point {point.toFixed(2)}</label>
            <input type="range" min="0" max="1" step="0.01" value={point} onChange={(e) => setPoint(parseFloat(e.target.value))} />
            <div className="flex items-center justify-between text-sm">
              <label className="text-neutral-300">Color</label>
              <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="h-6 w-10 bg-transparent border border-neutral-700 rounded" />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="font-medium flex items-center gap-2"><Camera className="h-4 w-4 text-blue-300" /> Camera</h3>
            <div className="flex gap-2">
              {['Perspective', 'Orthographic'].map((m) => (
                <button key={m} onClick={() => setCameraMode(m)} className={`text-xs px-2 py-1 rounded border ${cameraMode === m ? 'bg-blue-600 border-blue-500' : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700'}`}>{m}</button>
              ))}
            </div>
          </div>
        </aside>

        <section className="col-span-12 md:col-span-9 p-3">
          <div onDrop={onDrop} onDragOver={onDragOver} className="relative aspect-video w-full rounded-lg border border-neutral-800 bg-[radial-gradient(circle_at_30%_20%,rgba(167,139,250,0.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.08),transparent_40%)]">
            <div className="absolute inset-0" style={ambientStyle} />
            <div className="absolute inset-0 p-3">
              <div className="text-xs text-neutral-300">Drop elements here to add to scene. Camera: {cameraMode}</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
                {elements.map((el) => (
                  <div key={el.uid} className="rounded-md border border-neutral-800 bg-neutral-900/70 px-3 py-2 text-sm">
                    <div className="text-neutral-200">{el.label}</div>
                    <div className="mt-1 text-[11px] text-neutral-400">Light: A {ambient.toFixed(2)} | D {directional.toFixed(2)} | P {point.toFixed(2)}</div>
                  </div>
                ))}
                {elements.length === 0 && (
                  <div className="col-span-full text-center text-neutral-500 text-sm py-10">Drag items from the palette to populate your scene.</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
