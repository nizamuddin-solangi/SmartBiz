import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { type Business } from '../types';
import { Button } from '../components/ui/button';
import { Search, MapPin, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExplorePage = () => {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Beauty', 'Health', 'Tech', 'Food', 'Cleaning', 'Fitness', 'Luxury', 'Retail'];

    useEffect(() => {
        fetchBusinesses();
    }, [activeCategory]);

    const fetchBusinesses = async () => {
        setIsLoading(true);
        try {
            const categoryParam = activeCategory !== 'All' ? `category=${activeCategory}` : '';
            const response = await api.get(`/businesses?${categoryParam}`);
            setBusinesses(response.data.data.businesses);
        } catch (error) {
            console.error('Failed to fetch businesses');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.get(`/businesses?search=${search}`);
            setBusinesses(response.data.data.businesses);
        } catch (error) {
            console.error('Search failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Explore Businesses</h1>
                    <p className="text-muted-foreground mt-1">Discover top-rated services in your community.</p>
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-[400px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name or description..."
                        className="w-full bg-background border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                    <p className="text-muted-foreground font-medium">Finding best businesses for you...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {businesses.length > 0 ? (
                        businesses.map((business) => (
                            <motion.div
                                key={business.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group border rounded-2xl overflow-hidden bg-background hover:shadow-xl transition-all duration-300"
                            >
                                <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                                    {business.logo ? (
                                        <img
                                            src={business.logo}
                                            alt={business.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                            <Search className="h-8 w-8 text-primary/20" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1">
                                        {business.categories.map((cat) => (
                                            <span key={cat.id} className="px-2 py-0.5 rounded-full bg-background/90 backdrop-blur-sm text-[8px] font-bold uppercase tracking-wider text-primary shadow-sm">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                            {business.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                            <span>{((business as any).avgRating || 0).toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
                                        {business.description}
                                    </p>
                                    <div className="flex items-center text-xs text-muted-foreground mb-6">
                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                        <span className="truncate">{business.address}</span>
                                    </div>
                                    <Link to={`/business/${business.id}`}>
                                        <Button className="w-full font-semibold rounded-xl">View Services</Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center">
                            <p className="text-xl font-semibold text-muted-foreground">No businesses found matching your criteria</p>
                            <Button
                                variant="link"
                                onClick={() => { setActiveCategory('All'); setSearch(''); }}
                                className="mt-2"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
