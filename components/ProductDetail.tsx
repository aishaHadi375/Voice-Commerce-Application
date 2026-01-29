import React from 'react';
import type { Shoe } from '../types';
import { CloseIcon } from './Icons';

interface ProductDetailProps {
  shoe: Shoe;
  onClose: () => void;
}

export default function ProductDetail({ shoe, onClose }: ProductDetailProps): React.JSX.Element {
    // Prevent background scroll when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

  return (
    <div 
        className="fixed inset-0 bg-background-deep/90 z-20 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-name"
    >
        <div 
            className="relative bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10 p-1 rounded-full bg-background/50 hover:bg-background"
                aria-label="Close product details"
            >
                <CloseIcon className="h-6 w-6" />
            </button>
            <div className="md:w-1/2 flex-shrink-0">
                <img src={shoe.imageUrl} alt={shoe.name} className="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"/>
            </div>
            <div className="p-6 md:p-8 flex-grow flex flex-col">
                <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-wide">{shoe.brand}</p>
                    <h1 id="product-name" className="mt-1 text-3xl md:text-4xl font-bold text-text-light">{shoe.name}</h1>
                    <p className="mt-3 text-lg text-gray-400">{shoe.color} &middot; {shoe.gender} &middot; {shoe.category}</p>
                    <p className="mt-4 text-4xl font-extrabold text-text-light">PKR {shoe.price}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-md font-semibold text-gray-200 uppercase tracking-wider">Available Sizes</h3>
                    <div className="flex flex-wrap gap-3 mt-3">
                        {shoe.sizes.map(size => (
                            <span key={size} className="w-12 h-12 flex items-center justify-center text-md font-semibold bg-primary-dark/50 text-gray-200 border border-primary-dark rounded-md">
                                {size}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-6">
                     <button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors duration-200 text-lg">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}