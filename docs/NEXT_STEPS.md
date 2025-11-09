# Prochaines étapes - Sprint S1 à S3

## ✅ Sprint S1 - Fondation (complété)

- [x] Init Expo RN TS, ESLint/Prettier
- [x] Design system (couleurs, typo, tokens), thème dark/light
- [x] Composants de base (Button, Card, Chips, AmountInput)
- [x] SQLite: création schéma local + DAO
- [x] Onboarding sans compte: coffre local, génération clé/QR
- [x] Écrans: Dashboard (placeholders), Transactions (liste)
- [x] Catégories: set par défaut + CRUD

## 🔄 Sprint S2 - Fonctionnel MVP (en cours)

- [ ] Transactions complètes: IN/OUT, pièce jointe photo (local), récurrences (RRULE light)
- [ ] Budgets & enveloppes: création, anneaux, alertes 50/80/100%
- [ ] Import/Export CSV: mapping simple + gestion devise
- [ ] Sécurité: verrouillage par code/biométrie, 'privacy mode' (masque)
- [ ] Paywall (RevenueCat sandbox): Free vs Premium (gating)
- [ ] Performance: listes virtuelles, cold start, images compressées
- [ ] Rappels locaux: service de planification + permissions

## 📋 Sprint S3 - Sync optionnelle + Pré-release

- [ ] Supabase Edge: /v1/sync/pull & /v1/sync/push (LWW + outbox)
- [ ] R2: upload chiffré des pièces jointes (Premium)
- [ ] Multi-device: liaison via QR (transfert identifiant coffre + dérivation)
- [ ] QA: tests E2E (Detox léger), crash checks, politiques Stores, privacy policy

## 🚀 Sprint S4 - Go-to-market

- [ ] Listing stores, captures, vidéo, FAQ, onboarding tips, essai 7j
- [ ] Beta TestFlight / Closed Track, corrections, 1ère release publique

## 📝 Notes importantes

- Les assets (icônes, splash) doivent être générés et placés dans `/assets`
- Les variables d'environnement doivent être configurées dans `.env`
- Les services Sentry, PostHog doivent être configurés avec les clés appropriées
- RevenueCat doit être configuré pour les achats in-app

