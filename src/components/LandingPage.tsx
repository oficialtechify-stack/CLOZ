import React, { useState } from 'react';
import { 
  Instagram, 
  ChevronDown, 
  X, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  Layers,
  Shirt,
  Compass,
  Download,
  Bell,
  Settings,
  Heart,
  RotateCw,
  Plus,
  Share2,
  MapPin,
  Lock,
  BarChart2,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  CloudSun,
  Home,
  Search,
  MessageCircle
} from 'lucide-react';
import ArmarioDigitalView from './ArmarioDigitalView';
import outfitMFilipe from '../assets/images/outfit_m_filipe_1784997145447.jpg';
import outfitCamila from '../assets/images/outfit_camila_1784997156459.jpg';
import outfitPatterned from '../assets/images/outfit_patterned_1784997167345.jpg';
import outfitBlazer from '../assets/images/outfit_blazer_1784997177843.jpg';
import rickAvatar from '../assets/images/rick_avatar_1784997756592.jpg';

export default function LandingPage() {
  const [currentTab, setCurrentTab] = useState<'inicio' | 'armario'>('inicio');
  const [activeModal, setActiveModal] = useState<'sobre' | 'ontologia' | 'lookbook' | 'privacidade' | 'termos' | 'download' | null>(null);

  // Sample curated outfit calendar cutouts for Phone 1 mockup
  const calendarOutfits: { [day: number]: string } = {
    1: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200',
    2: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=200',
    3: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=200',
    4: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    5: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    6: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=200',
    7: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=200',
    8: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    9: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    10: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=200',
    11: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200',
    12: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=200',
    13: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=200',
    14: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200',
    15: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=200',
    16: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200',
    17: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=200',
    18: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    19: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    20: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=200',
    21: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=200',
    22: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    23: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    24: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=200',
    25: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200',
    26: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=200',
    27: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=200',
    28: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200',
    29: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=200',
    30: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200',
    31: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=200',
  };

  return (
    <div className="bg-[#FFFFFF] text-[#171717] min-h-screen font-sans selection:bg-[#EAE8E1] flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Top Header Navigation */}
      <header className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-8 flex justify-between items-center z-20">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => {
              setCurrentTab('inicio');
              setActiveModal(null);
            }} 
            className="font-display font-semibold text-2xl tracking-tight text-[#171717] hover:opacity-80 transition cursor-pointer uppercase"
          >
            CLOZ.
          </button>
          <button 
            onClick={() => setActiveModal('sobre')}
            className="text-sm font-normal text-[#525252] hover:text-[#171717] transition cursor-pointer"
          >
            Sobre
          </button>
        </div>

        <nav className="flex items-center space-x-8 text-sm font-normal text-[#404040]">
          <button 
            onClick={() => setActiveModal('lookbook')}
            className="hover:text-[#171717] transition cursor-pointer"
          >
            Lookbook
          </button>
          <button 
            onClick={() => setCurrentTab('armario')}
            className={`hover:text-[#171717] transition cursor-pointer ${
              currentTab === 'armario' ? 'font-bold text-[#171717] underline decoration-2 underline-offset-4' : ''
            }`}
          >
            Armário Digital
          </button>
          <button 
            onClick={() => setActiveModal('ontologia')}
            className="hover:text-[#171717] transition cursor-pointer"
          >
            Ontologia
          </button>
        </nav>
      </header>

      {/* View Switcher: Inicio vs Armario Digital */}
      {currentTab === 'armario' ? (
        <main className="w-full flex-1 animate-fadeIn">
          <ArmarioDigitalView 
            onOpenDownload={() => setActiveModal('download')}
          />
        </main>
      ) : (
        /* Main Hero Section strictly matching reference screenshot */
        <main className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-6 lg:py-12 my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
          
          {/* Left Column: Two Slanted Overlapping Phone Mockups */}
          <div 
            onClick={() => setActiveModal('sobre')}
            className="lg:col-span-7 relative flex justify-center items-center py-8 cursor-pointer group select-none"
          >
            <div className="relative w-full max-w-[540px] h-[580px] sm:h-[640px] flex items-center justify-center">
              
              {/* Phone 2: Fashion Discovery Feed (Back / Right tilted) strictly matching user screenshot */}
              <div className="absolute right-2 sm:right-6 top-6 w-[260px] sm:w-[280px] h-[500px] sm:h-[540px] bg-[#0A0A0A] rounded-[42px] p-2.5 shadow-2xl border-[5px] border-[#383838] transform rotate-[8deg] group-hover:rotate-[10deg] transition-all duration-500 ease-out z-0 overflow-hidden">
                <div className="w-full h-full bg-[#000000] rounded-[34px] overflow-hidden text-white flex flex-col font-sans relative p-2.5 space-y-2">
                  
                  {/* Phone Status bar */}
                  <div className="px-1 pt-0.5 flex justify-between items-center text-[9px] text-gray-400 font-medium">
                    <span>9:41</span>
                    <div className="flex space-x-1 items-center">
                      <span className="w-2 h-2 rounded-full border border-gray-400"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    </div>
                  </div>

                  {/* Top Bar Navigation Tabs */}
                  <div className="flex justify-between items-center px-1 pt-0.5 pb-1 border-b border-neutral-900">
                    <div className="flex space-x-3 text-[10px] items-center">
                      <div className="flex flex-col items-center">
                        <span className="text-white font-semibold">Recente</span>
                        <div className="w-full h-[2px] bg-white rounded-full mt-0.5"></div>
                      </div>
                      <span className="text-neutral-500 font-normal">Seguindo</span>
                      <span className="text-neutral-500 font-normal text-[9px]">Se descobrindo</span>
                    </div>
                    <Bell className="w-3.5 h-3.5 text-white cursor-pointer" />
                  </div>

                  {/* Stories Horizontal Strip */}
                  <div className="flex space-x-2 overflow-x-auto no-scrollbar py-0.5 px-0.5">
                    
                    {/* Story 1: Seu story */}
                    <div className="flex flex-col items-center shrink-0 space-y-0.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-700 bg-neutral-900">
                        <img 
                          src={rickAvatar} 
                          alt="Seu story" 
                          className="w-full h-full object-cover opacity-90"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 right-0 bg-white text-black rounded-full w-2.5 h-2.5 flex items-center justify-center text-[7px] font-bold border border-black">
                          +
                        </div>
                      </div>
                      <span className="text-[7px] text-neutral-300 truncate max-w-[40px]">Seu story</span>
                    </div>

                    {/* Story 2: Café-da-manhã */}
                    <div className="flex flex-col items-center shrink-0 space-y-0.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-neutral-600 p-[1px]">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" 
                          alt="Café-da-manhã" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="text-[7px] text-neutral-300 truncate max-w-[46px]">Café-da-m...</span>
                    </div>

                    {/* Story 3: Arte Urbana */}
                    <div className="flex flex-col items-center shrink-0 space-y-0.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-neutral-600 p-[1px]">
                        <img 
                          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=100" 
                          alt="Arte Urbana" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="text-[7px] text-neutral-300 truncate max-w-[44px]">Arte Urbana</span>
                    </div>

                    {/* Story 4: Simba */}
                    <div className="flex flex-col items-center shrink-0 space-y-0.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-neutral-600 p-[1px]">
                        <img 
                          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=100" 
                          alt="Simba" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="text-[7px] text-neutral-300 truncate max-w-[34px]">Simba</span>
                    </div>

                    {/* Story 5: Couro Novo */}
                    <div className="flex flex-col items-center shrink-0 space-y-0.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-neutral-600 p-[1px]">
                        <img 
                          src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=100" 
                          alt="Couro Novo" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="text-[7px] text-neutral-300 truncate max-w-[40px]">Couro Novo</span>
                    </div>

                    {/* Story 6: Viage */}
                    <div className="flex flex-col items-center shrink-0 space-y-0.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-neutral-600 p-[1px]">
                        <img 
                          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=100" 
                          alt="Viage" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="text-[7px] text-neutral-300 truncate max-w-[34px]">Viage</span>
                    </div>

                  </div>

                  {/* 2x2 Feed Grid */}
                  <div className="grid grid-cols-2 gap-1.5 flex-1 overflow-hidden pt-0.5">
                    
                    {/* Top Left Card: @m_filipe */}
                    <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col justify-end">
                      <img 
                        src={outfitMFilipe} 
                        alt="@m_filipe outfit" 
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"></div>
                      <div className="relative p-1.5 flex justify-between items-center z-10 w-full">
                        <div className="flex items-center space-x-1 min-w-0">
                          <img 
                            src={outfitMFilipe} 
                            className="w-3.5 h-3.5 rounded-full object-cover border border-white/50 shrink-0" 
                            alt="Avatar" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[7px] font-medium text-white truncate">@m_filipe</span>
                        </div>
                        <div className="flex items-center space-x-1 text-white/90 shrink-0">
                          <RotateCw className="w-2.5 h-2.5" />
                          <Heart className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Top Right Card: @camila_fashion_d. */}
                    <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col justify-end">
                      <img 
                        src={outfitCamila} 
                        alt="@camila_fashion_d. outfit" 
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"></div>
                      <div className="relative p-1.5 flex justify-between items-center z-10 w-full">
                        <div className="flex items-center space-x-1 min-w-0">
                          <img 
                            src={outfitCamila} 
                            className="w-3.5 h-3.5 rounded-full object-cover border border-white/50 shrink-0" 
                            alt="Avatar" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[7px] font-medium text-white truncate">@camila_fashion_d.</span>
                        </div>
                        <div className="flex items-center space-x-1 text-white/90 shrink-0">
                          <RotateCw className="w-2.5 h-2.5" />
                          <Heart className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Left Card */}
                    <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col justify-between p-1.5">
                      <img 
                        src={outfitPatterned} 
                        alt="Outfit" 
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="relative ml-auto bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[7.5px] flex items-center space-x-0.5 z-10">
                        <Heart className="w-2.5 h-2.5 text-white" />
                        <span>1.2M</span>
                      </div>
                    </div>

                    {/* Bottom Right Card */}
                    <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col justify-between p-1.5">
                      <img 
                        src={outfitBlazer} 
                        alt="Outfit" 
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="relative ml-auto bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[7.5px] flex items-center space-x-0.5 z-10">
                        <Heart className="w-2.5 h-2.5 text-white" />
                        <span>1.2M</span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Phone 1: @rickzinxx Profile Calendar OOTD (Front / Left tilted) */}
              <div className="absolute left-2 sm:left-6 top-0 w-[270px] sm:w-[295px] h-[520px] sm:h-[560px] bg-[#000000] rounded-[44px] p-2.5 shadow-2xl border-[6px] border-[#2B2B2B] transform rotate-[-8deg] group-hover:rotate-[-6deg] transition-all duration-500 ease-out z-10 overflow-hidden">
                <div className="w-full h-full bg-[#0a0a0a] rounded-[36px] overflow-hidden text-white flex flex-col font-sans relative p-2.5 space-y-1.5 select-none">
                  
                  {/* Header Top Bar */}
                  <div className="flex justify-between items-center px-1 pt-0.5">
                    <span className="font-semibold text-xs tracking-tight text-white">@rickzinxx</span>
                    <div className="flex items-center space-x-2">
                      <button className="bg-[#a82424] text-white text-[9px] px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                        Convidar
                      </button>
                      <Share2 className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                  </div>

                  {/* Profile Section */}
                  <div className="flex items-center justify-between px-1 pt-0.5">
                    <div className="flex items-center space-x-2.5">
                      {/* Avatar with Zap Badge */}
                      <div className="relative">
                        <img 
                          src={rickAvatar} 
                          alt="Rick" 
                          className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -top-1 -right-1 bg-neutral-800 text-white border border-neutral-600 text-[6px] px-1 rounded-full flex items-center space-x-0.5">
                          <span>⚡</span>
                          <span>0</span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="text-left">
                        <div className="flex items-center space-x-1">
                          <h3 className="font-bold text-xs text-white">rick</h3>
                          <span className="bg-[#a82424] text-white text-[6px] rounded-full w-2.5 h-2.5 flex items-center justify-center font-bold">✓</span>
                        </div>
                        <p className="text-[8.5px] text-gray-400 mt-0.5">0 Seguidores / 0 Seguindo</p>
                      </div>
                    </div>

                    <Settings className="w-3.5 h-3.5 text-gray-400" />
                  </div>

                  {/* Location & Badges Row */}
                  <div className="flex justify-between items-center px-1 text-[8.5px] text-gray-300">
                    <div className="flex items-center space-x-1 font-medium">
                      <MapPin className="w-2.5 h-2.5 fill-[#a82424] text-[#a82424]" />
                      <span className="text-gray-300">Recife</span>
                    </div>
                    
                    <div className="bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-full flex items-center space-x-1 text-[8px] text-gray-300">
                      <Lock className="w-2.5 h-2.5 text-gray-400" />
                      <span>0 / 12</span>
                      <BarChart2 className="w-2.5 h-2.5 text-gray-400" />
                    </div>
                  </div>

                  {/* Tabs Bar */}
                  <div className="flex justify-around items-center pt-1.5 pb-1 border-b border-neutral-900 text-neutral-400">
                    <div className="flex flex-col items-center cursor-pointer">
                      <Calendar className="w-4 h-4 text-white" />
                      <div className="w-7 h-[2px] bg-white rounded-full mt-1"></div>
                    </div>
                    <Camera className="w-4 h-4 hover:text-white" />
                    <Shirt className="w-4 h-4 hover:text-white" />
                    <BarChart2 className="w-4 h-4 hover:text-white" />
                  </div>

                  {/* Section Title & Nav */}
                  <div className="px-1 pt-1 flex justify-between items-end">
                    <div className="text-left">
                      <h4 className="font-bold text-xs text-white leading-tight">Julho De 2026</h4>
                      <p className="text-[8px] text-gray-400">Recife</p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <ChevronLeft className="w-3 h-3 cursor-pointer" />
                      <ChevronRight className="w-3 h-3 cursor-pointer" />
                      <Share2 className="w-2.5 h-2.5 cursor-pointer" />
                    </div>
                  </div>

                  {/* Weather Row */}
                  <div className="grid grid-cols-6 gap-1 px-0.5 py-1 text-center border-b border-neutral-900/60">
                    {/* Col 1 */}
                    <div className="flex flex-col items-center space-y-0.5">
                      <span className="text-[7.5px] text-gray-400 font-medium">S</span>
                      <span className="w-4 h-4 rounded-full border border-white text-white flex items-center justify-center text-[7.5px] font-bold">25</span>
                      <CloudRain className="w-2.5 h-2.5 text-gray-300 my-0.5" />
                      <span className="text-[7px] text-white font-semibold">26°</span>
                      <span className="text-[6.5px] text-gray-400">19°</span>
                    </div>

                    {/* Col 2 */}
                    <div className="flex flex-col items-center space-y-0.5">
                      <span className="text-[7.5px] text-gray-400 font-medium">D</span>
                      <span className="text-[7.5px] text-white font-semibold">26</span>
                      <CloudRain className="w-2.5 h-2.5 text-gray-400 my-0.5" />
                      <span className="text-[7px] text-white font-semibold">26°</span>
                      <span className="text-[6.5px] text-gray-400">20°</span>
                    </div>

                    {/* Col 3 */}
                    <div className="flex flex-col items-center space-y-0.5">
                      <span className="text-[7.5px] text-gray-400 font-medium">S</span>
                      <span className="text-[7.5px] text-white font-semibold">27</span>
                      <CloudRain className="w-2.5 h-2.5 text-gray-400 my-0.5" />
                      <span className="text-[7px] text-white font-semibold">26°</span>
                      <span className="text-[6.5px] text-gray-400">20°</span>
                    </div>

                    {/* Col 4 */}
                    <div className="flex flex-col items-center space-y-0.5">
                      <span className="text-[7.5px] text-gray-400 font-medium">T</span>
                      <span className="text-[7.5px] text-white font-semibold">28</span>
                      <CloudSun className="w-2.5 h-2.5 text-gray-400 my-0.5" />
                      <span className="text-[7px] text-white font-semibold">27°</span>
                      <span className="text-[6.5px] text-gray-400">18°</span>
                    </div>

                    {/* Col 5 */}
                    <div className="flex flex-col items-center space-y-0.5">
                      <span className="text-[7.5px] text-gray-400 font-medium">Q</span>
                      <span className="text-[7.5px] text-white font-semibold">29</span>
                      <CloudRain className="w-2.5 h-2.5 text-gray-400 my-0.5" />
                      <span className="text-[7px] text-white font-semibold">27°</span>
                      <span className="text-[6.5px] text-gray-400">19°</span>
                    </div>

                    {/* Col 6 */}
                    <div className="flex flex-col items-center space-y-0.5">
                      <span className="text-[7.5px] text-gray-400 font-medium">Q</span>
                      <span className="text-[7.5px] text-white font-semibold">30</span>
                      <CloudSun className="w-2.5 h-2.5 text-gray-400 my-0.5" />
                      <span className="text-[7px] text-white font-semibold">29°</span>
                      <span className="text-[6.5px] text-gray-400">19°</span>
                    </div>
                  </div>

                  {/* Calendar Month Header */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[7.5px] text-gray-400 font-medium pt-0.5">
                    <span>Se</span><span>Te</span><span>Qu</span><span>Qu</span><span>Se</span><span>Sá</span><span>Do</span>
                  </div>

                  {/* Calendar 31-Day Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[7.5px] font-medium text-gray-300 pt-0.5 pb-1">
                    {/* Row 1: empty 1, empty 2, 1, 2, 3, 4, 5 */}
                    <span></span><span></span>
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>

                    {/* Row 2 */}
                    <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>

                    {/* Row 3 */}
                    <span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span>

                    {/* Row 4 */}
                    <span>20</span><span>21</span><span>22</span><span>23</span><span>24</span>
                    <span className="w-4 h-4 bg-white text-black font-bold rounded-full mx-auto flex items-center justify-center">25</span>
                    <span>26</span>

                    {/* Row 5 */}
                    <span>27</span><span>28</span><span>29</span><span>30</span><span>31</span>
                  </div>

                  {/* Bottom Floating Nav Bar */}
                  <div className="mt-auto pt-0.5">
                    <div className="bg-[#121212] border border-neutral-800 rounded-full px-3 py-1 flex justify-between items-center text-gray-400">
                      <Home className="w-3.5 h-3.5 text-white" />
                      <Search className="w-3.5 h-3.5 hover:text-white" />
                      <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow">
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <MessageCircle className="w-3.5 h-3.5 hover:text-white" />
                      <img 
                        src={rickAvatar} 
                        alt="User Profile" 
                        className="w-3.5 h-3.5 rounded-full border border-white object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Copy, Member count, Store Badges strictly matching screenshot */}
          <div className="lg:col-span-5 flex flex-col items-start text-left space-y-8 pl-0 lg:pl-4">
            
            {/* App Store & Google Play Store Badges matching Image 3 & Image 4 */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Apple App Store Badge */}
              <button 
                onClick={() => setActiveModal('download')}
                className="bg-[#000000] text-white px-4 py-2.5 rounded-xl flex items-center space-x-3 hover:bg-neutral-800 transition shadow-sm active:scale-95 cursor-pointer border border-black"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.02.12-9.88-1.93-14.58-6.15-3.35-2.88-7.22-7.58-11.62-14.1-6.15-9.17-11.03-19.16-14.65-29.98-3.62-10.82-5.43-21.2-5.43-31.14 0-14.24 3.63-26.11 10.89-35.61 7.26-9.5 16.53-14.34 27.81-14.52 4.81 0 10.04 1.18 15.68 3.54 5.64 2.36 9.4 3.54 11.28 3.54 1.63 0 5.42-1.18 11.37-3.54 5.95-2.36 10.82-3.42 14.61-3.18 8.13.5 15.34 3.12 21.62 7.87 6.28 4.75 10.74 10.97 13.38 18.66-12.37 7.48-18.44 17.65-18.2 30.52.24 10.13 4.1 18.61 11.58 25.44 7.48 6.83 16.27 10.59 26.37 11.28-2.61 7.82-6.12 15.36-10.53 22.62zM119.22 31.8c0-7.38 2.68-14.34 8.04-20.88 5.36-6.54 12.08-10.37 20.16-11.49.12.98.18 1.83.18 2.56 0 7.32-2.73 14.35-8.19 21.09-5.46 6.74-12.22 10.59-20.28 11.55-.12-.86-.18-1.81-.18-2.83z" />
                </svg>
                <div className="text-left font-sans">
                  <div className="text-[10px] leading-none uppercase tracking-wider text-gray-300 font-medium">Baixar na</div>
                  <div className="text-sm font-semibold tracking-tight text-white leading-tight">App Store</div>
                </div>
              </button>

              {/* Google Play Store Badge */}
              <button 
                onClick={() => setActiveModal('download')}
                className="bg-[#000000] text-white px-4 py-2 rounded-xl flex items-center space-x-3 hover:bg-neutral-900 transition shadow-sm active:scale-95 cursor-pointer border border-neutral-800"
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

            {/* Main Title Section */}
            <div className="space-y-3 pt-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#2f4233] tracking-tight uppercase">
                CLOZ.
              </h2>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-normal text-[#171717] tracking-tight leading-[1.1]">
                Third Space for Fashion
              </h1>
              <p className="text-base sm:text-lg text-[#525252] font-normal max-w-md pt-2 leading-relaxed">
                Registre seus looks. Monte seu closet. Explore o lookbook global.
              </p>
            </div>

          </div>

        </main>
      )}

      {/* Footer strictly matching reference screenshot */}
      <footer className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#525252] gap-4 z-20 border-t border-transparent">
        
        {/* Left Side Links */}
        <div className="flex items-center space-x-6 font-normal">
          <button 
            onClick={() => setActiveModal('privacidade')} 
            className="hover:text-[#171717] transition cursor-pointer"
          >
            Aviso de Privacidade
          </button>
          <button 
            onClick={() => setActiveModal('termos')} 
            className="hover:text-[#171717] transition cursor-pointer"
          >
            Termos de Serviço
          </button>
        </div>

        {/* Right Side Icons & Language */}
        <div className="flex items-center space-x-5 font-normal">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#171717] transition"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>

          <div className="flex items-center space-x-1 cursor-pointer hover:text-[#171717] transition">
            {/* Discord custom icon */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a73.51 73.51 0 0 0 64.32 0c.87.67 1.76 1.35 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.91-72.15zM42.45 65.69c-6.32 0-11.51-5.8-11.51-12.92 0-7.11 5.08-12.92 11.51-12.92 6.47 0 11.62 5.85 11.51 12.92 0 7.12-5.08 12.92-11.51 12.92zm42.24 0c-6.32 0-11.51-5.8-11.51-12.92 0-7.11 5.08-12.92 11.51-12.92 6.47 0 11.62 5.85 11.51 12.92 0 7.12-5.04 12.92-11.51 12.92z"/>
            </svg>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          <div className="flex items-center space-x-1.5 cursor-pointer hover:text-[#171717] transition">
            <span className="text-sm">🇧🇷</span>
            <span>Português</span>
          </div>
        </div>

      </footer>

      {/* Interactive Modal View for Sobre, Lookbook, Ontologia, Privacidade, Termos, Download */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl relative border border-gray-100 text-left space-y-4 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {activeModal === 'sobre' && (
              <>
                <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#2f4233] font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Sobre o Cloz</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Third Space for Fashion
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  Cloz é um espaço calmo e intuitivo onde a moda retoma sua essência lúdica e documental. É seu calendário pessoal de looks, seu catálogo de closet e o lookbook global da comunidade.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  Inspirados pelo conceito de "Terceiro Espaço", conectamos curadores e criadores de estilo ao redor do mundo de forma autêntica e sem ruído de redes sociais tradicionais.
                </p>
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="bg-[#171717] text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-black transition cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </>
            )}

            {activeModal === 'lookbook' && (
              <>
                <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#2f4233] font-bold">
                  <Compass className="w-4 h-4" />
                  <span>Lookbook Global</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Curadoria & Estética
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  O Lookbook Global do Cloz reúne coleções de marcas autorais, arquivos estéticos e combinações de vestir compartilhadas por membros em todo o mundo.
                </p>
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="bg-[#171717] text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-black transition cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </>
            )}

            {activeModal === 'ontologia' && (
              <>
                <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#2f4233] font-bold">
                  <Layers className="w-4 h-4" />
                  <span>Ontologia do Cloz</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Estrutura e Linguagem
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  A ontologia do Cloz organiza o vestir em três pilares fundamentais:
                </p>
                <ul className="text-xs space-y-2 text-gray-700 font-light list-disc pl-5">
                  <li><strong>O Tempo (Calendário):</strong> O look registrado no contexto do dia a dia, clima e ocasião.</li>
                  <li><strong>A Matéria (Closet):</strong> A peça física catalogada com dados de uso, valor e vestibilidade.</li>
                  <li><strong>A Estética (Lookbook Global):</strong> O diálogo visual entre marcas, membros e subculturas de moda.</li>
                </ul>
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="bg-[#171717] text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-black transition cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </>
            )}

            {activeModal === 'download' && (
              <>
                <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#2f4233] font-bold">
                  <Download className="w-4 h-4" />
                  <span>Baixar Cloz</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Aplicativo Mobile
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  O Cloz está disponível para iOS na App Store e Android no Google Play.
                </p>
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="bg-[#171717] text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-black transition cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              </>
            )}

            {activeModal === 'privacidade' && (
              <>
                <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#2f4233] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Aviso de Privacidade</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Sua Privacidade no Cloz
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  Seus dados e registros de closet são protegidos com os mais altos padrões de segurança. Você controla quais looks compartilha e quais mantém em arquivo pessoal.
                </p>
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="bg-[#171717] text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-black transition cursor-pointer"
                  >
                    Entender
                  </button>
                </div>
              </>
            )}

            {activeModal === 'termos' && (
              <>
                <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#2f4233] font-bold">
                  <FileText className="w-4 h-4" />
                  <span>Termos de Serviço</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Termos de Uso
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  Ao utilizar o Cloz, você concorda em manter um ambiente respeitoso, colaborativo e voltado para a expressão artística e compartilhamento consciente de moda.
                </p>
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="bg-[#171717] text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-black transition cursor-pointer"
                  >
                    Concordar
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
