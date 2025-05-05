
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ScenarioProvider } from '@/context/ScenarioContext';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import ScenarioPage from '@/pages/ScenarioPage';
import NarrativeAssessmentPage from '@/pages/NarrativeAssessmentPage';
import ProgressPage from '@/pages/ProgressPage';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <ScenarioProvider>
      <div className="app font-nunito bg-gradient-to-b from-white to-speech-light min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scenario" element={<ScenarioPage />} />
            <Route path="/narrative-assessment" element={<NarrativeAssessmentPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <footer className="py-4 px-6 text-center text-sm text-speech-dark/60 bg-white shadow-inner">
          <p>Chiku - Helping children practice speech skills through fun activities!</p>
        </footer>
      </div>
    </ScenarioProvider>
  );
}

export default App;
