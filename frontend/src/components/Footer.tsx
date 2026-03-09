import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full border-t bg-background py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-primary">SmartBiz</h3>
                        <p className="text-sm text-muted-foreground">
                            Empowering businesses to grow and customers to find the best services in their area.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Marketplace</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/explore" className="hover:text-primary transition-colors">Explore Services</Link></li>
                            <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
                            <li><Link to="/trending" className="hover:text-primary transition-colors">Trending</Link></li>
                            <li><Link to="/new" className="hover:text-primary transition-colors">New Businesses</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">For Businesses</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/register?role=BUSINESS" className="hover:text-primary transition-colors">Register as Business</Link></li>
                            <li><Link to="/solutions" className="hover:text-primary transition-colors">Solutions</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} SmartBiz. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
