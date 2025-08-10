// src/app/models/rappel.model.ts
export interface Rappel {
    id: number;
    titre: string;
    description: string;
    montant: number; 
    dateEcheance: string; 
    userId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRappelRequest {
    titre: string;
    description?: string;
    montant: number;
    dateEcheance: string; 
    isCompleted?: boolean; 
}