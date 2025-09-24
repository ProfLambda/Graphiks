# GraPhiks – Visualisation de notes par enseignant

## 📌 Description

Ce projet est une page **HTML autonome** qui permet d’afficher, pour chaque enseignant, un graphique en **radar** représentant ses notes.  
Les données sont embarquées dans la page sous forme de **CSV** et peuvent être remplacées en déposant un nouveau fichier CSV directement dans la zone prévue (_drag & drop_).

L’échelle des notes est normalisée entre **0 et 3**.

### Fonctionnalités principales

-  📊 Génération automatique de graphiques radar (Chart.js).
-  📂 Données CSV embarquées dans la page.
-  🖱️ Support du **glisser-déposer** ou sélection de fichier CSV pour recharger les données.
-  🎨 Interface responsive avec une grille de cartes.
-  🏷️ Affichage des métadonnées sous chaque graphique :
   -  Nom de l’enseignant
   -  Classe (affichée sous le nom, avec le nombre de personnes entre parenthèses)
   -  Section, nombre de réponses, etc.

---

## ⚙️ Utilisation

1. Ouvrir le fichier `radars_profs.html` dans un navigateur moderne (Chrome, Edge, Firefox…).
2. Les graphiques sont générés automatiquement à partir du CSV embarqué.
3. Pour tester un autre fichier :
   -  Glissez-déposez un CSV dans la zone prévue.
   -  Ou cliquez sur la zone pour sélectionner un fichier CSV depuis votre disque.

---

## 📂 Format CSV attendu

-  Séparateur : `;`
-  Décimales : `,`
-  Colonnes obligatoires :

   -  `ref`
   -  `Nombre de réponses`
   -  Notes (`A`, `B`, `C`, … à `P`)
   -  `SECTION`
   -  `CLASSE`

Exemple :

```csv
ref;Nombre de réponses;Nom;A;B;C;D;E;F;G;H;I;J;K;L;M;N;O;P;SECTION;CLASSE
1;12;Bob Léponge;2,00;2,50;2,50;1,50;3,00;2,50;2,00;2,50;1,50;1,50;2,50;1,50;2,00;1,50;2,00;2,00;SM;BTS truc
```

---

## 🚀 Améliorations possibles

-  📥 **Export PDF / PNG** : ajouter un bouton sous chaque graphique pour télécharger le radar.
-  🔍 **Filtrage / recherche** : possibilité de n’afficher que certaines classes ou sections.
-  📊 **Comparaison** : permettre de comparer plusieurs enseignants sur le même radar.
-  🎛️ **Options dynamiques** : réglage de l’échelle (0–3, 0–100), choix des couleurs, etc.
-  💾 **Persistance locale** : sauvegarder les derniers fichiers CSV utilisés dans le navigateur.

---

## 🛠️ Technologies

-  [Chart.js](https://www.chartjs.org/) pour les graphiques radar.
-  JavaScript vanilla (aucune dépendance externe).
-  HTML / CSS simples, responsive.

---

## 👨‍🏫 Auteur

Projet réalisé pour visualiser simplement les évaluations d’enseignants à partir de données CSV, avec une mise en page claire et interactive.
