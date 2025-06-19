# Web2PDF - Convertisseur de pages web en PDF

Une application Next.js qui permet de convertir des pages web en PDF avec authentification utilisateur et stockage cloud via Supabase.

## Fonctionnalités

- ✅ Authentification utilisateur (inscription/connexion) via Supabase Auth
- ✅ Conversion de pages web en PDF avec Puppeteer
- ✅ Stockage automatique des PDF dans Supabase Storage
- ✅ Interface utilisateur moderne et responsive avec TailwindCSS
- ✅ Extraction automatique du titre de la page pour nommer le fichier
- ✅ Validation des URL
- ✅ Ouverture automatique du PDF généré

## Stack technique

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS
- **Authentification**: Supabase Auth
- **Stockage**: Supabase Storage
- **Génération PDF**: Puppeteer
- **Base de données**: Supabase (PostgreSQL)

## Installation

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd Web2PDF
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Supabase**
   
   a. Créez un projet sur [Supabase](https://supabase.com)
   
   b. Copiez les clés de votre projet et modifiez le fichier `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
   ```

4. **Configuration du stockage Supabase**
   
   Dans votre dashboard Supabase :
   
   a. Allez dans **Storage** > **Buckets**
   
   b. Créez un nouveau bucket nommé `pdfs`
   
   c. Configurez les politiques de sécurité pour permettre aux utilisateurs authentifiés de lire et écrire :
   
   ```sql
   -- Politique pour permettre aux utilisateurs de télécharger leurs propres fichiers
   CREATE POLICY "Users can upload their own files" ON storage.objects
   FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[2]);
   
   -- Politique pour permettre aux utilisateurs de voir leurs propres fichiers
   CREATE POLICY "Users can view their own files" ON storage.objects
   FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[2]);
   ```

5. **Configuration de la base de données (optionnel)**
   
   Pour l'historique des exports, créez la table `pdf_exports` :
   
   ```sql
   CREATE TABLE pdf_exports (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     url TEXT NOT NULL,
     filename TEXT NOT NULL,
     storage_path TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Index pour améliorer les performances
   CREATE INDEX idx_pdf_exports_user_id ON pdf_exports(user_id);
   CREATE INDEX idx_pdf_exports_created_at ON pdf_exports(created_at DESC);
   
   -- Politique de sécurité
   ALTER TABLE pdf_exports ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can view their own exports" ON pdf_exports
   FOR SELECT USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert their own exports" ON pdf_exports
   FOR INSERT WITH CHECK (auth.uid() = user_id);
   ```

## Démarrage

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Utilisation

1. **Inscription/Connexion**
   - Créez un compte ou connectez-vous avec vos identifiants
   - Vérifiez votre email si vous vous inscrivez

2. **Génération de PDF**
   - Entrez l'URL de la page web à convertir
   - Cliquez sur "Générer le PDF"
   - Le PDF s'ouvrira automatiquement dans un nouvel onglet
   - Le fichier est sauvegardé dans votre espace de stockage cloud

## Structure du projet

```
Web2PDF/
├── app/
│   ├── api/
│   │   └── generate-pdf/
│   │       └── route.ts          # API pour générer les PDF
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts           # Callback d'authentification
│   │   ├── signin/
│   │   │   └── page.tsx           # Page de connexion
│   │   └── signup/
│   │       └── page.tsx           # Page d'inscription
│   ├── globals.css                # Styles globaux
│   ├── layout.tsx                 # Layout principal
│   └── page.tsx                   # Page d'accueil
├── components/
│   ├── AuthForm.tsx               # Formulaire d'authentification
│   └── PdfGenerator.tsx           # Composant principal de génération
├── lib/
│   ├── pdf.ts                     # Logique de génération PDF
│   └── supabase.ts                # Configuration Supabase
├── .env.local                     # Variables d'environnement
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Fonctionnalités avancées

### Personnalisation du PDF

Vous pouvez modifier les options de génération PDF dans `lib/pdf.ts` :

```typescript
const pdfBuffer = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: {
    top: '20px',
    right: '20px', 
    bottom: '20px',
    left: '20px'
  },
  displayHeaderFooter: false
})
```

### Gestion des erreurs

L'application gère automatiquement :
- Les URL invalides
- Les erreurs de réseau
- Les timeouts de chargement de page
- Les erreurs d'upload vers Supabase

## Déploiement

### Vercel (recommandé)

1. Connectez votre repository à Vercel
2. Ajoutez les variables d'environnement dans les paramètres Vercel
3. Déployez

### Autres plateformes

Assurez-vous que la plateforme supporte :
- Node.js 18+
- Puppeteer (certaines plateformes nécessitent des configurations spéciales)

## Dépannage

### Problèmes avec Puppeteer

Si Puppeteer ne fonctionne pas en production :

1. Vérifiez que les dépendances système sont installées
2. Ajoutez les arguments Chrome appropriés dans `lib/pdf.ts`
3. Considérez l'utilisation d'un service externe comme Browserless

### Problèmes d'authentification

1. Vérifiez que les URL de callback sont correctement configurées dans Supabase
2. Assurez-vous que les variables d'environnement sont correctes

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT License