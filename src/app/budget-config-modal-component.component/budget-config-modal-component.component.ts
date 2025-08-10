// budget-config-modal-component.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Category } from '../models/category.model';
import { AlertSettings, BudgetConfig, CreateBudgetRequest, Budget } from '../models/budget.model';
import { CategoryService } from '../services/category.service';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Injected, adjust usage if needed

@Component({
  selector: 'app-budget-config-modal',
  templateUrl: './budget-config-modal-component.component.html',
  styleUrls: ['./budget-config-modal-component.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BudgetConfigModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() categories: Category[] = []; // Input categories (might be empty initially)
  @Input() existingBudgets: BudgetConfig[] = []; // Input existing budgets (if any passed by parent)
  @Output() save = new EventEmitter<{ budgets: BudgetConfig[]; alertSettings: AlertSettings }>();
  @Output() close = new EventEmitter<void>();

  // Local state
  budgetConfigs: BudgetConfig[] = []; // Local copy of budgets being configured (mapped from allUserBudgets)
  availableCategories: Category[] = []; // Categories without associated budgets (for selection)
  selectedCategoryId: string = ''; // For the dropdown (string because it's bound to <select>)
  customCategoryName: string = '';
  newBudgetLimit: number | null = null;
  alertSettings = {
    warningThreshold: 75
  };
  successMessage = '';
  errorMessage = '';

  // Store full lists fetched from API for reference/filtering
  private allUserCategories: Category[] = [];
  private allUserBudgets: Budget[] = []; // Store full Budget objects

  constructor(
    private categoryService: CategoryService,
    private budgetService: BudgetService,
    private authService: AuthService // Inject AuthService (usage depends on needs)
  ) { }

  ngOnInit() {
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges) {
    // If categories or existingBudgets inputs change from the parent, re-initialize
    if (changes['categories'] || changes['existingBudgets']) {
      this.initializeData();
    }
  }

  // --- Helper Methods ---
  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private resetForm() {
    this.selectedCategoryId = '';
    this.customCategoryName = '';
    this.newBudgetLimit = null;
  }

  // --- Primary Initialization ---
  private initializeData() {
    console.log('Initializing Budget Config Modal Data...');
    // 1. Load categories for the current user if not provided or empty
    if (this.categories && this.categories.length > 0) {
      console.log('Using provided categories input.');
      this.allUserCategories = [...this.categories]; // Take a copy
      this.loadBudgetsAndFilter(); // Then load budgets and filter based on these categories
    } else {
      console.log('Fetching categories for current user.');
      this.loadCategories(); // loadCategories will trigger loadBudgetsAndFilter after fetching
    }
    // Note: existingBudgets input is handled via loadBudgetsAndFilter which fetches full budget objects.
  }

  loadCategories() {
    this.clearMessages();
    this.categoryService.getAllForCurrentUser().subscribe({
      next: (categories) => {
        console.log('Loaded categories for current user:', categories);
        this.allUserCategories = categories;
        // After loading categories, load budgets and perform filtering
        this.loadBudgetsAndFilter();
      },
      error: (err) => {
        console.error('Error loading categories for current user:', err);
        this.errorMessage = 'Erreur lors du chargement des catégories.';
        this.allUserCategories = [];
        this.availableCategories = []; // Clear available list on category load error
        // budgetConfigs and allUserBudgets might still be empty or stale
      }
    });
  }

  loadBudgetsAndFilter() {
    this.budgetService.getCurrentUserBudgets().subscribe({
      next: (budgets: Budget[]) => { // Expect full Budget objects
        console.log('Loaded budgets for current user:', budgets);
        this.allUserBudgets = budgets;

        // --- Filtering Logic ---
        // 1. Find category IDs that already have budgets
        const budgetCategoryIds = new Set(this.allUserBudgets.map(b => b.categoryId));
        console.log('Category IDs with existing budgets:', Array.from(budgetCategoryIds));

        // 2. Filter available categories (those without budgets)
        this.availableCategories = this.allUserCategories.filter(
          cat => !budgetCategoryIds.has(cat.id!) // Use non-null assertion if ID is guaranteed
        );
        console.log('Available categories (no budget yet):', this.availableCategories);

        // 3. Map existing budgets to BudgetConfig format for the local list
        //    Use the budgets fetched from the API to get the actual budget details
        this.budgetConfigs = this.allUserBudgets.map(budget => ({
            category_id: budget.categoryId,
            monthlyLimit: budget.monthlyLimit,
            // budgetId: budget.budgetId // Optional: store for easier deletion if needed
        }));
        console.log('Initialized budget configs from API data:', this.budgetConfigs);

      },
      error: (err) => {
        console.error('Error loading budgets for current user:', err);
        this.errorMessage = 'Erreur lors du chargement des budgets.';
        this.allUserBudgets = []; // Clear budgets on error
        this.budgetConfigs = []; // Clear local configs on error
        // availableCategories might still be set from loadCategories
      }
    });
  }

  // --- UI Interaction Handlers ---
  onCategoryChange() {
    if (this.selectedCategoryId) {
      this.customCategoryName = ''; // Clear custom name if a category is selected
    }
    this.clearMessages();
    console.log('Selected category ID:', this.selectedCategoryId, 'Custom category:', this.customCategoryName);
  }

  addBudgetCategory() {
    this.clearMessages();

    if (this.customCategoryName) {
      // --- Create New Category ---
      console.log('Creating new category:', this.customCategoryName);
      this.categoryService.create({ name: this.customCategoryName })
        .subscribe({
          next: (newCategory: Category) => { // Specify type
            console.log('New category created:', newCategory);
            // Add new category to the list
            this.allUserCategories = [...this.allUserCategories, newCategory];
            // It's now available for budgets

            // --- Create Budget for the New Category ---
            if (this.newBudgetLimit !== null && this.newBudgetLimit > 0) {
                this.createBudgetAndAddToList(newCategory.id!, this.newBudgetLimit);
            } else {
                 this.errorMessage = 'Veuillez définir une limite valide.';
            }
          },
          error: (err) => {
            console.error('Error creating category:', err);
            this.errorMessage = err.message || 'Erreur lors de la création de la catégorie.';
          }
        });
    } else if (this.selectedCategoryId) {
        // --- Use Selected Existing Category ---
        // --- CRITICAL VALIDATION ---
        if (this.selectedCategoryId === '0' || this.selectedCategoryId.trim() === '') {
            this.errorMessage = 'Veuillez sélectionner une catégorie valide.';
            console.error('Selected category ID is invalid (0 or empty):', this.selectedCategoryId);
            return;
        }

        const categoryIdToAddRaw = +this.selectedCategoryId; // Convert string to number

        // Check if conversion was successful and the result is valid
        if (isNaN(categoryIdToAddRaw) || categoryIdToAddRaw <= 0) {
             this.errorMessage = 'ID de catégorie sélectionné invalide.';
             console.error(`Failed to parse categoryId from '${this.selectedCategoryId}' or parsed value is invalid: ${categoryIdToAddRaw}`);
             return;
        }
        const categoryIdToAdd = categoryIdToAddRaw; // Assign the valid number
        // --- END CRITICAL VALIDATION ---

        // Ensure a limit is set
        if (this.newBudgetLimit === null || this.newBudgetLimit <= 0) {
            this.errorMessage = 'Veuillez définir une limite valide.';
            return;
        }

        // Create budget for the selected existing category
        this.createBudgetAndAddToList(categoryIdToAdd, this.newBudgetLimit);
    } else {
        this.errorMessage = 'Veuillez sélectionner une catégorie ou en créer une nouvelle.';
        return;
    }
  }

  private createBudgetAndAddToList(categoryId: number, monthlyLimit: number) {
    // --- Prepare the request object ---
    // Ensure field names match your backend DTO (budget.model.ts)
    const request: CreateBudgetRequest = {
      categoryId: categoryId,     // Send the numeric ID
      monthlyLimit: monthlyLimit      // Send the limit
    };

    // --- ADD THIS DEBUG LOG ---
    console.log('DEBUG: Sending budget creation request to backend:', request);
    // --- END DEBUG LOG ---

    this.budgetService.create(request).subscribe({
      next: (newBudget: Budget) => { // Expect full Budget object
        console.log('Budget created successfully:', newBudget);

        // 1. Add to local budget config list (using data from the new Budget object)
        const newConfig: BudgetConfig = {
            category_id: newBudget.categoryId,
            monthlyLimit: newBudget.monthlyLimit,
            // budgetId: newBudget.budgetId // If you need the budget ID for deletion
        };
        this.budgetConfigs = [...this.budgetConfigs, newConfig]; // Update local list

        // 2. Remove the category from available list
        this.availableCategories = this.availableCategories.filter(c => c.id !== categoryId);

        // 3. Show success & reset form
        this.successMessage = 'Budget ajouté avec succès !';
        this.resetForm(); // Clear the form fields

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error creating budget:', err);
        // Use the error message formatted by the service's handleError if available
        this.errorMessage = err.message || 'Erreur lors de la création du budget.';
      }
    });
  }

  removeBudgetCategory(categoryId: number) {
    // Find the budget object associated with this categoryId to get its ID for deletion
    // Find the FIRST budget config for this category (assuming one budget per category)
    const budgetConfigToRemove = this.budgetConfigs.find(c => c.category_id === categoryId);

    if (!budgetConfigToRemove) {
        console.warn('Budget config not found for category ID:', categoryId);
        this.errorMessage = 'Configuration de budget non trouvée pour suppression.';
        return;
    }

    // Optional: If you stored budgetId in BudgetConfig, use it directly.
    // const budgetIdToDelete = budgetConfigToRemove.budgetId;
    // if (budgetIdToDelete === undefined) { ... handle error ... }

    // If not, find the full Budget object to get its ID
    // Find the FIRST full budget object for this category (assuming one budget per category)
    const fullBudgetToRemove = this.allUserBudgets.find(b => b.categoryId === categoryId);

    if (!fullBudgetToRemove) {
        console.warn('Full Budget object not found for category ID:', categoryId);
        this.errorMessage = 'Budget non trouvé pour suppression.';
        return;
    }

    const budgetIdToDelete = fullBudgetToRemove.budgetId; // Get the actual budget ID
    if (budgetIdToDelete === undefined || budgetIdToDelete === null) {
         console.error('Budget ID is undefined/null for budget:', fullBudgetToRemove);
         this.errorMessage = 'ID du budget non disponible pour suppression.';
         return;
    }

    // Call API to delete the budget using its actual ID
    this.budgetService.delete(budgetIdToDelete.toString()).subscribe({ // Convert to string if needed
      next: () => {
        console.log(`Budget (ID: ${budgetIdToDelete}) deleted successfully.`);

        // 1. Remove from local budget config list
        this.budgetConfigs = this.budgetConfigs.filter(c => c.category_id !== categoryId);

        // 2. Remove from allUserBudgets list
        this.allUserBudgets = this.allUserBudgets.filter(b => b.budgetId !== budgetIdToDelete);

        // 3. Add the category back to the available list
        const category = this.allUserCategories.find(c => c.id === categoryId);
        if (category) {
            // Check if it's not already in the list (defensive)
            if (!this.availableCategories.some(c => c.id === categoryId)) {
                this.availableCategories = [...this.availableCategories, category];
            }
        } else {
            console.warn('Category not found in allUserCategories for ID:', categoryId);
        }

        this.successMessage = 'Budget supprimé avec succès !';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error deleting budget:', err);
        this.errorMessage = err.message || 'Erreur lors de la suppression du budget.';
      }
    });
  }

  // --- Event Emitters ---
  closeModal() { // <-- Use this method name consistently
    console.log('Closing budget config modal.');
    this.clearMessages();
    // Emit close event to parent component
    this.close.emit();
    // The parent component is responsible for setting isOpen to false
  }

  saveConfig() {
    // Emit save event with current budget configs and alert settings to parent component
    // Parent handles saving to backend
    this.save.emit({
      budgets: [...this.budgetConfigs],
      alertSettings: { ...this.alertSettings }
    });
  }

  // --- Template Helpers ---
  trackByCategory(index: number, config: BudgetConfig): number {
    return config.category_id; // Use category_id for tracking
  }

  getCategoryName(categoryId: number): string {
    // Search in the full list of user categories (this is correct)
    const category = this.allUserCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Inconnu';
  }

  // getCategoryName(categoryId: number): string {
  //   // Search in the full list of user categories
  //   const category = this.allUserCategories.find(c => c.id === categoryId);
  //   return category ? category.name : 'Inconnu';
  // }
}
