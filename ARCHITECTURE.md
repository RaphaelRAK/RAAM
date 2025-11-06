# Architecture de l'application Budget App

## Structure du projet

```
/app                    # Écrans Expo Router
  /_layout.tsx         # Layout principal avec QueryClient
  /index.tsx            # Point d'entrée (redirection)
  /onboarding.tsx       # Onboarding sans compte
  /(tabs)               # Navigation par onglets
    /_layout.tsx        # Layout des tabs
    /dashboard.tsx      # Écran principal
    /transactions.tsx   # Liste des transactions
    /budgets.tsx        # Gestion des budgets
    /settings.tsx       # Paramètres

/src
  /components           # Composants UI réutilisables
    /Button.tsx
    /Card.tsx
    /AmountInput.tsx
    /CategoryChip.tsx
    /BudgetRing.tsx
    /TxListItem.tsx
    /EmptyState.tsx

  /store                # Stores Zustand
    /auth.ts            # État d'authentification
    /vault.ts           # Gestion des portefeuilles
    /transactions.ts    # Gestion des transactions

  /services             # Services métier
    /crypto.ts          # Chiffrement (XSalsa20-Poly1305)
    /recovery.ts         # Génération clé de récupération
    /notifications.ts   # Notifications locales
    /sync.ts            # Synchronisation Supabase
    /analytics.ts       # PostHog
    /sentry.ts          # Monitoring Sentry
    /purchases.ts       # RevenueCat IAP

  /db                   # Base de données SQLite
    /schema.ts          # Schéma de la base
    /index.ts           # Initialisation DB

  /utils                # Utilitaires
    /id.ts              # Génération d'IDs
    /currency.ts        # Formatage des montants
    /date.ts            # Formatage des dates

  /theme                # Design system
    /colors.ts          # Palette de couleurs
    /typography.ts      # Typographie
    /spacing.ts         # Espacements et bordures

  /types                # Types TypeScript
    /index.ts           # Types Zod pour validation
```

## Flux de données

### Onboarding
1. L'utilisateur lance l'app
2. Vérification si un compte existe (table `user_local`)
3. Si non, affichage de l'onboarding
4. Génération d'une clé maître (32 bytes)
5. Génération d'une clé de récupération (12 mots)
6. Stockage de la clé maître dans SecureStore
7. Création de l'enregistrement `user_local`

### Création de transaction
1. L'utilisateur saisit le montant, catégorie, note
2. Chiffrement de la note avec la clé maître
3. Insertion dans la table `transaction`
4. Ajout à la file de synchronisation (`sync_outbox`)
5. Mise à jour de l'état Zustand

### Synchronisation
1. Pull des changements depuis Supabase
2. Application des changements (LWW)
3. Push des changements locaux
4. Suppression des entrées traitées de `sync_outbox`

## Sécurité

- **Clé maître** : Générée localement, stockée dans SecureStore, jamais envoyée au serveur
- **Chiffrement** : XSalsa20-Poly1305 pour les champs sensibles (note, pièces jointes)
- **Transport** : TLS pour toutes les communications
- **PII** : Aucune donnée personnelle identifiante par défaut

## Base de données

### Tables principales
- `user_local` : Informations de l'utilisateur local
- `vault` : Portefeuilles
- `category` : Catégories de transactions
- `transaction` : Transactions (IN/OUT)
- `budget` : Budgets par période
- `reminder` : Rappels planifiés
- `sync_outbox` : File d'attente de synchronisation

## Services externes

### Supabase
- Postgres pour la synchronisation
- Edge Functions pour les endpoints de sync
- RLS pour la sécurité

### Cloudflare R2
- Stockage des pièces jointes chiffrées
- Accès via CDN

### RevenueCat
- Gestion des achats in-app
- Abonnements Premium

### PostHog
- Analytics événementiels
- Funnels et rétention

### Sentry
- Monitoring des erreurs
- Performance tracking

## Prochaines étapes

1. Implémenter les écrans manquants (ajout transaction, budgets, etc.)
2. Configurer les icônes (@expo/vector-icons)
3. Implémenter VictoryPie pour les graphiques
4. Ajouter la gestion des catégories
5. Implémenter les budgets avec alertes
6. Ajouter les rappels et notifications
7. Intégrer RevenueCat pour le paywall
8. Configurer Supabase pour la sync
9. Tests unitaires et E2E

