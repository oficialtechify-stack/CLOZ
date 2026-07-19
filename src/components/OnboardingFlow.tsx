import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, X, MapPin, Search, Plus, Bell, Shield, EyeOff, LayoutGrid, Palette, BarChart3, HelpCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { WORLD_COUNTRIES } from '../lib/countries';

interface OnboardingFlowProps {
  profile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
  onLogout: () => void;
  onLanguageChange: (lang: string) => void;
}

const CITIES_LIST = WORLD_COUNTRIES;

const ONBOARDING_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600'
];

export default function OnboardingFlow({ profile, onComplete, onLogout, onLanguageChange }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  // Location selector
  const [selectedCity, setSelectedCity] = useState<typeof CITIES_LIST[0] | null>(null);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);

  // TAP TO START cycling image
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [cutoutImage, setCutoutImage] = useState<string | null>(null);

  // Accessories appearing one by one in digital closet
  const [visibleAccessories, setVisibleAccessories] = useState<number[]>([]);

  // Notification Perm State
  const [showRealNotificationPrompt, setShowRealNotificationPrompt] = useState(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);

  // Background removal cycling
  useEffect(() => {
    if (step === 6) {
      const interval = setInterval(() => {
        setActiveImageIdx((prev) => (prev + 1) % ONBOARDING_IMAGES.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Accessories staggered animations trigger
  useEffect(() => {
    if (step === 8) {
      setVisibleAccessories([]);
      const timers = [
        setTimeout(() => setVisibleAccessories(prev => [...prev, 1]), 600),
        setTimeout(() => setVisibleAccessories(prev => [...prev, 2]), 1200),
        setTimeout(() => setVisibleAccessories(prev => [...prev, 3]), 1800),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  // Check unique username in Firestore
  const checkUsernameUniqueness = async (val: string) => {
    const cleanVal = val.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');
    if (!cleanVal) {
      setUsernameError('');
      setIsUsernameAvailable(false);
      return;
    }
    setCheckingUsername(true);
    setUsernameError('');
    setIsUsernameAvailable(false);

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', cleanVal));
      const querySnapshot = await getDocs(q);
      
      let isTaken = false;
      querySnapshot.forEach((docSnap) => {
        if (docSnap.id !== profile.uid) {
          isTaken = true;
        }
      });

      if (isTaken) {
        setUsernameError('Este nome de usuário não está disponível');
        setIsUsernameAvailable(false);
      } else {
        setUsernameError('');
        setIsUsernameAvailable(true);
      }
    } catch (err) {
      console.error("Error checking username uniqueness:", err);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleNextUsername = async () => {
    if (!isUsernameAvailable || usernameError) return;
    setStep(4);
  };

  const handleSelectCity = (cityObj: typeof CITIES_LIST[0]) => {
    setSelectedCity(cityObj);
    setShowCityModal(false);
  };

  const confirmLocationAndLanguage = () => {
    if (!selectedCity) return;
    
    // Convert location's language to our mapping codes
    let langCode = 'Português';
    if (selectedCity.lang === 'English') langCode = 'English';
    else if (selectedCity.lang === 'Français') langCode = 'Français';
    else if (selectedCity.lang === 'Español') langCode = 'Español';
    else if (selectedCity.lang === 'Română') langCode = 'Español'; // Fallback to Spanish or Portuguese for RO if not explicitly loaded
    else if (selectedCity.lang === '繁體中文') langCode = '繁體中文';

    onLanguageChange(langCode);
    setStep(6);
  };

  const startBackgroundRemoval = async () => {
    setIsRemovingBg(true);
    const chosenImage = ONBOARDING_IMAGES[activeImageIdx];
    
    // Call our real backend remove-bg endpoint
    try {
      // Fetch image and convert to base64
      const response = await fetch(chosenImage);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;
          const apiRes = await fetch('/api/remove-bg', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageBase64: base64data })
          });
          
          if (!apiRes.ok) {
            throw new Error(`HTTP error! status: ${apiRes.status}`);
          }
          const apiData = await apiRes.json();
          if (apiData && apiData.imageBase64) {
            setCutoutImage(apiData.imageBase64);
          } else {
            setCutoutImage(chosenImage); // Fallback if API fails
          }
        } catch (innerErr) {
          console.warn("Inner background removal error:", innerErr);
          setCutoutImage(chosenImage); // Fallback if API fails
        } finally {
          setIsRemovingBg(false);
          setStep(7);
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.warn("Background removal error, using fallback cutout rendering:", err);
      setCutoutImage(chosenImage);
      setIsRemovingBg(false);
      setStep(7);
    }
  };

  const requestNativeNotificationPermission = async () => {
    setShowRealNotificationPrompt(true);
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationPermissionGranted(true);
        }
      } catch (err) {
        console.warn("Notification request permission blocked or failed:", err);
      }
    }
    setTimeout(() => {
      setShowRealNotificationPrompt(false);
      setStep(13);
    }, 1800);
  };

  const completeOnboarding = async (registeredLook: boolean = false) => {
    const updated: UserProfile = {
      ...profile,
      displayName: name || profile.displayName || 'User',
      username: username || profile.username || 'user',
      location: selectedCity ? `${selectedCity.city}, ${selectedCity.country}` : 'San Antonio, United States',
      onboarded: true
    };
    
    // Persist to Firestore
    try {
      const userDocRef = doc(db, 'users', profile.uid);
      await updateDoc(userDocRef, {
        displayName: updated.displayName,
        username: updated.username,
        location: updated.location,
        onboarded: true
      });
    } catch (e) {
      console.error("Failed to update profile onboarded status in Firestore:", e);
    }
    
    // Trigger completion in parent component
    onComplete(updated);
  };

  const filteredCities = CITIES_LIST.filter(c => 
    c.city.toLowerCase().includes(citySearchQuery.toLowerCase()) || 
    c.country.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-y-auto select-none font-sans">
      
      {/* Top Bar with Logo and Sair */}
      <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur z-20">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center">
            <span className="font-display font-extrabold text-[11px] tracking-tight">C</span>
          </div>
          <span className="font-display font-extrabold text-sm tracking-widest uppercase">CLOZ</span>
        </div>
        
        {step < 14 && (
          <button 
            onClick={onLogout}
            className="text-xs text-neutral-400 hover:text-white transition font-mono tracking-wider cursor-pointer"
          >
            Sair
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-md w-full mx-auto px-6 py-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Name choice */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-extrabold tracking-tight">Qual é o seu nome?</h2>
                <p className="text-sm text-neutral-400">Você sempre pode mudar isso depois.</p>
              </div>

              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ex: Confusão Confucionista"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:ring-1 focus:ring-white rounded-2xl px-5 py-4 text-base outline-none transition font-sans"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  disabled={!name.trim()}
                  onClick={() => setStep(2)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${name.trim() ? 'bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer' : 'bg-neutral-800 text-neutral-500 opacity-60 cursor-not-allowed'}`}
                >
                  <ArrowRight className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Unique Username */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-extrabold tracking-tight">Escolha seu nome de usuário</h2>
                <p className="text-sm text-neutral-400">Ele deve ser único no site.</p>
              </div>

              <div className="space-y-2">
                <div className="relative flex items-center">
                  <span className="absolute left-5 text-neutral-400 text-base font-medium font-sans">@</span>
                  <input 
                    type="text"
                    placeholder="rickzinxx"
                    value={username}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
                      setUsername(clean);
                      checkUsernameUniqueness(clean);
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:ring-1 focus:ring-white rounded-2xl pl-10 pr-5 py-4 text-base outline-none transition font-sans"
                  />
                  {checkingUsername && (
                    <div className="absolute right-5 w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  )}
                </div>

                {usernameError && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500 font-semibold px-1"
                  >
                    {usernameError}
                  </motion.p>
                )}

                {!usernameError && isUsernameAvailable && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-emerald-400 font-semibold px-1 flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Nome de usuário disponível</span>
                  </motion.p>
                )}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="text-sm text-neutral-400 hover:text-white transition font-semibold"
                >
                  Voltar
                </button>
                
                <button 
                  disabled={!isUsernameAvailable || !!usernameError}
                  onClick={handleNextUsername}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isUsernameAvailable && !usernameError ? 'bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer' : 'bg-neutral-800 text-neutral-500 opacity-60 cursor-not-allowed'}`}
                >
                  <ArrowRight className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 & 5: Country & City selection (Skyscrapers background) */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col justify-between p-6 bg-cover bg-center"
              style={{ 
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200")'
              }}
            >
              {/* Spacer */}
              <div />

              {/* Central Box */}
              <div className="space-y-6 max-w-sm mx-auto w-full">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-display font-extrabold tracking-tight">De onde você é?</h2>
                  <p className="text-sm text-neutral-400">O estilo não tem fronteiras: diga-nos onde é o seu lar.</p>
                </div>

                <button 
                  onClick={() => setShowCityModal(true)}
                  className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl px-5 py-4 text-left flex items-center justify-between text-base outline-none transition cursor-pointer"
                >
                  {selectedCity ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{selectedCity.flag}</span>
                      <span className="font-semibold">{selectedCity.city}, {selectedCity.country}</span>
                    </div>
                  ) : (
                    <span className="text-neutral-400">Toque para selecionar sua cidade...</span>
                  )}
                  <MapPin className="w-5 h-5 text-neutral-400 shrink-0" />
                </button>

                <div className="flex justify-between items-center pt-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="text-sm text-neutral-400 hover:text-white transition font-semibold"
                  >
                    Voltar
                  </button>
                  
                  <button 
                    disabled={!selectedCity}
                    onClick={confirmLocationAndLanguage}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${selectedCity ? 'bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer' : 'bg-neutral-800 text-neutral-500 opacity-60 cursor-not-allowed'}`}
                  >
                    <ArrowRight className="w-6 h-6 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Footer text */}
              <div className="text-center text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                Cloz Editorial Co.
              </div>

              {/* City selector Modal */}
              <AnimatePresence>
                {showCityModal && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/95 backdrop-blur-md z-30 flex flex-col justify-end"
                  >
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="bg-neutral-900 rounded-t-3xl border-t border-neutral-800 p-6 flex flex-col max-h-[85vh]"
                    >
                      {/* Modal Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold">Localização</span>
                        <button 
                          onClick={() => setShowCityModal(false)}
                          className="p-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Search Bar */}
                      <div className="relative mb-4">
                        <span className="absolute left-4 top-3.5 text-neutral-500">
                          <Search className="w-5 h-5" />
                        </span>
                        <input 
                          type="text"
                          placeholder="Pesquisar cidades..."
                          value={citySearchQuery}
                          onChange={(e) => setCitySearchQuery(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-white transition"
                        />
                      </div>

                      {/* Cities List */}
                      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                        {filteredCities.map((cityObj, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectCity(cityObj)}
                            className="w-full text-left p-3.5 rounded-xl hover:bg-white/5 transition flex items-center justify-between border border-transparent hover:border-white/5 cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{cityObj.flag}</span>
                              <div>
                                <h4 className="font-semibold text-sm">{cityObj.city}</h4>
                                <p className="text-xs text-neutral-500">{cityObj.country}</p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-md font-mono text-neutral-400">
                              {cityObj.lang}
                            </span>
                          </button>
                        ))}

                        {filteredCities.length === 0 && (
                          <p className="text-xs text-neutral-500 text-center py-8">Nenhuma cidade encontrada.</p>
                        )}
                      </div>

                      {/* Cancel / Skip button at bottom */}
                      <button 
                        onClick={() => {
                          setSelectedCity(CITIES_LIST[0]);
                          setShowCityModal(false);
                        }}
                        className="w-full py-3.5 mt-4 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white transition cursor-pointer text-center"
                      >
                        Pular / Usar Padrão
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 6: TOQUE PARA COMEÇAR (TAP TO START) */}
          {step === 6 && (
            <motion.div 
              key="step6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-display font-bold uppercase tracking-widest text-neutral-400">Seu Look Inteligente</h2>
                <p className="text-sm text-neutral-400">Toque na imagem para testar a nossa tecnologia exclusiva de segmentação por IA.</p>
              </div>

              {/* Rounded card image */}
              <div 
                onClick={startBackgroundRemoval}
                className="relative aspect-[3/4] max-w-xs mx-auto rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl cursor-pointer group active:scale-95 transition duration-350"
              >
                <img 
                  src={ONBOARDING_IMAGES[activeImageIdx]} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  alt="Fashion style editorial representation"
                  referrerPolicy="no-referrer"
                />
                
                {/* TOQUE PARA COMEÇAR overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-end items-center p-8">
                  {isRemovingBg ? (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                      <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider animate-pulse uppercase">Removendo Fundo...</span>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 animate-pulse bg-black/60 px-4 py-2 rounded-full border border-emerald-500/20">
                        TOQUE PARA COMEÇAR
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 7: PRIVACIDADE EM PRIMEIRO LUGAR (Privacy First) */}
          {step === 7 && (
            <motion.div 
              key="step7"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-display font-extrabold tracking-tight flex items-center justify-center space-x-2">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <span>PRIVACIDADE EM PRIMEIRO LUGAR</span>
                </h2>
                <p className="text-xs text-neutral-400 px-4">Seu rosto é anonimizado automaticamente com uma barra preta de censura para manter sua total privacidade.</p>
              </div>

              {/* Main cutout viewer */}
              <div className="relative aspect-[3/4] max-w-xs mx-auto rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl flex items-center justify-center">
                
                {/* Dynamic silhouette rendering with eye black stroke */}
                {cutoutImage && (
                  <div className="relative w-full h-full bg-white flex items-center justify-center">
                    <img 
                      src={cutoutImage} 
                      className="w-full h-full object-cover"
                      alt="Segmented cutout model"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Handdrawn look eye black rectangle censorship strip */}
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                      className="absolute top-[32%] w-[42%] h-[20px] bg-black rotate-[-3deg] origin-center shadow-lg border border-black flex items-center justify-center"
                    >
                      <span className="text-[6px] text-white/40 tracking-widest uppercase font-mono font-bold">CLOZ PRIVACY</span>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Dots tracker & Next */}
              <div className="flex flex-col items-center space-y-4 pt-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                </div>

                <button 
                  onClick={() => setStep(8)}
                  className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-neutral-100 transition duration-200 cursor-pointer text-center text-sm uppercase tracking-wider"
                >
                  Próximo
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 8: CLOSET DIGITAL */}
          {step === 8 && (
            <motion.div 
              key="step8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-display font-extrabold tracking-tight flex items-center justify-center space-x-2">
                  <LayoutGrid className="w-6 h-6 text-emerald-400" />
                  <span>CLOSET DIGITAL</span>
                </h2>
                <p className="text-xs text-neutral-400 px-4">Cada peça que você usa é detectada e salva individualmente para compor seu guarda-roupa interativo.</p>
              </div>

              {/* Interactive clothes cutout floating scene */}
              <div className="relative aspect-[3/4] max-w-xs mx-auto rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl flex items-center justify-center">
                
                {/* Silhouette Model background */}
                {cutoutImage && (
                  <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center opacity-40">
                    <img 
                      src={cutoutImage} 
                      className="w-full h-full object-cover filter grayscale"
                      alt="Cutout model silhouette"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Floating tags */}
                {/* Tag 1: Bolsa */}
                {visibleAccessories.includes(1) && (
                  <motion.div 
                    initial={{ scale: 0, x: -30, y: -20 }}
                    animate={{ scale: 1, x: 0, y: 0 }}
                    className="absolute top-12 left-6 bg-black/90 border border-neutral-800 p-3 rounded-2xl flex items-center space-x-2.5 max-w-[140px] shadow-xl"
                  >
                    <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=150" className="w-10 h-10 rounded-lg object-cover shrink-0" alt="bag" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-[10px] font-bold text-white truncate">Bolsa Transversal</h4>
                      <p className="text-[8px] text-emerald-400 font-bold">Lemaire</p>
                    </div>
                  </motion.div>
                )}

                {/* Tag 2: Casaco */}
                {visibleAccessories.includes(2) && (
                  <motion.div 
                    initial={{ scale: 0, x: -40, y: 30 }}
                    animate={{ scale: 1, x: 0, y: 0 }}
                    className="absolute bottom-16 left-6 bg-black/90 border border-neutral-800 p-3 rounded-2xl flex items-center space-x-2.5 max-w-[140px] shadow-xl"
                  >
                    <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=150" className="w-10 h-10 rounded-lg object-cover shrink-0" alt="coat" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-[10px] font-bold text-white truncate">Casaco IENA</h4>
                      <p className="text-[8px] text-emerald-400 font-bold">IENA Studio</p>
                    </div>
                  </motion.div>
                )}

                {/* Tag 3: Relógio */}
                {visibleAccessories.includes(3) && (
                  <motion.div 
                    initial={{ scale: 0, x: 40, y: 10 }}
                    animate={{ scale: 1, x: 0, y: 0 }}
                    className="absolute top-[35%] right-6 bg-black/90 border border-neutral-800 p-3 rounded-2xl flex items-center space-x-2.5 max-w-[140px] shadow-xl"
                  >
                    <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=150" className="w-10 h-10 rounded-lg object-cover shrink-0" alt="watch" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-[10px] font-bold text-white truncate">Relógio Nomos</h4>
                      <p className="text-[8px] text-emerald-400 font-bold">Nomos Glashütte</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Dots tracker & Next */}
              <div className="flex flex-col items-center space-y-4 pt-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                </div>

                <button 
                  onClick={() => setStep(9)}
                  className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-neutral-100 transition duration-200 cursor-pointer text-center text-sm uppercase tracking-wider"
                >
                  Próximo
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 9: ...e ORGANIZADO */}
          {step === 9 && (
            <motion.div 
              key="step9"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-display font-extrabold tracking-tight flex items-center justify-center space-x-2">
                  <LayoutGrid className="w-6 h-6 text-emerald-400" />
                  <span>...e ORGANIZADO</span>
                </h2>
                <p className="text-xs text-neutral-400 px-4">Seu guarda-roupa se constrói e se categoriza automaticamente por tipo de peça para sua facilidade.</p>
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-2 gap-3 aspect-[3/4] max-w-xs mx-auto">
                {[
                  { name: 'Brincos Prateados', cat: 'Acessório', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=150' },
                  { name: 'Relógio Nomos Glashütte', cat: 'Acessório', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=150' },
                  { name: 'Bolsa Transversal Lemaire', cat: 'Acessório', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=150' },
                  { name: 'Casaco de Outono IENA', cat: 'Jaqueta', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=150' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="bg-neutral-900 border border-neutral-850 p-3 rounded-2xl flex flex-col space-y-2 justify-between"
                  >
                    <img src={item.img} className="w-full h-24 object-cover rounded-lg" alt={item.name} referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-[10px] font-bold text-white truncate leading-tight">{item.name}</h4>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono uppercase mt-1 inline-block">{item.cat}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Dots tracker & Next */}
              <div className="flex flex-col items-center space-y-4 pt-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                </div>

                <button 
                  onClick={() => setStep(10)}
                  className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-neutral-100 transition duration-200 cursor-pointer text-center text-sm uppercase tracking-wider"
                >
                  Próximo
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 10: CORES */}
          {step === 10 && (
            <motion.div 
              key="step10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-display font-extrabold tracking-tight flex items-center justify-center space-x-2">
                  <Palette className="w-6 h-6 text-emerald-400" />
                  <span>ANÁLISE DE CORES</span>
                </h2>
                <p className="text-xs text-neutral-400 px-4">Detectamos as cores dominantes das suas composições para facilitar combinações e novas inspirações cromáticas.</p>
              </div>

              {/* Stats chart representation */}
              <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-6 space-y-6 aspect-[3/4] max-w-xs mx-auto flex flex-col justify-center">
                
                {/* Mock Outfit image top */}
                <div className="w-14 h-14 rounded-full mx-auto border-2 border-emerald-500 bg-white overflow-hidden shadow-xl flex items-center justify-center shrink-0">
                  <img src={cutoutImage || ONBOARDING_IMAGES[0]} className="w-full h-full object-cover" alt="outfit center" referrerPolicy="no-referrer" />
                </div>

                <div className="space-y-4">
                  {/* Color 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold flex items-center space-x-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#3B444B] border border-neutral-700 inline-block shrink-0" />
                        <span className="font-mono">Arsênico</span>
                      </span>
                      <span className="font-bold font-mono">77%</span>
                    </div>
                    <div className="h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-850">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "77%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-[#3B444B] rounded-full"
                      />
                    </div>
                  </div>

                  {/* Color 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold flex items-center space-x-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#000000] border border-neutral-700 inline-block shrink-0" />
                        <span className="font-mono">Preto Absoluto</span>
                      </span>
                      <span className="font-bold font-mono">23%</span>
                    </div>
                    <div className="h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-850">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "23%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-[#000000] rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-center text-neutral-500 italic font-mono uppercase">
                  Detecção cromática processada via Gemini AI Vision
                </p>
              </div>

              {/* Dots tracker & Next */}
              <div className="flex flex-col items-center space-y-4 pt-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                </div>

                <button 
                  onClick={() => setStep(11)}
                  className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-neutral-100 transition duration-200 cursor-pointer text-center text-sm uppercase tracking-wider"
                >
                  Próximo
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 11: ESTÉTICAS */}
          {step === 11 && (
            <motion.div 
              key="step11"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-display font-extrabold tracking-tight flex items-center justify-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                  <span>ESTÉTICAS E TENDÊNCIAS</span>
                </h2>
                <p className="text-xs text-neutral-400 px-4">Identificamos o estilo e a estética predominante de cada composição sua para ajudar no seu alinhamento fashion.</p>
              </div>

              {/* Aesthetics layout */}
              <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-6 space-y-5 aspect-[3/4] max-w-xs mx-auto flex flex-col justify-center">
                {[
                  { name: 'Monástico', score: 82, badge: 'Alta' },
                  { name: 'Androginia', score: 64, badge: 'Média-Alta' },
                  { name: 'Parisiense', score: 45, badge: 'Moderada' },
                  { name: 'Sotto', score: 20, badge: 'Sutil' }
                ].map((ae, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">{ae.name}</span>
                      <span className="font-mono text-[9px] bg-white/10 px-2 py-0.5 rounded text-neutral-300">{ae.badge} ({ae.score}%)</span>
                    </div>
                    <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-850">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${ae.score}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots tracker & Next */}
              <div className="flex flex-col items-center space-y-4 pt-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>

                <button 
                  onClick={() => setStep(12)}
                  className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-neutral-100 transition duration-200 cursor-pointer text-center text-sm uppercase tracking-wider"
                >
                  Próximo
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 12: Notification Permission Request (WORKS FOR REAL) */}
          {step === 12 && (
            <motion.div 
              key="step12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center relative"
            >
              <div className="space-y-3">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Bell className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-display font-extrabold tracking-tight">Ativar Notificações</h2>
                <p className="text-xs text-neutral-400 px-6">Receba atualizações de curtidas, novos seguidores, propostas de compra e relatórios diários de estilo.</p>
              </div>

              {/* Custom High-Fidelity OS Alert Popup simulator */}
              <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-3xl aspect-[3/4] max-w-xs mx-auto flex flex-col justify-center items-center relative overflow-hidden">
                
                {/* Simulated iOS Alert Popup */}
                <motion.div 
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-5 text-center space-y-3 shadow-2xl relative z-10"
                >
                  <h3 className="text-sm font-bold leading-tight">"Cloz" Gostaria de Enviar Notificações</h3>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Notificações podem incluir alertas, sons e avisos nos ícones. Podem ser configuradas nos Ajustes do seu sistema operacional.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 border-t border-neutral-850 pt-3">
                    <button 
                      onClick={() => setStep(13)}
                      className="text-xs text-neutral-500 hover:text-white transition py-2 font-medium cursor-pointer"
                    >
                      Não Permitir
                    </button>
                    <button 
                      onClick={requestNativeNotificationPermission}
                      className="text-xs text-emerald-400 hover:text-emerald-350 transition py-2 font-bold cursor-pointer"
                    >
                      Permitir
                    </button>
                  </div>
                </motion.div>
                
                {/* Realistic Web API status notification banner */}
                {showRealNotificationPrompt && (
                  <motion.div 
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute top-4 left-4 right-4 bg-emerald-500 text-black text-[9px] font-mono py-2 px-3 rounded-lg flex items-center space-x-1.5 shadow-lg z-25"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-black animate-ping shrink-0" />
                    <span>Disparando solicitação nativa do navegador...</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 13: Ready? Register look or skip */}
          {step === 13 && (
            <motion.div 
              key="step13"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-extrabold tracking-tight">Pronto? Poste seu look.</h2>
                <p className="text-sm text-neutral-400">Comece postando sua primeira composição para a IA processar ou pule para o perfil.</p>
              </div>

              {/* Main Green + action circle */}
              <div className="aspect-[3/4] max-w-xs mx-auto rounded-3xl bg-neutral-900 border border-neutral-850 shadow-2xl flex flex-col justify-center items-center p-6 space-y-6">
                <button 
                  onClick={() => completeOnboarding(true)}
                  className="w-20 h-20 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20"
                >
                  <Plus className="w-9 h-9 stroke-[2.5]" />
                </button>
                
                <span className="text-xs text-neutral-500 uppercase tracking-widest font-mono">
                  Toque para registrar com IA
                </span>
              </div>

              <button 
                onClick={() => setStep(14)}
                className="text-sm text-neutral-400 hover:text-white font-semibold transition py-2 underline"
              >
                Pular esta etapa
              </button>
            </motion.div>
          )}

          {/* STEP 14: CLOZ Brand Page (About CLOZ) */}
          {step === 14 && (
            <motion.div 
              key="step14"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8 text-center"
            >
              {/* Cloz Custom Design Logo */}
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-extrabold text-2xl tracking-tight">C</span>
                </div>
                <h1 className="text-4xl font-display font-black tracking-widest">CLOZ</h1>
                <p className="text-[10px] text-emerald-400 font-mono tracking-[0.25em] uppercase">The Digital Dressing Room</p>
              </div>

              {/* Highly Poetic Brand manifesto lines as shown in screenshot */}
              <div className="space-y-4 max-w-xs mx-auto text-center border-y border-neutral-900 py-6 font-display">
                <p className="text-xs font-semibold leading-relaxed tracking-wider text-neutral-200">
                  VESTIR-SE BEM É OUVIR COM OS OLHOS
                </p>
                <p className="text-xs font-semibold leading-relaxed tracking-wider text-neutral-200">
                  LUXO É ATRITO APLICADO COM INTENÇÃO
                </p>
                <p className="text-xs font-semibold leading-relaxed tracking-wider text-neutral-200">
                  O USO DA PEÇA RESIDE EM SEU ESPAÇO PARA RESPIRAR
                </p>
              </div>

              {/* Black/white entering button */}
              <button 
                onClick={() => completeOnboarding(false)}
                className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-neutral-200 transition duration-300 cursor-pointer text-center text-sm uppercase tracking-widest font-bold"
              >
                Entrar
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Progress Footer indicator */}
      <div className="px-6 py-4 border-t border-neutral-900 bg-black flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
        <span>PASSO {step} DE 14</span>
        <span>{selectedCity ? selectedCity.city : 'Localização Pendente'}</span>
      </div>
    </div>
  );
}
