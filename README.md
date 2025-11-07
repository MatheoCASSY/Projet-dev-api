# JeuScope — README complet

Bienvenue dans JeuScope — une application React qui vise à recréer l'expérience d'un store de jeux vidéo, mais de façon plus indépendante et orientée découverte.

Objectif du projet
- Créer une interface qui agrège des données de jeux (via l'API RAWG) pour proposer : listes, filtres par genre, fiches détaillées.
- Ajouter un composant serveur (proxy) pour récupérer des données Steam (prix, succès, avis) sans être bloqué par CORS.
- Rendre le frontend autonome : l'objectif est de fournir une alternative légère à un store centralisé en combinant plusieurs sources publiques d'information.

Fonctionnalités clés
- Liste de jeux et recherche (RAWG).
- Carrousel de jeux vedette et grille de jeux.
- Filtrage par catégorie/genre.
- Fiches détaillées avec images, métadonnées et données Steam (via proxy).

Prérequis
- Node.js (>=14) et npm.
- Compte RAWG pour obtenir une clé API.
- (Optionnel) Compte Steam pour obtenir une Steam Web API key si tu veux des données Steam supplémentaires.

Où créer les clés d'API (pas-à-pas)

1) RAWG — clé API
- Va sur https://rawg.io/apidocs
- Crée un compte ou connecte-toi.
- Suis la documentation pour demander une clé API (généralement depuis ton tableau de bord développeur).
- Une fois obtenue, copie la clé : elle sera utilisée dans la variable `REACT_APP_RAWG_API_KEY`.

2) Steam — Steam Web API Key (optionnel)
- Va sur https://steamcommunity.com/dev/apikey
- Connecte-toi avec ton compte Steam.
- Indique le nom de domaine de ton application (pour local dev tu peux mettre `localhost`) et crée la clé.
- Copie la clé pour `REACT_APP_STEAM_API_KEY`. Sans cette clé le proxy fonctionne encore, mais certains endpoints (schema des succès) ne seront pas disponibles.

Configuration du projet (.env)

- Un fichier d'exemple `.env.example` est présent dans le dépôt. Pour créer ton fichier local :

PowerShell (Windows) :
```powershell
Copy-Item .env.example .env
notepad .env
```

- Remplace les valeurs par tes clés :
```bash
REACT_APP_RAWG_API_KEY=ta_clef_rawg_ici
REACT_APP_STEAM_API_KEY=ta_clef_steam_ici   # optionnel
```

- Important : ne commite jamais `.env` avec tes clés publiques. Ajoute `.env` à `.gitignore` si ce n'est pas déjà fait.

Lancer et tester en local

1) Installer les dépendances :
```powershell
npm install
```

2) Démarrer l'application en mode développement :
```powershell
npm start
```

3) Ouvre http://localhost:3000

Vérifications utiles
- Si l'app affiche "Missing RAWG API key", vérifie `.env` et relance `npm start`.
- Pour tester le proxy Steam localement, tu peux soit déployer (voir ci‑dessous), soit émuler avec Vercel CLI :

Emuler la fonction proxy avec Vercel (optionnel)
- Installe la CLI Vercel :
```powershell
npm i -g vercel
```
- Lance l'émulation locale depuis la racine du projet :
```powershell
vercel dev
```
- L'endpoint sera disponible sur `http://localhost:3000/api/steam-proxy` ou à l'URL indiquée par `vercel dev`.

Démarrer un proxy local simple (Express) — optionnel
- Si tu préfères éviter Vercel, tu peux ajouter un petit serveur Express pour exposer `api/steam-proxy.js` localement :

- Installer express :
```powershell
npm install express node-fetch@2
```
- Créer un fichier `server.js` (exemple) à la racine :
```javascript
// server.js
const express = require('express');
const proxy = require('./api/steam-proxy');
const app = express();
app.get('/api/steam-proxy', (req, res) => proxy(req, res));
const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Proxy listening on', port));
```
- Lancer :
```powershell
node server.js
```
- Le proxy sera accessible sur `http://localhost:3001/api/steam-proxy?appid=XXXXX`.

Construction (production)

```powershell
npm run build
```

Le dossier `build/` contient l'application prête à être servie.

Déploiement recommandé (Vercel)
- Vercel est simple : connecte ton repo et ajoute les variables d'environnement `REACT_APP_RAWG_API_KEY` et `REACT_APP_STEAM_API_KEY` dans les settings du projet.