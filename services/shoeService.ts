
import { shoes } from '../data/shoes';
import type { Shoe, SearchFilters, SearchResult } from '../types';

function applyFilters(shoeList: Shoe[], filters: SearchFilters): Shoe[] {
    return shoeList.filter(shoe => {
        if (filters.brand && shoe.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
        if (filters.color && !shoe.color.toLowerCase().includes(filters.color.toLowerCase())) return false;
        if (filters.gender && shoe.gender !== filters.gender) return false;
        if (filters.size && !shoe.sizes.includes(filters.size)) return false;
        if (filters.priceMin && shoe.price < filters.priceMin) return false;
        if (filters.priceMax && shoe.price > filters.priceMax) return false;
        if (filters.category && shoe.category.toLowerCase() !== filters.category.toLowerCase()) return false;
        return true;
    });
}

export function searchShoes(filters: SearchFilters): SearchResult {
    // 1. Attempt exact match
    let exactMatches = applyFilters(shoes, filters);

    if (exactMatches.length > 0) {
        return {
            products: exactMatches,
            isFallback: false,
        };
    }

    // 2. If no exact matches, apply fallback logic
    // Keep size and gender fixed as they are usually critical
    const fallbackFilters: SearchFilters = {
        size: filters.size,
        gender: filters.gender,
        // We relax brand, color, price, and category
    };

    const fallbackMatches = applyFilters(shoes, fallbackFilters);

    return {
        products: fallbackMatches,
        isFallback: true,
    };
}
