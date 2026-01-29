import React, { useState, useCallback } from 'react';
import { extractFiltersFromText } from './services/geminiService';
import { searchShoes } from './services/shoeService';
import type { Shoe, SearchFilters, SearchResult } from './types';
import VoiceControl from './components/VoiceControl';
import ResultsSection from './components/ResultsSection';
import { ShoeIcon } from './components/Icons';
import ProductDetail from './components/ProductDetail';

export default function App(): React.JSX.Element {
  const [transcript, setTranscript] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilters | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);

  const handleSearch = useCallback(async (text: string) => {
    if (!text) return;

    setIsLoading(true);
    setError(null);
    setTranscript(text);
    setFilters(null);
    setSearchResult(null);

    try {
      const extractedFilters = await extractFiltersFromText(text);
      setFilters(extractedFilters);

      const results = searchShoes(extractedFilters);
      setSearchResult(results);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetSearch = () => {
    setTranscript('');
    setFilters(null);
    setSearchResult(null);
    setError(null);
    setIsLoading(false);
    setSelectedShoe(null);
  };

  const handleSelectShoe = (shoe: Shoe) => {
    setSelectedShoe(shoe);
  };

  const handleCloseDetail = () => {
    setSelectedShoe(null);
  };

  if (selectedShoe) {
    return <ProductDetail shoe={selectedShoe} onClose={handleCloseDetail} />;
  }

  return (
    <div className="min-h-screen bg-background-deep text-text-light font-sans">
      <header className="bg-background-deep/70 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
               <ShoeIcon className="h-8 w-8 text-primary"/>
              <h1 className="text-2xl font-bold text-text-light tracking-tight">
                AI Powered Voice Commerce App
              </h1>
            </div>
            <button
                onClick={resetSearch}
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200"
              >
                New Search
              </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
            {!searchResult && !isLoading && (
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-light mb-4">
                  Find your perfect pair, just by speaking.
                </h2>
                <p className="text-lg text-gray-300 mb-4">
                  Tap the button or upload an audio file. Try an example:
                </p>
                <div className="text-sm text-gray-400 space-y-1 bg-background/50 p-4 rounded-lg">
                   <p><em className="font-semibold text-gray-200">"I'm looking for blue Adidas running shoes for men, size 11, under 100 PKR"</em></p>
                   <p><em className="font-semibold text-gray-200">"Busco zapatillas de correr Adidas azules para hombre, talla 11, por menos de 4000 PKR"</em> (Spanish)</p>
                   <p><em className="font-semibold text-gray-200">"أبحث عن حذاء جري أديداس أزرق للرجال مقاس 11 بأقل من 5000 دولار"</em> (Arabic)</p>
                </div>
              </div>
            )}

            <VoiceControl onSearch={handleSearch} isLoading={isLoading} />
            
            {error && (
                <div className="mt-8 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold">Oops!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            )}

            <ResultsSection
              transcript={transcript}
              filters={filters}
              searchResult={searchResult}
              isLoading={isLoading}
              onSelectShoe={handleSelectShoe}
            />
        </div>
      </main>
    </div>
  );
}