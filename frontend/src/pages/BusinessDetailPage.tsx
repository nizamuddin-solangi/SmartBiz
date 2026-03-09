import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { type Business, type Service } from '../types';
import { Button } from '../components/ui/button';
import {
    MapPin, Phone, Mail, Clock, Star,
    Calendar, CheckCircle2, Loader2, ArrowLeft,
    X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const BusinessDetailPage = () => {
    const { id } = useParams();
    const [business, setBusiness] = useState<Business | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        fetchBusinessData();
    }, [id]);

    const fetchBusinessData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/businesses/${id}`);
            setBusiness(response.data.data.business);
            setServices(response.data.data.business.services || []);
        } catch (error) {
            console.error('Failed to fetch business details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedService || !bookingDate || !bookingTime) return;

        setIsSubmitting(true);
        try {
            await api.post('/bookings', {
                serviceId: selectedService.id,
                businessId: id,
                date: bookingDate,
                timeSlot: bookingTime
            });
            setSuccessMessage('Booking request sent successfully!');
            setTimeout(() => {
                setSuccessMessage('');
                setSelectedService(null);
                setBookingDate('');
                setBookingTime('');
            }, 3000);
        } catch (error) {
            alert('Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                <p className="text-muted-foreground font-medium">Loading business profile...</p>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h2 className="text-2xl font-bold">Business not found</h2>
                <Link to="/explore">
                    <Button variant="link" className="mt-4">Back to Explore</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pb-20">
            {/* Header / Cover */}
            <div className="h-64 md:h-80 bg-muted relative">
                {business.logo && (
                    <img src={business.logo} alt={business.name} className="w-full h-full object-cover opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="container mx-auto px-4 absolute bottom-8">
                    <Link to="/explore" className="inline-flex items-center text-sm font-medium hover:text-primary mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Explore
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center p-2">
                                {business.logo ? (
                                    <img src={business.logo} alt={business.name} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-3xl font-bold text-primary">{business.name[0]}</span>
                                )}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    {business.categories.map((cat) => (
                                        <span key={cat.id} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                            {cat.name}
                                        </span>
                                    ))}
                                    <div className="flex items-center text-sm font-bold text-yellow-500 ml-1">
                                        <Star className="h-3.5 w-3.5 fill-current mr-1" />
                                        4.9
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{business.name}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Services & Description */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-6">About</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {business.description}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-6">Our Services</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {services.map((service) => (
                                    <motion.div
                                        key={service.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-5 border rounded-2xl bg-card hover:border-primary/50 transition-all flex justify-between items-center group"
                                    >
                                        <div>
                                            <h3 className="font-bold group-hover:text-primary transition-colors">{service.title}</h3>
                                            <p className="text-xs text-muted-foreground mt-1 mb-2 line-clamp-1">{service.description}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-primary font-bold text-sm">${service.price}</span>
                                                <span className="text-xs text-muted-foreground flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {service.duration} mins
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedService(service)}
                                            className="rounded-xl"
                                        >
                                            Book
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Contact & Location */}
                    <div className="space-y-6">
                        <div className="p-6 border rounded-3xl bg-card space-y-6 sticky top-24">
                            <h3 className="font-bold text-xl">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Location</p>
                                        <p className="text-sm text-muted-foreground">{business.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Phone</p>
                                        <p className="text-sm text-muted-foreground">{business.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">{business.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Working Hours</p>
                                        <p className="text-sm text-muted-foreground">{business.workingHours}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedService(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-[450px] bg-card border rounded-3xl shadow-2xl p-8 overflow-hidden"
                        >
                            {successMessage ? (
                                <div className="text-center py-8">
                                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Success!</h3>
                                    <p className="text-muted-foreground">{successMessage}</p>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setSelectedService(null)}
                                        className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold">Book {selectedService.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Select your preferred date and time slot.</p>
                                    </div>

                                    {!isAuthenticated ? (
                                        <div className="text-center py-6">
                                            <p className="mb-4">You need to be logged in to book services.</p>
                                            <Link to="/login" state={{ from: window.location.pathname }}>
                                                <Button className="w-full">Login to Continue</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleBooking} className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Select Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    value={bookingDate}
                                                    onChange={(e) => setBookingDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Select Time Slot</label>
                                                <select
                                                    required
                                                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    value={bookingTime}
                                                    onChange={(e) => setBookingTime(e.target.value)}
                                                >
                                                    <option value="">Choose a time...</option>
                                                    <option value="09:00 AM">09:00 AM</option>
                                                    <option value="10:00 AM">10:00 AM</option>
                                                    <option value="11:00 AM">11:00 AM</option>
                                                    <option value="01:00 PM">01:00 PM</option>
                                                    <option value="02:00 PM">02:00 PM</option>
                                                    <option value="03:00 PM">03:00 PM</option>
                                                    <option value="04:00 PM">04:00 PM</option>
                                                </select>
                                            </div>
                                            <div className="pt-4 space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Total to pay:</span>
                                                    <span className="font-bold text-lg text-primary">${selectedService.price}</span>
                                                </div>
                                                <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Calendar className="h-4 w-4 mr-2" />}
                                                    Confirm Booking
                                                </Button>
                                                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-none">
                                                    No payment required now
                                                </p>
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BusinessDetailPage;
