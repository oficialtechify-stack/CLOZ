import React, { useState } from 'react';

export type EffectId = 'none' | 'neon' | 'pixel' | 'aurora';
export type EffectSlot = 'avatar' | 'name' | 'card';
export type EquippedEffects = Record<EffectSlot, EffectId>;

const catalog: { id: EffectId; label: string; priceBRL: number }[] = [
  { id: 'none', label: 'Padrão', priceBRL: 0 },
  { id: 'neon', label: 'Neon', priceBRL: 4.9 },
  { id: 'pixel', label: 'Pixel', priceBRL: 4.9 },
  { id: 'aurora', label: 'Aurora', priceBRL: 7.9 },
];

const css = `
.cloz-effects { color: inherit; display: grid; gap: 1rem; }
.cloz-effects-preview { position: relative; overflow: hidden; padding: 1.5rem; border-radius: 1rem; border: 1px solid #ffffff25; background: #15151d; transition: transform .2s ease; }
.cloz-effects-preview:hover { transform: translateY(-2px); }
.cloz-effects-avatar { display: inline-grid; place-items: center; width: 72px; height: 72px; border-radius: 50%; background: #29293a; font-size: 1.8rem; border: 3px solid transparent; }
.cloz-effects-avatar[data-effect="neon"] { border-color: #ad69ff; box-shadow: 0 0 15px #a65aff99; }
.cloz-effects-avatar[data-effect="pixel"] { border-style: dashed; border-color: #54e6b5; }
.cloz-effects-avatar[data-effect="aurora"] { border-color: #5bcdf7; animation: cloz-pulse 2.5s ease-in-out infinite; }
.cloz-effects-name[data-effect="neon"] { color: #cf9cff; text-shadow: 0 0 12px #a45bff; }
.cloz-effects-name[data-effect="pixel"] { color: #7fffc7; letter-spacing: .08em; }
.cloz-effects-name[data-effect="aurora"] { background: linear-gradient(100deg,#7ce8ff,#c88aff,#7ce8ff); background-size: 200% 100%; color: transparent; background-clip: text; animation: cloz-shimmer 4s linear infinite; }
.cloz-effects-preview[data-effect="neon"] { box-shadow: inset 0 0 20px #a45bff40; }
.cloz-effects-preview[data-effect="pixel"] { outline: 2px dashed #54e6b5; outline-offset: -6px; }
.cloz-effects-preview[data-effect="aurora"] { background: linear-gradient(120deg,#15253b,#302046,#15253b); background-size: 200% 100%; animation: cloz-shimmer 8s linear infinite; }
.cloz-effects-options { display: flex; flex-wrap: wrap; gap: .5rem; }
.cloz-effects-options button { border: 1px solid #ffffff45; border-radius: .6rem; padding: .5rem .8rem; background: #222230; color: white; cursor: pointer; }
.cloz-effects-options button[aria-pressed="true"] { border-color: #b38aff; }
@keyframes cloz-pulse { 50% { box-shadow: 0 0 18px #5bcdf7aa; } }
@keyframes cloz-shimmer { to { background-position: 200% 0; } }
@media (prefers-reduced-motion: reduce) { .cloz-effects *, .cloz-effects-preview { animation: none !important; transition: none !important; } }
`;

export function ClozEffects({ displayName = 'Seu perfil', onPurchaseRequest }: {
  displayName?: string;
  onPurchaseRequest?: (effect: EffectId, slot: EffectSlot) => void;
}) {
  const [slot, setSlot] = useState<EffectSlot>('avatar');
  const [preview, setPreview] = useState<EquippedEffects>({ avatar: 'none', name: 'none', card: 'none' });
  const selected = catalog.find(item => item.id === preview[slot])!;
  return <section className="cloz-effects" aria-label="Prévia da loja CLOZ Effects">
    <style>{css}</style>
    <h2>CLOZ Effects</h2>
    <p>Personalize seu perfil. Os efeitos abaixo são apenas uma prévia; nenhuma compra é realizada aqui.</p>
    <div className="cloz-effects-preview" data-effect={preview.card}>
      <div className="cloz-effects-avatar" data-effect={preview.avatar} aria-hidden="true">✦</div>
      <h3 className="cloz-effects-name" data-effect={preview.name}>{displayName}</h3>
      <p>Seu espaço, seu estilo.</p>
    </div>
    <div className="cloz-effects-options" role="group" aria-label="Área para personalizar">
      {(['avatar','name','card'] as const).map(value => <button key={value} type="button" aria-pressed={slot === value} onClick={() => setSlot(value)}>{({avatar:'Avatar',name:'Nome',card:'Cartão'})[value]}</button>)}
    </div>
    <div className="cloz-effects-options" role="group" aria-label="Escolher efeito">
      {catalog.map(item => <button type="button" key={item.id} aria-pressed={preview[slot] === item.id} onClick={() => setPreview(old => ({ ...old, [slot]: item.id }))}>{item.label} · {item.priceBRL === 0 ? 'Grátis' : item.priceBRL.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</button>)}
    </div>
    {selected.id !== 'none' && <button type="button" disabled={!onPurchaseRequest} onClick={() => onPurchaseRequest?.(selected.id,slot)}>{onPurchaseRequest ? 'Solicitar compra' : 'Compra indisponível nesta demonstração'}</button>}
  </section>;
}
