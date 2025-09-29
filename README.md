# JSQuizStarter2
## Introduction  

Ce projet est une évolution du prototype **JSQuizStarter**.  
L’objectif est de développer une **application de quiz éducative moderne et interactive**, qui dépasse le simple enchaînement de questions statiques.  

Cette nouvelle version met en avant :  
- Le **chargement dynamique des données** (via fichiers JSON).  
- L’utilisation de **concepts avancés de JavaScript (ES6+)**.  
- Une **expérience utilisateur enrichie** avec chronomètre, feedback visuel et sauvegarde de progression.  
- Un **tableau de bord complet** permettant d’analyser les performances grâce à des statistiques et des graphiques.  

En résumé, ce projet vise à offrir une **plateforme ludique et pédagogique** qui combine interactivité, persistance des données et visualisation des résultats.  


### Thèmes disponibles
- JavaScript Basics
- DOM & Events
- Objects & Arrays

### Technologies utilisées

Le projet repose uniquement sur des technologies front-end modernes :

- **HTML5** → structure de l’application.
- **CSS3 (Flexbox, Grid, responsive design)** → mise en page et style.
- **JavaScript (ES6+)** → logique principale du quiz (modules, async/await, map, filter, reduce…).
- **LocalStorage** → sauvegarde persistante des utilisateurs, réponses et statistiques.
- **Chart.js** → visualisation graphique des performances et statistiques.
- **jsPDF / html2canvas** → génération et export des rapports.

## Installation

Le projet étant une application front-end simple (HTML, CSS, JavaScript), l'installation est très rapide.

### Étapes :

1. **Cloner le dépôt GitHub** :  
```bash
git clone https://github.com/ElFirdaous28/JSQuizStarter.git
```
Le projet est également déployé sur GitHub Pages et peut être consulté directement ici :  
[Voir le projet en ligne](https://elfirdaous28.github.io/JSQuizStarter2/)

## 🚀 Utilisation  

1. **Ouvrir l’application :**  
   - Si vous avez cloné le dépôt, ouvrez simplement le fichier `index.html`.  
   - Sinon, accédez directement à la version déployée via **GitHub Pages**.  

2. **Choisir un nom d’utilisateur :**  
   - Saisissez un pseudo unique qui servira à enregistrer votre progression et vos résultats.  

3. **Sélectionner une thématique :**  
   - Exemple : *JavaScript Basics*, *DOM & Events*, *Objects & Arrays* (d’autres thèmes peuvent être ajoutés).  
   - Les questions sont chargées dynamiquement depuis un fichier JSON correspondant.  

4. **Jouer au quiz :**  
   - Répondez aux questions générées automatiquement.  
   - Chronomètre actif par question et global.  
   - Feedback immédiat (bonne/mauvaise réponse).  
   - Possibilité d’arrêter et de reprendre une partie plus tard.  

5. **Consulter vos résultats :**  
   - Score obtenu, temps total passé, réponses correctes/incorrectes.  
   - Mode **révision** disponible pour rejouer uniquement les questions échouées.  

6. **Explorer le tableau de bord :**  
   - Statistiques globales (parties jouées, scores moyens, meilleur score, top 3 pseudos).  
   - Visualisations interactives avec **Chart.js**.  

7. **Exporter vos données :**  
   - Historique et statistiques disponibles en **JSON** ou **CSV**.  
   - Possibilité de générer un rapport PDF complet.  
