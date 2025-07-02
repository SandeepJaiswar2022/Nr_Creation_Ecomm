import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartItems, selectUniqueItemsCount } from "@/store/slices/cartSlice";
import { logoutUser } from "@/store/slices/Auth/authSlice";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);
  // console.log("user : ", user);
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    dispatch(fetchCartItems())
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const uniqueItemsCount = useSelector(selectUniqueItemsCount);

  const { totalQuantity } = useSelector((state) => state.cart);
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
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10 pr-4"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
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
            <Link to="/auth" className="hidden px-3 py-1.5 rounded-lg bg-[#871845] text-white hover:bg-[#611031] lg:flex">
              Login
            </Link>
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
