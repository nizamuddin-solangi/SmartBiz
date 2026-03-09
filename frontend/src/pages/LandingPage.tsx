import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Shield, Zap, TrendingUp, Star, Users } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
                            Grow Your Business <br />
                            <span className="text-primary">Without the Stress.</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                            The all-in-one platform for service providers to manage bookings,
                            engage customers, and scale their operations with ease.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link to="/register">
                                <Button size="lg" className="h-12 px-8 text-base">Get Started for Free</Button>
                            </Link>
                            <Link to="/explore">
                                <Button variant="outline" size="lg" className="h-12 px-8 text-base">Explore Marketplace</Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Background Elements */}
                <div className="absolute top-0 -z-10 h-full w-full pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-primary/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-primary/10 rounded-full blur-[120px]" />
                </div>
            </section>

            {/* Features Grid */}
            <section className="bg-slate-50 dark:bg-slate-900/50 py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to succeed</h2>
                        <p className="mt-4 text-muted-foreground">Professional tools built for modern entrepreneurs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="h-6 w-6 text-primary" />}
                            title="Instant Bookings"
                            description="Automated scheduling that works around the clock. No more back-and-forth emails."
                        />
                        <FeatureCard
                            icon={<Shield className="h-6 w-6 text-primary" />}
                            title="Secure Payments"
                            description="Trusted payment processing integration for safe and reliable transactions."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="h-6 w-6 text-primary" />}
                            title="Business Analytics"
                            description="Deep insights into your revenue, customer behavior, and service performance."
                        />
                        <FeatureCard
                            icon={<Search className="h-6 w-6 text-primary" />}
                            title="Marketplace Exposure"
                            description="Get discovered by thousands of customers searching for services in your area."
                        />
                        <FeatureCard
                            icon={<Users className="h-6 w-6 text-primary" />}
                            title="Customer Management"
                            description="Build lasting relationships with integrated CRM and review systems."
                        />
                        <FeatureCard
                            icon={<Star className="h-6 w-6 text-primary" />}
                            title="Premium Branding"
                            description="Professional business profiles that showcase your services in the best light."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center text-primary-foreground shadow-2xl md:px-12">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Ready to take your business to the next level?</h2>
                        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90">
                            Join thousands of businesses already scaling with SmartBiz.
                            Start your journey today with a 14-day free trial.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link to="/register">
                                <Button variant="secondary" size="lg" className="h-12 px-8 text-base font-semibold">Start Free Trial</Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="ghost" size="lg" className="h-12 px-8 text-base text-primary-foreground hover:bg-white/10">Talk to Sales</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="flex flex-col p-8 rounded-2xl border bg-background shadow-sm hover:shadow-md transition-all"
    >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
);

export default LandingPage;
