import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Car, UserCircle2, LogIn, LogOut } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewListing from './pages/NewListing';
import MyListings from './pages/MyListings';
import CarDetails from './pages/CarDetails';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, signOut } = useAuth();

  return (
    <Router>
      <div className="min-h-screen mb-32 bg-gray-50">
        <Toaster position="top-right" />
        <nav className="bg-white shadow-lg">
          <div className="container  mx-auto px-6 py-4">
            <div className="flex items-center box justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-800">AutoMarket</span>
              </Link>
              
              <div className="flex flex-wrap btn items-center space-x-6 md:space-x-4 lg:space-x-6">
                {user ? (
                  <>
                    <Link
                      to="/new-listing"
                      className="bg-blue-600 btn-car text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                    >
                      <Car className="h-5 w-5" />
                      <span>Poster une annonce</span>
                    </Link>
                    <Link
                      to="/my-listings"
                      className="text-gray-600 hover:text-gray-800 transition flex items-center space-x-2"
                    >
                      <UserCircle2 className="h-5 w-5" />
                      <span>Mes annonces</span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="text-gray-600 hover:text-gray-800 transition flex items-center space-x-2"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-gray-800 transition flex items-center space-x-2"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Connexion</span>
                    </Link>
                    <Link
                      to="/register"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/new-listing" element={<NewListing />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/car/:id" element={<CarDetails />} />
          </Routes>
        </main>
      </div>
      <footer className="bg-gray-800 text-white py-4 fixed inset-x-0 bottom-0">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Car className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">AutoMarket</span>
              </div>
              <div className="text-gray-400">
                © 2025 AutoMarket. Tous droits réservés.
              </div>
            </div>
          </div>
        </footer>
    </Router>
  );
}

export default App;