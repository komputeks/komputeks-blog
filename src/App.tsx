import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Article from './pages/Article';
import Category from './pages/Category';
import Tag from './pages/Tag';
import Search from './pages/Search';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/tag/:slug" element={<Tag />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
