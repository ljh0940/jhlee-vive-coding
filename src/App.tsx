import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Lotto from '@/pages/Lotto';
import Roulette from '@/pages/Roulette';
import OAuth2Redirect from '@/pages/OAuth2Redirect';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
          <Route path="/lotto" element={<Lotto />} />
          <Route path="/roulette" element={<Roulette />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;