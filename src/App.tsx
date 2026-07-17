/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AppSimulator from './components/AppSimulator';

export default function App() {
  const [view, setView] = useState<'web' | 'app'>('web');

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#171717] selection:bg-[#E5E5E0]">
      {view === 'web' ? (
        <LandingPage onEnterApp={() => setView('app')} />
      ) : (
        <AppSimulator onBackToWeb={() => setView('web')} />
      )}
    </div>
  );
}
