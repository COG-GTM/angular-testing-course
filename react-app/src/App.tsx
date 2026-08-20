import { Navigate, Route, Routes } from 'react-router-dom';
import { Toolbar } from './components/Toolbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { CoursePage } from './pages/CoursePage';

export function App() {
  return (
    <>
      <Toolbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses/:id" element={<CoursePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
