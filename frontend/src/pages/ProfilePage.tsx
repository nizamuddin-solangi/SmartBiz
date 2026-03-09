import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Calendar, User as UserIcon, Mail, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { user, setUser } = useAuthStore();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings');
            setBookings(response.data.data.bookings);
        } catch (error) {
            console.error('Failed to fetch bookings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await api.put('/users/me', { name });
            setUser(response.data.data.user);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Account Settings */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-8 border rounded-3xl bg-card shadow-sm">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <UserIcon className="h-10 w-10 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="mt-4 px-3 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-widest">
                                    {user.role}
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Display Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            required
                                            className="w-full bg-background border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 opacity-50">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            disabled
                                            className="w-full bg-muted border rounded-lg pl-10 pr-4 py-2 text-sm cursor-not-allowed"
                                            value={user.email}
                                        />
                                    </div>
                                </div>

                                <Button className="w-full mt-6" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Update Account'}
                                </Button>

                                {successMessage && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center text-sm text-green-600 font-medium flex items-center justify-center gap-2 mt-2"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        {successMessage}
                                    </motion.p>
                                )}
                            </form>
                        </div>

                        <div className="p-6 border rounded-3xl bg-slate-50 dark:bg-slate-900/50 space-y-4">
                            <h3 className="font-bold font-sm flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                Security Tips
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Never share your password with anyone. Use a strong, unique password for your SmartBiz account to keep your data safe.
                            </p>
                        </div>
                    </div>

                    {/* Booking History */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">My Bookings</h2>
                            <p className="text-muted-foreground">Manage your upcoming and past service appointments.</p>
                        </div>

                        {isLoading ? (
                            <div className="py-24 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                                <p className="text-sm text-muted-foreground">Fetching your bookings...</p>
                            </div>
                        ) : bookings.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {bookings.map((booking: any) => (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-6 border rounded-3xl bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-primary/50 transition-all"
                                    >
                                        <div className="flex gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center">
                                                <Calendar className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                    {booking.service?.title}
                                                </h3>
                                                <p className="text-sm font-medium">{booking.business?.name}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{booking.timeSlot}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                                                ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-muted text-muted-foreground'}`}>
                                                {booking.status}
                                            </span>
                                            <span className="text-lg font-bold text-primary">${booking.service?.price}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 border border-dashed rounded-3xl text-center space-y-4">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                                <p className="text-muted-foreground font-medium">You haven't made any bookings yet.</p>
                                <Button variant="outline" className="rounded-xl">Browse Services</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
