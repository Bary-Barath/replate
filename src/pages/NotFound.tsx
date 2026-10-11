import { Link } from 'react-router-dom';

const NotFound = () => <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6"><p className="text-brand-forest font-bold text-sm uppercase tracking-widest mb-4">404</p><h1 className="text-4xl font-display font-extrabold mb-4">This page took a wrong turn.</h1><p className="text-text-secondary mb-8">The page you requested does not exist.</p><Link to="/" className="btn-primary">Return home</Link></div>;

export default NotFound;
