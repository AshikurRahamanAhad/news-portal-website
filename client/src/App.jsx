import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedNews from './pages/SavedNews';
import CreateNews from './pages/CreateNews';
import NewsDetails from './pages/NewsDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/news/:id" element={<NewsDetails />} />

            {/* Protected Routes */}
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <SavedNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-news"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reporter']}>
                  <CreateNews />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;