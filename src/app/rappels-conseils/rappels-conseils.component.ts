// rappels-conseils.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Rappel {
  id: number;
  titre: string;
  montant: number;
  dateEcheance: Date;
  type: 'facture' | 'impot' | 'abonnement' | 'autre';
  statut: 'urgent' | 'bientot' | 'normal';
  description?: string;
}

interface Conseil {
  id: number;
  titre: string;
  contenu: string;
  categorie: 'economie' | 'investissement' | 'budget' | 'astuce';
  icone: string;
  datePublication: Date;
}

@Component({
  selector: 'app-rappels-conseils',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rappels-conseils.component.html',
  styleUrls: ['./rappels-conseils.component.css'],
    
})
export class RappelsConseilsComponent implements OnInit {
createRappel() {
throw new Error('Method not implemented.');
}
  activeTab: 'rappels' | 'conseils' = 'rappels';
  
  rappels: Rappel[] = [
    {
      id: 1,
      titre: 'Facture Électricité',
      montant: 89.50,
      dateEcheance: new Date('2024-07-20'),
      type: 'facture',
      statut: 'urgent',
      description: 'Facture EDF du mois de juin'
    },
    {
      id: 2,
      titre: 'Assurance Auto',
      montant: 156.30,
      dateEcheance: new Date('2024-07-25'),
      type: 'abonnement',
      statut: 'bientot',
      description: 'Échéance trimestrielle'
    },
    {
      id: 3,
      titre: 'Impôts sur le Revenu',
      montant: 1250.00,
      dateEcheance: new Date('2024-07-30'),
      type: 'impot',
      statut: 'normal',
      description: 'Solde des impôts 2024'
    }
  ];

  conseils: Conseil[] = [
    {
      id: 1,
      titre: 'Automatisez vos virements',
      contenu: 'Programmez vos virements récurrents pour éviter les oublis et optimiser votre gestion de budget.',
      categorie: 'budget',
      icone: 'icon-automation',
      datePublication: new Date('2024-07-10')
    },
    {
      id: 2,
      titre: 'Diversifiez vos placements',
      contenu: 'Ne mettez pas tous vos œufs dans le même panier. Répartissez vos investissements pour réduire les risques.',
      categorie: 'investissement',
      icone: 'icon-chart',
      datePublication: new Date('2024-07-09')
    },
    {
      id: 3,
      titre: 'Négociez vos contrats',
      contenu: 'Renégociez régulièrement vos contrats d\'assurance et d\'abonnements pour faire des économies.',
      categorie: 'economie',
      icone: 'icon-negotiate',
      datePublication: new Date('2024-07-08')
    }
  ];

  astuceDuJour: Conseil = {
    id: 0,
    titre: 'Règle des 50/30/20',
    contenu: 'Répartissez votre budget : 50% pour les besoins essentiels, 30% pour les loisirs, et 20% pour l\'épargne et les investissements.',
    categorie: 'budget',
    icone: 'icon-star',
    datePublication: new Date()
  };

  ngOnInit() {
    // Trier les rappels par date d'échéance
    this.rappels.sort((a, b) => a.dateEcheance.getTime() - b.dateEcheance.getTime());
  }

  getTypeLabel(type: string): string {
    const labels = {
      'facture': 'Facture',
      'impot': 'Impôt',
      'abonnement': 'Abonnement',
      'autre': 'Autre'
    };
    return labels[type as keyof typeof labels] || type;
  }

  getStatutLabel(statut: string): string {
    const labels = {
      'urgent': 'Urgent',
      'bientot': 'Bientôt',
      'normal': 'Normal'
    };
    return labels[statut as keyof typeof labels] || statut;
  }

  getCategorieLabel(categorie: string): string {
    const labels = {
      'economie': 'Économie',
      'investissement': 'Investissement',
      'budget': 'Budget',
      'astuce': 'Astuce'
    };
    return labels[categorie as keyof typeof labels] || categorie;
  }

  marquerPaye(id: number) {
    this.rappels = this.rappels.filter(r => r.id !== id);
    console.log(`Rappel ${id} marqué comme payé`);
  }

  reporterRappel(id: number) {
    const rappel = this.rappels.find(r => r.id === id);
    if (rappel) {
      rappel.dateEcheance = new Date(rappel.dateEcheance.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 jours
      console.log(`Rappel ${id} reporté d'une semaine`);
    }
  }
}