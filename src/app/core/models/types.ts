// ENUMS
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type Sexe = 'HOMME' | 'FEMME';
export type GroupeSanguin =
  | 'A_POSITIF'
  | 'A_NEGATIF'
  | 'B_POSITIF'
  | 'B_NEGATIF'
  | 'AB_POSITIF'
  | 'AB_NEGATIF'
  | 'O_POSITIF'
  | 'O_NEGATIF';
export type Urgence = 'NORMALE' | 'HAUTE' | 'CRITIQUE';
export type StatutDon =
  | 'EN_ATTENTE'
  | 'VALIDE'
  | 'REJETE'
  | 'UTILISE'
  | 'PERIME';
export type StatutDemande =
  | 'EN_ATTENTE'
  | 'EN_COURS'
  | 'SATISFAITE'
  | 'ANNULEE'
  | 'REJETEE';
export type StatutHopital = 'EN_ATTENTE' | 'VALIDE' | 'SUSPENDU' | 'REJETE';
export type TypeNotification =
  | 'INFO'
  | 'ALERTE'
  | 'URGENCE'
  | 'SUCCES'
  | 'RAPPEL'
  | 'SYSTEME';
export type PrioriteNotification = 'BASSE' | 'NORMALE' | 'HAUTE' | 'CRITIQUE';
export type NiveauStock = 'CRITIQUE' | 'NORMAL' | 'ELEVE';

// REQUESTS
export interface InscriptionRequest {
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: Role;
  hopitalId?: number;
}
export interface ConnexionRequest {
  email: string;
  motDePasse: string;
}
export interface DonRequest {
  hopitalId: number;
  quantiteMl: number;
  notes?: string;
}
export interface DemandeSangRequest {
  groupeSanguinDemande: GroupeSanguin;
  quantiteDemandee: number;
  hopitalId: number;
  urgence: Urgence;
  nomPatient: string;
  prenomPatient: string;
  diagnostic: string;
  medecinPrescripteur: string;
  dateBesoin: string;
  notes?: string;
}
export interface HopitalRequest {
  nom: string;
  adresse: string;
  ville: string;
  region: string;
  telephone: string;
  email: string;
  capaciteStockage: number;
  description?: string;
}
export interface NotificationRequest {
  titre: string;
  message: string;
  type: TypeNotification;
  priorite: PrioriteNotification;
}
export interface CampagneRequest {
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  hopitalId?: number;
  nationale?: boolean;
}
export interface DonneurProfileRequest {
  cin: string;
  dateNaissance: string;
  sexe: Sexe;
  groupeSanguin: GroupeSanguin;
  poids: number;
  adresse: string;
  ville: string;
  antecedentsMedicaux?: string;
}

// RESPONSES
export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  pointsTotal?: number;
  hopitalId?: number;
}
export interface DonneurResponse {
  id: number;
  nom: string;
  prenom: string;
  groupeSanguin: GroupeSanguin;
  eligible: boolean;
  ville: string;
  pointsTotal?: number;
}
export interface HopitalResponse {
  id: number;
  nom: string;
  ville: string;
  region: string;
  statut: StatutHopital;
  capaciteStockage: number;
}
export interface DonResponse {
  id: number;
  statut: StatutDon;
  quantiteMl: number;
  dateCreation: string;
  hopital?: HopitalResponse;
}
export interface DemandeSangResponse {
  id: number;
  nomPatient: string;
  prenomPatient: string;
  groupeSanguinDemande: GroupeSanguin;
  quantiteDemandee: number;
  urgence: Urgence;
  statut: StatutDemande;
  dateDemande: string;
}
export interface StockResponse {
  groupeSanguin: GroupeSanguin;
  quantiteTotale: number;
  niveauStock: NiveauStock;
}
export interface BadgeResponse {
  nom: string;
  niveau: string;
  description: string;
  obtenuLe: string;
}
export interface NotificationResponse {
  id: number;
  titre: string;
  message: string;
  type: TypeNotification;
  priorite: PrioriteNotification;
  lue: boolean;
  dateCreation: string;
  lienAction?: string;
}
export interface CampagneResponse {
  id: number;
  titre: string;
  dateDebut: string;
  dateFin: string;
  nationale: boolean;
}
export interface DashboardAnalytics {
  totalDons: number;
  totalDonneurs: number;
  totalDemandes: number;
  demandesUrgentes: number;
  stocksCritiques: number;
  donsMoisActuel: number;
}
