import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { Move, RotateCw, Play, Square, Settings, Wand2, Camera as CameraIcon, Sun, Layers, GripVertical } from 'lucide-react';

function Character({ color = '#8b5cf6' }) {
  const mesh = useRef();
  return (
    <mesh ref={mesh} castShadow>
      <capsuleGeometry args={[0.6, 1.6, 16, 32]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.5} />
    </mesh>
  );
}

function TimelinePlayer({ keyframes, duration, playing, onTick, onEnd }) {
  const startRef = useRef(null);
  useFrame((_, delta) => {
    if (!playing) return;
    if (startRef.current == null) startRef.current = 0;
    startRef.current += delta;
    const t = Math.min(startRef.current / duration, 1);
    onTick(t);
    if (t >= 1) {
      startRef.current = null;
      onEnd?.();
    }
  });
  return null;
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial opacity={0.25} />
    </mesh>
  );
}

export default function Workspace({ preset }) {
  const [mode, setMode] = useState('translate');
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(3);

  const [ambient, setAmbient] = useState({ enabled: true, intensity: 0.6, color: '#ffffff' });
  const [dir, setDir] = useState({ enabled: true, intensity: 0.8, color: '#ffffff', position: [4, 6, 4] });
  const [point, setPoint] = useState({ enabled: false, intensity: 0.6, color: '#9ae6b4', position: [-3, 2, 1] });
  const [cameraMode, setCameraMode] = useState('perspective');

  const [objects, setObjects] = useState([
    { id: 'char', type: 'character', name: 'Character', color: '#8b5cf6' },
  ]);

  const [activeId, setActiveId] = useState('char');
  const [keyframes, setKeyframes] = useState([
    { t: 0, position: [0, 1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
    { t: 1, position: [1.5, 1, -1], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1] },
  ]);

  // Load preset example projects
  useEffect(() => {
    if (!preset) return;
    if (preset.id === 'orbit-dance') {
      setObjects([
        { id: 'char', type: 'character', name: 'Astronaut', color: '#60a5fa' },
        { id: 'sphereBg', type: 'sphere', name: 'Sphere BG', color: '#22d3ee', position: [0, 3, -4] },
      ]);
      setKeyframes([
        { t: 0, position: [0, 1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        { t: 0.33, position: [1.2, 1.2, -0.6], rotation: [0, Math.PI / 3, 0], scale: [1.1, 1.1, 1.1] },
        { t: 0.66, position: [-1.2, 0.9, 0.6], rotation: [0, -Math.PI / 3, 0], scale: [0.9, 0.9, 0.9] },
        { t: 1, position: [0, 1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      ]);
      setAmbient({ enabled: true, intensity: 0.7, color: '#ffffff' });
      setDir({ enabled: true, intensity: 1, color: '#ffffff', position: [6, 8, 3] });
      setPoint({ enabled: true, intensity: 0.8, color: '#22d3ee', position: [-2, 2, 2] });
      setCameraMode('perspective');
    }
  }, [preset]);

  const activeIndex = objects.findIndex((o) => o.id === activeId);
  const [transform, setTransform] = useState({ position: [0, 1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] });

  // Interpolate helper
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function lerpVec(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  }

  function evalKeyframes(frames, tNorm) {
    if (!frames.length) return { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] };
    // ensure sorted
    const f = [...frames].sort((a, b) => a.t - b.t);
    const t = Math.max(0, Math.min(1, tNorm));
    let i = 0;
    for (; i < f.length - 1; i++) if (t <= f[i + 1].t) break;
    const a = f[i];
    const b = f[Math.min(i + 1, f.length - 1)];
    const span = Math.max(1e-6, b.t - a.t);
    const k = Math.max(0, Math.min(1, (t - a.t) / span));
    return {
      position: lerpVec(a.position, b.position, k),
      rotation: lerpVec(a.rotation, b.rotation, k),
      scale: lerpVec(a.scale, b.scale, k),
    };
  }

  function addObject(type) {
    const id = `${type}-${crypto.randomUUID().slice(0, 6)}`;
    const base = { id, type, name: type.charAt(0).toUpperCase() + type.slice(1), color: '#a3a3a3', position: [0, 0.5, 0] };
    setObjects((o) => [...o, base]);
    setActiveId(id);
  }

  function removeObject(id) {
    setObjects((o) => o.filter((x) => x.id !== id));
    if (activeId === id) setActiveId('char');
  }

  function onDragStart(e, id) {
    e.dataTransfer.setData('text/plain', id);
  }
  function onDrop(e) {
    const id = e.dataTransfer.getData('text/plain');
    const overId = e.currentTarget.getAttribute('data-id');
    if (!id || !overId || id === overId) return;
    setObjects((list) => {
      const from = list.findIndex((x) => x.id === id);
      const to = list.findIndex((x) => x.id === overId);
      if (from === -1 || to === -1) return list;
      const copy = [...list];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  }

  function addKeyframeAtCurrent() {
    setKeyframes((k) => {
      const current = transform;
      const t = Math.min(0.999, Math.max(0, k.length ? k[k.length - 1].t + 0.25 : 0));
      return [...k, { t, position: current.position, rotation: current.rotation, scale: current.scale }].sort((a, b) => a.t - b.t);
    });
  }

  return (
    <section id="workspace" className="grid grid-cols-1 xl:grid-cols-[320px,1fr] gap-4">
      {/* Sidebar: Scene Editor */}
      <aside className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 h-full space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Layers className="h-4 w-4"/> Scene</h3>
          <button onClick={() => addObject('sphere')} className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700">+ Sphere</button>
        </div>
        <div className="space-y-1">
          {objects.map((o) => (
            <div
              key={o.id}
              data-id={o.id}
              draggable
              onDragStart={(e) => onDragStart(e, o.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded border ${
                activeId === o.id ? 'border-fuchsia-500/60 bg-fuchsia-500/10' : 'border-neutral-800 bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-neutral-500"/>
                <button className="text-left" onClick={() => setActiveId(o.id)}>
                  <div className="text-xs font-medium">{o.name}</div>
                  <div className="text-[10px] text-neutral-400">{o.type}</div>
                </button>
              </div>
              {o.id !== 'char' && (
                <button onClick={() => removeObject(o.id)} className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700">
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-neutral-800 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Sun className="h-4 w-4"/> Lighting</h3>
          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between gap-2">Ambient
              <input type="checkbox" checked={ambient.enabled} onChange={(e) => setAmbient({ ...ambient, enabled: e.target.checked })} />
            </label>
            <label className="flex items-center gap-2">Intensity
              <input className="w-full" type="range" min="0" max="2" step="0.05" value={ambient.intensity} onChange={(e) => setAmbient({ ...ambient, intensity: parseFloat(e.target.value) })} />
            </label>
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between gap-2">Directional
              <input type="checkbox" checked={dir.enabled} onChange={(e) => setDir({ ...dir, enabled: e.target.checked })} />
            </label>
            <label className="flex items-center gap-2">Intensity
              <input className="w-full" type="range" min="0" max="2" step="0.05" value={dir.intensity} onChange={(e) => setDir({ ...dir, intensity: parseFloat(e.target.value) })} />
            </label>
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between gap-2">Point
              <input type="checkbox" checked={point.enabled} onChange={(e) => setPoint({ ...point, enabled: e.target.checked })} />
            </label>
            <label className="flex items-center gap-2">Intensity
              <input className="w-full" type="range" min="0" max="2" step="0.05" value={point.intensity} onChange={(e) => setPoint({ ...point, intensity: parseFloat(e.target.value) })} />
            </label>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-800 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><CameraIcon className="h-4 w-4"/> Camera</h3>
          <div className="flex gap-2 text-xs">
            <button onClick={() => setCameraMode('perspective')} className={`px-2 py-1 rounded ${cameraMode === 'perspective' ? 'bg-neutral-800' : 'bg-neutral-900 border border-neutral-800'}`}>Perspective</button>
            <button onClick={() => setCameraMode('orthographic')} className={`px-2 py-1 rounded ${cameraMode === 'orthographic' ? 'bg-neutral-800' : 'bg-neutral-900 border border-neutral-800'}`}>Orthographic</button>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-1">
            <button title="Translate" onClick={() => setMode('translate')} className={`px-2 py-1 rounded flex items-center gap-1 ${mode === 'translate' ? 'bg-neutral-800' : 'hover:bg-neutral-800/60'}`}><Move className="h-4 w-4"/> <span className="text-xs">Move</span></button>
            <button title="Rotate" onClick={() => setMode('rotate')} className={`px-2 py-1 rounded flex items-center gap-1 ${mode === 'rotate' ? 'bg-neutral-800' : 'hover:bg-neutral-800/60'}`}><RotateCw className="h-4 w-4"/> <span className="text-xs">Rotate</span></button>
            <button title="Scale" onClick={() => setMode('scale')} className={`px-2 py-1 rounded flex items-center gap-1 ${mode === 'scale' ? 'bg-neutral-800' : 'hover:bg-neutral-800/60'}`}><Settings className="h-4 w-4"/> <span className="text-xs">Scale</span></button>
            <button title="Add Keyframe" onClick={addKeyframeAtCurrent} className="px-2 py-1 rounded flex items-center gap-1 hover:bg-neutral-800/60"><Wand2 className="h-4 w-4"/> <span className="text-xs">Keyframe</span></button>
          </div>
          <div className="flex items-center gap-2">
            {!playing ? (
              <button onClick={() => setPlaying(true)} className="px-2 py-1 rounded bg-fuchsia-500 text-neutral-900 text-xs font-medium flex items-center gap-1 hover:bg-fuchsia-400"><Play className="h-4 w-4"/> Play</button>
            ) : (
              <button onClick={() => setPlaying(false)} className="px-2 py-1 rounded bg-neutral-200 text-neutral-900 text-xs font-medium flex items-center gap-1 hover:bg-neutral-300"><Square className="h-4 w-4"/> Stop</button>
            )}
            <div className="text-xs flex items-center gap-2">
              <span>Duration</span>
              <input className="w-24" type="range" min="1" max="10" step="0.5" value={duration} onChange={(e) => setDuration(parseFloat(e.target.value))} />
              <span className="w-6 text-right">{duration.toFixed(0)}s</span>
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
          <Canvas shadows camera={{ position: [4, 3, 6], fov: 50 }} orthographic={cameraMode === 'orthographic'}>
            {ambient.enabled && <ambientLight intensity={ambient.intensity} color={ambient.color} />}
            {dir.enabled && <directionalLight castShadow intensity={dir.intensity} color={dir.color} position={dir.position} />}
            {point.enabled && <pointLight intensity={point.intensity} color={point.color} position={point.position} />}

            <group>
              <Ground />
              {objects.map((o) => (
                <group key={o.id} position={o.position || [0, 0, 0]}> 
                  {o.type === 'character' && <Character color={o.color} />}
                  {o.type === 'sphere' && (
                    <mesh castShadow>
                      <sphereGeometry args={[0.5, 32, 32]} />
                      <meshStandardMaterial color={o.color} />
                    </mesh>
                  )}
                </group>
              ))}

              <TransformControls mode={mode} enabled={!!activeId}>
                <group>
                  <mesh visible={false} position={transform.position} rotation={transform.rotation} scale={transform.scale} />
                </group>
              </TransformControls>

              <TimelinePlayer
                keyframes={keyframes}
                duration={duration}
                playing={playing}
                onTick={(t) => setTransform(evalKeyframes(keyframes, t))}
                onEnd={() => setPlaying(false)}
              />

              <group position={transform.position} rotation={transform.rotation} scale={transform.scale}>
                <Character color={objects.find((o) => o.id === 'char')?.color || '#8b5cf6'} />
              </group>
            </group>

            <OrbitControls makeDefault />
          </Canvas>
        </div>

        {/* Timeline */}
        <div className="mt-3 bg-neutral-950 border border-neutral-800 rounded-lg p-3">
          <div className="text-xs text-neutral-400 mb-2">Timeline</div>
          <div className="h-16 relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0,transparent_calc(10%_-_1px),rgba(120,113,108,0.25)_calc(10%_-_1px),rgba(120,113,108,0.25)_10%)] bg-[length:10%_1px] bg-bottom bg-repeat-x" />
            <div className="relative h-full flex items-center gap-2 px-1">
              {keyframes.sort((a,b)=>a.t-b.t).map((kf, i) => (
                <div key={i} title={`t=${kf.t.toFixed(2)}`} style={{ left: `${kf.t * 100}%` }} className="absolute bottom-2 translate-x-[-50%]">
                  <div className="h-4 w-4 rounded-full bg-fuchsia-500 border border-white/20" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-neutral-400">
            Drag the gizmo in the viewport to move, rotate, or scale. Click Keyframe to insert at the current pose and build your animation.
          </div>
        </div>
      </div>
    </section>
  );
}
