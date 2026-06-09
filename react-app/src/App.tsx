import { Navigate, Route, Routes } from 'react-router-dom';
import Toolbar from './components/Toolbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursePage from './pages/CoursePage';

export default function App() {
  return (
    <>
      <Toolbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
