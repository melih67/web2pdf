-- Script d'initialisation pour Supabase
-- Exécutez ces commandes dans l'éditeur SQL de votre dashboard Supabase

-- 1. Créer la table pdf_exports pour l'historique
CREATE TABLE IF NOT EXISTS pdf_exports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_pdf_exports_user_id ON pdf_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_exports_created_at ON pdf_exports(created_at DESC);

-- 3. Activer Row Level Security (RLS)
ALTER TABLE pdf_exports ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques de sécurité pour la table pdf_exports
CREATE POLICY "Users can view their own exports" ON pdf_exports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exports" ON pdf_exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exports" ON pdf_exports
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Créer les politiques de sécurité pour le storage
-- Note: Ces politiques doivent être créées dans l'interface Storage de Supabase

-- Politique pour permettre aux utilisateurs de télécharger leurs propres fichiers
-- Nom: "Users can upload their own files"
-- Opération: INSERT
-- Condition: auth.uid()::text = (storage.foldername(name))[1]

-- Politique pour permettre aux utilisateurs de voir leurs propres fichiers  
-- Nom: "Users can view their own files"
-- Opération: SELECT
-- Condition: auth.uid()::text = (storage.foldername(name))[1]

-- Politique pour permettre aux utilisateurs de supprimer leurs propres fichiers
-- Nom: "Users can delete their own files"
-- Opération: DELETE
-- Condition: auth.uid()::text = (storage.foldername(name))[1]

-- 6. Fonction utilitaire pour nettoyer les anciens exports (optionnel)
CREATE OR REPLACE FUNCTION cleanup_old_exports()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Supprimer les exports de plus de 30 jours
  DELETE FROM pdf_exports 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- 7. Fonction pour obtenir les statistiques utilisateur (optionnel)
CREATE OR REPLACE FUNCTION get_user_export_stats()
RETURNS TABLE (
  total_exports bigint,
  exports_last_week bigint,
  exports_last_month bigint,
  first_export timestamp with time zone,
  last_export timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_exports,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as exports_last_week,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as exports_last_month,
    MIN(created_at) as first_export,
    MAX(created_at) as last_export
  FROM pdf_exports
  WHERE user_id = auth.uid();
END;
$$;

-- 8. Fonction pour obtenir l'URL publique d'un fichier (optionnel)
CREATE OR REPLACE FUNCTION get_pdf_public_url(storage_path text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  public_url text;
BEGIN
  -- Cette fonction peut être utilisée côté serveur pour générer des URLs
  -- L'implémentation dépend de votre configuration Supabase
  SELECT CONCAT(
    current_setting('app.supabase_url'),
    '/storage/v1/object/public/pdfs/',
    storage_path
  ) INTO public_url;
  
  RETURN public_url;
END;
$$;

-- Commentaires pour l'utilisation
COMMENT ON TABLE pdf_exports IS 'Table pour stocker l''historique des exports PDF des utilisateurs';
COMMENT ON COLUMN pdf_exports.user_id IS 'Référence vers l''utilisateur qui a créé l''export';
COMMENT ON COLUMN pdf_exports.url IS 'URL de la page web convertie';
COMMENT ON COLUMN pdf_exports.filename IS 'Nom du fichier PDF généré';
COMMENT ON COLUMN pdf_exports.storage_path IS 'Chemin du fichier dans Supabase Storage';
COMMENT ON COLUMN pdf_exports.created_at IS 'Date et heure de création de l''export';

-- Fin du script d'initialisation