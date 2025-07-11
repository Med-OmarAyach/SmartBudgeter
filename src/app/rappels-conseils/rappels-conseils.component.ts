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
  template: `
    <div class="container">
      <!-- Navigation Tabs -->
      <div class="tabs-container">
        <button 
          class="tab-button"
          [class.active]="activeTab === 'rappels'"
          (click)="activeTab = 'rappels'">
          <i class="icon-bell"></i>
          Rappels
        </button>
        <button 
          class="tab-button"
          [class.active]="activeTab === 'conseils'"
          (click)="activeTab = 'conseils'">
          <i class="icon-lightbulb"></i>
          Conseils
        </button>
      </div>

      <!-- Rappels Section -->
      <div *ngIf="activeTab === 'rappels'" class="rappels-section">
        <div class="section-header">
          <h2>Prochains Rappels</h2>
          <p class="subtitle">Factures et échéances à ne pas manquer</p>
        </div>

        <div class="rappels-grid">
          <div 
            *ngFor="let rappel of rappels" 
            class="rappel-card"
            [class.urgent]="rappel.statut === 'urgent'"
            [class.bientot]="rappel.statut === 'bientot'">
            
            <div class="card-header">
              <div class="type-badge" [class]="rappel.type">
                {{ getTypeLabel(rappel.type) }}
              </div>
              <div class="statut-indicator" [class]="rappel.statut">
                <i class="icon-clock"></i>
                {{ getStatutLabel(rappel.statut) }}
              </div>
            </div>

            <div class="card-body">
              <h3>{{ rappel.titre }}</h3>
              <p class="montant">{{ rappel.montant | currency:'EUR':'symbol':'1.2-2':'fr' }}</p>
              <p class="date-echeance">
                <i class="icon-calendar"></i>
                Échéance: {{ rappel.dateEcheance | date:'dd/MM/yyyy' }}
              </p>
              <p *ngIf="rappel.description" class="description">
                {{ rappel.description }}
              </p>
            </div>

            <div class="card-actions">
              <button class="btn-primary" (click)="marquerPaye(rappel.id)">
                <i class="icon-check"></i>
                Marquer comme payé
              </button>
              <button class="btn-secondary" (click)="reporterRappel(rappel.id)">
                <i class="icon-clock"></i>
                Reporter
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="rappels.length === 0" class="empty-state">
          <i class="icon-check-circle"></i>
          <h3>Aucun rappel en cours</h3>
          <p>Toutes vos factures sont à jour !</p>
        </div>
      </div>

      <!-- Conseils Section -->
      <div *ngIf="activeTab === 'conseils'" class="conseils-section">
        <div class="section-header">
          <h2>Conseils & Astuces</h2>
          <p class="subtitle">Optimisez votre gestion financière</p>
        </div>

        <!-- Astuce du jour -->
        <div class="astuce-jour">
          <div class="astuce-header">
            <i class="icon-star"></i>
            <h3>Astuce du jour</h3>
          </div>
          <div class="astuce-content">
            <h4>{{ astuceDuJour.titre }}</h4>
            <p>{{ astuceDuJour.contenu }}</p>
          </div>
        </div>

        <!-- Autres conseils -->
        <div class="conseils-grid">
          <div 
            *ngFor="let conseil of conseils" 
            class="conseil-card"
            [class]="conseil.categorie">
            
            <div class="card-icon">
              <i [class]="conseil.icone"></i>
            </div>
            
            <div class="card-content">
              <div class="categorie-badge">
                {{ getCategorieLabel(conseil.categorie) }}
              </div>
              <h4>{{ conseil.titre }}</h4>
              <p>{{ conseil.contenu }}</p>
              <small class="date-publication">
                {{ conseil.datePublication | date:'dd/MM/yyyy' }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0c12;
      min-height: 100vh;
    }

    .tabs-container {
      display: flex;
      gap: 0;
      margin-bottom: 40px;
      border-bottom: 1px solid #1f2533;
      background: #121621;
    }

    .tab-button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 32px;
      background: transparent;
      border: none;
      font-size: 15px;
      font-weight: 600;
      color: #6b7280;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
      position: relative;
      letter-spacing: 0.02em;
    }

    .tab-button:hover {
      color: #9ca3af;
      background: rgba(18, 22, 33, 0.8);
    }

    .tab-button.active {
      color: #ffffff;
      border-bottom-color: #121621;
      background: #121621;
    }

    .tab-button.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #121621, #1f2533);
    }

    .section-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .section-header h2 {
      font-size: 32px;
      color: #ffffff;
      margin-bottom: 12px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .subtitle {
      color: #9ca3af;
      font-size: 16px;
      font-weight: 400;
    }

    /* Rappels Styles */
    .rappels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .rappel-card {
      background: #121621;
      border: 1px solid #1f2533;
      padding: 24px;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .rappel-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #121621;
    }

    .rappel-card:hover {
      border-color: #2d3748;
      transform: translateY(-1px);
    }

    .rappel-card.urgent::before {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }

    .rappel-card.bientot::before {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    .rappel-card.normal::before {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .type-badge {
      padding: 6px 16px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: 1px solid #1f2533;
    }

    .type-badge.facture { 
      background: rgba(18, 22, 33, 0.8);
      color: #60a5fa;
      border-color: #1e40af;
    }
    .type-badge.impot { 
      background: rgba(18, 22, 33, 0.8);
      color: #f472b6;
      border-color: #be185d;
    }
    .type-badge.abonnement { 
      background: rgba(18, 22, 33, 0.8);
      color: #34d399;
      border-color: #059669;
    }
    .type-badge.autre { 
      background: rgba(18, 22, 33, 0.8);
      color: #a78bfa;
      border-color: #7c3aed;
    }

    .statut-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .statut-indicator.urgent { color: #ef4444; }
    .statut-indicator.bientot { color: #f59e0b; }
    .statut-indicator.normal { color: #10b981; }

    .card-body h3 {
      font-size: 20px;
      color: #ffffff;
      margin-bottom: 12px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .montant {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    .date-echeance {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #9ca3af;
      font-size: 14px;
      margin-bottom: 12px;
      font-weight: 500;
    }

    .description {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.5;
    }

    .card-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .btn-primary, .btn-secondary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .btn-primary {
      background: #121621;
      color: #ffffff;
      border: 1px solid #1f2533;
    }

    .btn-primary:hover {
      background: #1f2533;
      border-color: #2d3748;
    }

    .btn-secondary {
      background: transparent;
      color: #9ca3af;
      border: 1px solid #1f2533;
    }

    .btn-secondary:hover {
      background: #121621;
      color: #ffffff;
      border-color: #2d3748;
    }

    /* Conseils Styles */
    .astuce-jour {
      background: linear-gradient(135deg, #121621 0%, #1f2533 100%);
      color: #ffffff;
      padding: 32px;
      margin-bottom: 48px;
      position: relative;
      overflow: hidden;
      border: 1px solid #1f2533;
    }

    .astuce-jour::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #fbbf24, #f59e0b);
    }

    .astuce-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .astuce-header i {
      font-size: 28px;
      color: #fbbf24;
    }

    .astuce-header h3 {
      font-size: 22px;
      margin: 0;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .astuce-content h4 {
      font-size: 18px;
      margin-bottom: 12px;
      font-weight: 600;
      color: #ffffff;
    }

    .astuce-content p {
      line-height: 1.6;
      color: #d1d5db;
      font-size: 16px;
    }

    .conseils-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .conseil-card {
      background: #121621;
      border: 1px solid #1f2533;
      padding: 24px;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .conseil-card:hover {
      border-color: #2d3748;
      transform: translateY(-1px);
    }

    .conseil-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .conseil-card.economie::before { background: linear-gradient(90deg, #10b981, #059669); }
    .conseil-card.investissement::before { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
    .conseil-card.budget::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
    .conseil-card.astuce::before { background: linear-gradient(90deg, #3b82f6, #2563eb); }

    .card-icon {
      text-align: center;
      margin-bottom: 20px;
    }

    .card-icon i {
      font-size: 32px;
      color: #9ca3af;
    }

    .categorie-badge {
      display: inline-block;
      padding: 6px 12px;
      background: rgba(18, 22, 33, 0.8);
      border: 1px solid #1f2533;
      font-size: 11px;
      font-weight: 600;
      color: #9ca3af;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .conseil-card h4 {
      font-size: 18px;
      color: #ffffff;
      margin-bottom: 12px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .conseil-card p {
      color: #9ca3af;
      line-height: 1.6;
      margin-bottom: 16px;
      font-size: 15px;
    }

    .date-publication {
      color: #6b7280;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: #6b7280;
    }

    .empty-state i {
      font-size: 48px;
      color: #10b981;
      margin-bottom: 24px;
    }

    .empty-state h3 {
      font-size: 24px;
      margin-bottom: 12px;
      color: #ffffff;
      font-weight: 600;
    }

    /* Icons */
    .icon-bell:before { content: '🔔'; }
    .icon-lightbulb:before { content: '💡'; }
    .icon-clock:before { content: '⏰'; }
    .icon-calendar:before { content: '📅'; }
    .icon-check:before { content: '✓'; }
    .icon-check-circle:before { content: '✅'; }
    .icon-star:before { content: '⭐'; }

    /* Responsive Design */
    @media (max-width: 768px) {
      .container {
        padding: 16px;
      }
      
      .rappels-grid, .conseils-grid {
        grid-template-columns: 1fr;
      }
      
      .card-actions {
        flex-direction: column;
      }
      
      .tab-button {
        padding: 16px 24px;
      }
      
      .section-header h2 {
        font-size: 28px;
      }
    }
  `]
})
export class RappelsConseilsComponent implements OnInit {
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