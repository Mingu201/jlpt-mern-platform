import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import KanaChart from './pages/KanaChart';
import KanjiDojo from './pages/KanjiDojo';
import ReadingReader from './features/reading/ReadingReader';
import SpeakingStudio from './features/speaking/SpeakingStudio';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100 transition-colors duration-200">
        <Navbar />
        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kana" element={<KanaChart />} />
            <Route path="/kanji" element={<KanjiDojo />} />
            <Route path="/reading" element={<ReadingReader />} />
            <Route path="/speaking" element={<SpeakingStudio />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
