export interface Conseil {
    id: number;
    titre: string;
    contenu: string;
    categorie: 'epargne' | 'investissement' | 'depenses' | 'budget' | 'autre'; // Add categories
    icone: string; // e.g., 'icon-piggy-bank', 'icon-chart-line'
    datePublication: string; // ISO 8601 date string
    userId?: number; // Optional, for user-specific tips
    createdAt?: string;
    updatedAt?: string;
}