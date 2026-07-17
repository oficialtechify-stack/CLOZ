import React, { useState } from 'react';
import { ChevronRight, ArrowDownRight, Smartphone, BookOpen, Layers, Grid, Shield, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { FREQUENT_QUESTIONS_LEKONDO, FREQUENT_QUESTIONS_CLOSET } from '../data';

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'lookbook' | 'closet' | 'sobre'>('lookbook');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#171717] min-h-screen font-sans selection:bg-[#E5E5E0]">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-gray-200/50">
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => setActiveTab('lookbook')} 
            className="font-display font-bold text-xl tracking-tight hover:opacity-80 transition cursor-pointer"
          >
            Cloz
          </button>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-500">
            <button 
              onClick={() => { setActiveTab('sobre'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-[#171717] transition ${activeTab === 'sobre' ? 'text-[#171717] font-semibold' : ''}`}
            >
              Sobre
            </button>
            <button 
              onClick={() => { setActiveTab('lookbook'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-[#171717] transition ${activeTab === 'lookbook' ? 'text-[#171717] font-semibold' : ''}`}
            >
              Lookbook
            </button>
            <button 
              onClick={() => { setActiveTab('closet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-[#171717] transition ${activeTab === 'closet' ? 'text-[#171717] font-semibold' : ''}`}
            >
              Armário Digital
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onEnterApp}
            className="flex items-center space-x-2 bg-[#171717] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Entrar no Cloz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main Container - Renders different tabs depending on main nav */}
      {activeTab === 'lookbook' && (
        <main className="pb-24">
          {/* Hero Section */}
          <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
            <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
              Seu calendário de looks. <br />
              <span className="text-[#3A3F35]">O lookbook do mundo.</span>
            </h1>
            <p className="mt-8 text-lg text-gray-600 max-w-xl mx-auto leading-relaxed font-light">
              Um lugar tranquilo para brincar com roupas novamente. Anônimo por padrão. Organize seu armário e venda suas melhores combinações.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button 
                onClick={onEnterApp}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#171717] text-white px-8 py-4 rounded-full text-base font-medium hover:bg-black transition-all shadow-md active:scale-95"
              >
                <span>Acessar Rede Social</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('faq-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-full text-base font-medium hover:bg-[#F2F1EC] transition-all"
              >
                <span>Como funciona?</span>
              </button>
            </div>
          </section>

          {/* Banner Video/Image Mockup */}
          <section className="max-w-5xl mx-auto px-6 mb-24">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white p-2">
              <div className="bg-[#121212] aspect-video w-full rounded-2xl flex flex-col items-center justify-center relative group">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1400" 
                  alt="Cloz Promo"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity filter saturate-50 group-hover:opacity-60 transition-opacity duration-700"
                />
                <div className="relative z-10 text-center p-8">
                  <span className="text-xs font-mono tracking-widest text-gray-400 uppercase">CLOZ MARKETPLACE</span>
                  <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mt-4 tracking-tight">
                    O Futuro do Guarda-Roupa Colaborativo
                  </h2>
                  <p className="text-gray-300 mt-4 text-sm md:text-base max-w-lg mx-auto">
                    Conecte peças, registre e venda com um único clique.
                  </p>
                  <button 
                    onClick={onEnterApp}
                    className="mt-8 bg-white text-[#171717] px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition shadow cursor-pointer"
                  >
                    Acessar Plataforma Oficial
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Intro Philosophy Section */}
          <section className="max-w-4xl mx-auto px-6 py-12 border-t border-b border-gray-200/60 grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-xs font-mono tracking-wider text-gray-400 uppercase">O LOOKBOOK, REVISITADO</span>
              <h3 className="font-display text-2xl font-bold mt-2 text-gray-900 leading-snug">
                Postar um look costumava ser algo simples.
              </h3>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed font-light">
                Uma foto granulada no quarto, upload no Lookbook e a vida segue. O nome de usuário não significava nada. Não havia expectativa de que conhecidos veriam.
              </p>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed font-light">
                Hoje a maioria entra em espiral antes de postar: "E se meu ex vir? E se ninguém curtir?". A ansiedade virou parte do algoritmo. O medo é parte do meio.
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold md:mt-6 text-gray-900 leading-snug">
                Cloz tira essa barreira.
              </h3>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed font-light">
                Anonimato por padrão, para que a foto seja apenas o look. Você documenta seu visual como em um diário pessoal. Mas este diário é compartilhado com strangers que compartilham o mesmo amor por estilo.
              </p>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed font-light">
                E o melhor: se alguém gostar do que você está usando, pode comprar a peça diretamente do seu armário através de links integrados ou contato direto.
              </p>
              <p className="mt-6 text-xs italic text-gray-500 font-mono">
                Um terceiro espaço para a moda, mais calmo do que temos hoje.
              </p>
            </div>
          </section>

          {/* Feature Highlight 1: Calendar */}
          <section className="max-w-4xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono tracking-wider text-gray-400 uppercase">SUA PARTE</span>
              <h3 className="font-display text-3xl font-extrabold mt-2 text-gray-900 tracking-tight leading-tight">
                Seu calendário diário de looks.
              </h3>
              <p className="mt-6 text-gray-600 text-sm leading-relaxed font-light">
                Cada dia no Cloz é um quadrado na sua grade. Tire uma selfie do seu visual. O calendário registra o dia, e você pode marcar as peças do seu <span className="underline font-normal">armário digital</span>. Uma foto, um dia registrado.
              </p>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed font-light">
                Planeje looks na noite anterior, veja o custo real por uso e acompanhe o clima de Porto Alegre ou qualquer cidade do Brasil.
              </p>
              <button 
                onClick={onEnterApp}
                className="mt-8 flex items-center space-x-2 text-sm font-semibold hover:opacity-80 transition group"
              >
                <span>Ver Simulador de Calendário</span>
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white p-4 shadow-lg">
              <div className="bg-[#FAF9F6] p-4 rounded-2xl">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200/50">
                  <span className="font-mono text-xs text-gray-400">julho de 2026</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 pt-4 text-center text-xs font-mono text-gray-400">
                  <span>Se</span><span>Te</span><span>Qu</span><span>Qu</span><span>Se</span><span>Sá</span><span>Do</span>
                  <span className="p-2 text-gray-300">1</span>
                  <span className="p-2 text-gray-300">2</span>
                  <span className="p-2 text-gray-300">3</span>
                  <span className="p-2 text-gray-300">4</span>
                  <span className="p-2 text-gray-300">5</span>
                  <span className="p-2">6</span>
                  <span className="p-2">7</span>
                  <span className="p-2">8</span>
                  <span className="p-2">9</span>
                  <span className="p-2">10</span>
                  <span className="p-2">11</span>
                  <span className="p-2 bg-[#E1E1DC] rounded font-bold text-gray-900">12</span>
                  <span className="p-2">13</span>
                  <span className="p-2">14</span>
                  <span className="p-2">15</span>
                  <span className="p-2 relative flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=100" 
                      alt="look" 
                      className="w-6 h-6 rounded-full object-cover border border-gray-900"
                    />
                  </span>
                  <span className="p-2">17</span>
                  <span className="p-2">18</span>
                  <span className="p-2">19</span>
                </div>
                <div className="mt-4 p-3 bg-white rounded-xl border border-gray-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono text-gray-500">16/07/2026</span>
                    <span className="text-xs font-semibold text-gray-800">look diário salvo</span>
                  </div>
                  <span className="text-xs font-mono bg-green-100 text-green-800 px-2 py-0.5 rounded">30ºC / Curitiba</span>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Highlight 2: Feed & Sales */}
          <section className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative rounded-3xl overflow-hidden border border-gray-200 bg-white p-4 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" className="w-8 h-8 rounded-full" alt="avatar" />
                    <div>
                      <span className="text-xs font-bold block">@rickzinxx</span>
                      <span className="text-[10px] text-gray-400">Porto Alegre</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-[#E5E5E0] px-2 py-0.5 rounded">A Venda</span>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="product" />
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold flex items-center space-x-2">
                    <span className="font-mono text-[#3A3F35]">R$ 199,00</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-medium">Jeans Baggy Lavagem Clara</span>
                  <button className="bg-black text-white px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-neutral-800 transition">
                    Ver Item & Compre
                  </button>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-xs font-mono tracking-wider text-gray-400 uppercase">FÁCIL E DIRETO</span>
              <h3 className="font-display text-3xl font-extrabold mt-2 text-gray-900 tracking-tight leading-tight">
                Venda suas peças diretamente pelo lookbook.
              </h3>
              <p className="mt-6 text-gray-600 text-sm leading-relaxed font-light">
                Tem roupas que não usa mais? Cadastre no seu Armário Digital, marque-as nos seus looks e coloque-as à venda. Outros usuários podem clicar nas tags da imagem para ver preços, marcas e fechar a compra em segundos.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600 font-light">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#3A3F35] stroke-[3px]" />
                  <span>Tags interativas de preços nas fotos.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#3A3F35] stroke-[3px]" />
                  <span>Simulador de carrinho e compras integrado.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#3A3F35] stroke-[3px]" />
                  <span>Aura social: ganhe engajamento pela estética.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq-section" className="max-w-3xl mx-auto px-6 pt-24">
            <div className="text-center mb-12">
              <span className="text-xs font-mono tracking-wider text-gray-400 uppercase">SUPORTE</span>
              <h3 className="font-display text-3xl font-extrabold mt-2 text-gray-900">
                Perguntas frequentes
              </h3>
            </div>

            <div className="space-y-4">
              {FREQUENT_QUESTIONS_LEKONDO.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center text-left py-4 hover:opacity-80 transition cursor-pointer"
                  >
                    <span className="font-display font-bold text-gray-900 text-base">{faq.q}</span>
                    <span className="text-lg text-gray-400">{openFaqIndex === index ? '−' : '+'}</span>
                  </button>
                  {openFaqIndex === index && (
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed font-light pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          <section className="max-w-4xl mx-auto px-6 pt-32 text-center">
            <div className="bg-[#FAF9F6] border border-gray-200/80 rounded-3xl p-12 text-center shadow-sm">
              <h3 className="font-display text-3xl font-extrabold text-gray-900">
                Comece seu Calendário de looks hoje.
              </h3>
              <p className="mt-4 text-gray-600 text-sm font-light max-w-md mx-auto leading-relaxed">
                Totalmente grátis. Use o simulador agora e veja como gerenciar suas roupas de forma revolucionária.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={onEnterApp}
                  className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition shadow"
                >
                  Abrir Simulador Interativo
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {activeTab === 'closet' && (
        <main className="pb-24">
          <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
            <span className="text-xs font-mono tracking-wider text-gray-400 uppercase">ARMÁRIO INTELIGENTE</span>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mt-3 text-gray-900">
              O que é um armário digital?
            </h1>
            <p className="mt-6 text-base text-gray-600 max-w-xl mx-auto leading-relaxed font-light">
              Um catálogo no celular de cada peça que você possui — para planejar looks, parar de comprar itens repetidos e realmente usar o que está no seu guarda-roupa.
            </p>
          </section>

          {/* 3 Step Guide */}
          <section className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 border-t border-gray-200/50">
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="font-mono text-4xl font-extrabold text-[#3A3F35]">01</span>
              <h4 className="font-display font-bold text-lg mt-4">Fotografe ou importe</h4>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed font-light">
                Na maioria dos apps, você fotografa cada item por um e eles removem o fundo. No Cloz é diferente: tire uma única foto do look e o modelo detecta todas as peças.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="font-mono text-4xl font-extrabold text-[#3A3F35]">02</span>
              <h4 className="font-display font-bold text-lg mt-4">Marque uma vez</h4>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed font-light">
                Defina cor, marca, categoria, preço e estação do ano. O Cloz detecta quase tudo automaticamente, permitindo um cadastro em 5 segundos por item.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="font-mono text-4xl font-extrabold text-[#3A3F35]">03</span>
              <h4 className="font-display font-bold text-lg mt-4">Monte looks e venda</h4>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed font-light">
                Arraste itens para salvar combinações. Marque-os no calendário mensal e coloque-os à venda. Acompanhe o custo real por uso do seu armário.
              </p>
            </div>
          </section>

          {/* Cost per Wear Banner */}
          <section className="max-w-4xl mx-auto px-6 py-12">
            <div className="bg-[#171717] text-white rounded-3xl p-10 grid md:grid-cols-2 gap-8 items-center shadow-lg">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">ESTÁTICA FINANCEIRA</span>
                <h3 className="font-display text-2xl font-bold mt-2">
                  Veja seu custo real por uso (Cost-per-Wear)
                </h3>
                <p className="text-gray-300 text-xs mt-4 leading-relaxed font-light">
                  Monitore quais itens valem o investimento real. Uma bota de R$ 300 que você usa semanalmente é infinitamente mais barata e sustentável do que uma camiseta de R$ 80 usada duas vezes.
                </p>
              </div>
              <div className="bg-[#242424] p-6 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                  <span className="text-gray-400">Jaqueta de Couro (Preço)</span>
                  <span className="font-mono font-bold">R$ 450,00</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                  <span className="text-gray-400">Vezes Usada</span>
                  <span className="font-mono text-green-400 font-bold">18 vezes</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 font-mono">
                  <span className="text-gray-300 font-sans text-xs">Custo por Uso:</span>
                  <span className="text-white font-bold bg-[#171717] px-3 py-1 rounded">R$ 25,00 / uso</span>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-8">
              <span className="text-xs font-mono tracking-wider text-gray-400 uppercase">ANÁLISE COMPARATIVA</span>
              <h3 className="font-display text-2xl font-bold mt-2 text-gray-900">
                Os melhores apps de armário digital em 2026, comparados
              </h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 font-display font-semibold text-gray-700">
                    <th className="p-4">App</th>
                    <th className="p-4">Ideal Para</th>
                    <th className="p-4">Plano Grátis</th>
                    <th className="p-4">Importação por IA</th>
                    <th className="p-4">Venda Integrada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  <tr className="bg-gray-50/30">
                    <td className="p-4 font-bold text-gray-900">Cloz</td>
                    <td className="p-4">Criar looks com calendário e venda social integrada</td>
                    <td className="p-4">Sim (ilimitado)</td>
                    <td className="p-4 text-green-600 font-medium">Sim (automático)</td>
                    <td className="p-4 text-green-600 font-medium">Sim</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Alta</td>
                    <td className="p-4">Looks com IA provadora virtual</td>
                    <td className="p-4">Grátis limitado</td>
                    <td className="p-4">Sim</td>
                    <td className="p-4">Não</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Whering</td>
                    <td className="p-4">Inventário simples de roupas</td>
                    <td className="p-4">Sim</td>
                    <td className="p-4">Manual</td>
                    <td className="p-4">Não</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Acloset</td>
                    <td className="p-4">Sugestões de looks baseadas no clima</td>
                    <td className="p-4">Limitado (max 100 itens)</td>
                    <td className="p-4">Manual</td>
                    <td className="p-4">Não</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ section */}
          <section className="max-w-3xl mx-auto px-6 py-12">
            <div className="space-y-4">
              {FREQUENT_QUESTIONS_CLOSET.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <button 
                    onClick={() => toggleFaq(index + 10)}
                    className="w-full flex justify-between items-center text-left py-4 hover:opacity-80 transition cursor-pointer"
                  >
                    <span className="font-display font-bold text-gray-900 text-base">{faq.q}</span>
                    <span className="text-lg text-gray-400">{openFaqIndex === index + 10 ? '−' : '+'}</span>
                  </button>
                  {openFaqIndex === index + 10 && (
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed font-light pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {activeTab === 'sobre' && (
        <main className="pb-24">
          <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white p-2 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600" 
                alt="Hilma af Klint Inspired art" 
                className="w-full h-auto object-cover rounded-xl"
              />
              <span className="text-[10px] text-gray-400 mt-2 block font-mono text-center">
                Inspirado em composições estéticas clássicas e modernas
              </span>
            </div>
            <div>
              <span className="text-xs font-mono tracking-wider text-gray-400 uppercase">NOSSA CONCEPÇÃO</span>
              <h1 className="font-display text-4xl font-extrabold tracking-tight mt-3 text-gray-900 leading-tight">
                Cloz
              </h1>
              <p className="text-gray-600 mt-6 text-sm leading-relaxed font-light">
                Inspirados pelo Tractatus Logico-Philosophicus de L. Wittgenstein, exploramos como a moda molda a relação entre linguagem e identidade.
              </p>
              <p className="text-gray-600 mt-4 text-sm leading-relaxed font-light">
                Nosso trabalho vive no limite entre tecnologia, arte e curadoria sustentável. Criamos novas formas para as pessoas se verem e verem umas às outras com mais clareza, pois como uma ideia existe no mundo importa tanto quanto a ideia em si.
              </p>
              <p className="text-gray-500 italic mt-6 text-xs font-mono">
                "Magia custa caro, mas não se compra com dinheiro."
              </p>
              <div className="mt-8 pt-6 border-t border-gray-200/60">
                <span className="text-xs text-gray-400 block font-mono">E-mail para suporte:</span>
                <span className="text-sm font-semibold text-gray-900 block mt-1">contato (arroba) cloz.app</span>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-6">
            <span>Aviso de Privacidade</span>
            <span>Termos de Serviço</span>
            <span>Cloz © 2026</span>
          </div>
          <div className="flex space-x-4">
            <span>Instagram</span>
            <span>Discord</span>
            <span>🇧🇷 Português</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
