import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpg";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Customize", path: "/customize" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: cartItems = [] } = useCart();
  const { user } = useAuth();
  const cartCount = user ? cartItems.length : 0;

  const handleAddressClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/addresses');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 w-full border-b border-black overflow-hidden z-50 group"
        style={{ backgroundColor: 'transparent', transition: 'background 0.3s' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'white')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <nav
          className="section-container py-2"
          style={{ backgroundColor: 'transparent' }}
        >
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-1 md:flex-none justify-center md:justify-start">
              <motion.img
                src={logo}
                alt="G-KAP Logo"
                className="h-8 md:h-10 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative text-xl font-light uppercase tracking-wide transition-colors duration-200 inline-block text-black",
                    location.pathname === link.path ? "" : "hover:text-black/80"
                  )}
                  style={{
                    fontFamily: 'Zalando Sans Expanded, sans-serif',
                    fontWeight: 300,
                    transform: 'none',
                  }}
                >
                  <span style={{ display: 'inline-block' }}>{link.name}</span>
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-6 w-6" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={handleAddressClick}
              >
                <span className="material-icons text-[24px]">place</span>
              </Button>
              <Link to={user ? "/profile" : "/login"}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <span className="material-icons text-[24px]">account_circle</span>
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <span className="material-icons text-[24px]">shopping_cart</span>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </Button>
              </Link>
              {!user ? (
                <Link
                  to="/login"
                  className={cn(
                    "relative text-xl font-light uppercase tracking-wide transition-colors duration-200 inline-block text-black",
                    location.pathname === '/login' ? "" : "hover:text-black/80"
                  )}
                  style={{
                    fontFamily: 'Zalando Sans Expanded, sans-serif',
                    fontWeight: 300,
                    transform: 'none',
                  }}
                >
                  <span style={{ display: 'inline-block' }}>Sign In</span>
                  {location.pathname === '/login' && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full"
                    />
                  )}
                </Link>
              ) : null}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-full text-black hover:text-black"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 pt-20 md:hidden overflow-y-auto"
                style={{ backgroundColor: 'var(--navbar-bg, rgb(109, 236, 71))' }}
          >
            <div className="section-container py-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={cn(
                        "relative text-xl font-light uppercase tracking-wide transition-colors duration-200 inline-block text-black",
                        location.pathname === link.path ? "" : "hover:text-black/80"
                      )}
                      style={{
                        fontFamily: 'Zalando Sans Expanded, sans-serif',
                        fontWeight: 300,
                      }}
                    >
                      <span style={{ display: 'inline-block' }}>{link.name}</span>
                      {location.pathname === link.path && (
                        <motion.div
                          layoutId="activeMobileNav"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="flex flex-col gap-3 mt-4"
                >
                  {/* Mobile Action Icons */}
                  <div className="grid grid-cols-4 gap-3 mb-4 pb-4">
                    <Button variant="ghost" size="icon" className="rounded-full h-14 w-14 mx-auto">
                      <Search className="h-6 w-6" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-14 w-14 mx-auto"
                      onClick={handleAddressClick}
                    >
                      <span className="material-icons text-[24px]">place</span>
                    </Button>
                    <Link to={user ? "/profile" : "/login"}>
                      <Button variant="ghost" size="icon" className="rounded-full h-14 w-14 mx-auto">
                        <span className="material-icons text-[24px]">account_circle</span>
                      </Button>
                    </Link>
                    <Link to="/cart">
                      <Button variant="ghost" size="icon" className="rounded-full h-14 w-14 mx-auto relative">
                        <span className="material-icons text-[24px]">shopping_cart</span>
                        {cartCount > 0 && (
                          <motion.span
                            key={cartCount}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
                          >
                            {cartCount > 99 ? "99+" : cartCount}
                          </motion.span>
                        )}
                      </Button>
                    </Link>
                  </div>
                  
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        className={cn(
                          "relative text-xl font-light uppercase tracking-wide transition-colors duration-200 inline-block text-black",
                          location.pathname === '/login' ? "" : "hover:text-black/80"
                        )}
                        style={{
                          fontFamily: 'Zalando Sans Expanded, sans-serif',
                          fontWeight: 300,
                        }}
                      >
                        <span style={{ display: 'inline-block' }}>Sign In</span>
                        {location.pathname === '/login' && (
                          <motion.div
                            layoutId="activeMobileNav"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full"
                          />
                        )}
                      </Link>
                      <Link
                        to="/signup"
                        className={cn(
                          "relative text-xl font-light uppercase tracking-wide transition-colors duration-200 inline-block text-black",
                          location.pathname === '/signup' ? "" : "hover:text-black/80"
                        )}
                        style={{
                          fontFamily: 'Zalando Sans Expanded, sans-serif',
                          fontWeight: 300,
                        }}
                      >
                        <span style={{ display: 'inline-block' }}>Create Account</span>
                        {location.pathname === '/signup' && (
                          <motion.div
                            layoutId="activeMobileNav"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full"
                          />
                        )}
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/profile"
                      className={cn(
                        "relative text-xl font-light uppercase tracking-wide transition-colors duration-200 inline-block text-black",
                        location.pathname === '/profile' ? "" : "hover:text-black/80"
                      )}
                      style={{
                        fontFamily: 'Zalando Sans Expanded, sans-serif',
                        fontWeight: 300,
                      }}
                    >
                      <span style={{ display: 'inline-block' }}>My Profile</span>
                      {location.pathname === '/profile' && (
                        <motion.div
                          layoutId="activeMobileNav"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full"
                        />
                      )}
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
