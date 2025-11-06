# Guide de configuration - Budget App

## Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Compte Expo (pour EAS Build)

## Installation

```bash
# Installer les dépendances
npm install

# Pour iOS (nécessite Xcode)
cd ios && pod install && cd ..

# Pour Android (nécessite Android Studio)
# Aucune action supplémentaire nécessaire
```

## Configuration des variables d'environnement

1. Copiez `.env.example` vers `.env` :
```bash
cp .env.example .env
```

2. Remplissez les variables dans `.env` :
```env
EXPO_PUBLIC_ENV=dev
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_POSTHOG_KEY=phc_xxx
EXPO_PUBLIC_SENTRY_DSN=https://xxx.ingest.sentry.io/yyy
```

## Développement

```bash
# Démarrer le serveur de développement
npm start

# Démarrer sur iOS
npm run ios

# Démarrer sur Android
npm run android

# Démarrer sur Web
npm run web
```

## Build

### EAS Build (recommandé)

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Configurer le projet
eas build:configure

# Build pour iOS
eas build --platform ios

# Build pour Android
eas build --platform android
```

### Build local

```bash
# iOS (nécessite Xcode)
npx expo run:ios

# Android (nécessite Android Studio)
npx expo run:android
```

## Tests

```bash
# Linter
npm run lint

# Type checking
npm run type-check

# Formatage
npm run format
```

## Structure des assets

Créez les fichiers suivants dans `/assets` :

- `icon.png` (1024x1024)
- `splash.png` (2048x2048)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)
- `notification-icon.png` (96x96)

## Services externes

### Supabase
1. Créer un projet Supabase
2. Configurer les tables selon le schéma
3. Créer les Edge Functions pour `/v1/sync/pull` et `/v1/sync/push`
4. Configurer RLS

### PostHog
1. Créer un compte PostHog
2. Créer un projet
3. Récupérer la clé API
4. Ajouter dans `.env`

### Sentry
1. Créer un projet Sentry
2. Récupérer le DSN
3. Ajouter dans `.env`

### RevenueCat
1. Créer un compte RevenueCat
2. Créer une app iOS et Android
3. Configurer les produits Premium
4. Récupérer les clés API
5. Ajouter dans `.env`

### Cloudflare R2
1. Créer un bucket R2
2. Configurer les permissions
3. Créer un token d'accès
4. Configurer le CDN
5. Ajouter dans `.env`

## Problèmes courants

### Erreur "Module not found"
```bash
# Nettoyer et réinstaller
rm -rf node_modules
npm install
```

### Erreur "Metro bundler"
```bash
# Réinitialiser le cache
npx expo start --clear
```

### Erreur iOS "Pod install"
```bash
cd ios
pod deintegrate
pod install
cd ..
```

## Commandes utiles

```bash
# Voir les logs
npx expo start --dev-client

# Ouvrir les DevTools
npx expo start --dev-client --devtools

# Build preview
eas build --profile preview

# Soumettre à l'App Store
eas submit --platform ios

# Soumettre à Google Play
eas submit --platform android
```

