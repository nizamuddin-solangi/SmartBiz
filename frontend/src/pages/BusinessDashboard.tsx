import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { type Business, type Booking, type Service } from '../types';
import { Button } from '../components/ui/button';
import {
    LayoutDashboard, ShoppingBag, Calendar, Settings,
    CheckCircle2, Clock, Loader2
} from 'lucide-react';

const BusinessDashboard = () => {
    const [business, setBusiness] = useState<Business | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const bizRes = await api.get('/businesses');
            const myBiz = bizRes.data.data.businesses.find((b: Business) => b.userId);

            if (myBiz) {
                setBusiness(myBiz);
                const [bookRes, servRes] = await Promise.all([
                    api.get('/bookings'),
                    api.get(`/services/business/${myBiz.id}`)
                ]);
                setBookings(bookRes.data.data.bookings);
                setServices(servRes.data.data.services);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const updateBookingStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/bookings/${id}/status`, { status });
            setBookings(bookings.map(b => b.id === id ? { ...b, status: status as any } : b));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" /></div>;

    if (!business) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h2 className="text-2xl font-bold">No Business Found</h2>
                <p className="text-muted-foreground mt-2">You haven't registered a business yet.</p>
                <Link to="/dashboard/setup" className="mt-6 inline-block">
                    <Button>Set Up Your Business</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            <aside className="w-64 border-r bg-muted/30 p-6 hidden md:block">
                <nav className="space-y-2">
                    <DashboardLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Overview" />
                    <DashboardLink to="/dashboard/bookings" icon={<Calendar className="h-4 w-4" />} label="Bookings" />
                    <DashboardLink to="/dashboard/services" icon={<ShoppingBag className="h-4 w-4" />} label="Services" />
                    <DashboardLink to="/dashboard/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
                </nav>
            </aside>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <Routes>
                    <Route index element={<Overview business={business} bookings={bookings} services={services} onUpdateStatus={updateBookingStatus} />} />
                    <Route path="bookings" element={<BookingList bookings={bookings} onUpdateStatus={updateBookingStatus} />} />
                    <Route path="services" element={<ServiceList services={services} onRefresh={fetchDashboardData} />} />
                    <Route path="settings" element={<BusinessSettings business={business} onRefresh={fetchDashboardData} />} />
                </Routes>
            </main>
        </div>
    );
};

const DashboardLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
        >
            {icon}
            {label}
        </Link>
    );
};

const Overview = ({ business, bookings, services, onUpdateStatus }: any) => {
    const stats = [
        { label: 'Total Bookings', value: bookings.length, icon: <Calendar className="h-5 w-5 text-blue-500" /> },
        { label: 'Pending Requests', value: bookings.filter((b: any) => b.status === 'PENDING').length, icon: <Clock className="h-5 w-5 text-orange-500" /> },
        { label: 'Completed', value: bookings.filter((b: any) => b.status === 'COMPLETED').length, icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
        { label: 'Active Services', value: services.length, icon: <ShoppingBag className="h-5 w-5 text-purple-500" /> },
    ];

    const recentBookings = bookings.slice(0, 5);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Welcome back, {business.name}!</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="p-6 rounded-2xl border bg-card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
                            {s.icon}
                        </div>
                        <span className="text-2xl font-bold">{s.value}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="p-6 border rounded-2xl bg-card">
                    <h2 className="font-bold text-lg mb-6">Recent Booking Requests</h2>
                    <div className="space-y-4">
                        {recentBookings.map((b: any) => (
                            <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                                <div>
                                    <p className="font-semibold text-sm">{b.customer?.name}</p>
                                    <p className="text-xs text-muted-foreground">{b.service?.title} • {b.date.split('T')[0]}</p>
                                </div>
                                <div className="flex gap-2">
                                    {b.status === 'PENDING' ? (
                                        <Button size="sm" variant="outline" onClick={() => onUpdateStatus(b.id, 'CONFIRMED')}>Accept</Button>
                                    ) : (
                                        <span className="text-xs uppercase font-bold">{b.status}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookingList = ({ bookings, onUpdateStatus }: any) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold">Manage Bookings</h2>
        <div className="border rounded-2xl overflow-hidden bg-card">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-muted/50 border-b">
                        <th className="text-left p-4">Customer</th>
                        <th className="text-left p-4">Service</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-right p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b: any) => (
                        <tr key={b.id} className="border-b">
                            <td className="p-4">{b.customer?.name}</td>
                            <td className="p-4">{b.service?.title}</td>
                            <td className="p-4">{b.status}</td>
                            <td className="p-4 text-right">
                                {b.status === 'PENDING' && (
                                    <Button size="sm" onClick={() => onUpdateStatus(b.id, 'CONFIRMED')}>Accept</Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ServiceList = ({ services, onRefresh }: any) => {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', price: '', duration: '', category: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/services', {
                ...formData,
                price: parseFloat(formData.price),
                duration: parseInt(formData.duration)
            });
            setIsAddingNew(false);
            setFormData({ title: '', description: '', price: '', duration: '', category: '' });
            onRefresh();
        } catch (error) {
            alert('Failed to add service');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Services</h2>
                <Button onClick={() => setIsAddingNew(!isAddingNew)}>
                    {isAddingNew ? 'Cancel' : 'Add New Service'}
                </Button>
            </div>

            {isAddingNew && (
                <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="p-6 border rounded-3xl bg-card space-y-4 shadow-lg border-primary/20"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Service Title</label>
                            <input
                                required
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="e.g. Premium Haircut"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <input
                                required
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="e.g. Beauty"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price ($)</label>
                            <input
                                required
                                type="number"
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="50.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Duration (minutes)</label>
                            <input
                                required
                                type="number"
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="45"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            required
                            className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Describe what this service includes..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Service'}
                    </Button>
                </motion.form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((s: any) => (
                    <div key={s.id} className="p-5 border rounded-2xl bg-card hover:border-primary/50 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold group-hover:text-primary transition-colors">{s.title}</h3>
                            <span className="text-primary font-bold">${s.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                            <span>{s.duration} mins</span>
                            <span>•</span>
                            <span>{s.category}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BusinessSettings = ({ business, onRefresh }: any) => {
    const [formData, setFormData] = useState({ ...business });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put(`/businesses/${business.id}`, formData);
            alert('Settings updated successfully');
            onRefresh();
        } catch (error) {
            alert('Failed to update settings');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Business Settings</h2>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6 p-8 border rounded-3xl bg-card h-fit">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Business Name</label>
                            <input
                                required
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <input
                                    required
                                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <input
                                    required
                                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Public Email</label>
                            <input
                                required
                                type="email"
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <input
                                required
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                required
                                className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 border rounded-3xl bg-card space-y-4">
                        <h3 className="font-bold text-lg">Hours & Media</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Working Hours</label>
                            <input
                                required
                                placeholder="e.g. Mon-Fri: 9AM - 5PM"
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.workingHours}
                                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Logo URL</label>
                            <input
                                placeholder="https://..."
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.logo || ''}
                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                            />
                        </div>
                        {formData.logo && (
                            <div className="aspect-square rounded-2xl overflow-hidden border">
                                <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default BusinessDashboard;
