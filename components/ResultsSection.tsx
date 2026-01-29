import React from 'react';
import type { Shoe, SearchFilters, SearchResult } from '../types';
import ProductCard from './ProductCard';
import { FilterIcon, NoResultsIcon, SearchIcon } from './Icons';

interface ResultsSectionProps {
  transcript: string | null;
  filters: SearchFilters | null;
  searchResult: SearchResult | null;
  isLoading: boolean;
  onSelectShoe: (shoe: Shoe) => void;
}

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-background rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-56 bg-primary-dark/50"></div>
                <div className="p-4">
                    <div className="h-6 bg-primary-dark/50 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-primary-dark/50 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);

export default function ResultsSection({ transcript, filters, searchResult, isLoading, onSelectShoe }: ResultsSectionProps): React.JSX.Element | null {
  if (isLoading) {
    return (
        <div className="w-full mt-12 text-left">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Finding your shoes...</h3>
            <LoadingSkeleton />
        </div>
    );
  }
  
  if (!transcript && !filters && !searchResult) return null;

  return (
    <div className="mt-12 w-full text-left space-y-12">
      {transcript && (
        <div className="bg-background p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center mb-3">
                <SearchIcon className="h-5 w-5 mr-2 text-primary"/>
                Your Request
            </h3>
            <p className="text-gray-300 italic">"{transcript}"</p>
        </div>
      )}

      {filters && (
        <div className="bg-background p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center mb-3">
            <FilterIcon className="h-5 w-5 mr-2 text-primary"/>
            Extracted Filters
          </h3>
          <pre className="text-sm bg-background-deep p-4 rounded-md overflow-x-auto text-left text-gray-200">
            <code>{JSON.stringify(filters, null, 2)}</code>
          </pre>
        </div>
      )}

      {searchResult && (
        <div>
            {searchResult.isFallback && searchResult.products.length > 0 && (
                 <div className="bg-primary-dark/40 border-l-4 border-primary text-gray-200 p-4 rounded-r-lg mb-8" role="alert">
                    <p className="font-bold">No exact matches found.</p>
                    <p>We've broadened your search to show similar items based on size and gender.</p>
                </div>
            )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResult.products.map((shoe) => (
                    <React.Fragment key={shoe.id}>
                        <ProductCard shoe={shoe} onSelect={onSelectShoe} />
                    </React.Fragment>
                ))}
            </div>

            {searchResult.products.length === 0 && (
                <div className="text-center py-16 px-6 bg-background rounded-lg shadow-lg">
                    <NoResultsIcon className="mx-auto h-16 w-16 text-gray-500" />
                    <h3 className="mt-4 text-2xl font-semibold text-white">No Products Found</h3>
                    <p className="mt-2 text-md text-gray-400">
                        We couldn't find any shoes matching your criteria. Try being more general or searching for something else.
                    </p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}