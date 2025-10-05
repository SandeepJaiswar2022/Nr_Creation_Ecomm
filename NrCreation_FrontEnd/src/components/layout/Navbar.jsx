import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, clearCartState, fetchCartItems, selectUniqueItemsCount } from "@/store/slices/cartSlice";
import { logoutUser } from "@/store/slices/Auth/authSlice";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { setSearchTermToProductState } from "@/store/slices/productSlice";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);
  const uniqueItemsCount = useSelector(selectUniqueItemsCount);
  const location = useLocation();

  // check if current path is cart or checkout
  const hideCartLink = location.pathname === "/cart" || location.pathname === "/checkout";

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const lastSearchTerm = useRef("");

  // Mock category data (could come from backend later)
  const categories = [
    { name: "Electronics", keyword: "electronics" },
    { name: "Fashion", keyword: "fashion" },
    { name: "Home & Kitchen", keyword: "home-kitchen" },
    { name: "Books", keyword: "books" },
    { name: "Toys", keyword: "toys" },
    { name: "Beauty & Health", keyword: "beauty-health" },
    { name: "Sports", keyword: "sports" },
    { name: "Groceries", keyword: "groceries" },
  ];

  const commonSearches = [
    "Mobiles",
    "Shoes",
    "Laptops",
    "Headphones",
    "Watches",
    "Smart TVs",
  ];


  useEffect(() => {
    if (user && user?.role === "USER")
      // console.info("Fetching cart Information in NAVBAR....");
      dispatch(fetchCartItems())
  }, [user, dispatch]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🧠 Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // console.log("user : ", user);
  const handleLogout = async () => {
    try {
      dispatch(clearCartState()); // wait for clearCart to finish
      dispatch(logoutUser()); // then logout
    } catch (error) {
      console.error("Failed to clear cart before logout:");
    }
  };

  // Filter suggestions based on user input
  const filteredSuggestions = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleSearch = (term) => {
    const trimmed = (term ?? searchTerm).trim();

    if (trimmed && trimmed !== lastSearchTerm.current) {
      console.log("Search keyword:", trimmed);
      dispatch(setSearchTermToProductState(trimmed)); // update Redux
      navigate("/category/dupattas");

      // here you’d call your backend API
      // e.g., dispatch(fetchProductsByKeyword(trimmed));

      lastSearchTerm.current = trimmed; // store latest term
      setShowSuggestions(false);
    } else if (trimmed === lastSearchTerm.current) {
      console.log("⏸️ Ignored duplicate search for:", trimmed);
    }
  };

  // Handle selecting suggestion
  const handleSelect = (keyword) => {
    setSearchTerm(keyword);
    handleSearch(keyword);
    setShowSuggestions(false);
  };

  return (
    <nav className="py-4 my-container mx-auto">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-[#871845]">NR_CREATION</div>
        </Link>

        {/* Navigation Links - Hidden on md and below */}
        <div className="hidden lg:flex items-center space-x-6">
          <NavLink to="/" isActive={location.pathname === "/"}>
            Home
          </NavLink>
          <NavLink
            to="/category/dupattas"
            isActive={location.pathname === "/category/dupattas"}
          >
            Dupattas
          </NavLink>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex border rounded-md border-black flex-1 max-w-md mx-4">
          <div ref={searchRef} className="relative w-full">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              type="search"
              placeholder="Search products..."
              className="w-full pl-10 pr-4"
            />

            <Search onClick={() => handleSearch(searchTerm)} className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 h-4 w-4 cursor-pointer hover:text-[#871845] text-[#b86787]  text-muted-foreground" />
            {showSuggestions && (
              <div
                className="absolute w-full mt-2 bg-white dark:bg-slate-800 
                     border border-gray-200 dark:border-slate-700 
                     rounded-lg shadow-lg z-10 transition-all duration-300"
              >
                {/* Show most common searches when no input */}
                {searchTerm.trim() === "" ? (
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Most Common Searches
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {commonSearches.map((term) => (
                        <li
                          key={term}
                          onClick={() => handleSelect(term)}
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-slate-700 
                               text-gray-800 dark:text-gray-100 rounded-full 
                               cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-600/60 
                               transition-all"
                        >
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <ul className="max-h-56 overflow-y-auto">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((cat) => (
                        <li
                          key={cat.keyword}
                          onClick={() => handleSelect(cat.keyword)}
                          className="px-4 py-2 cursor-pointer 
                               hover:bg-indigo-50 dark:hover:bg-slate-700 
                               text-gray-800 dark:text-gray-100 transition-colors"
                        >
                          {cat.name}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                        No matching categories
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {!hideCartLink && (
            <Link
              to="/cart"
              variant="ghost"
              size="icon"
              className="relative p-2 rounded-sm bg-gray-300 hover:bg-gray-400"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-3 -right-2 bg-[#871845] text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center">
                <p>{uniqueItemsCount || 0}</p>
              </span>
            </Link>
          )}
          {accessToken ? (
            isMobile ? (
              // Mobile: show Sheet
              <>

                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileSheetOpen(true)}>
                  <User className="h-5 w-5" />
                </Button>
                <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetTitle className="sr-only">Account</SheetTitle>
                    <div className="mt-8 space-y-4">
                      <Link to="/profile/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMobileSheetOpen(false)}>My Profile</Link>
                      <Link to="/profile/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMobileSheetOpen(false)}>My Orders</Link>
                      <button onClick={() => { handleLogout(); setIsMobileSheetOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">Logout</button>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              // Desktop: show dropdown
              <div className="flex items-center space-x-4 relative group" onMouseLeave={() => setIsDropdownOpen(false)}>
                <div
                  className="relative flex space-x-3 p-1.5 cursor-pointer rounded-md bg-gray-300 px-2 hover:bg-gray-400"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onFocus={() => setIsDropdownOpen(true)}
                  tabIndex={0}
                  aria-haspopup="true" aria-expanded={isDropdownOpen}
                >

                  <User className="h-5 w-5" />
                  <span>Account</span>
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 w-48 top-9 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                      onMouseEnter={() => setIsDropdownOpen(true)}
                      onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                      <Link to="/profile/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>My Profile</Link>
                      <Link to="/profile/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>My Orders</Link>
                      <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">Logout</button>
                    </div>
                  )}
                </div>
                <div className="hidden lg:flex items-center space-x-2">
                  <span className="text-sm font-medium">Hi, {user?.firstName}</span>
                </div>
              </div>
            )
          ) : (
            <>
              <Button variant="ghost" size="icon" className="lg:hidden bg-gray-300" onClick={() => setIsMobileSheetOpen(true)}>
                <LogIn className="h-5 w-5" />
              </Button>

              {!isMobile && <Link to="/auth" className="hidden px-3 py-1.5 rounded-lg bg-[#871845] text-white hover:bg-[#611031] lg:flex">
                Login
              </Link>}


              <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="sr-only">Login</SheetTitle>
                  <div className="mt-8 space-y-1">
                    <Link to="/category/dupattas" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMobileSheetOpen(false)}>Dupattas</Link>
                    <Link to="/auth" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMobileSheetOpen(false)}>Login</Link>
                  </div>
                </SheetContent>
              </Sheet>
            </>

          )}
        </div>

        {/* Menu Button - Show on md and below */}
        {/* Removed Sheet and mobile nav logic */}
      </div>

      {/* Mobile Search - Visible only on mobile */}
      <div className="mt-4 lg:hidden border rounded-md border-black">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full pl-10 pr-4"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={`relative hover:text-[#871845] transition-colors ${isActive ? `text-[#871845]` : ""
      }`}
  >
    {children}
    <div
      className={`absolute -bottom-1 left-0 rounded-full w-full h-[0.2rem] bg-[#871845] transform transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
    />
  </Link>
);

export default Navbar;
