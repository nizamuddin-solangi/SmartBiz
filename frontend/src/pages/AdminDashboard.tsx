import { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/button';
import {
    Users, Building2, Calendar, ShieldCheck,
    Trash2, Search, Loader2, AlertTriangle, TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data.data);
            setUsers(usersRes.data.data.users);
        } catch (error) {
            console.error('Failed to fetch admin data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            fetchAdminData(); // Refresh stats
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Administration</h1>
                    <p className="text-muted-foreground mt-1">Monitor activity and manage system accounts.</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
            </div>

            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard label="Total Users" value={stats.totalUsers} icon={<Users className="h-5 w-5" />} color="blue" />
                    <StatCard label="Total Businesses" value={stats.totalBusinesses} icon={<Building2 className="h-5 w-5" />} color="purple" />
                    <StatCard label="Total Bookings" value={stats.totalBookings} icon={<Calendar className="h-5 w-5" />} color="green" />
                    <StatCard label="Active Requests" value={stats.activeBookings} icon={<TrendingUp className="h-5 w-5" />} color="orange" />
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                <div className="p-8 border rounded-3xl bg-card">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold">User Management</h2>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input placeholder="Search users..." className="w-full bg-muted/50 border-none rounded-full pl-10 pr-4 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="text-left p-4 font-semibold">User</th>
                                    <th className="text-left p-4 font-semibold">Email</th>
                                    <th className="text-left p-4 font-semibold">Role</th>
                                    <th className="text-left p-4 font-semibold">Joined</th>
                                    <th className="text-right p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="p-4 font-medium">{u.name}</td>
                                        <td className="p-4 text-muted-foreground">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                                u.role === 'BUSINESS' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{u.createdAt.split('T')[0]}</td>
                                        <td className="p-4 text-right">
                                            {u.role !== 'ADMIN' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDeleteUser(u.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-6 bg-orange-50 dark:bg-orange-950/20 rounded-2xl flex items-center gap-4 text-orange-800 dark:text-orange-300">
                    <AlertTriangle className="h-6 w-6 shrink-0" />
                    <p className="text-sm">
                        <strong>Platform Advisory:</strong> Deleting a user will permanently remove all associated data including business profiles, services, and history. Exercise caution when performing administrative deletions.
                    </p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }: any) => {
    const colors: any = {
        blue: "bg-blue-500/10 text-blue-600",
        purple: "bg-purple-500/10 text-purple-600",
        green: "bg-green-500/10 text-green-600",
        orange: "bg-orange-500/10 text-orange-600",
    };
    return (
        <div className="p-6 border rounded-3xl bg-card hover:shadow-lg transition-all duration-300">
            <div className={`p-3 w-fit rounded-2xl mb-4 ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-3xl font-extrabold mt-1">{value}</p>
        </div>
    );
};

export default AdminDashboard;
