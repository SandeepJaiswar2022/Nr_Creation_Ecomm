import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react'

const Navbar = () => {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="py-4 my-container mx-auto">
            <div className="flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-[#871845]">
                        NR Creation
                    </div>
                </Link>

                {/* Navigation Links - Hidden on md and below */}
                <div className="hidden lg:flex items-center space-x-6">
                    <NavLink to="/" isActive={location.pathname === '/'}>Home</NavLink>
                    <NavLink to="/men" isActive={location.pathname === '/men'}>Men</NavLink>
                    <NavLink to="/women" isActive={location.pathname === '/women'}>Women</NavLink>
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
                <div className="flex items-center  space-x-4">
                    <Button variant="ghost" size="icon" className="relative bg-gray-300 hover:bg-gray-400">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="absolute -top-3 -right-2 bg-[#871845] text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center">
                            <p>
                                0
                            </p>
                        </span>
                    </Button>
                    <Button variant="ghost" size="icon" className="bg-gray-300 hover:bg-gray-400">
                        <User className="h-5 w-5" />
                    </Button>
                    <Button className="hidden bg-[#871845] text-white hover:bg-[#611031] lg:flex">Login</Button>
                </div>

                {/* Menu Button - Show on md and below */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">

                        <div className="mt-8 space-y-4">
                            <MobileNavLink to="/" isActive={location.pathname === '/'} onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                            <MobileNavLink to="/men" isActive={location.pathname === '/men'} onClick={() => setIsOpen(false)}>Men</MobileNavLink>
                            <MobileNavLink to="/women" isActive={location.pathname === '/women'} onClick={() => setIsOpen(false)}>Women</MobileNavLink>
                        </div>
                    </SheetContent>
                </Sheet>
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
    )
}

const NavLink = ({ to, children, isActive }) => (
    <Link
        to={to}
        className={`relative  hover:text-[#871845] transition-colors ${isActive ? `text-[#871845]` : ''}`}
    >
        {children}
        <div className={`absolute -bottom-1 left-0 rounded-full w-full h-[0.2rem] bg-[#871845] transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
    </Link>
)

const MobileNavLink = ({ to, children, isActive, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`block w-fit text-lg font-medium hover:text-[#871845] transition-colors relative ${isActive ? 'text-[#871845]' : ''}`}
    >
        {children}
        <div className={`absolute -bottom-1 left-0 w-full h-[0.2rem] rounded-full bg-[#871845] transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
    </Link>
)

export default Navbar 