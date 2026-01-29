import React from 'react';
import type { Shoe } from '../types';

interface ProductCardProps {
  shoe: Shoe;
  onSelect: (shoe: Shoe) => void;
}

export default function ProductCard({ shoe, onSelect }: ProductCardProps): React.JSX.Element {
  return (
    <div className="bg-background rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out flex flex-col border border-primary-dark/30">
      <div className="flex-shrink-0">
        <img className="h-64 w-full object-cover" src={shoe.imageUrl} alt={shoe.name} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">
            {shoe.brand}
          </p>
          <h3 className="mt-2 text-xl font-bold text-text-light">{shoe.name}</h3>
          <p className="mt-2 text-base text-gray-400">{shoe.color}</p>
          <div className="mt-3">
            <span className="text-sm text-gray-400">{shoe.gender} / {shoe.category}</span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-300">Available Sizes:</p>
            <div className="flex flex-wrap gap-1 mt-2">
                {shoe.sizes.map(size => (
                    <span key={size} className="text-xs font-semibold bg-primary-dark/50 text-gray-200 px-2 py-1 rounded">
                        {size}
                    </span>
                ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-baseline justify-between">
            <p className="text-2xl font-extrabold text-text-light">PKR {shoe.price}</p>
            <button 
                onClick={() => onSelect(shoe)}
                className="bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors duration-200">
                View
            </button>
        </div>
      </div>
    </div>
  );
}