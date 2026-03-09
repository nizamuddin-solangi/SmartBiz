import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from './ui/button';
import { LayoutDashboard, LogOut, Menu, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold tracking-tight text-primary">SmartBiz</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                            <Link to="/explore" className="transition-colors hover:text-primary">Explore</Link>
                            <Link to="/categories" className="transition-colors hover:text-primary">Categories</Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'BUSINESS' && (
                                    <Link to="/dashboard">
                                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
                                {user?.role === 'ADMIN' && (
                                    <Link to="/admin">
                                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Admin
                                        </Button>
                                    </Link>
                                )}
                                <Link to="/profile">
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background p-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
                    <Link to="/explore" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Explore</Link>
                    <Link to="/categories" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Categories</Link>
                    <hr />
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                            {user?.role === 'BUSINESS' && (
                                <Link to="/dashboard" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            )}
                            <Button variant="outline" size="sm" onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full justify-start gap-2">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-col space-y-2">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" size="sm" className="w-full">Login</Button>
                            </Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                <Button size="sm" className="w-full">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
