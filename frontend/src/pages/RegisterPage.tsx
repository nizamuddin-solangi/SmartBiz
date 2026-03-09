import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Mail, Lock, User, Loader2, AlertCircle, Building2 } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', formData);
            const { user } = response.data.data;
            setAuth(user, response.data.token);
            navigate(user.role === 'BUSINESS' ? '/dashboard' : '/explore');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[440px] space-y-8"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                    <p className="mt-2 text-muted-foreground">Join SmartBiz today and start growing</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'CUSTOMER' })}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.role === 'CUSTOMER' ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50'
                            }`}
                    >
                        <User className={`h-6 w-6 mb-2 ${formData.role === 'CUSTOMER' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-semibold">Customer</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'BUSINESS' })}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.role === 'BUSINESS' ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50'
                            }`}
                    >
                        <Building2 className={`h-6 w-6 mb-2 ${formData.role === 'BUSINESS' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-semibold">Business</span>
                    </button>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="name">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                id="name"
                                placeholder="John Doe"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="password">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {formData.role === 'BUSINESS' ? 'Register Business' : 'Create Customer Account'}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{' '}
                    <Link to="/terms" className="hover:text-primary underline underline-offset-4">Terms of Service</Link> and{' '}
                    <Link to="/privacy" className="hover:text-primary underline underline-offset-4">Privacy Policy</Link>.
                </p>

                <div className="text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                        Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
