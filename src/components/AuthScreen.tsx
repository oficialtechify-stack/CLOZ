import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';
import { Lock, Mail, User, MapPin, Sparkles, AlertCircle, Camera, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthScreenProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
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
        // 1. Try real Firebase login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        // 2. Fetch the profile from Firestore
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

        // 3. Store in local storage for session durability in Sandbox frames
        localStorage.setItem('cloz_profile', JSON.stringify(loggedInProfile));
        localStorage.setItem('cloz_user', JSON.stringify({ uid: loggedInProfile.uid, email: loggedInProfile.email }));

        // 4. Complete login successfully
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
    <div className="flex-1 flex flex-col justify-center px-6 py-8 text-left h-full overflow-y-auto max-w-[350px] mx-auto">
      <div className="text-center space-y-2 mb-6">
        <h2 className="font-display font-black text-2xl tracking-tight text-gray-900">
          {isSignUp ? 'Criar Conta' : 'Entrar no Cloz'}
        </h2>
        <p className="text-xs text-gray-500">
          {isSignUp ? 'Faça parte da nossa rede social de curadoria de moda.' : 'Acesse seu armário digital e calendário de looks.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-start space-x-2 text-[11px] text-red-600 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {signupSuccess && !isSignUp && (
        <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl flex items-start space-x-2 text-[11px] text-emerald-700 mb-4 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <div>
            <p className="font-bold">Conta criada de verdade!</p>
            <p className="mt-0.5 text-emerald-600/80">O e-mail e a senha foram preenchidos acima. Clique em <strong>"Entrar no Aplicativo"</strong> para ativar sua rede social personalizada.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Endereço de E-mail</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              className="w-full bg-neutral-100 pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none focus:bg-neutral-200/50 border border-transparent focus:border-gray-200 transition"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Senha</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha (mín. 6 dígitos)"
              className="w-full bg-neutral-100 pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none focus:bg-neutral-200/50 border border-transparent focus:border-gray-200 transition"
            />
          </div>
        </div>

        {isSignUp && (
          <div className="space-y-3.5 pt-1 border-t border-gray-100 mt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Nome de Usuário (@)</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: rickzinxx"
                  className="w-full bg-neutral-100 pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none focus:bg-neutral-200/50 border border-transparent focus:border-gray-200 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Nome de Exibição</label>
              <input 
                type="text" 
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ex: Richard"
                className="w-full bg-neutral-100 px-4 py-2.5 rounded-xl text-xs outline-none focus:bg-neutral-200/50 border border-transparent focus:border-gray-200 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Localização</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ex: Porto Alegre, Brazil"
                  className="w-full bg-neutral-100 pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none focus:bg-neutral-200/50 border border-transparent focus:border-gray-200 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Sua Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Fale um pouco sobre o seu estilo..."
                rows={2}
                className="w-full bg-neutral-100 px-4 py-2 rounded-xl text-xs outline-none focus:bg-neutral-200/50 border border-transparent focus:border-gray-200 transition resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Selecione seu Avatar</label>
              <div className="flex gap-2 overflow-x-auto py-1">
                {avatarsPreset.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setAvatar(url)}
                    className={`w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 relative transition ${avatar === url ? 'border-black scale-105' : 'border-transparent opacity-70'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="avatar preset" />
                    {avatar === url && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl text-xs font-bold hover:bg-neutral-800 transition active:scale-98 disabled:opacity-40 flex items-center justify-center space-x-2 cursor-pointer mt-3"
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

      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-gray-100"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-mono tracking-wider font-semibold">ou</span>
        <div className="flex-grow border-t border-gray-100"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold hover:bg-neutral-50 transition active:scale-98 disabled:opacity-40 flex items-center justify-center space-x-2.5 cursor-pointer shadow-2xs"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
        </svg>
        <span>Entrar com o Google</span>
      </button>

      <div className="text-center mt-6">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-gray-500 hover:text-black hover:underline"
        >
          {isSignUp ? 'Já possui uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </button>
      </div>
    </div>
  );
}
