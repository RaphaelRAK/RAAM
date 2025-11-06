# Budget App

Application de gestion de budget en React Native avec Expo, architecture local-first.

## Stack technique

- **Expo** + **React Native** + **TypeScript**
- **SQLite** (local-first)
- **Supabase** (sync optionnelle)
- **Cloudflare R2** (pièces jointes)
- **RevenueCat** (IAP)
- **PostHog** (analytics)
- **Sentry** (monitoring)

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
EXPO_PUBLIC_ENV=dev
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
EXPO_PUBLIC_POSTHOG_KEY=phc_xxx
EXPO_PUBLIC_SENTRY_DSN=https://xxx.ingest.sentry.io/yyy
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_R2_BUCKET=bucket-budget
EXPO_PUBLIC_R2_PUBLIC_BASE=https://cdn.example.com/objects
```

## Développement

```bash
npm start
```

## Structure du projet

```
/app              # Écrans Expo Router
/src
  /components     # Composants UI réutilisables
  /screens        # Écrans (si nécessaire)
  /hooks          # Hooks React personnalisés
  /store          # Stores Zustand
  /services       # Services (crypto, sync, analytics, etc.)
  /db             # Base de données SQLite
  /utils          # Utilitaires
  /theme          # Design system
  /types          # Types TypeScript
```

## Fonctionnalités

- ✅ Onboarding sans compte (clé de récupération 12 mots)
- ✅ Gestion de transactions (IN/OUT)
- ✅ Portefeuilles multiples
- ✅ Chiffrement des données sensibles
- ✅ Base de données locale SQLite
- 🔄 Sync optionnelle (Supabase)
- 🔄 Budgets et enveloppes
- 🔄 Rappels et notifications
- 🔄 Premium (RevenueCat)

## Sécurité

- Clé maître stockée dans SecureStore
- Chiffrement XSalsa20-Poly1305 pour les champs sensibles
- Aucune PII envoyée par défaut
- Transport TLS

## Licence

Propriétaire
