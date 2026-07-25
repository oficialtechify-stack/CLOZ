import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, Shirt, Check } from 'lucide-react';

interface ArmarioDigitalViewProps {
  onNavigateModal?: (modal: 'sobre' | 'ontologia' | 'lookbook' | 'armario' | 'privacidade' | 'termos' | 'download' | null) => void;
  onOpenDownload?: () => void;
}

export default function ArmarioDigitalView({ onOpenDownload }: ArmarioDigitalViewProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Existe algum app de armário digital gratuito?',
      a: 'Sim, o Cloz oferece um plano gratuito com itens ilimitados para você catalogar e organizar seu guarda-roupa sem pagar nada.'
    },
    {
      q: 'Qual a diferença entre Cloz e Alta?',
      a: 'O Cloz permite que você tire uma foto do look completo e a IA reconheça todas as peças de uma vez. Já o Alta foca mais em provador virtual por avatar e cadastro individual.'
    },
    {
      q: 'Tenho que fotografar cada item um por um?',
      a: 'Não! Esse é o grande diferencial do Cloz. Você pode simplesmente tirar uma foto vestindo o look e nossa tecnologia reconhece cada peça individualmente (blusa, calça, sapatos, acessórios).'
    },
    {
      q: 'Um armário digital ajuda a parar de gastar demais?',
      a: 'Sim. Ver todas as suas peças em um catálogo digital evita comprar itens parecidos, ajuda a redescobrir roupas esquecidas e permite acompanhar o custo por uso de cada peça.'
    },
    {
      q: 'Armário digital é o mesmo que calendário de looks?',
      a: 'Não. O armário digital é o catálogo com suas roupas individuais. O calendário de looks é onde você registra em quais dias usou cada combinação.'
    },
    {
      q: 'Posso compartilhar meu armário com amigos?',
      a: 'Sim, no Cloz você pode deixar seu armário público ou privado e compartilhar combinações com a comunidade no Lookbook Global.'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 space-y-24 text-left font-sans text-[#171717]">
      
      {/* 1. Hero Header Section */}
      <section className="space-y-6 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium tracking-tight text-[#171717] leading-[1.15]">
          O que é um armário digital?
        </h1>
        <p className="text-lg sm:text-xl text-[#525252] font-light leading-relaxed">
          Um catálogo no celular de cada peça que você possui — para planejar looks, parar de comprar itens repetidos e realmente usar o que está no seu guarda-roupa.
        </p>

        {/* EM UMA FRASE Card */}
        <div className="bg-[#FAF9F6] border border-[#EAE8E1] rounded-2xl p-6 sm:p-8 space-y-3 mt-8">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#737373] font-semibold">
            EM UMA FRASE
          </div>
          <p className="text-sm sm:text-base text-[#262626] font-normal leading-relaxed">
            Um armário digital (também chamado de guarda-roupa virtual) é um app que armazena fotos das suas roupas, sapatos e acessórios. Você pode navegar pelo seu guarda-roupa como um catálogo, montar looks e monitorar o que usou — sem abrir o armário físico.
          </p>
        </div>
      </section>

      {/* 2. Phone Mockups Section */}
      <section className="flex justify-center items-center py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto items-center">
          
          {/* Left Phone: Calendar View */}
          <div className="bg-[#0A0A0A] rounded-[44px] p-2.5 shadow-2xl border-[5px] border-[#383838] w-full max-w-[310px] mx-auto h-[580px] text-[#171717] flex flex-col font-sans overflow-hidden bg-white">
            <div className="w-full h-full bg-white rounded-[36px] p-4 flex flex-col justify-between relative overflow-hidden">
              
              {/* Status Bar */}
              <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium pb-2 border-b border-gray-100">
                <span>14:54</span>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full border border-gray-400"></span>
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                </div>
              </div>

              {/* Profile Header */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                      alt="kikibaby" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1">
                      <span>@kikibaby</span>
                      <span className="text-[10px] font-normal text-gray-400">⚡</span>
                    </h3>
                    <div className="text-[9px] text-gray-500 flex items-center space-x-2">
                      <span><strong>8</strong> 阮的女人</span>
                      <span><strong>16</strong> Followers</span>
                    </div>
                    <p className="text-[8.5px] text-gray-400">Taipei, Taiwan, Taiwan</p>
                  </div>
                </div>
                <button className="bg-black text-white text-[10px] font-medium px-3 py-1 rounded-full">
                  Follow
                </button>
              </div>

              {/* Tabs */}
              <div className="flex justify-around border-b border-gray-100 text-[11px] pt-3 pb-1.5 font-medium text-gray-400">
                <span className="text-black font-bold pb-1 border-b-2 border-black flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Calendar
                </span>
                <span>Outfits</span>
                <span>Closet</span>
              </div>

              {/* Date Header */}
              <div className="pt-2 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs">Wednesday</h4>
                  <p className="text-[10px] text-gray-500">April 8, 2026</p>
                </div>
                <div className="bg-neutral-100 px-2 py-0.5 rounded text-[9px] font-mono text-gray-600 flex items-center space-x-1">
                  <span>8/12</span>
                  <span>⛅</span>
                </div>
              </div>

              {/* Mini Calendar strip */}
              <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-mono text-gray-400 pt-1">
                <span>Mo</span><span>Tu</span><span className="font-bold text-black">We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-gray-600 pb-1 border-b border-gray-100">
                <span>6</span><span>7</span><span className="font-bold bg-black text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto">8</span><span>9</span><span>10</span><span>11</span><span>12</span>
              </div>

              {/* Outfit Photo Cutout Card */}
              <div className="bg-neutral-50 rounded-2xl p-3 flex-1 flex flex-col justify-center items-center my-2 relative overflow-hidden border border-neutral-100">
                <span className="text-[9px] font-mono text-gray-400 absolute top-2 left-2 uppercase">APR 8</span>
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300" 
                  alt="April 8 Outfit" 
                  className="h-36 object-contain filter drop-shadow-md my-auto"
                />
              </div>

              {/* Bottom mini nav */}
              <div className="grid grid-cols-5 gap-1 text-center text-[8px] font-mono pt-1 text-gray-400 border-t border-gray-100 items-center">
                <span className="font-bold text-black">1</span>
                <span>2</span>
                <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto text-xs">+</span>
                <span>4</span>
                <span>5</span>
              </div>

            </div>
          </div>

          {/* Right Phone: Closet Items View */}
          <div className="bg-[#0A0A0A] rounded-[44px] p-2.5 shadow-2xl border-[5px] border-[#383838] w-full max-w-[310px] mx-auto h-[580px] text-[#171717] flex flex-col font-sans overflow-hidden bg-white">
            <div className="w-full h-full bg-white rounded-[36px] p-4 flex flex-col justify-between relative overflow-hidden">
              
              {/* Status Bar */}
              <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium pb-2 border-b border-gray-100">
                <span>14:54</span>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full border border-gray-400"></span>
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                </div>
              </div>

              {/* Profile Header */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                      alt="kikibaby" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1">
                      <span>@kikibaby</span>
                    </h3>
                    <div className="text-[9px] text-gray-500 flex items-center space-x-2">
                      <span><strong>8</strong> 阮的女人</span>
                      <span><strong>16</strong> Followers</span>
                    </div>
                  </div>
                </div>
                <button className="bg-black text-white text-[10px] font-medium px-3 py-1 rounded-full">
                  Follow
                </button>
              </div>

              {/* Tabs */}
              <div className="flex justify-around border-b border-gray-100 text-[11px] pt-3 pb-1.5 font-medium text-gray-400">
                <span>Calendar</span>
                <span>Outfits</span>
                <span className="text-black font-bold pb-1 border-b-2 border-black flex items-center gap-1">
                  <Shirt className="w-3 h-3" /> Closet
                </span>
              </div>

              {/* Search & Filter bar */}
              <div className="flex justify-between items-center py-2 text-[10px]">
                <span className="text-gray-400">🔍 Search...</span>
                <span className="font-semibold text-black flex items-center gap-1">
                  All <ChevronDown className="w-3 h-3" />
                </span>
              </div>

              {/* Closet Category Cards Grid */}
              <div className="grid grid-cols-2 gap-2 flex-1 overflow-hidden py-1">
                
                {/* Item 1 */}
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-100 flex flex-col justify-between relative">
                  <span className="text-[7px] font-mono text-gray-400 uppercase">PLATFORMS</span>
                  <img 
                    src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=200" 
                    alt="Dr. Martens" 
                    className="w-full h-20 object-contain my-auto" 
                  />
                  <div className="text-[8px] font-medium text-gray-800 line-clamp-1">
                    Black Platform Mary Janes <span className="bg-red-900 text-white px-1 rounded text-[6px]">Dr. Martens</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-100 flex flex-col justify-between relative">
                  <span className="text-[7px] font-mono text-gray-400 uppercase">TOPS</span>
                  <img 
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=200" 
                    alt="Shirt" 
                    className="w-full h-20 object-contain my-auto" 
                  />
                  <div className="text-[8px] font-medium text-gray-800 line-clamp-1">
                    Black Long Sleeve Shirt
                  </div>
                </div>

                {/* Item 3 */}
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-100 flex flex-col justify-between relative">
                  <span className="text-[7px] font-mono text-gray-400 uppercase">SNEAKERS</span>
                  <img 
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200" 
                    alt="Salomon" 
                    className="w-full h-16 object-contain my-auto" 
                  />
                  <div className="text-[8px] font-medium text-gray-800 line-clamp-1">
                    Grey Salomon
                  </div>
                </div>

                {/* Item 4 */}
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-100 flex flex-col justify-between relative">
                  <span className="text-[7px] font-mono text-gray-400 uppercase">PUFFER</span>
                  <img 
                    src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=200" 
                    alt="Puffer" 
                    className="w-full h-16 object-contain my-auto" 
                  />
                  <div className="text-[8px] font-medium text-gray-800 line-clamp-1">
                    Black Puffer Vest
                  </div>
                </div>

              </div>

              {/* Plus button Floating */}
              <div className="pt-1 flex justify-center">
                <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg">
                  +
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. Por que ter um armário digital */}
      <section className="space-y-12">
        <h2 className="text-3xl sm:text-4xl font-display font-normal text-[#171717] tracking-tight">
          Por que ter um armário digital
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#171717]">
              Pare de comprar roupas que você já tem
            </h3>
            <p className="text-sm text-[#525252] leading-relaxed font-light">
              A maioria das pessoas descobre que esqueceu cerca de um terço do guarda-roupa na primeira semana. A forma mais rápida de gastar menos é ver o que você já possui.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#171717]">
              Planeje looks na noite anterior
            </h3>
            <p className="text-sm text-[#525252] leading-relaxed font-light">
              Abra o calendário de amanhã, arraste blusas sobre calças e salve o look. Chega de pânico no armário às 7h da manhã.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#171717]">
              Veja seu custo por uso
            </h3>
            <p className="text-sm text-[#525252] leading-relaxed font-light">
              Monitore quais itens valem o investimento. As botas de R$ 300 que você usa semanalmente são mais baratas que as de R$ 80 usadas duas vezes.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#171717]">
              Faça malas sem abrir o armário
            </h3>
            <p className="text-sm text-[#525252] leading-relaxed font-light">
              Crie lookbooks de viagem pelo celular — no escritório, no trem, em qualquer lugar, exceto na frente de uma mala.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Como começar um */}
      <section className="space-y-12 pt-8 border-t border-gray-100">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-display font-normal text-[#171717] tracking-tight">
            Como começar um
          </h2>
          <p className="text-sm text-[#525252] font-light leading-relaxed">
            Cerca de cinco minutos para registrar seus favoritos. Você não precisa fazer o armário inteiro de uma vez.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Steps List */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="flex items-start space-x-6">
              <span className="text-4xl font-display font-light text-[#737373]">01</span>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#171717]">Fotografe ou importe</h3>
                <p className="text-sm text-[#525252] leading-relaxed font-light">
                  Na maioria dos apps, você fotografa cada item um por um e eles removem o fundo. O Cloz corta caminho: tire uma única foto do look e o modelo detecta todas as peças de uma vez.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <span className="text-4xl font-display font-light text-[#737373]">02</span>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#171717]">Marque uma vez</h3>
                <p className="text-sm text-[#525252] leading-relaxed font-light">
                  Cor, categoria, estação, tecido. A maioria dos apps detecta isso automaticamente agora. Cerca de cinco segundos por item.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <span className="text-4xl font-display font-light text-[#737373]">03</span>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#171717]">Monte looks e registre usos</h3>
                <p className="text-sm text-[#525252] leading-relaxed font-light">
                  Arraste itens para salvar looks. Toque em um look no calendário para registrar o uso. Padrões surgem após algumas semanas.
                </p>
              </div>
            </div>

          </div>

          {/* Phone Mockup Right */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-[#0A0A0A] rounded-[38px] p-2 shadow-xl border-[4px] border-[#383838] w-full max-w-[260px] h-[480px] bg-white overflow-hidden text-[#171717] font-sans flex flex-col justify-between">
              <div className="p-3 bg-white h-full flex flex-col justify-between">
                
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="kiki" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold">@kikibaby</div>
                    <div className="text-[8px] text-gray-400">16 Followers • Taipei</div>
                  </div>
                </div>

                <div className="space-y-2 py-2 flex-1">
                  <div className="text-[9px] font-bold text-gray-700 uppercase tracking-wider">ADIDAS • 1 item</div>
                  <div className="bg-neutral-50 p-2 rounded-lg border border-gray-100 flex items-center space-x-2">
                    <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=100" alt="Adidas" className="w-10 h-10 object-contain" />
                    <div className="text-[8px] font-medium text-gray-800">Adidas Samba OG Core Black</div>
                  </div>

                  <div className="text-[9px] font-bold text-gray-700 uppercase tracking-wider pt-1">DR. MARTENS • 1 item</div>
                  <div className="bg-neutral-50 p-2 rounded-lg border border-gray-100 flex items-center space-x-2">
                    <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=100" alt="Dr Martens" className="w-10 h-10 object-contain" />
                    <div className="text-[8px] font-medium text-gray-800">Black Platform Mary Janes</div>
                  </div>
                </div>

                <div className="bg-black text-white text-[9px] font-medium py-1.5 rounded-full text-center">
                  Closet Active
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. O Diferencial do Cloz */}
      <section className="bg-[#FAF9F6] border border-[#EAE8E1] rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#737373] font-semibold">
          O DIFERENCIAL DO CLOZ
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-normal text-[#171717] tracking-tight leading-tight">
          Uma foto do look. O armário todo se monta sozinho.
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-[#404040] leading-relaxed font-light">
          <p>
            Todo outro app de armário pede para você fotografar cada item individualmente. Blusa, calça, sapatos, joias. A maioria perde a paciência após vinte itens e nunca termina — deixando o guarda-roupa invisível para o app.
          </p>
          <p>
            O Cloz segue outro caminho. Suba uma foto do look — selfie no espelho, OOTD, foto no provador — e o modelo identifica cada peça: blusa, calça, sapatos, bolsa, joias. Uma foto pode cadastrar cinco itens de uma vez.
          </p>
          <p className="italic text-[#171717] font-normal pt-2">
            Esta é a razão pela qual usuários do Cloz montam um armário útil em menos de quinze minutos. É também por isso que a tabela de comparação destaca como cada app adiciona itens — a parte que a maioria ignora.
          </p>
        </div>
      </section>

      {/* 6. Comparison Table Section */}
      <section className="space-y-8 pt-4">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-display font-normal text-[#171717] tracking-tight">
            Os melhores apps de armário digital em 2026, comparados
          </h2>
          <p className="text-sm text-[#525252] font-light">
            Usamos todos. Nenhum app vence em todos os quesitos — escolha com base no que você realmente precisa.
          </p>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-neutral-200 rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-[#737373] font-mono text-[10px] uppercase border-b border-neutral-200">
                <th className="p-4 font-semibold">APP</th>
                <th className="p-4 font-semibold">IDEAL PARA</th>
                <th className="p-4 font-semibold">PLANO GRATUITO</th>
                <th className="p-4 font-semibold">ADICIONAR ITENS</th>
                <th className="p-4 font-semibold">SOCIAL / LOOKBOOK</th>
                <th className="p-4 font-semibold">PLATAFORMAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-[#262626] font-normal">
              
              {/* Cloz Row (Highlighted) */}
              <tr className="bg-[#FAF9F6] font-medium">
                <td className="p-4 font-bold text-black text-sm">Cloz</td>
                <td className="p-4">Criar armário via fotos de looks + lookbook da comunidade global</td>
                <td className="p-4 text-emerald-700 font-semibold">Itens ilimitados</td>
                <td className="p-4 font-semibold">Foto de um look — Cloz detecta cada item</td>
                <td className="p-4">Sim</td>
                <td className="p-4">iOS, Android</td>
              </tr>

              <tr>
                <td className="p-4 font-semibold">Alta</td>
                <td className="p-4">Looks gerados por IA + provador virtual com avatares</td>
                <td className="p-4">Grátis</td>
                <td className="p-4">Recibos, busca por marca, fotos de itens individuais</td>
                <td className="p-4">Parcial</td>
                <td className="p-4">iOS, Android</td>
              </tr>

              <tr>
                <td className="p-4 font-semibold">Whering</td>
                <td className="p-4">Básicos, forte comunidade no Reino Unido e UE</td>
                <td className="p-4">Itens ilimitados</td>
                <td className="p-4">Fotos de itens individuais, recibos</td>
                <td className="p-4">Parcial</td>
                <td className="p-4">iOS, Android</td>
              </tr>

              <tr>
                <td className="p-4 font-semibold">Acloset</td>
                <td className="p-4">Sugestões de looks por IA, baseadas no clima</td>
                <td className="p-4 text-amber-700">Limitado</td>
                <td className="p-4">Fotos de itens individuais</td>
                <td className="p-4">Não</td>
                <td className="p-4">iOS, Android</td>
              </tr>

              <tr>
                <td className="p-4 font-semibold">Indyx</td>
                <td className="p-4">Guarda-roupa cápsula + rastreamento de revenda</td>
                <td className="p-4 text-amber-700">Limitado</td>
                <td className="p-4">Fotos individuais, recibos</td>
                <td className="p-4">Não</td>
                <td className="p-4">Apenas iOS</td>
              </tr>

              <tr>
                <td className="p-4 font-semibold">Stylebook</td>
                <td className="p-4">Usuários avançados que querem análises detalhadas</td>
                <td className="p-4 text-red-700">$4,99, sem plano grátis</td>
                <td className="p-4">Fotos individuais (manual)</td>
                <td className="p-4">Não</td>
                <td className="p-4">Apenas iOS</td>
              </tr>

              <tr>
                <td className="p-4 font-semibold">Cladwell</td>
                <td className="p-4">Mentoria de guarda-roupa cápsula</td>
                <td className="p-4 text-amber-700">Apenas teste</td>
                <td className="p-4">Apenas catálogo de marcas curado</td>
                <td className="p-4">Não</td>
                <td className="p-4">iOS, Android</td>
              </tr>

            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Perguntas Frequentes (FAQ) */}
      <section className="space-y-8 pt-8 border-t border-gray-100">
        <h2 className="text-3xl sm:text-4xl font-display font-normal text-[#171717] tracking-tight">
          Perguntas frequentes
        </h2>

        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-5">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center text-left text-base sm:text-lg font-normal text-[#171717] hover:opacity-80 transition cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-gray-400 ml-4">
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-black" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400" />
                  )}
                </span>
              </button>
              {openFaqIndex === index && (
                <p className="mt-3 text-sm text-[#525252] font-light leading-relaxed animate-fadeIn">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call to Action Final */}
      <section className="text-center py-16 space-y-6 bg-[#FAF9F6] rounded-3xl border border-[#EAE8E1]">
        <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#171717] tracking-tight">
          Comece seu armário digital
        </h2>
        <p className="text-sm sm:text-base text-[#525252] font-light">
          Grátis, itens ilimitados, cinco minutos para começar.
        </p>

        {/* Store Badges matching Image 3 and Image 4 */}
        <div className="flex justify-center items-center gap-4 pt-2">
          
          {/* Apple App Store */}
          <button 
            onClick={onOpenDownload}
            className="bg-[#000000] text-white px-5 py-2.5 rounded-xl flex items-center space-x-3 hover:bg-neutral-800 transition shadow-sm active:scale-95 cursor-pointer border border-black"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.02.12-9.88-1.93-14.58-6.15-3.35-2.88-7.22-7.58-11.62-14.1-6.15-9.17-11.03-19.16-14.65-29.98-3.62-10.82-5.43-21.2-5.43-31.14 0-14.24 3.63-26.11 10.89-35.61 7.26-9.5 16.53-14.34 27.81-14.52 4.81 0 10.04 1.18 15.68 3.54 5.64 2.36 9.4 3.54 11.28 3.54 1.63 0 5.42-1.18 11.37-3.54 5.95-2.36 10.82-3.42 14.61-3.18 8.13.5 15.34 3.12 21.62 7.87 6.28 4.75 10.74 10.97 13.38 18.66-12.37 7.48-18.44 17.65-18.2 30.52.24 10.13 4.1 18.61 11.58 25.44 7.48 6.83 16.27 10.59 26.37 11.28-2.61 7.82-6.12 15.36-10.53 22.62zM119.22 31.8c0-7.38 2.68-14.34 8.04-20.88 5.36-6.54 12.08-10.37 20.16-11.49.12.98.18 1.83.18 2.56 0 7.32-2.73 14.35-8.19 21.09-5.46 6.74-12.22 10.59-20.28 11.55-.12-.86-.18-1.81-.18-2.83z" />
            </svg>
            <div className="text-left font-sans">
              <div className="text-[10px] leading-none uppercase tracking-wider text-gray-300 font-medium">Baixar na</div>
              <div className="text-sm font-semibold tracking-tight text-white leading-tight">App Store</div>
            </div>
          </button>

          {/* Google Play */}
          <button 
            onClick={onOpenDownload}
            className="bg-[#000000] text-white px-5 py-2.5 rounded-xl flex items-center space-x-3 hover:bg-neutral-900 transition shadow-sm active:scale-95 cursor-pointer border border-neutral-800"
          >
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.25 10.375C16.928 15.698 13.9 23.82 13.9 33.3v445.4c0 9.48 3.028 17.602 8.35 22.925l1.225 1.225L273.85 252.5v-5L23.475 9.15l-1.225 1.225z" fill="#00C8FF"/>
              <path d="M358.85 337.5l-85-85L23.85 502.875c7.875 8.35 20.825 9.48 33.3 2.4l301.7-167.775z" fill="#FF3A44"/>
              <path d="M358.85 174.5L57.15 6.725C44.675-.35 31.725.775 23.85 9.125l250 250.375 85-85z" fill="#00E676"/>
              <path d="M358.85 256l92.5-52.5c12.25-6.95 12.25-18.3 0-25.25L358.85 125.75v260.5z" fill="#FFC107"/>
            </svg>
            <div className="text-left font-sans">
              <div className="text-[9px] leading-none uppercase tracking-wider text-gray-200 font-medium">DISPONÍVEL NO</div>
              <div className="text-base font-bold tracking-tight text-white leading-tight mt-0.5">Google Play</div>
            </div>
          </button>

        </div>
      </section>

    </div>
  );
}
