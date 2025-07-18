# 🛡️ CyberPortfolio Pro

Un portfolio professionnel moderne avec une esthétique cybersécurité, conçu pour les professionnels de l'IT et de la sécurité informatique.

![Version](https://img.shields.io/badge/version-1.0.0-dc143c.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PHP](https://img.shields.io/badge/PHP-7.4%2B-777BB4.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E.svg)

## 🚀 Aperçu

**CyberPortfolio Pro** est un portfolio web interactif avec une interface terminal/Matrix, intégrant des animations avancées et une récupération automatique des projets GitHub. Parfait pour les administrateurs réseaux, experts en cybersécurité et développeurs souhaitant présenter leurs compétences de manière unique.

![Aperçu du Portfolio](https://github.com/Nyx-Off/CyberPortfolio-Pro/blob/main/portfolio.gif)


### ✨ Caractéristiques principales

- 🎨 **Design Cyberpunk** : Interface terminal avec effet Matrix rain
- 📱 **Responsive** : Optimisé pour tous les appareils
- ⚡ **PWA Ready** : Installation en tant qu'application
- 🔄 **Projets GitHub** : Synchronisation automatique via API
- 🎯 **SEO Optimisé** : Meta tags et structure optimisée
- 🛡️ **Sécurisé** : Headers de sécurité et protection .htaccess
- 🎮 **Interactif** : Animations et easter eggs (Ctrl+Shift+K)

## 📋 Prérequis

- Serveur web (Apache recommandé)
- PHP 7.4 ou supérieur
- Module mod_rewrite activé
- HTTPS (recommandé)

## 🔧 Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/yourusername/cyberportfolio-pro.git
   cd cyberportfolio-pro
   ```

2. **Configurer les projets GitHub**
   
   Éditez `get_github_projects.php` et remplacez le token GitHub :
   ```php
   $github_token = 'YOUR_GITHUB_TOKEN';
   ```

3. **Personnaliser le contenu**
   
   Modifiez `index.html` pour ajouter vos informations personnelles :
   - Nom et titre
   - Expériences professionnelles
   - Formation
   - Compétences

4. **Ajouter vos assets**
   - Remplacez `images/profile.jpg` par votre photo
   - Ajoutez votre audio dans `audio/`

5. **Déployer**
   
   Uploadez tous les fichiers sur votre serveur web.

## 🗂️ Structure du projet

```
cyberportfolio-pro/
│
├── audio/                 # Fichiers audio (témoignages, etc.)
├── images/               # Images et icônes
├── scripts/              # JavaScript
│   ├── main.js          # Script principal
│   └── github-projects.js # Gestion des projets GitHub
├── styles/               # CSS
│   ├── main.css         # Styles principaux
│   ├── animations.css   # Animations
│   └── print.css        # Styles d'impression
│
├── .htaccess            # Configuration Apache
├── 404.html             # Page d'erreur personnalisée
├── get_github_projects.php # API GitHub
├── github-cache.php     # Système de cache
├── index.html           # Page principale
├── manifest.json        # PWA manifest
├── robots.txt           # Directives robots
├── service-worker.js    # Service Worker PWA
└── sitemap.xml          # Plan du site
```

## 🔐 Configuration GitHub API

Pour afficher vos projets GitHub :

1. Générez un [Personal Access Token](https://github.com/settings/tokens)
2. Ajoutez-le dans `get_github_projects.php`
3. Personnalisez la liste des projets à afficher

## 🎨 Personnalisation

### Couleurs
Modifiez les variables CSS dans `styles/main.css` :
```css
:root {
    --primary-color: #dc143c;
    --bg-color: #0a0a0a;
    --text-color: #fff;
}
```

### Animations
- Matrix Rain : `scripts/main.js` (fonction `initMatrixRain`)
- Glitch effect : `styles/animations.css`
- Boot sequence : Personnalisable dans `main.js`

### Easter Eggs
- Terminal popup : `Ctrl+Shift+K`
- Lien secret dans la section contact

## 📱 Progressive Web App

Le site est configuré comme PWA :
- Installation sur mobile/desktop
- Mode hors ligne
- Mise en cache des ressources
- Synchronisation en arrière-plan

## 🚀 Optimisations

- **Performance** : Compression GZIP, cache navigateur
- **Sécurité** : Headers CSP, protection XSS
- **SEO** : Meta tags, sitemap, structured data
- **Accessibilité** : Semantic HTML, ARIA labels

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Samy Bensalem**
- Portfolio : [bensalemdev.fr](https://bensalemdev.fr)
- GitHub : [@Nyx-Off](https://github.com/Nyx-Off)

## 🙏 Remerciements

- Font Awesome pour les icônes
- Google Fonts pour les polices
- Communauté open source

---

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile sur GitHub !
