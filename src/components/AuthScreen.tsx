import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';
import { Lock, Mail, User, MapPin, Sparkles, AlertCircle, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthScreenProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

const backgroundImages = [
  'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1200&auto=format&fit=crop', // Cap & streetwear hoodie
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop', // Techwear urban look
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', // Oversized yellow hoodie & beanie style
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop', // Clean aesthetics & street fashion
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop', // Moody street look with coat
];

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Background random style crossfading interval
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const avatarsPreset = [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!username || !displayName) {
          throw new Error('Por favor, preencha todos os campos obrigatórios.');
        }
        
        const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_.]/g, '');
        if (cleanUsername.length < 3) {
          throw new Error('O nome de usuário deve ter pelo menos 3 caracteres.');
        }

        // Check if username already exists in Firestore
        const usernameQuery = query(collection(db, 'users'), where('username', '==', cleanUsername));
        const usernameSnapshot = await getDocs(usernameQuery);
        if (!usernameSnapshot.empty) {
          throw new Error('Este nome de usuário já está sendo usado por outra pessoa. Escolha outro.');
        }
        
        // 1. Create firebase user using standard firebase auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // 2. Create clean user profile with NO fake statistics (0 everywhere)
        const newProfile: UserProfile & { email?: string } = {
          uid,
          username: cleanUsername,
          displayName,
          avatar,
          bio: bio || '',
          location: location || '',
          followersCount: 0,
          followingCount: 0,
          auraScore: 0,
          totalOutfits: 0,
          email: email.toLowerCase()
        };

        // 3. Save profile in Firestore
        await setDoc(doc(db, 'users', uid), newProfile);

        // Success! Take them to login page pre-filled
        setSignupSuccess(true);
        setIsSignUp(false);
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        // Fetch the profile from Firestore
        let loggedInProfile: any = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            loggedInProfile = userDoc.data();
          }
        } catch (firestoreError) {
          console.warn("Firestore offline or error on email login, using fallback:", firestoreError);
        }

        if (!loggedInProfile) {
          // Fallback if profile doesn't exist yet for some reason or Firestore is offline
          loggedInProfile = {
            uid,
            username: email.toLowerCase().split('@')[0].replace(/[^a-z0-9_.]/g, ''),
            displayName: email.split('@')[0],
            avatar,
            bio: '',
            location: '',
            followersCount: 0,
            followingCount: 0,
            auraScore: 0,
            totalOutfits: 0,
            email: email.toLowerCase()
          };
          // Try to save to Firestore in background, ignore error
          setDoc(doc(db, 'users', uid), loggedInProfile).catch(e => console.warn("Background setDoc failed:", e));
        }

        // Store in local storage for session durability in Sandbox frames
        localStorage.setItem('cloz_profile', JSON.stringify(loggedInProfile));
        localStorage.setItem('cloz_user', JSON.stringify({ uid: loggedInProfile.uid, email: loggedInProfile.email }));

        // Complete login successfully
        onAuthSuccess(loggedInProfile);
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || '';
      const errCode = err.code || '';
      
      if (errCode === 'auth/email-already-in-use' || errMsg.includes('auth/email-already-in-use')) {
        setError('Este e-mail já está cadastrado. Por favor, faça login ou use outro e-mail.');
      } else if (errCode === 'auth/weak-password' || errMsg.includes('auth/weak-password')) {
        setError('A senha precisa ter pelo menos 6 caracteres.');
      } else if (errCode === 'auth/invalid-email' || errMsg.includes('auth/invalid-email')) {
        setError('Por favor, insira um endereço de e-mail válido.');
      } else if (
        errCode === 'auth/user-not-found' || 
        errCode === 'auth/wrong-password' || 
        errCode === 'auth/invalid-credential' ||
        errMsg.includes('auth/user-not-found') ||
        errMsg.includes('auth/wrong-password') ||
        errMsg.includes('auth/invalid-credential')
      ) {
        setError('Credenciais incorretas. Verifique seu e-mail e senha.');
      } else {
        setError(err.message || 'Ocorreu um erro ao realizar a autenticação.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      let loggedInProfile: UserProfile;
      try {
        // Check if profile exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          loggedInProfile = userDoc.data() as UserProfile;
        } else {
          // Create user profile with no fake stats (0 everywhere)
          let baseUsername = user.email ? user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '') : `user_${user.uid.slice(0, 5)}`;
          if (!baseUsername) baseUsername = `user_${user.uid.slice(0, 5)}`;
          
          let uniqueUsername = baseUsername;
          let isUnique = false;
          let attempts = 0;
          try {
            while (!isUnique && attempts < 10) {
              const uQuery = query(collection(db, 'users'), where('username', '==', uniqueUsername));
              const uSnapshot = await getDocs(uQuery);
              if (uSnapshot.empty) {
                isUnique = true;
              } else {
                attempts++;
                uniqueUsername = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
              }
            }
          } catch (e) {
            console.warn("Could not check username uniqueness from Firestore, using random suffix:", e);
            uniqueUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
          }

          loggedInProfile = {
            uid: user.uid,
            username: uniqueUsername,
            displayName: user.displayName || user.email?.split('@')[0] || 'Usuário',
            avatar: user.photoURL || avatarsPreset[0],
            bio: '',
            location: '',
            followersCount: 0,
            followingCount: 0,
            auraScore: 0,
            totalOutfits: 0,
            email: user.email?.toLowerCase() || ''
          };
          await setDoc(doc(db, 'users', user.uid), loggedInProfile);
        }
      } catch (firestoreError: any) {
        console.warn("Firestore error during Google sign-in. Falling back to local profile generation to prevent offline crash:", firestoreError);
        
        let baseUsername = user.email ? user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '') : `user_${user.uid.slice(0, 5)}`;
        if (!baseUsername) baseUsername = `user_${user.uid.slice(0, 5)}`;
        let uniqueUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;

        loggedInProfile = {
          uid: user.uid,
          username: uniqueUsername,
          displayName: user.displayName || user.email?.split('@')[0] || 'Usuário',
          avatar: user.photoURL || avatarsPreset[0],
          bio: '',
          location: '',
          followersCount: 0,
          followingCount: 0,
          auraScore: 0,
          totalOutfits: 0,
          email: user.email?.toLowerCase() || ''
        };
        
        // Save in background if possible, don't block
        setDoc(doc(db, 'users', user.uid), loggedInProfile).catch(e => {
          console.warn("Failed background setDoc:", e);
        });
      }
      
      // Store in local storage for session durability in Sandbox frames
      localStorage.setItem('cloz_profile', JSON.stringify(loggedInProfile));
      localStorage.setItem('cloz_user', JSON.stringify({ uid: loggedInProfile.uid, email: user.email }));

      // Complete login successfully
      onAuthSuccess(loggedInProfile);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || '';
      if (errMsg.includes('auth/popup-closed-by-user')) {
        setError('O login com Google foi cancelado ou o pop-up foi fechado pelo usuário.');
      } else if (errMsg.includes('auth/popup-blocked')) {
        setError('O pop-up de login do Google foi bloqueado pelo seu navegador. Por favor, permita pop-ups.');
      } else {
        setError(err.message || 'Erro ao entrar com o Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between overflow-hidden text-white bg-black rounded-3xl select-none">
      
      {/* Animated Streetwear Backgrounds with overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgIndex}
            src={backgroundImages[bgIndex]}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="w-full h-full object-cover brightness-[0.72] contrast-[1.05]"
            alt="Dynamic Streetwear background"
          />
        </AnimatePresence>
        
        {/* Shadow Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/35 z-10" />
      </div>

      {/* Top right language selector exactly like image */}
      <div className="absolute top-5 right-5 z-20">
        <button 
          type="button"
          onClick={() => {
            alert('Idioma definido como Português (Brasil).');
          }}
          className="flex items-center space-x-1.5 bg-black/35 backdrop-blur-md border border-white/15 text-white font-sans text-xs font-semibold px-4 py-2 rounded-full transition hover:bg-black/55 active:scale-95 cursor-pointer shrink-0 shadow-xs"
        >
          <span>Português</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/80 stroke-[2.5]" />
        </button>
      </div>

      {/* Bottom Main Content exact layout */}
      <div className="mt-auto w-full z-20 px-6.5 pb-6 pt-20 bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col">
        
        {/* Title and brand */}
        <div className="mb-6.5 space-y-1.5 text-left">
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/75 font-black block leading-none">
            LEKONDO
          </span>
          <h1 className="font-display font-black text-4.5xl text-white tracking-tight leading-none">
            Third Space <br />
            for Fashion
          </h1>
        </div>

        {/* Buttons Grid */}
        <div className="space-y-3.5">
          
          {/* Continuar com Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-neutral-50 text-black py-3.8 px-6 rounded-full text-[13.5px] font-bold flex items-center justify-center space-x-2.5 transition active:scale-98 shadow-md cursor-pointer text-center"
          >
            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Continuar com Google</span>
          </button>

          {/* Continuar com E-mail */}
          <button
            type="button"
            onClick={() => {
              setShowEmailModal(true);
              setIsSignUp(false);
              setError('');
            }}
            className="w-full bg-[#22442B] hover:bg-[#1C3622] text-white py-3.8 px-6 rounded-full text-[13.5px] font-bold flex items-center justify-center space-x-2.5 transition active:scale-98 shadow-md cursor-pointer text-center"
          >
            <Mail className="w-4.5 h-4.5 text-white stroke-[2px]" />
            <span>Continuar com E-mail</span>
          </button>
        </div>

        {/* Footer exactly like image */}
        <p className="text-[10px] text-white/50 text-center mt-5 leading-relaxed max-w-[290px] mx-auto font-sans font-medium">
          Ao continuar, você concorda com nossos{' '}
          <a href="#" onClick={(e) => e.preventDefault()} className="underline text-white/70 hover:text-white transition">Termos de Serviço</a>
          {' '}e{' '}
          <a href="#" onClick={(e) => e.preventDefault()} className="underline text-white/70 hover:text-white transition">Política de Privacidade</a>
        </p>

        {/* Version indicators */}
        <span className="text-[10px] text-white/35 text-center mt-3 font-mono">
          Versão 1.63.36
        </span>
      </div>

      {/* Beautiful Modal Bottom Sheet for Email authentication flow */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="absolute inset-0 z-40 bg-black/65 backdrop-blur-xs flex flex-col justify-end rounded-3xl">
            {/* Overlay background click to close */}
            <div className="absolute inset-0 z-0" onClick={() => setShowEmailModal(false)} />

            {/* Slide up sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative z-10 w-full max-h-[85%] bg-[#121212]/95 backdrop-blur-2xl border-t border-white/12 rounded-t-3xl p-6 flex flex-col overflow-y-auto"
            >
              {/* Grab bar */}
              <div 
                className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 cursor-pointer shrink-0" 
                onClick={() => setShowEmailModal(false)} 
              />

              {/* Title Section */}
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div>
                  <h3 className="font-display font-black text-lg text-white leading-tight">
                    {isSignUp ? 'Criar Conta' : 'Entrar com E-mail'}
                  </h3>
                  <p className="text-[10.5px] text-white/60">
                    {isSignUp ? 'Faça parte da nossa rede de estilo.' : 'Acesse seu guarda-roupa digital.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="text-[11px] text-white/55 hover:text-white px-3 py-1.5 rounded-full border border-white/10 bg-white/5 font-bold transition active:scale-95 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              {/* Error box */}
              {error && (
                <div className="bg-red-950/40 border border-red-900/40 p-3 rounded-2xl flex items-start space-x-2 text-[11px] text-red-200 mb-4 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Sign Up indicator */}
              {signupSuccess && !isSignUp && (
                <div className="bg-emerald-950/40 border border-emerald-900/40 p-3.5 rounded-2xl flex items-start space-x-2 text-[11px] text-emerald-200 mb-4 animate-fadeIn">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">Conta criada com sucesso!</p>
                    <p className="mt-0.5 text-emerald-300/80">Sua conta foi criada no Firebase de verdade. Digite sua senha para entrar.</p>
                  </div>
                </div>
              )}

              {/* Interactive Form */}
              <form onSubmit={handleAuth} className="space-y-4 text-left">
                
                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block font-bold">Endereço de E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-white/5 border border-white/8 pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-white/25 outline-none focus:bg-white/10 focus:border-white/20 transition"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block font-bold">Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha (mín. 6 dígitos)"
                      className="w-full bg-white/5 border border-white/8 pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-white/25 outline-none focus:bg-white/10 focus:border-white/20 transition"
                    />
                  </div>
                </div>

                {/* Additional registration fields when isSignUp is active */}
                {isSignUp && (
                  <div className="space-y-4 pt-4 border-t border-white/8 mt-4 animate-fadeIn">
                    
                    {/* Username */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block font-bold">Nome de Usuário (@)</label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                        <input 
                          type="text" 
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="ex: rickzin"
                          className="w-full bg-white/5 border border-white/8 pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-white/25 outline-none focus:bg-white/10 focus:border-white/20 transition"
                        />
                      </div>
                    </div>

                    {/* Display name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block font-bold">Nome de Exibição</label>
                      <input 
                        type="text" 
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="ex: Rick"
                        className="w-full bg-white/5 border border-white/8 px-4 py-2.5 rounded-xl text-xs text-white placeholder-white/25 outline-none focus:bg-white/10 focus:border-white/20 transition"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block font-bold">Localização</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                        <input 
                          type="text" 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="ex: São Paulo, Brasil"
                          className="w-full bg-white/5 border border-white/8 pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-white/25 outline-none focus:bg-white/10 focus:border-white/20 transition"
                        />
                      </div>
                    </div>

                    {/* Bio text */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block font-bold">Sua Bio</label>
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Fale um pouco sobre o seu estilo..."
                        rows={2}
                        className="w-full bg-white/5 border border-white/8 px-4 py-2 rounded-xl text-xs text-white placeholder-white/25 outline-none focus:bg-white/10 focus:border-white/20 transition resize-none"
                      />
                    </div>

                    {/* Avatar Preset selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block font-bold">Selecione seu Avatar</label>
                      <div className="flex gap-2.5 overflow-x-auto py-1">
                        {avatarsPreset.map((url, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setAvatar(url)}
                            className={`w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 relative transition ${avatar === url ? 'border-white scale-105' : 'border-transparent opacity-60'}`}
                          >
                            <img src={url} className="w-full h-full object-cover" alt="avatar preset" />
                            {avatar === url && (
                              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm/submit button styled like Continuar com E-mail */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#22442B] hover:bg-[#1C3622] text-white py-3.5 rounded-full text-xs font-bold transition active:scale-98 disabled:opacity-40 flex items-center justify-center space-x-2 cursor-pointer mt-4 shadow-sm font-sans"
                >
                  {loading ? (
                    <span>Processando...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      <span>{isSignUp ? 'Criar Minha Conta' : 'Entrar no Aplicativo'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Bottom login toggle link */}
              <div className="text-center mt-5 mb-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-xs text-white/60 hover:text-white underline transition"
                >
                  {isSignUp ? 'Já possui uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
