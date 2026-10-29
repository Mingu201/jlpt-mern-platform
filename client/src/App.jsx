import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import KanaChart from './pages/KanaChart';
import KanjiDojo from './pages/KanjiDojo';
import ReadingReader from './features/reading/ReadingReader';
import SpeakingStudio from './features/speaking/SpeakingStudio';
import ClassroomSession from './features/classroom/ClassroomSession';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100 transition-colors duration-200">
        <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />
        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/" element={<Dashboard onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/classroom" element={<ClassroomSession onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            <Route path="/kana" element={<KanaChart />} />
            <Route path="/kanji" element={<KanjiDojo />} />
            <Route path="/reading" element={<ReadingReader />} />
            <Route path="/speaking" element={<SpeakingStudio />} />
          </Routes>
        </main>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </Router>
  );
}
