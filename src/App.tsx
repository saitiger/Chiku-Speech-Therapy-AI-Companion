
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ScenarioProvider } from '@/context/ScenarioContext';
import HomePage from '@/pages/HomePage';
import ScenarioPage from '@/pages/ScenarioPage';
import NarrativeAssessmentPage from '@/pages/NarrativeAssessmentPage';
import ProgressPage from '@/pages/ProgressPage';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <ScenarioProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scenario" element={<ScenarioPage />} />
          <Route path="/narrative-assessment" element={<NarrativeAssessmentPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </ScenarioProvider>
  );
}

export default App;
