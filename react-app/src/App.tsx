import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import CourseDetail from './components/CourseDetail';
import About from './components/About';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="mat-toolbar mat-elevation-z6">
          <nav className="toolbar-nav">
            <Link to="/" className="nav-link">COURSES</Link>
            <Link to="/about" className="nav-link">ABOUT</Link>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
