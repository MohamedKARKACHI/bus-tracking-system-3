# Guide de Compilation du Rapport PDF

## ✅ Option 1 : Overleaf (Recommandée - Immédiate)

**Overleaf** est un éditeur LaTeX en ligne gratuit qui compile automatiquement votre PDF.

### Étapes :

1. **Créer un compte** : Allez sur https://www.overleaf.com et inscrivez-vous gratuitement

2. **Créer un nouveau projet** :
   - Cliquez sur **"New Project"** → **"Upload Project"**
   - Sélectionnez le fichier `Rapport_PFA_Bus_Tracking_System_UPDATED.tex`
   - Ou créez un **"Blank Project"** et copiez-collez le contenu du fichier

3. **Compiler** :
   - Le PDF se génère automatiquement dans le panneau de droite
   - Si besoin, cliquez sur **"Recompile"**
   - Téléchargez le PDF via le bouton **"Download PDF"**

4. **Avantages** :
   - ✅ Aucune installation requise
   - ✅ Compilation automatique
   - ✅ Tous les packages LaTeX sont déjà installés
   - ✅ Collaboration possible
   - ✅ Historique des versions

---

## Option 2 : Installation Locale (macOS)

### A. Installation de BasicTeX (Légère - ~100MB)

```bash
# Installation via Homebrew (nécessite mot de passe admin)
brew install --cask basictex

# Ajouter au PATH
export PATH="/Library/TeX/texbin:$PATH"
echo 'export PATH="/Library/TeX/texbin:$PATH"' >> ~/.zshrc

# Mettre à jour tlmgr
sudo tlmgr update --self

# Installer les packages nécessaires
sudo tlmgr install collection-fontsrecommended
sudo tlmgr install babel-french
sudo tlmgr install fancyhdr
sudo tlmgr install titlesec
sudo tlmgr install enumitem
sudo tlmgr install caption
sudo tlmgr install geometry
sudo tlmgr install hyperref
sudo tlmgr install listings
sudo tlmgr install xcolor
sudo tlmgr install booktabs
sudo tlmgr install tabularx
sudo tlmgr install float
sudo tlmgr install longtable
sudo tlmgr install multicol
sudo tlmgr install array
```

### B. Installation de MacTeX (Complète - ~4GB)

```bash
# Installation complète (tous les packages inclus)
brew install --cask mactex

# Ajouter au PATH
export PATH="/Library/TeX/texbin:$PATH"
echo 'export PATH="/Library/TeX/texbin:$PATH"' >> ~/.zshrc
```

### C. Compilation du document

Une fois LaTeX installé :

```bash
# Aller dans le répertoire du projet
cd /Users/apple/Downloads/bus-tracking-system-3

# Compiler le document (3 passes pour table des matières)
pdflatex Rapport_PFA_Bus_Tracking_System_UPDATED.tex
pdflatex Rapport_PFA_Bus_Tracking_System_UPDATED.tex
pdflatex Rapport_PFA_Bus_Tracking_System_UPDATED.tex

# Le PDF sera généré : Rapport_PFA_Bus_Tracking_System_UPDATED.pdf
```

**Note** : La triple compilation est nécessaire pour :
1. Générer le contenu
2. Créer la table des matières
3. Résoudre les références croisées

---

## Option 3 : Docker (Portable)

Si vous avez Docker installé :

```bash
# Lancer un conteneur avec LaTeX
docker run --rm -v "$PWD:/data" \
  thomasweise/docker-texlive-full \
  pdflatex -interaction=nonstopmode \
  /data/Rapport_PFA_Bus_Tracking_System_UPDATED.tex

# Relancer 2 fois pour les références
docker run --rm -v "$PWD:/data" \
  thomasweise/docker-texlive-full \
  pdflatex -interaction=nonstopmode \
  /data/Rapport_PFA_Bus_Tracking_System_UPDATED.tex
```

---

## Résolution de Problèmes

### Erreur "pdflatex: command not found"
- **Solution** : Vérifiez que LaTeX est dans le PATH
  ```bash
  which pdflatex
  # Devrait afficher : /Library/TeX/texbin/pdflatex
  ```
- Si vide, ajoutez au PATH :
  ```bash
  export PATH="/Library/TeX/texbin:$PATH"
  ```

### Erreur "Package not found"
- **Solution** : Installez le package manquant
  ```bash
  sudo tlmgr install <nom-du-package>
  ```

### Caractères français mal affichés
- **Solution** : Utilisez XeLaTeX au lieu de pdflatex
  ```bash
  xelatex Rapport_PFA_Bus_Tracking_System_UPDATED.tex
  ```

### Le PDF ne se met pas à jour
- **Solution** : Supprimez les fichiers auxiliaires
  ```bash
  rm *.aux *.toc *.lof *.lot *.log *.out
  ```

---

## Structure du Document

Le rapport LaTeX contient :

✅ **Préliminaires**
- Page de garde
- Dédicace
- Remerciements
- Résumé (FR + EN)
- Liste des figures
- Liste des tableaux
- Glossaire
- Table des matières

✅ **Corps du document**
- Chapitre 1 : État de l'Art (complet avec tableaux)
- Chapitre 2 : Contexte Général (objectifs, Scrum, risques)
- Chapitre 3 : Analyse et Conception (UML, DB, architecture)
- Chapitre 4 : Technologies et Outils (stack détaillé)
- Chapitre 5 : Implémentation et Tests (Selenium, SonarQube, JMeter)
- Chapitre 6 : Service ANPR (YOLOv8, endpoints)
- Chapitre 7 : IA et Machine Learning (training, métriques)
- Chapitre 8 : Guide Pratique et Déploiement (Docker, Nginx)

✅ **Annexes**
- Conclusion générale
- Références
- Annexes (scripts SQL, config, screenshots)

---

## 🎯 Recommandation

**Utilisez Overleaf** (Option 1) pour une compilation immédiate sans installation !

C'est la solution la plus rapide et la plus fiable pour générer votre PDF professionnel.

---

## Fichiers Générés après Compilation

Après compilation réussie, vous aurez :

- `Rapport_PFA_Bus_Tracking_System_UPDATED.pdf` ← **Votre rapport final**
- `Rapport_PFA_Bus_Tracking_System_UPDATED.aux` (auxiliaire)
- `Rapport_PFA_Bus_Tracking_System_UPDATED.toc` (table des matières)
- `Rapport_PFA_Bus_Tracking_System_UPDATED.lof` (liste des figures)
- `Rapport_PFA_Bus_Tracking_System_UPDATED.lot` (liste des tableaux)
- `Rapport_PFA_Bus_Tracking_System_UPDATED.log` (logs de compilation)
- `Rapport_PFA_Bus_Tracking_System_UPDATED.out` (hyperlinks)

Vous pouvez supprimer tous les fichiers sauf le `.tex` et le `.pdf`.

---

## Support

Pour toute question sur LaTeX ou Overleaf :
- Documentation Overleaf : https://www.overleaf.com/learn
- LaTeX Stack Exchange : https://tex.stackexchange.com
