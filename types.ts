
export interface Shoe {
    id: number;
    name: string;
    brand: 'Nike' | 'Adidas' | 'Puma' | 'Bata' | 'Stylo' | 'Ndure' | 'Walkeaze';
    category: 'Running' | 'Basketball' | 'Lifestyle' | 'Training' | 'Sandals' | 'Heels' | 'Slippers';
    gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
    color: string;
    price: number;
    sizes: number[];
    imageUrl: string;
}

export interface SearchFilters {
    brand?: string | null;
    color?: string | null;
    gender?: 'Men' | 'Women' | 'Unisex' | 'Kids' | null;
    size?: number | null;
    priceMin?: number | null;
    priceMax?: number | null;
    category?: string | null;
}

export interface SearchResult {
    products: Shoe[];
    isFallback: boolean;
}