import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ShoppingCartProvider } from './contexts/ShoppingCartContext';
import Layout from './components/common/Layout';
import FlyToCartAnimation from './components/common/FlyToCartAnimation';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import ShoppingList from './pages/ShoppingList';
import CookingMode from './pages/CookingMode';
import ContributeRecipe from './pages/ContributeRecipe';

function App() {
  return (
    <AuthProvider>
      <ShoppingCartProvider>
        <BrowserRouter>
          <Routes>
            {/* Full-screen route (no Layout) */}
            <Route path="/recipe/:id/cook" element={<CookingMode />} />

            {/* Standard routes with Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shopping-list" element={<ShoppingList />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/contribute" element={<ContributeRecipe />} />
            </Route>
          </Routes>
          <FlyToCartAnimation />
        </BrowserRouter>
      </ShoppingCartProvider>
    </AuthProvider>
  );
}

export default App;
