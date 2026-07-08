# OmarchéExpress — Déploiement sur Vercel

Ce dossier est un projet React (Vite) prêt à être déployé. Deux façons de le mettre en ligne avec ton compte Vercel :

## Option A — Le plus simple : Vercel CLI (5 min, depuis ton ordinateur)

1. Télécharge et décompresse ce dossier sur ton ordinateur.
2. Ouvre un terminal dans le dossier `omarcheexpress-site`.
3. Installe les dépendances :
   ```
   npm install
   ```
4. Installe la CLI Vercel (si pas déjà fait) :
   ```
   npm install -g vercel
   ```
5. Lance le déploiement :
   ```
   vercel
   ```
   - Connecte-toi avec ton compte Vercel si demandé.
   - Accepte les valeurs par défaut (Vercel détecte Vite automatiquement).
6. Pour la mise en ligne définitive (production) :
   ```
   vercel --prod
   ```
7. Vercel t'affiche un lien du type `https://omarcheexpress.vercel.app` — c'est ton site en ligne.

## Option B — Via GitHub (recommandé si tu veux mettre à jour le site facilement plus tard)

1. Crée un nouveau dépôt sur https://github.com/new (ex: `omarcheexpress`).
2. Dans le dossier du projet, sur ton ordinateur :
   ```
   git init
   git add .
   git commit -m "Premier déploiement OmarchéExpress"
   git branch -M main
   git remote add origin https://github.com/TON-COMPTE/omarcheexpress.git
   git push -u origin main
   ```
3. Va sur https://vercel.com/new, connecte ton compte GitHub, choisis le dépôt `omarcheexpress`.
4. Vercel détecte automatiquement "Vite" comme framework — laisse les réglages par défaut.
5. Clique sur "Deploy". Le site est en ligne en 1-2 minutes.
6. À chaque fois que tu modifies le code et fais `git push`, Vercel republie automatiquement.

## Important à savoir

Ce site est une **démonstration front-end** :
- Les produits, commandes et comptes sont stockés en mémoire dans le navigateur de chaque visiteur.
- Rien n'est partagé entre les visiteurs, et tout est réinitialisé au rechargement de la page.
- Il est prêt à montrer le concept, le design et le parcours utilisateur — mais **pas encore à gérer de vraies commandes et un vrai stock partagé**.

Pour un site réellement fonctionnel (commandes/stock partagés, comptes réels), il faudra ajouter une base de données et un backend — je peux t'accompagner sur cette étape quand tu seras prêt.
