# Rapport de Projet de Fin d'Année

## Système de Suivi de Bus en Temps Réel avec Reconnaissance de Plaques d'Immatriculation (ANPR)

---

### Réalisé par : [Votre Nom]
### Encadré par : [Nom de l'Encadrant]
### Année Universitaire : 2024-2025

---

# Dédicace

*À mes chers parents,*

*Pour leur soutien inconditionnel, leurs sacrifices et leur amour tout au long de mon parcours académique.*

*À mes professeurs,*

*Qui m'ont transmis les connaissances et les compétences nécessaires pour mener à bien ce projet.*

*À tous ceux qui ont contribué de près ou de loin à la réalisation de ce travail.*

---

# Remerciements

Je tiens à exprimer ma profonde gratitude à toutes les personnes qui ont contribué à la réalisation de ce projet de fin d'année.

Mes sincères remerciements vont tout d'abord à mon encadrant **[Nom de l'Encadrant]** pour ses conseils avisés, son suivi régulier et sa disponibilité tout au long de ce projet.

Je remercie également l'ensemble du corps professoral de **[Nom de l'Établissement]** pour la qualité de l'enseignement dispensé et pour m'avoir fourni les outils nécessaires à la réussite de ce projet.

Enfin, je remercie ma famille et mes amis pour leur soutien moral et leurs encouragements constants.

---

# Résumé

Ce projet de fin d'année porte sur la conception et le développement d'un **système de suivi de bus en temps réel avec reconnaissance automatique des plaques d'immatriculation (ANPR)**. L'objectif principal est de fournir une solution complète permettant aux passagers de suivre la position des bus en temps réel, aux conducteurs de gérer leurs trajets efficacement, et aux administrateurs de superviser l'ensemble de la flotte avec un système automatisé de check-in/check-out basé sur l'intelligence artificielle.

Le système est développé en utilisant des technologies modernes : **Next.js 16** pour le frontend, **Spring Boot 3.2** pour le backend, **MySQL** pour la base de données, **WebSocket STOMP** pour les communications en temps réel, et **Python (FastAPI + YOLOv8 + EasyOCR)** pour le service de reconnaissance de plaques d'immatriculation marocaines. L'application intègre également **Mapbox GL JS** pour la visualisation cartographique et le suivi GPS.

**Mots-clés :** Suivi GPS, Temps réel, Transport en commun, Next.js, Spring Boot, WebSocket, Mapbox, ANPR, YOLOv8, EasyOCR, Intelligence Artificielle, Plaques Marocaines

---

# Abstract

This end-of-year project focuses on the design and development of a **real-time bus tracking system with Automatic Number Plate Recognition (ANPR)**. The main objective is to provide a comprehensive solution allowing passengers to track bus positions in real-time, drivers to efficiently manage their routes, and administrators to oversee the entire fleet with an AI-powered automated check-in/check-out system.

The system is developed using modern technologies: **Next.js 16** for the frontend, **Spring Boot 3.2** for the backend, **MySQL** for the database, **WebSocket STOMP** for real-time communications, and **Python (FastAPI + YOLOv8 + EasyOCR)** for Moroccan license plate recognition service. The application also integrates **Mapbox GL JS** for map visualization and GPS tracking.

**Keywords:** GPS Tracking, Real-time, Public Transportation, Next.js, Spring Boot, WebSocket, Mapbox, ANPR, YOLOv8, EasyOCR, Artificial Intelligence, Moroccan Plates

---

# Liste des Figures

| N° | Titre | Page |
|----|-------|------|
| 1 | Architecture générale du système | 15 |
| 2 | Diagramme de Gantt - Planification du projet | 18 |
| 3 | Diagramme de cas d'utilisation général | 21 |
| 4 | Diagramme de cas d'utilisation - Suivi GPS | 22 |
| 5 | Diagramme de cas d'utilisation - ANPR Check-in/Check-out | 23 |
| 6 | Diagramme de séquence - Authentification | 24 |
| 7 | Diagramme de séquence - Mise à jour GPS | 25 |
| 8 | Diagramme de séquence - Détection de plaque ANPR | 26 |
| 9 | Diagramme de classes | 28 |
| 10 | Diagramme d'activité - Processus Check-in/Check-out | 29 |
| 11 | Diagramme de déploiement | 30 |
| 12 | Schéma de la base de données | 32 |
| 13 | Page d'accueil de l'application | 38 |
| 14 | Page de connexion | 39 |
| 15 | Tableau de bord administrateur | 40 |
| 16 | Carte de suivi en temps réel | 41 |
| 17 | Portail conducteur | 42 |
| 18 | Portail client | 43 |
| 19 | Gestion de la flotte | 44 |
| 20 | Page Check-in/Check-out ANPR | 45 |
| 21 | Interface de détection de plaques | 46 |
| 22 | Page des caméras ANPR | 47 |
| 23 | Gestion des cartes d'identité | 48 |
| 24 | Architecture du service ANPR | 49 |

---

# Glossaire

| Terme | Définition |
|-------|------------|
| **ANPR** | Automatic Number Plate Recognition - Reconnaissance automatique des plaques d'immatriculation |
| **API** | Application Programming Interface - Interface de programmation permettant la communication entre applications |
| **Backend** | Partie serveur d'une application web |
| **CORS** | Cross-Origin Resource Sharing - Mécanisme de sécurité pour les requêtes HTTP |
| **EasyOCR** | Bibliothèque Python pour la reconnaissance optique de caractères |
| **FastAPI** | Framework Python moderne pour créer des APIs web haute performance |
| **Frontend** | Partie client d'une application web (interface utilisateur) |
| **GPS** | Global Positioning System - Système de géolocalisation par satellite |
| **JWT** | JSON Web Token - Standard pour la création de jetons d'accès sécurisés |
| **MJPEG** | Motion JPEG - Format de streaming vidéo |
| **MySQL** | Système de gestion de base de données relationnelle |
| **Next.js** | Framework React pour le développement d'applications web |
| **OCR** | Optical Character Recognition - Reconnaissance optique de caractères |
| **REST** | Representational State Transfer - Style d'architecture pour les API web |
| **Spring Boot** | Framework Java pour le développement d'applications backend |
| **STOMP** | Simple Text Oriented Messaging Protocol - Protocole de messagerie pour WebSocket |
| **TypeScript** | Langage de programmation typé basé sur JavaScript |
| **WebSocket** | Protocole de communication bidirectionnelle persistante |
| **YOLOv8** | You Only Look Once v8 - Modèle de détection d'objets en temps réel |

---

# Introduction Générale

## Contexte

Dans un monde où la mobilité urbaine devient de plus en plus complexe, les systèmes de transport en commun jouent un rôle crucial dans le développement durable des villes. Cependant, l'un des principaux défis auxquels font face les usagers des transports publics est l'incertitude concernant les horaires et la position des véhicules.

Le manque d'informations en temps réel sur la localisation des bus engendre plusieurs problèmes :
- Des temps d'attente incertains pour les passagers
- Une difficulté à planifier les trajets
- Une inefficacité dans la gestion de la flotte
- Un manque de transparence dans le service de transport

## Objectifs du projet

Ce projet vise à développer une solution complète de suivi de bus en temps réel qui permet de :

1. **Pour les passagers** : Visualiser en temps réel la position des bus, estimer les temps d'arrivée et planifier leurs trajets
2. **Pour les conducteurs** : Gérer leurs itinéraires, signaler les incidents et communiquer avec le dispatching
3. **Pour les administrateurs** : Superviser l'ensemble de la flotte, analyser les performances et gérer les ressources
4. **Système ANPR** : Automatiser le check-in/check-out des bus via la reconnaissance des plaques d'immatriculation marocaines

## Structure du rapport

Ce rapport est organisé en cinq chapitres principaux :

- **Chapitre 1 : État de l'Art** - Présentation des technologies existantes et des solutions de suivi GPS et ANPR
- **Chapitre 2 : Analyse et Conception** - Modélisation UML et conception de l'architecture
- **Chapitre 3 : Technologies et Outils** - Description des technologies utilisées
- **Chapitre 4 : Implémentation et Mise en Œuvre** - Réalisation technique et démonstration
- **Chapitre 5 : Service ANPR** - Détail du module de reconnaissance de plaques

---

# CHAPITRE 1 : ÉTAT DE L'ART

## 1. Introduction

Ce chapitre présente un état de l'art des technologies et solutions existantes dans le domaine du suivi de véhicules en temps réel. Nous examinerons les différentes approches technologiques, les solutions existantes sur le marché, et les technologies clés utilisées dans ce domaine.

## 2. Systèmes de suivi GPS : contexte et enjeux

### 2.1 Présentation des systèmes de géolocalisation

La géolocalisation par GPS (Global Positioning System) est une technologie qui permet de déterminer la position géographique d'un objet ou d'une personne à l'aide de signaux émis par des satellites. Cette technologie est devenue omniprésente dans notre quotidien, notamment grâce aux smartphones et aux systèmes de navigation.

**Principe de fonctionnement :**
- Le système GPS utilise une constellation de satellites en orbite autour de la Terre
- Un récepteur GPS calcule sa position en mesurant le temps de propagation des signaux provenant d'au moins 4 satellites
- La précision peut atteindre quelques mètres en conditions optimales

### 2.2 Barrières et défis techniques


Les systèmes de suivi en temps réel font face à plusieurs défis :

| Défi | Description |
|------|-------------|
| **Latence** | Le délai entre l'émission de la position et son affichage doit être minimal |
| **Précision GPS** | Les obstacles urbains (bâtiments, tunnels) peuvent affecter la précision |
| **Consommation énergétique** | Les mises à jour fréquentes consomment de la batterie |
| **Connectivité** | La communication nécessite une connexion réseau stable |
| **Scalabilité** | Le système doit supporter un grand nombre de véhicules et d'utilisateurs |

### 2.2 bis Explications mathématiques : ETA et métriques IA/ML

#### a) Calcul du temps d'arrivée estimé (ETA)
L'ETA (Estimated Time of Arrival) est une estimation du temps restant avant l'arrivée d'un bus à un arrêt donné. Il se base sur la distance restante et la vitesse moyenne du véhicule. La formule de base est :

\[
	ext{ETA} = \frac{\text{Distance restante}}{\text{Vitesse moyenne}}
\]

Où :
- \(\text{Distance restante}\) est la distance entre la position actuelle du bus et l'arrêt cible (calculée via la géolocalisation GPS).
- \(\text{Vitesse moyenne}\) est la moyenne des vitesses mesurées sur le trajet ou sur une fenêtre temporelle récente.

Des facteurs additionnels comme le trafic, les arrêts intermédiaires et les conditions de circulation peuvent être intégrés pour raffiner l'ETA à l'aide de modèles statistiques ou d'apprentissage automatique.

#### b) Métriques d'évaluation des modèles IA/ML
Dans le cadre de la reconnaissance de plaques (ANPR) ou de la détection d'incidents, il est essentiel d'évaluer la performance des modèles d'intelligence artificielle. Les principales métriques sont :

- **Précision (Precision)** : Proportion de prédictions positives correctes parmi toutes les prédictions positives.
  \[
  	ext{Précision} = \frac{\text{Vrai Positifs}}{\text{Vrai Positifs} + \text{Faux Positifs}}
  \]
- **Rappel (Recall)** : Proportion de vrais positifs détectés parmi tous les cas réellement positifs.
  \[
  	ext{Rappel} = \frac{\text{Vrai Positifs}}{\text{Vrai Positifs} + \text{Faux Négatifs}}
  \]
- **F-mesure (F1-score)** : Moyenne harmonique entre la précision et le rappel, utile pour équilibrer les deux.
  \[
  F1 = 2 \times \frac{\text{Précision} \times \text{Rappel}}{\text{Précision} + \text{Rappel}}
  \]

Ces métriques permettent de comparer différents modèles et d'optimiser les performances du système de détection automatique.

### 2.3 Besoins d'outils technologiques pour le transport urbain

L'intégration des technologies de suivi dans le transport public répond à plusieurs besoins :

- **Information voyageur** : Fournir des informations précises aux usagers
- **Optimisation des ressources** : Améliorer l'utilisation de la flotte
- **Sécurité** : Assurer le suivi et la sécurité des véhicules et passagers
- **Analyse des données** : Collecter des données pour améliorer le service

## 3. Solutions existantes de suivi de transport

### 3.1 Solutions commerciales

#### 3.1.1 Google Maps Transit

Google Maps intègre des fonctionnalités de transport en commun dans de nombreuses villes :
- Affichage des lignes et arrêts
- Prédiction des temps d'arrivée
- Intégration avec les données des opérateurs

#### 3.1.2 Moovit

Application dédiée au transport en commun :
- Couverture mondiale
- Alertes en temps réel
- Planification d'itinéraires multimodaux

### 3.2 Solutions open-source

#### 3.2.1 OpenTripPlanner

Planificateur de trajets open-source supportant :
- Le transport multimodal
- L'intégration GTFS (General Transit Feed Specification)
- Le calcul d'itinéraires optimisés

## 4. Technologies utilisées dans ce domaine

### 4.1 Communication en temps réel

#### 4.1.1 Introduction

La communication en temps réel est essentielle pour les systèmes de suivi. Plusieurs technologies permettent d'établir des connexions bidirectionnelles entre le serveur et les clients.

#### 4.1.2 WebSocket et STOMP Protocol

**WebSocket** est un protocole de communication qui permet une connexion bidirectionnelle persistante entre un client et un serveur.

**STOMP (Simple Text Oriented Messaging Protocol)** est un protocole de messagerie qui fonctionne au-dessus de WebSocket avec :
- Support natif dans Spring Framework
- Modèle publish/subscribe avec topics
- Gestion des destinations et des messages

```java
// Exemple d'utilisation de WebSocket STOMP avec Spring
@MessageMapping("/gps/update")
public void handleGpsUpdate(@Payload GpsUpdateRequest request) {
    messagingTemplate.convertAndSend("/topic/gps-updates", response);
}
```

### 4.2 Cartographie et visualisation

#### 4.2.1 Introduction

La visualisation cartographique est un composant clé des systèmes de suivi GPS. Elle permet aux utilisateurs de voir la position des véhicules sur une carte interactive.

#### 4.2.2 Mapbox GL JS

Mapbox GL JS est une bibliothèque JavaScript puissante pour :
- Affichage de cartes vectorielles
- Personnalisation avancée des styles
- Support des marqueurs et popups interactifs
- Animations fluides

#### 4.2.3 Alternatives : Leaflet et Google Maps

| Technologie | Avantages | Inconvénients |
|-------------|-----------|---------------|
| **Mapbox GL JS** | Performances, personnalisation | Coût pour gros volumes |
| **Leaflet** | Open-source, léger | Moins de fonctionnalités |
| **Google Maps** | Documentation, fiabilité | Coût, dépendance |

### 4.3 Frameworks Web modernes

#### 4.3.1 Introduction

Le développement d'applications web modernes repose sur des frameworks qui facilitent la création d'interfaces utilisateur réactives et performantes.

#### 4.3.2 Next.js

Next.js est un framework React qui offre :
- Rendu côté serveur (SSR)
- Génération statique (SSG)
- Routing automatique
- API Routes intégrées

#### 4.3.3 Spring Boot

Spring Boot est un framework Java robuste pour le développement backend :
- Configuration automatique
- Serveur embarqué (Tomcat)
- Gestion des dépendances avec Maven
- Intégration native de Spring Security et WebSocket

## 5. Conclusion

L'état de l'art montre que les technologies pour le suivi en temps réel sont matures et accessibles. Notre projet s'appuie sur ces technologies pour créer une solution adaptée au contexte marocain, en combinant :
- **WebSocket STOMP** pour la communication temps réel
- **Mapbox GL JS** pour la cartographie
- **Next.js** et **Spring Boot** pour le développement full-stack

---

# CHAPITRE 2 : CONTEXTE GÉNÉRAL DU PROJET

## 1. Introduction

Ce chapitre présente le contexte général du projet, incluant la problématique identifiée, les objectifs à atteindre et la méthodologie adoptée pour le développement.

## 2. Présentation du projet

### 2.1 Problématique

Le secteur du transport public au Maroc souffre d'un retard technologique important. Dans de nombreuses villes, le pointage des bus et des conducteurs se fait encore manuellement, à l'aide de papier et de stylo. Cette méthode traditionnelle engendre non seulement des pertes de temps et des erreurs, mais favorise aussi les fraudes et les vols par les personnes en charge du contrôle. Ce manque de modernisation nuit à l'efficacité, à la transparence et à la fiabilité du service public. 

La solution proposée dans ce projet vise à répondre à cette problématique en introduisant une plateforme numérique de suivi en temps réel et d'automatisation du pointage grâce à l'intelligence artificielle (ANPR). Elle permet de fiabiliser le processus, de réduire les risques de fraude et d'améliorer la gestion globale de la flotte.

### 2.1 bis Historique du transport au Maroc

Le transport public au Maroc a connu plusieurs phases d'évolution. Dès le début du XXe siècle, les premières lignes de tramway et d'autobus ont été mises en place dans les grandes villes comme Casablanca et Rabat. Cependant, la modernisation du secteur a longtemps été freinée par le manque d'investissements et l'absence de digitalisation. Ce n'est qu'à partir des années 2010, avec l'arrivée de nouveaux opérateurs et l'introduction de technologies comme le tramway moderne, que le secteur a commencé à se transformer. Malgré ces avancées, la majorité des réseaux de bus reste encore gérée de façon traditionnelle, d'où la nécessité d'une solution innovante comme celle proposée dans ce projet.

### 2.2 Objectifs du projet

#### Objectifs principaux :
- Développer une application web permettant le suivi en temps réel des bus
- Créer des interfaces dédiées pour chaque type d'utilisateur
- Implémenter un système de communication en temps réel

#### Objectifs spécifiques :
| Objectif | Description |
|----------|-------------|
| Suivi GPS | Afficher la position des bus sur une carte interactive |
| Multi-rôles | Interfaces pour admin, conducteur et client |
| Temps réel | Mise à jour automatique sans rechargement |
| Gestion de flotte | Outils d'administration pour la flotte |
| Réservation | Système de réservation de tickets |

### 2.3 Solution proposée

Notre solution est un **système de suivi de bus en temps réel** comprenant :

1. **Application Web responsive**
   - Interface adaptée desktop et mobile
   - Carte interactive avec Mapbox

2. **Architecture multi-rôles**
   - Portail Administrateur
   - Portail Conducteur
   - Portail Client

3. **Backend robuste**
   - API RESTful
   - Communication WebSocket
   - Base de données relationnelle

## 3. Démarche et planification

### 3.1 La méthode SCRUM

Pour la gestion de ce projet, nous avons adopté la méthodologie **Agile SCRUM** qui permet :
- Un développement itératif et incrémental
- Une adaptation rapide aux changements
- Une livraison régulière de fonctionnalités

### 3.2 Pourquoi SCRUM ?

| Avantage | Application au projet |
|----------|----------------------|
| **Flexibilité** | Adaptation aux besoins changeants |
| **Visibilité** | Suivi clair de l'avancement |
| **Qualité** | Tests réguliers à chaque sprint |
| **Communication** | Échanges fréquents avec l'encadrant |

### 3.3 L'équipe et rôles

| Rôle | Responsabilité |
|------|----------------|
| **Product Owner** | Définition des besoins et priorités |
| **Scrum Master** | Facilitation du processus Scrum |
| **Développeur** | Conception et implémentation |

### 3.4 Identification du backlog des tâches

#### Sprint 1 : Configuration et Base
- Configuration de l'environnement de développement
- Mise en place de la base de données
- Création de l'architecture du projet

#### Sprint 2 : Authentification et Utilisateurs
- Système d'authentification JWT
- Gestion des rôles utilisateurs
- Pages de connexion et inscription

#### Sprint 3 : Fonctionnalités Core
- Intégration de la carte Mapbox
- Suivi GPS en temps réel
- Gestion de la flotte

#### Sprint 4 : Portails Utilisateurs
- Dashboard administrateur
- Portail conducteur
- Portail client

#### Sprint 5 : Service ANPR
- Développement du service Python FastAPI
- Intégration YOLOv8 pour la détection de plaques
- OCR pour la lecture des plaques marocaines
- Interface Check-in/Check-out

#### Sprint 6 : Finalisation
- Tests et corrections
- Optimisation des performances
- Documentation

### 3.5 Diagramme de Gantt

Le diagramme de Gantt ci-dessous présente la planification temporelle du projet :

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE GANTT - PROJET BUS TRACKING                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Tâches                    │ S1  │ S2  │ S3  │ S4  │ S5  │ S6  │ S7  │ S8  │ S9  │ S10 │ S11│ S12│
├───────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼────┼────┤
│ Analyse des besoins       │████ │████ │     │     │     │     │     │     │     │     │    │    │
│ Conception UML            │     │████ │████ │     │     │     │     │     │     │     │    │    │
│ Config. environnement     │     │     │████ │     │     │     │     │     │     │     │    │    │
│ Base de données           │     │     │████ │████ │     │     │     │     │     │     │    │    │
│ Backend Spring Boot       │     │     │     │████ │████ │████ │     │     │     │     │    │    │
│ Authentification JWT      │     │     │     │     │████ │████ │     │     │     │     │    │    │
│ Frontend Next.js          │     │     │     │     │     │████ │████ │████ │     │     │    │    │
│ Intégration Mapbox        │     │     │     │     │     │     │████ │████ │     │     │    │    │
│ WebSocket temps réel      │     │     │     │     │     │     │     │████ │████ │     │    │    │
│ Service ANPR Python       │     │     │     │     │     │     │     │     │████ │████ │████│    │
│ Interface Check-in/out    │     │     │     │     │     │     │     │     │     │████ │████│    │
│ Tests & Validation        │     │     │     │     │     │     │     │     │     │     │████│████│
│ Documentation             │     │     │     │     │     │     │     │     │     │     │████│████│
└───────────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴────┴────┘

Légende : ████ = Période d'exécution   S = Semaine
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de Gantt créé avec un outil comme Microsoft Project, GanttProject ou Monday.com]**

---

# CHAPITRE 3 : ANALYSE ET CONCEPTION

## 1. Introduction

Ce chapitre présente l'analyse et la conception du système à travers différents diagrammes UML. Ces modèles permettent de visualiser l'architecture et le fonctionnement de l'application.

## 2. Langage de modélisation

Nous utilisons **UML (Unified Modeling Language)** pour modéliser notre système. UML est un langage de modélisation graphique standardisé qui permet de :
- Visualiser la structure du système
- Spécifier les comportements attendus
- Construire les différents composants
- Documenter l'architecture

## 3. Diagramme de cas d'utilisation général

Le diagramme de cas d'utilisation général présente les interactions entre les acteurs et le système.

### Acteurs du système :

| Acteur | Description |
|--------|-------------|
| **Administrateur** | Gère la flotte, les utilisateurs et supervise le système |
| **Conducteur** | Conduit le bus, signale les incidents |
| **Client/Passager** | Consulte les positions des bus, réserve des tickets |
| **Système GPS** | Envoie les positions des véhicules |
| **Système ANPR** | Détecte et reconnaît les plaques d'immatriculation |

### Cas d'utilisation principaux :

```
┌─────────────────────────────────────────────────────────────────┐
│                    Système de Suivi de Bus                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Administrateur│───▶│ Gérer la flotte      │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Gérer les utilisateurs│                 │
│          │            ├──────────────────────┤                 │
│          │            │ Voir les statistiques │                 │
│          │            ├──────────────────────┤                 │
│          │            │ Gérer les routes      │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Superviser ANPR       │                 │
│                       ├──────────────────────┤                 │
│                       │ Voir Check-in/out    │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │  Conducteur  │───▶│ Commencer un trajet   │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Signaler un incident  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir son itinéraire   │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │    Client    │───▶│ Suivre un bus         │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Réserver un ticket    │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir les horaires     │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Système ANPR │───▶│ Détecter plaque       │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Enregistrer Check-in  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Enregistrer Check-out │                 │
│                       └──────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation créé avec un outil UML comme StarUML, Lucidchart ou draw.io]**

## 4. Diagramme de cas d'utilisation - ANPR Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│              Système ANPR - Check-in/Check-out                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐                                             │
│   │   Caméra     │                                             │
│   └──────┬───────┘                                             │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────────────┐                                     │
│   │ Capturer image       │                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Détecter plaque      │───▶│ YOLOv8 Model         │        │
│   │ (YOLOv8)             │    │ (best.pt)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Lire caractères      │───▶│ EasyOCR              │        │
│   │ (OCR)                │    │ (ar + en)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Parser format        │                                     │
│   │ marocain             │                                     │
│   │ (SÉRIE|LETTRE|RÉGION)│                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Enregistrer événement│                                     │
│   │ (CHECK_IN/CHECK_OUT) │                                     │
│   └──────────────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation ANPR créé avec un outil UML]**

## 4. Diagrammes de séquence

### 4.1 DS pour le cas d'utilisation : Authentification

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│ Client │          │ Frontend │          │ Backend  │          │   BD   │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ Saisir identifiants│                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ POST /api/auth/login│                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ SELECT user        │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │ Retour user        │
    │                    │                     │◀───────────────────│
    │                    │                     │                    │
    │                    │                     │ Vérifier password  │
    │                    │                     │ (bcrypt.compare)   │
    │                    │                     │                    │
    │                    │                     │ Générer JWT        │
    │                    │                     │                    │
    │                    │ {token, user}       │                    │
    │                    │◀────────────────────│                    │
    │                    │                     │                    │
    │                    │ Stocker token       │                    │
    │                    │ (localStorage)      │                    │
    │                    │                     │                    │
    │ Redirection        │                     │                    │
    │ selon rôle         │                     │                    │
    │◀───────────────────│                     │                    │
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence d'authentification]**

### 4.2 DS pour le cas d'utilisation : Mise à jour GPS en temps réel

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│  GPS   │          │ Backend  │          │WebSocket │          │ Client │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ POST /api/gps/update                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ Enregistrer position│                    │
    │                    │ dans BD             │                    │
    │                    │                     │                    │
    │                    │ sendToTopic         │                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ Broadcast STOMP   │
    │                    │                     │ message to subs   │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │                    │ Mettre à jour
    │                    │                     │                    │ la carte
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence de mise à jour GPS]**

### 4.3 DS pour le cas d'utilisation : Détection de plaque ANPR

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐          ┌────────┐
│ Caméra │          │ Frontend │          │  ANPR    │          │Backend │          │   BD   │
│        │          │          │          │ Service  │          │        │          │        │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘          └───┬────┘
    │                    │                     │                    │                    │
    │ Flux vidéo MJPEG   │                     │                    │                    │
    │───────────────────▶│                     │                    │                    │
    │                    │                     │                    │                    │
    │                    │ Capture frame       │                    │                    │
    │                    │────────────────────▶│                    │                    │
    │                    │                     │                    │                    │
    │                    │                     │ YOLOv8 détection  │                    │
    │                    │                     │ de plaque          │                    │
    │                    │                     │                    │                    │
    │                    │                     │ EasyOCR lecture   │                    │
    │                    │                     │ des caractères     │                    │
    │                    │                     │                    │                    │
    │                    │ {plate, confidence} │                    │                    │
    │                    │◀────────────────────│                    │                    │
    │                    │                     │                    │                    │
    │                    │ POST /api/gate-events                   │                    │
    │                    │──────────────────────────────────────── ▶│                    │
    │                    │                     │                    │                    │
    │                    │                     │                    │ INSERT gate_event │
    │                    │                     │                    │───────────────────▶│
    │                    │                     │                    │                    │
    │                    │                     │                    │ Confirmation      │
    │                    │                     │                    │◀───────────────────│
    │                    │                     │                    │                    │
    │                    │ {success: true}     │                    │                    │
    │                    │◀─────────────────────────────────────────│                    │
    │                    │                     │                    │                    │
    │                    │ Afficher résultat   │                    │                    │
    │                    │ sur l'interface     │                    │                    │
    │                    │                     │                    │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence ANPR créé avec un outil UML]**

## 5. Diagramme de classes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE CLASSES                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│        User          │       │       Driver         │
├──────────────────────┤       ├──────────────────────┤
│ - id: int            │       │ - id: int            │
│ - email: string      │◀──────│ - user_id: int (FK)  │
│ - password: string   │  1  1 │ - license_number: str│
│ - role: enum         │       │ - license_expiry: date│
│ - first_name: string │       │ - status: enum       │
│ - last_name: string  │       │ - rating: decimal    │
│ - phone: string      │       │ - total_trips: int   │
│ - is_active: boolean │       └──────────────────────┘
├──────────────────────┤                │
│ + login()            │                │ 1
│ + register()         │                │
│ + updateProfile()    │                │
└──────────────────────┘       ┌──────────────────────┐
         │                     │        Bus           │
         │ 1                   ├──────────────────────┤
         │                     │ - id: int            │
         │                     │ - bus_number: string │
         │                     │ - plate_number: str  │
         │                     │ - model: string      │
         │                     │ - capacity: int      │
         │                     │ - status: enum       │
         │                     │ - current_driver_id  │
         ├────────────────────▶│──────────────────────┤
         │                     │ + updateLocation()   │
         │                     │ + getStatus()        │
         │                     └──────────────────────┘
         │                               │
         │ 1                             │
         │                               ▼
┌──────────────────────┐       ┌──────────────────────┐
│       Ticket         │       │     RouteStop        │
├──────────────────────┤       ├──────────────────────┤
│ - id: int            │       │ - id: int            │
│ - ticket_number: str │       │ - route_id: int (FK) │
│ - user_id: int (FK)  │       │ - stop_name: string  │
│ - schedule_id: int   │       │ - stop_order: int    │
│ - seat_number: string│       │ - latitude: decimal  │
│ - fare: decimal      │       │ - longitude: decimal │
│ - status: enum       │       └──────────────────────┘
│ - qr_code: text      │                │
└──────────────────────┘                │ 1
                                        │
                                        ▼
                               ┌──────────────────────┐
                               │      Schedule        │
                               ├──────────────────────┤
                               │ - id: int            │
                               │ - route_id: int (FK) │
                               │ - bus_id: int (FK)   │
                               │ - driver_id: int (FK)│
                               │ - departure_time: dt │
                               │ - arrival_time: dt   │
                               │ - status: enum       │
                               └──────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de classes complet créé avec un outil UML]**

## 6. Diagramme d'activité - Processus Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│           DIAGRAMME D'ACTIVITÉ - CHECK-IN/CHECK-OUT             │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │     Début       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Démarrer Service│
                    │     ANPR        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Vérifier statut │
                    │   service IA    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              │              ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Service Online │      │     │ Service Offline│
     └───────┬────────┘      │     └───────┬────────┘
             │               │             │
             ▼               │             ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Activer caméra │      │     │ Afficher erreur│
     └───────┬────────┘      │     └───────┬────────┘
             │               │             │
             ▼               │             ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Capturer frame │      │     │     Fin        │
     └───────┬────────┘      │     └────────────────┘
             │               │
             ▼               │
     ┌────────────────┐      │
     │ Envoyer à ANPR │      │
     └───────┬────────┘      │
             │               │
             ▼               │
     ┌────────────────┐      │
     │ Plaque détectée│      │
     │      ?         │      │
     └───────┬────────┘      │
             │               │
      ┌──────┴──────┐        │
      │             │        │
      ▼             ▼        │
┌──────────┐  ┌──────────┐   │
│   Oui    │  │   Non    │   │
└────┬─────┘  └────┬─────┘   │
     │             │         │
     ▼             │         │
┌──────────────┐   │         │
│ Choisir type │   │         │
│ (IN/OUT)     │   │         │
└──────┬───────┘   │         │
       │           │         │
       ▼           │         │
┌──────────────┐   │         │
│ Enregistrer  │   │         │
│ gate_event   │   │         │
└───────┬───────┘   │         │
        │           │         │
        ▼           │         │
┌──────────────┐   │         │
│ Afficher     │◀──┘         │
│ résultat     │             │
└───────┬──────┘             │
        │                     │
        ▼                     │
┌──────────────┐             │
│ Continuer ?  │─────────────┘
└───────┬───────┘
        │
        ▼
┌──────────────┐
│     Fin      │
└──────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme d'activité créé avec un outil UML]**

## 7. Diagramme de déploiement

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DIAGRAMME DE DÉPLOIEMENT                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              << device >>                                        │
│                              Serveur Web                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐    │
│  │   << container >>  │    │   << container >>  │    │   << container >>  │    │
│  │    Frontend        │    │     Backend        │    │   ANPR Service     │    │
│  │    (Next.js)       │    │  (Spring Boot)     │    │   (FastAPI)        │    │
│  │    Port: 3000      │    │    Port: 4000      │    │   Port: 8001       │    │
│  └────────┬───────────┘    └────────┬───────────┘    └────────┬───────────┘    │
│           │                         │                         │                 │
│           │    REST API             │                         │                 │
│           │◀───────────────────────▶│                         │                 │
│           │                         │                         │                 │
│           │    WebSocket STOMP      │                         │                 │
│           │◀───────────────────────▶│                         │                 │
│           │                         │                         │                 │
│           │         REST API (Détection)                      │                 │
│           │◀─────────────────────────────────────────────────▶│                 │
│           │                         │                         │                 │
│           │         MJPEG Stream                              │                 │
│           │◀─────────────────────────────────────────────────▶│                 │
│           │                         │                         │                 │
└───────────┼─────────────────────────┼─────────────────────────┼─────────────────┘
            │                         │                         │
            │                         ▼                         │
            │              ┌────────────────────┐               │
            │              │   << database >>   │               │
            │              │      MySQL         │               │
            │              │    Port: 8889      │               │
            │              └────────────────────┘               │
            │                                                   │
            ▼                                                   ▼
┌────────────────────┐                              ┌────────────────────┐
│   << browser >>    │                              │   << device >>     │
│   Client Web       │                              │   Webcam/Caméra    │
│   (Chrome, Safari) │                              │   ANPR             │
└────────────────────┘                              └────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de déploiement créé avec un outil UML]**

## 6. Conclusion

L'analyse et la conception présentées dans ce chapitre nous permettent d'avoir une vision claire de :
- Les différents acteurs et leurs interactions avec le système
- Le flux de données pour les cas d'utilisation principaux
- La structure des données et les relations entre entités

Cette conception servira de base pour l'implémentation détaillée dans le chapitre suivant.

---

# CHAPITRE 4 : TECHNOLOGIES ET OUTILS UTILISÉS

## 1. Introduction

Ce chapitre présente en détail les technologies et outils utilisés pour le développement du système de suivi de bus. Le choix de ces technologies a été guidé par des critères de performance, de modernité et d'adéquation avec les besoins du projet.

## 2. Technologies utilisées

### Stack Technique Complet

| Catégorie | Technologie | Version | Usage |
|-----------|-------------|---------|-------|
| **Frontend** | Next.js | 16.0.3 | Framework React |
| **Frontend** | React | 19.2.0 | Bibliothèque UI |
| **Frontend** | TypeScript | 5.x | Typage statique |
| **Frontend** | Tailwind CSS | 4.1.17 | Styles CSS |
| **Frontend** | Mapbox GL JS | 3.4.0 | Cartographie |
| **Backend** | Spring Boot | 3.2.0 | Framework Java |
| **Backend** | Spring Security | 6.x | Sécurité |
| **Backend** | Spring Data JPA | 3.x | Persistance |
| **Backend** | WebSocket STOMP | - | Temps réel |
| **ANPR** | Python | 3.11 | Langage service ANPR |
| **ANPR** | FastAPI | 0.104.x | Framework API Python |
| **ANPR** | YOLOv8 | latest | Détection de plaques |
| **ANPR** | EasyOCR | latest | Reconnaissance caractères |
| **ANPR** | OpenCV | 4.x | Traitement d'images |
| **Base de données** | MySQL | 8.x | Stockage données |
| **Authentification** | JWT (jjwt) | 0.12.3 | Jetons d'accès sécurisés |
| **Build** | Maven | 3.9.x | Gestion des dépendances |
| **Tests E2E** | Selenium | 4.x | Tests automatisés UI |
| **Tests** | JUnit 5 | 5.x | Tests unitaires Java |
| **Qualité code** | SonarQube | Cloud | Analyse statique |

### 2.1 Next.js 16

**Next.js** est un framework React qui offre :

- **Server-Side Rendering (SSR)** : Améliore le SEO et les performances
- **App Router** : Système de routage moderne basé sur les dossiers
- **API Routes** : Création d'endpoints API intégrés
- **Turbopack** : Bundler ultra-rapide pour le développement

```typescript
// Exemple de structure App Router
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <DashboardShell />
}
```

### 2.2 Spring Boot 3.2

**Spring Boot** est le framework backend Java choisi pour :

- Son écosystème robuste et mature
- Spring Security pour la sécurisation des APIs
- Spring Data JPA pour la persistance des données
- Support natif de WebSocket avec STOMP

```java
// Structure du contrôleur REST
@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {
    
    private final BusService busService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses() {
        List<BusResponse> buses = busService.getAllBuses();
        return ResponseEntity.ok(ApiResponse.success(buses));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<BusResponse>> createBus(
            @Valid @RequestBody BusRequest request) {
        BusResponse bus = busService.createBus(request);
        return ResponseEntity.ok(ApiResponse.success("Bus créé", bus));
    }
}
```

### 2.3 WebSocket STOMP

**WebSocket STOMP** permet la communication bidirectionnelle en temps réel avec Spring :

```java
// Backend - Contrôleur WebSocket
@Controller
@RequiredArgsConstructor
public class WebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final GpsService gpsService;
    
    @MessageMapping("/gps/update")
    public void handleGpsUpdate(@Payload GpsUpdateRequest request) {
        GpsResponse response = gpsService.updateGpsPosition(request);
        // Broadcast à tous les abonnés
        messagingTemplate.convertAndSend("/topic/gps-updates", response);
        // Notification spécifique au bus
        messagingTemplate.convertAndSend("/topic/bus/" + request.getBusId(), response);
    }
}

// Scheduler pour broadcast automatique
@Scheduled(fixedRate = 5000)
public void broadcastAllGpsPositions() {
    List<GpsResponse> positions = gpsService.getLatestPositions();
    messagingTemplate.convertAndSend("/topic/gps-updates", positions);
}
```

```typescript
// Frontend - Connexion STOMP avec SockJS
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const stompClient = new Client({
  webSocketFactory: () => new SockJS('http://localhost:4000/ws'),
  onConnect: () => {
    stompClient.subscribe('/topic/gps-updates', (message) => {
      const data = JSON.parse(message.body);
      updateBusPosition(data.busId, data.latitude, data.longitude);
    });
  }
});
stompClient.activate();
```

### 2.4 Mapbox GL JS

**Mapbox GL JS** est utilisé pour l'affichage des cartes :

```typescript
// Composant MapboxMap
const MapboxMap = ({ buses, onBusClick }) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-7.9811, 31.6295], // Marrakech
      zoom: 12
    })
    
    buses.forEach(bus => {
      new mapboxgl.Marker()
        .setLngLat([bus.longitude, bus.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${bus.bus_number}</h3>`))
        .addTo(map)
    })
  }, [buses])
}
```

---

## 3. Historique du transport au Maroc

Le transport urbain au Maroc a connu une évolution progressive depuis les années 1960. Initialement basé sur des bus classiques gérés par des sociétés publiques, le secteur s'est ouvert à la concurrence et à la privatisation dans les années 2000. Malgré l'introduction de nouveaux opérateurs et de bus modernes, la digitalisation des processus (suivi GPS, pointage électronique, gestion automatisée) reste très limitée. La majorité des opérations (pointage, contrôle, reporting) se fait encore manuellement, ce qui ralentit l'efficacité et la fiabilité du service. Ce projet s'inscrit dans une démarche de modernisation et d'alignement avec les standards internationaux du transport intelligent.

---

# CHAPITRE 2 : CONTEXTE GÉNÉRAL DU PROJET

## 1. Introduction

Ce chapitre présente le contexte général du projet, incluant la problématique identifiée, les objectifs à atteindre et la méthodologie adoptée pour le développement.

## 2. Présentation du projet

### 2.1 Problématique

Le secteur du transport public au Maroc souffre d'un retard technologique important. Dans de nombreuses villes, le pointage des bus et des conducteurs se fait encore manuellement, à l'aide de papier et de stylo. Cette méthode traditionnelle engendre non seulement des pertes de temps et des erreurs, mais favorise aussi les fraudes et les vols par les personnes en charge du contrôle. Ce manque de modernisation nuit à l'efficacité, à la transparence et à la fiabilité du service public. 

La solution proposée dans ce projet vise à répondre à cette problématique en introduisant une plateforme numérique de suivi en temps réel et d'automatisation du pointage grâce à l'intelligence artificielle (ANPR). Elle permet de fiabiliser le processus, de réduire les risques de fraude et d'améliorer la gestion globale de la flotte.

### 2.1 bis Historique du transport au Maroc

Le transport public au Maroc a connu plusieurs phases d'évolution. Dès le début du XXe siècle, les premières lignes de tramway et d'autobus ont été mises en place dans les grandes villes comme Casablanca et Rabat. Cependant, la modernisation du secteur a longtemps été freinée par le manque d'investissements et l'absence de digitalisation. Ce n'est qu'à partir des années 2010, avec l'arrivée de nouveaux opérateurs et l'introduction de technologies comme le tramway moderne, que le secteur a commencé à se transformer. Malgré ces avancées, la majorité des réseaux de bus reste encore gérée de façon traditionnelle, d'où la nécessité d'une solution innovante comme celle proposée dans ce projet.

### 2.2 Objectifs du projet

#### Objectifs principaux :
- Développer une application web permettant le suivi en temps réel des bus
- Créer des interfaces dédiées pour chaque type d'utilisateur
- Implémenter un système de communication en temps réel

#### Objectifs spécifiques :
| Objectif | Description |
|----------|-------------|
| Suivi GPS | Afficher la position des bus sur une carte interactive |
| Multi-rôles | Interfaces pour admin, conducteur et client |
| Temps réel | Mise à jour automatique sans rechargement |
| Gestion de flotte | Outils d'administration pour la flotte |
| Réservation | Système de réservation de tickets |

### 2.3 Solution proposée

Notre solution est un **système de suivi de bus en temps réel** comprenant :

1. **Application Web responsive**
   - Interface adaptée desktop et mobile
   - Carte interactive avec Mapbox

2. **Architecture multi-rôles**
   - Portail Administrateur
   - Portail Conducteur
   - Portail Client

3. **Backend robuste**
   - API RESTful
   - Communication WebSocket
   - Base de données relationnelle

## 3. Démarche et planification

### 3.1 La méthode SCRUM

Pour la gestion de ce projet, nous avons adopté la méthodologie **Agile SCRUM** qui permet :
- Un développement itératif et incrémental
- Une adaptation rapide aux changements
- Une livraison régulière de fonctionnalités

### 3.2 Pourquoi SCRUM ?

| Avantage | Application au projet |
|----------|----------------------|
| **Flexibilité** | Adaptation aux besoins changeants |
| **Visibilité** | Suivi clair de l'avancement |
| **Qualité** | Tests réguliers à chaque sprint |
| **Communication** | Échanges fréquents avec l'encadrant |

### 3.3 L'équipe et rôles

| Rôle | Responsabilité |
|------|----------------|
| **Product Owner** | Définition des besoins et priorités |
| **Scrum Master** | Facilitation du processus Scrum |
| **Développeur** | Conception et implémentation |

### 3.4 Identification du backlog des tâches

#### Sprint 1 : Configuration et Base
- Configuration de l'environnement de développement
- Mise en place de la base de données
- Création de l'architecture du projet

#### Sprint 2 : Authentification et Utilisateurs
- Système d'authentification JWT
- Gestion des rôles utilisateurs
- Pages de connexion et inscription

#### Sprint 3 : Fonctionnalités Core
- Intégration de la carte Mapbox
- Suivi GPS en temps réel
- Gestion de la flotte

#### Sprint 4 : Portails Utilisateurs
- Dashboard administrateur
- Portail conducteur
- Portail client

#### Sprint 5 : Service ANPR
- Développement du service Python FastAPI
- Intégration YOLOv8 pour la détection de plaques
- OCR pour la lecture des plaques marocaines
- Interface Check-in/Check-out

#### Sprint 6 : Finalisation
- Tests et corrections
- Optimisation des performances
- Documentation

### 3.5 Diagramme de Gantt

Le diagramme de Gantt ci-dessous présente la planification temporelle du projet :

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE GANTT - PROJET BUS TRACKING                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Tâches                    │ S1  │ S2  │ S3  │ S4  │ S5  │ S6  │ S7  │ S8  │ S9  │ S10 │ S11│ S12│
├───────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼────┼────┤
│ Analyse des besoins       │████ │████ │     │     │     │     │     │     │     │     │    │    │
│ Conception UML            │     │████ │████ │     │     │     │     │     │     │     │    │    │
│ Config. environnement     │     │     │████ │     │     │     │     │     │     │     │    │    │
│ Base de données           │     │     │████ │████ │     │     │     │     │     │     │    │    │
│ Backend Spring Boot       │     │     │     │████ │████ │████ │     │     │     │     │    │    │
│ Authentification JWT      │     │     │     │     │████ │████ │     │     │     │     │    │    │
│ Frontend Next.js          │     │     │     │     │     │████ │████ │████ │     │     │    │    │
│ Intégration Mapbox        │     │     │     │     │     │     │████ │████ │     │     │    │    │
│ WebSocket temps réel      │     │     │     │     │     │     │     │████ │████ │     │    │    │
│ Service ANPR Python       │     │     │     │     │     │     │     │     │████ │████ │████│    │
│ Interface Check-in/out    │     │     │     │     │     │     │     │     │     │████ │████│    │
│ Tests & Validation        │     │     │     │     │     │     │     │     │     │     │████│████│
│ Documentation             │     │     │     │     │     │     │     │     │     │     │████│████│
└───────────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴────┴────┘

Légende : ████ = Période d'exécution   S = Semaine
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de Gantt créé avec un outil comme Microsoft Project, GanttProject ou Monday.com]**

---

# CHAPITRE 3 : ANALYSE ET CONCEPTION

## 1. Introduction

Ce chapitre présente l'analyse et la conception du système à travers différents diagrammes UML. Ces modèles permettent de visualiser l'architecture et le fonctionnement de l'application.

## 2. Langage de modélisation

Nous utilisons **UML (Unified Modeling Language)** pour modéliser notre système. UML est un langage de modélisation graphique standardisé qui permet de :
- Visualiser la structure du système
- Spécifier les comportements attendus
- Construire les différents composants
- Documenter l'architecture

## 3. Diagramme de cas d'utilisation général

Le diagramme de cas d'utilisation général présente les interactions entre les acteurs et le système.

### Acteurs du système :

| Acteur | Description |
|--------|-------------|
| **Administrateur** | Gère la flotte, les utilisateurs et supervise le système |
| **Conducteur** | Conduit le bus, signale les incidents |
| **Client/Passager** | Consulte les positions des bus, réserve des tickets |
| **Système GPS** | Envoie les positions des véhicules |
| **Système ANPR** | Détecte et reconnaît les plaques d'immatriculation |

### Cas d'utilisation principaux :

```
┌─────────────────────────────────────────────────────────────────┐
│                    Système de Suivi de Bus                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Administrateur│───▶│ Gérer la flotte      │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Gérer les utilisateurs│                 │
│          │            ├──────────────────────┤                 │
│          │            │ Voir les statistiques │                 │
│          │            ├──────────────────────┤                 │
│          │            │ Gérer les routes      │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Superviser ANPR       │                 │
│                       ├──────────────────────┤                 │
│                       │ Voir Check-in/out    │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │  Conducteur  │───▶│ Commencer un trajet   │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Signaler un incident  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir son itinéraire   │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │    Client    │───▶│ Suivre un bus         │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Réserver un ticket    │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir les horaires     │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Système ANPR │───▶│ Détecter plaque       │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Enregistrer Check-in  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Enregistrer Check-out │                 │
│                       └──────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation créé avec un outil UML comme StarUML, Lucidchart ou draw.io]**

## 4. Diagramme de cas d'utilisation - ANPR Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│              Système ANPR - Check-in/Check-out                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐                                             │
│   │   Caméra     │                                             │
│   └──────┬───────┘                                             │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────────────┐                                     │
│   │ Capturer image       │                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Détecter plaque      │───▶│ YOLOv8 Model         │        │
│   │ (YOLOv8)             │    │ (best.pt)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Lire caractères      │───▶│ EasyOCR              │        │
│   │ (OCR)                │    │ (ar + en)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Parser format        │                                     │
│   │ marocain             │                                     │
│   │ (SÉRIE|LETTRE|RÉGION)│                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Enregistrer événement│                                     │
│   │ (CHECK_IN/CHECK_OUT) │                                     │
│   └──────────────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation ANPR créé avec un outil UML]**

## 4. Diagrammes de séquence

### 4.1 DS pour le cas d'utilisation : Authentification

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│ Client │          │ Frontend │          │ Backend  │          │   BD   │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ Saisir identifiants│                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ POST /api/auth/login│                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ SELECT user        │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │ Retour user        │
    │                    │                     │◀───────────────────│
    │                    │                     │                    │
    │                    │                     │ Vérifier password  │
    │                    │                     │ (bcrypt.compare)   │
    │                    │                     │                    │
    │                    │                     │ Générer JWT        │
    │                    │                     │                    │
    │                    │ {token, user}       │                    │
    │                    │◀────────────────────│                    │
    │                    │                     │                    │
    │                    │ Stocker token       │                    │
    │                    │ (localStorage)      │                    │
    │                    │                     │                    │
    │ Redirection        │                     │                    │
    │ selon rôle         │                     │                    │
    │◀───────────────────│                     │                    │
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence d'authentification]**

### 4.2 DS pour le cas d'utilisation : Mise à jour GPS en temps réel

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│  GPS   │          │ Backend  │          │WebSocket │          │ Client │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ POST /api/gps/update                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ Enregistrer position│                    │
    │                    │ dans BD             │                    │
    │                    │                     │                    │
    │                    │ sendToTopic         │                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ Broadcast STOMP   │
    │                    │                     │ message to subs   │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │                    │ Mettre à jour
    │                    │                     │                    │ la carte
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence de mise à jour GPS]**

### 4.3 DS pour le cas d'utilisation : Détection de plaque ANPR

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐          ┌────────┐
│ Caméra │          │ Frontend │          │  ANPR    │          │Backend │          │   BD   │
│        │          │          │          │ Service  │          │        │          │        │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘          └───┬────┘
    │                    │                     │                    │                    │
    │ Flux vidéo MJPEG   │                     │                    │                    │
    │───────────────────▶│                     │                    │                    │
    │                    │                     │                    │                    │
    │                    │ Capture frame       │                    │                    │
    │                    │────────────────────▶│                    │                    │
    │                    │                     │                    │                    │
    │                    │                     │ YOLOv8 détection  │                    │
    │                    │                     │ de plaque          │                    │
    │                    │                     │                    │                    │
    │                    │                     │ EasyOCR lecture   │                    │
    │                    │                     │ des caractères     │                    │
    │                    │                     │                    │                    │
    │                    │ {plate, confidence} │                    │                    │
    │                    │◀────────────────────│                    │                    │
    │                    │                     │                    │                    │
    │                    │ POST /api/gate-events                   │                    │
    │                    │──────────────────────────────────────── ▶│                    │
    │                    │                     │                    │                    │
    │                    │                     │                    │ INSERT gate_event │
    │                    │                     │                    │───────────────────▶│
    │                    │                     │                    │                    │
    │                    │                     │                    │ Confirmation      │
    │                    │                     │                    │◀───────────────────│
    │                    │                     │                    │                    │
    │                    │ {success: true}     │                    │                    │
    │                    │◀─────────────────────────────────────────│                    │
    │                    │                     │                    │                    │
    │                    │ Afficher résultat   │                    │                    │
    │                    │ sur l'interface     │                    │                    │
    │                    │                     │                    │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence ANPR créé avec un outil UML]**

## 5. Diagramme de classes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE CLASSES                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│        User          │       │       Driver         │
├──────────────────────┤       ├──────────────────────┤
│ - id: int            │       │ - id: int            │
│ - email: string      │◀──────│ - user_id: int (FK)  │
│ - password: string   │  1  1 │ - license_number: str│
│ - role: enum         │       │ - license_expiry: date│
│ - first_name: string │       │ - status: enum       │
│ - last_name: string  │       │ - rating: decimal    │
│ - phone: string      │       │ - total_trips: int   │
│ - is_active: boolean │       └──────────────────────┘
├──────────────────────┤                │
│ + login()            │                │ 1
│ + register()         │                │
│ + updateProfile()    │                │
└──────────────────────┘       ┌──────────────────────┐
         │                     │        Bus           │
         │ 1                   ├──────────────────────┤
         │                     │ - id: int            │
         │                     │ - bus_number: string │
         │                     │ - plate_number: str  │
         │                     │ - model: string      │
         │                     │ - capacity: int      │
         │                     │ - status: enum       │
         │                     │ - current_driver_id  │
         ├────────────────────▶│──────────────────────┤
         │                     │ + updateLocation()   │
         │                     │ + getStatus()        │
         │                     └──────────────────────┘
         │                               │
         │ 1                             │
         │                               ▼
┌──────────────────────┐       ┌──────────────────────┐
│       Ticket         │       │     RouteStop        │
├──────────────────────┤       ├──────────────────────┤
│ - id: int            │       │ - id: int            │
│ - ticket_number: str │       │ - route_id: int (FK) │
│ - user_id: int (FK)  │       │ - stop_name: string  │
│ - schedule_id: int   │       │ - stop_order: int    │
│ - seat_number: string│       │ - latitude: decimal  │
│ - fare: decimal      │       │ - longitude: decimal │
│ - status: enum       │       └──────────────────────┘
│ - qr_code: text      │                │
└──────────────────────┘                │ 1
                                        │
                                        ▼
                               ┌──────────────────────┐
                               │      Schedule        │
                               ├──────────────────────┤
                               │ - id: int            │
                               │ - route_id: int (FK) │
                               │ - bus_id: int (FK)   │
                               │ - driver_id: int (FK)│
                               │ - departure_time: dt │
                               │ - arrival_time: dt   │
                               │ - status: enum       │
                               └──────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de classes complet créé avec un outil UML]**

## 6. Diagramme d'activité - Processus Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│           DIAGRAMME D'ACTIVITÉ - CHECK-IN/CHECK-OUT             │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │     Début       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Démarrer Service│
                    │     ANPR        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Vérifier statut │
                    │   service IA    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              │              ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Service Online │      │     │ Service Offline│
     └───────┬────────┘      │     └───────┬────────┘
             │               │             │
             ▼               │             ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Activer caméra │      │     │ Afficher erreur│
     └───────┬────────┘      │     └───────┬────────┘
             │               │             │
             ▼               │             ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Capturer frame │      │     │     Fin        │
     └───────┬────────┘      │     └────────────────┘
             │               │
             ▼               │
     ┌────────────────┐      │
     │ Envoyer à ANPR │      │
     └───────┬────────┘      │
             │               │
             ▼               │
     ┌────────────────┐      │
     │ Plaque détectée│      │
     │      ?         │      │
     └───────┬────────┘      │
             │               │
      ┌──────┴──────┐        │
      │             │        │
      ▼             ▼        │
┌──────────┐  ┌──────────┐   │
│   Oui    │  │   Non    │   │
└────┬─────┘  └────┬─────┘   │
     │             │         │
     ▼             │         │
┌──────────────┐   │         │
│ Choisir type │   │         │
│ (IN/OUT)     │   │         │
└──────┬───────┘   │         │
       │           │         │
       ▼           │         │
┌──────────────┐   │         │
│ Enregistrer  │   │         │
│ gate_event   │   │         │
└───────┬───────┘   │         │
        │           │         │
        ▼           │         │
┌──────────────┐   │         │
│ Afficher     │◀──┘         │
│ résultat     │             │
└───────┬──────┘             │
        │                     │
        ▼                     │
┌──────────────┐             │
│ Continuer ?  │─────────────┘
└───────┬───────┘
        │
        ▼
┌──────────────┐
│     Fin      │
└──────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme d'activité créé avec un outil UML]**

## 7. Diagramme de déploiement

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DIAGRAMME DE DÉPLOIEMENT                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              << device >>                                        │
│                              Serveur Web                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐    │
│  │   << container >>  │    │   << container >>  │    │   << container >>  │    │
│  │    Frontend        │    │     Backend        │    │   ANPR Service     │    │
│  │    (Next.js)       │    │  (Spring Boot)     │    │   (FastAPI)        │    │
│  │    Port: 3000      │    │    Port: 4000      │    │   Port: 8001       │    │
│  └────────┬───────────┘    └────────┬───────────┘    └────────┬───────────┘    │
│           │                         │                         │                 │
│           │    REST API             │                         │                 │
│           │◀───────────────────────▶│                         │                 │
│           │                         │                         │                 │
│           │    WebSocket STOMP      │                         │                 │
│           │◀───────────────────────▶│                         │                 │
│           │                         │                         │                 │
│           │         REST API (Détection)                      │                 │
│           │◀─────────────────────────────────────────────────▶│                 │
│           │                         │                         │                 │
│           │         MJPEG Stream                              │                 │
│           │◀─────────────────────────────────────────────────▶│                 │
│           │                         │                         │                 │
└───────────┼─────────────────────────┼─────────────────────────┼─────────────────┘
            │                         │                         │
            │                         ▼                         │
            │              ┌────────────────────┐               │
            │              │   << database >>   │               │
            │              │      MySQL         │               │
            │              │    Port: 8889      │               │
            │              └────────────────────┘               │
            │                                                   │
            ▼                                                   ▼
┌────────────────────┐                              ┌────────────────────┐
│   << browser >>    │                              │   << device >>     │
│   Client Web       │                              │   Webcam/Caméra    │
│   (Chrome, Safari) │                              │   ANPR             │
└────────────────────┘                              └────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de déploiement créé avec un outil UML]**

## 6. Conclusion

L'analyse et la conception présentées dans ce chapitre nous permettent d'avoir une vision claire de :
- Les différents acteurs et leurs interactions avec le système
- Le flux de données pour les cas d'utilisation principaux
- La structure des données et les relations entre entités

Cette conception servira de base pour l'implémentation détaillée dans le chapitre suivant.

---

# CHAPITRE 4 : TECHNOLOGIES ET OUTILS UTILISÉS

## 1. Introduction

Ce chapitre présente en détail les technologies et outils utilisés pour le développement du système de suivi de bus. Le choix de ces technologies a été guidé par des critères de performance, de modernité et d'adéquation avec les besoins du projet.

## 2. Technologies utilisées

### Stack Technique Complet

| Catégorie | Technologie | Version | Usage |
|-----------|-------------|---------|-------|
| **Frontend** | Next.js | 16.0.3 | Framework React |
| **Frontend** | React | 19.2.0 | Bibliothèque UI |
| **Frontend** | TypeScript | 5.x | Typage statique |
| **Frontend** | Tailwind CSS | 4.1.17 | Styles CSS |
| **Frontend** | Mapbox GL JS | 3.4.0 | Cartographie |
| **Backend** | Spring Boot | 3.2.0 | Framework Java |
| **Backend** | Spring Security | 6.x | Sécurité |
| **Backend** | Spring Data JPA | 3.x | Persistance |
| **Backend** | WebSocket STOMP | - | Temps réel |
| **ANPR** | Python | 3.11 | Langage service ANPR |
| **ANPR** | FastAPI | 0.104.x | Framework API Python |
| **ANPR** | YOLOv8 | latest | Détection de plaques |
| **ANPR** | EasyOCR | latest | Reconnaissance caractères |
| **ANPR** | OpenCV | 4.x | Traitement d'images |
| **Base de données** | MySQL | 8.x | Stockage données |
| **Authentification** | JWT (jjwt) | 0.12.3 | Jetons d'accès sécurisés |
| **Build** | Maven | 3.9.x | Gestion des dépendances |
| **Tests E2E** | Selenium | 4.x | Tests automatisés UI |
| **Tests** | JUnit 5 | 5.x | Tests unitaires Java |
| **Qualité code** | SonarQube | Cloud | Analyse statique |

### 2.1 Next.js 16

**Next.js** est un framework React qui offre :

- **Server-Side Rendering (SSR)** : Améliore le SEO et les performances
- **App Router** : Système de routage moderne basé sur les dossiers
- **API Routes** : Création d'endpoints API intégrés
- **Turbopack** : Bundler ultra-rapide pour le développement

```typescript
// Exemple de structure App Router
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <DashboardShell />
}
```

### 2.2 Spring Boot 3.2

**Spring Boot** est le framework backend Java choisi pour :

- Son écosystème robuste et mature
- Spring Security pour la sécurisation des APIs
- Spring Data JPA pour la persistance des données
- Support natif de WebSocket avec STOMP

```java
// Structure du contrôleur REST
@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {
    
    private final BusService busService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses() {
        List<BusResponse> buses = busService.getAllBuses();
        return ResponseEntity.ok(ApiResponse.success(buses));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<BusResponse>> createBus(
            @Valid @RequestBody BusRequest request) {
        BusResponse bus = busService.createBus(request);
        return ResponseEntity.ok(ApiResponse.success("Bus créé", bus));
    }
}
```

### 2.3 WebSocket STOMP

**WebSocket STOMP** permet la communication bidirectionnelle en temps réel avec Spring :

```java
// Backend - Contrôleur WebSocket
@Controller
@RequiredArgsConstructor
public class WebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final GpsService gpsService;
    
    @MessageMapping("/gps/update")
    public void handleGpsUpdate(@Payload GpsUpdateRequest request) {
        GpsResponse response = gpsService.updateGpsPosition(request);
        // Broadcast à tous les abonnés
        messagingTemplate.convertAndSend("/topic/gps-updates", response);
        // Notification spécifique au bus
        messagingTemplate.convertAndSend("/topic/bus/" + request.getBusId(), response);
    }
}

// Scheduler pour broadcast automatique
@Scheduled(fixedRate = 5000)
public void broadcastAllGpsPositions() {
    List<GpsResponse> positions = gpsService.getLatestPositions();
    messagingTemplate.convertAndSend("/topic/gps-updates", positions);
}
```

```typescript
// Frontend - Connexion STOMP avec SockJS
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const stompClient = new Client({
  webSocketFactory: () => new SockJS('http://localhost:4000/ws'),
  onConnect: () => {
    stompClient.subscribe('/topic/gps-updates', (message) => {
      const data = JSON.parse(message.body);
      updateBusPosition(data.busId, data.latitude, data.longitude);
    });
  }
});
stompClient.activate();
```

### 2.4 Mapbox GL JS

**Mapbox GL JS** est utilisé pour l'affichage des cartes :

```typescript
// Composant MapboxMap
const MapboxMap = ({ buses, onBusClick }) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-7.9811, 31.6295], // Marrakech
      zoom: 12
    })
    
    buses.forEach(bus => {
      new mapboxgl.Marker()
        .setLngLat([bus.longitude, bus.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${bus.bus_number}</h3>`))
        .addTo(map)
    })
  }, [buses])
}
```

---

## 3. Historique du transport au Maroc

Le transport urbain au Maroc a connu une évolution progressive depuis les années 1960. Initialement basé sur des bus classiques gérés par des sociétés publiques, le secteur s'est ouvert à la concurrence et à la privatisation dans les années 2000. Malgré l'introduction de nouveaux opérateurs et de bus modernes, la digitalisation des processus (suivi GPS, pointage électronique, gestion automatisée) reste très limitée. La majorité des opérations (pointage, contrôle, reporting) se fait encore manuellement, ce qui ralentit l'efficacité et la fiabilité du service. Ce projet s'inscrit dans une démarche de modernisation et d'alignement avec les standards internationaux du transport intelligent.

---

# CHAPITRE 2 : CONTEXTE GÉNÉRAL DU PROJET

## 1. Introduction

Ce chapitre présente le contexte général du projet, incluant la problématique identifiée, les objectifs à atteindre et la méthodologie adoptée pour le développement.

## 2. Présentation du projet

### 2.1 Problématique

Le secteur du transport public au Maroc souffre d'un retard technologique important. Dans de nombreuses villes, le pointage des bus et des conducteurs se fait encore manuellement, à l'aide de papier et de stylo. Cette méthode traditionnelle engendre non seulement des pertes de temps et des erreurs, mais favorise aussi les fraudes et les vols par les personnes en charge du contrôle. Ce manque de modernisation nuit à l'efficacité, à la transparence et à la fiabilité du service public. 

La solution proposée dans ce projet vise à répondre à cette problématique en introduisant une plateforme numérique de suivi en temps réel et d'automatisation du pointage grâce à l'intelligence artificielle (ANPR). Elle permet de fiabiliser le processus, de réduire les risques de fraude et d'améliorer la gestion globale de la flotte.

### 2.1 bis Historique du transport au Maroc

Le transport public au Maroc a connu plusieurs phases d'évolution. Dès le début du XXe siècle, les premières lignes de tramway et d'autobus ont été mises en place dans les grandes villes comme Casablanca et Rabat. Cependant, la modernisation du secteur a longtemps été freinée par le manque d'investissements et l'absence de digitalisation. Ce n'est qu'à partir des années 2010, avec l'arrivée de nouveaux opérateurs et l'introduction de technologies comme le tramway moderne, que le secteur a commencé à se transformer. Malgré ces avancées, la majorité des réseaux de bus reste encore gérée de façon traditionnelle, d'où la nécessité d'une solution innovante comme celle proposée dans ce projet.

### 2.2 Objectifs du projet

#### Objectifs principaux :
- Développer une application web permettant le suivi en temps réel des bus
- Créer des interfaces dédiées pour chaque type d'utilisateur
- Implémenter un système de communication en temps réel

#### Objectifs spécifiques :
| Objectif | Description |
|----------|-------------|
| Suivi GPS | Afficher la position des bus sur une carte interactive |
| Multi-rôles | Interfaces pour admin, conducteur et client |
| Temps réel | Mise à jour automatique sans rechargement |
| Gestion de flotte | Outils d'administration pour la flotte |
| Réservation | Système de réservation de tickets |

### 2.3 Solution proposée

Notre solution est un **système de suivi de bus en temps réel** comprenant :

1. **Application Web responsive**
   - Interface adaptée desktop et mobile
   - Carte interactive avec Mapbox

2. **Architecture multi-rôles**
   - Portail Administrateur
   - Portail Conducteur
   - Portail Client

3. **Backend robuste**
   - API RESTful
   - Communication WebSocket
   - Base de données relationnelle

## 3. Démarche et planification

### 3.1 La méthode SCRUM

Pour la gestion de ce projet, nous avons adopté la méthodologie **Agile SCRUM** qui permet :
- Un développement itératif et incrémental
- Une adaptation rapide aux changements
- Une livraison régulière de fonctionnalités

### 3.2 Pourquoi SCRUM ?

| Avantage | Application au projet |
|----------|----------------------|
| **Flexibilité** | Adaptation aux besoins changeants |
| **Visibilité** | Suivi clair de l'avancement |
| **Qualité** | Tests réguliers à chaque sprint |
| **Communication** | Échanges fréquents avec l'encadrant |

### 3.3 L'équipe et rôles

| Rôle | Responsabilité |
|------|----------------|
| **Product Owner** | Définition des besoins et priorités |
| **Scrum Master** | Facilitation du processus Scrum |
| **Développeur** | Conception et implémentation |

### 3.4 Identification du backlog des tâches

#### Sprint 1 : Configuration et Base
- Configuration de l'environnement de développement
- Mise en place de la base de données
- Création de l'architecture du projet

#### Sprint 2 : Authentification et Utilisateurs
- Système d'authentification JWT
- Gestion des rôles utilisateurs
- Pages de connexion et inscription

#### Sprint 3 : Fonctionnalités Core
- Intégration de la carte Mapbox
- Suivi GPS en temps réel
- Gestion de la flotte

#### Sprint 4 : Portails Utilisateurs
- Dashboard administrateur
- Portail conducteur
- Portail client

#### Sprint 5 : Service ANPR
- Développement du service Python FastAPI
- Intégration YOLOv8 pour la détection de plaques
- OCR pour la lecture des plaques marocaines
- Interface Check-in/Check-out

#### Sprint 6 : Finalisation
- Tests et corrections
- Optimisation des performances
- Documentation

### 3.5 Diagramme de Gantt

Le diagramme de Gantt ci-dessous présente la planification temporelle du projet :

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE GANTT - PROJET BUS TRACKING                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Tâches                    │ S1  │ S2  │ S3  │ S4  │ S5  │ S6  │ S7  │ S8  │ S9  │ S10 │ S11│ S12│
├───────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼────┼────┤
│ Analyse des besoins       │████ │████ │     │     │     │     │     │     │     │     │    │    │
│ Conception UML            │     │████ │████ │     │     │     │     │     │     │     │    │    │
│ Config. environnement     │     │     │████ │     │     │     │     │     │     │     │    │    │
│ Base de données           │     │     │████ │████ │     │     │     │     │     │     │    │    │
│ Backend Spring Boot       │     │     │     │████ │████ │████ │     │     │     │     │    │    │
│ Authentification JWT      │     │     │     │     │████ │████ │     │     │     │     │    │    │
│ Frontend Next.js          │     │     │     │     │     │████ │████ │████ │     │     │    │    │
│ Intégration Mapbox        │     │     │     │     │     │     │████ │████ │     │     │    │    │
│ WebSocket temps réel      │     │     │     │     │     │     │     │████ │████ │     │    │    │
│ Service ANPR Python       │     │     │     │     │     │     │     │     │████ │████ │████│    │
│ Interface Check-in/out    │     │     │     │     │     │     │     │     │     │████ │████│    │
│ Tests & Validation        │     │     │     │     │     │     │     │     │     │     │████│████│
│ Documentation             │     │     │     │     │     │     │     │     │     │     │████│████│
└───────────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴────┴────┘

Légende : ████ = Période d'exécution   S = Semaine
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de Gantt créé avec un outil comme Microsoft Project, GanttProject ou Monday.com]**

---

# CHAPITRE 3 : ANALYSE ET CONCEPTION

## 1. Introduction

Ce chapitre présente l'analyse et la conception du système à travers différents diagrammes UML. Ces modèles permettent de visualiser l'architecture et le fonctionnement de l'application.

## 2. Langage de modélisation

Nous utilisons **UML (Unified Modeling Language)** pour modéliser notre système. UML est un langage de modélisation graphique standardisé qui permet de :
- Visualiser la structure du système
- Spécifier les comportements attendus
- Construire les différents composants
- Documenter l'architecture

## 3. Diagramme de cas d'utilisation général

Le diagramme de cas d'utilisation général présente les interactions entre les acteurs et le système.

### Acteurs du système :

| Acteur | Description |
|--------|-------------|
| **Administrateur** | Gère la flotte, les utilisateurs et supervise le système |
| **Conducteur** | Conduit le bus, signale les incidents |
| **Client/Passager** | Consulte les positions des bus, réserve des tickets |
| **Système GPS** | Envoie les positions des véhicules |
| **Système ANPR** | Détecte et reconnaît les plaques d'immatriculation |

### Cas d'utilisation principaux :

```
┌─────────────────────────────────────────────────────────────────┐
│                    Système de Suivi de Bus                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Administrateur│───▶│ Gérer la flotte      │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Gérer les utilisateurs│                 │
│          │            ├──────────────────────┤                 │
│          │            │ Voir les statistiques │                 │
│          │            ├──────────────────────┤                 │
│          │            │ Gérer les routes      │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Superviser ANPR       │                 │
│                       ├──────────────────────┤                 │
│                       │ Voir Check-in/out    │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │  Conducteur  │───▶│ Commencer un trajet   │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Signaler un incident  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir son itinéraire   │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │    Client    │───▶│ Suivre un bus         │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Réserver un ticket    │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir les horaires     │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Système ANPR │───▶│ Détecter plaque       │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Enregistrer Check-in  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Enregistrer Check-out │                 │
│                       └──────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation créé avec un outil UML comme StarUML, Lucidchart ou draw.io]**

## 4. Diagramme de cas d'utilisation - ANPR Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│              Système ANPR - Check-in/Check-out                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐                                             │
│   │   Caméra     │                                             │
│   └──────┬───────┘                                             │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────────────┐                                     │
│   │ Capturer image       │                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Détecter plaque      │───▶│ YOLOv8 Model         │        │
│   │ (YOLOv8)             │    │ (best.pt)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Lire caractères      │───▶│ EasyOCR              │        │
│   │ (OCR)                │    │ (ar + en)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Parser format        │                                     │
│   │ marocain             │                                     │
│   │ (SÉRIE|LETTRE|RÉGION)│                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Enregistrer événement│                                     │
│   │ (CHECK_IN/CHECK_OUT) │                                     │
│   └──────────────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation ANPR créé avec un outil UML]**

## 4. Diagrammes de séquence

### 4.1 DS pour le cas d'utilisation : Authentification

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│ Client │          │ Frontend │          │ Backend  │          │   BD   │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ Saisir identifiants│                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ POST /api/auth/login│                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ SELECT user        │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │ Retour user        │
    │                    │                     │◀───────────────────│
    │                    │                     │                    │
    │                    │                     │ Vérifier password  │
    │                    │                     │ (bcrypt.compare)   │
    │                    │                     │                    │
    │                    │                     │ Générer JWT        │
    │                    │                     │                    │
    │                    │ {token, user}       │                    │
    │                    │◀────────────────────│                    │
    │                    │                     │                    │
    │                    │ Stocker token       │                    │
    │                    │ (localStorage)      │                    │
    │                    │                     │                    │
    │ Redirection        │                     │                    │
    │ selon rôle         │                     │                    │
    │◀───────────────────│                     │                    │
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence d'authentification]**

### 4.2 DS pour le cas d'utilisation : Mise à jour GPS en temps réel

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│  GPS   │          │ Backend  │          │WebSocket │          │ Client │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ POST /api/gps/update                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ Enregistrer position│                    │
    │                    │ dans BD             │                    │
    │                    │                     │                    │
    │                    │ sendToTopic         │                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ Broadcast STOMP   │
    │                    │                     │ message to subs   │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │                    │ Mettre à jour
    │                    │                     │                    │ la carte
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence de mise à jour GPS]**

### 4.3 DS pour le cas d'utilisation : Détection de plaque ANPR

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐          ┌────────┐
│ Caméra │          │ Frontend │          │  ANPR    │          │Backend │          │   BD   │
│        │          │          │          │ Service  │          │        │          │        │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘          └───┬────┘
    │                    │                     │                    │                    │
    │ Flux vidéo MJPEG   │                     │                    │                    │
    │───────────────────▶│                     │                    │                    │
    │                    │                     │                    │                    │
    │                    │ Capture frame       │                    │                    │
    │                    │────────────────────▶│                    │                    │
    │                    │                     │                    │                    │
    │                    │                     │ YOLOv8 détection  │                    │
    │                    │                     │ de plaque          │                    │
    │                    │                     │                    │                    │
    │                    │                     │ EasyOCR lecture   │                    │
    │                    │                     │ des caractères     │                    │
    │                    │                     │                    │                    │
    │                    │ {plate, confidence} │                    │                    │
    │                    │◀────────────────────│                    │                    │
    │                    │                     │                    │                    │
    │                    │ POST /api/gate-events                   │                    │
    │                    │──────────────────────────────────────── ▶│                    │
    │                    │                     │                    │                    │
    │                    │                     │                    │ INSERT gate_event │
    │                    │                     │                    │───────────────────▶│
    │                    │                     │                    │                    │
    │                    │                     │                    │ Confirmation      │
    │                    │                     │                    │◀───────────────────│
    │                    │                     │                    │                    │
    │                    │ {success: true}     │                    │                    │
    │                    │◀─────────────────────────────────────────│                    │
    │                    │                     │                    │                    │
    │                    │ Afficher résultat   │                    │                    │
    │                    │ sur l'interface     │                    │                    │
    │                    │                     │                    │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence ANPR créé avec un outil UML]**

## 5. Diagramme de classes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE CLASSES                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│        User          │       │       Driver         │
├──────────────────────┤       ├──────────────────────┤
│ - id: int            │       │ - id: int            │
│ - email: string      │◀──────│ - user_id: int (FK)  │
│ - password: string   │  1  1 │ - license_number: str│
│ - role: enum         │       │ - license_expiry: date│
│ - first_name: string │       │ - status: enum       │
│ - last_name: string  │       │ - rating: decimal    │
│ - phone: string      │       │ - total_trips: int   │
│ - is_active: boolean │       └──────────────────────┘
├──────────────────────┤                │
│ + login()            │                │ 1
│ + register()         │                │
│ + updateProfile()    │                │
└──────────────────────┘       ┌──────────────────────┐
         │                     │        Bus           │
         │ 1                   ├──────────────────────┤
         │                     │ - id: int            │
         │                     │ - bus_number: string │
         │                     │ - plate_number: str  │
         │                     │ - model: string      │
         │                     │ - capacity: int      │
         │                     │ - status: enum       │
         │                     │ - current_driver_id  │
         ├────────────────────▶│──────────────────────┤
         │                     │ + updateLocation()   │
         │                     │ + getStatus()        │
         │                     └──────────────────────┘
         │                               │
         │ 1                             │
         │                               ▼
┌──────────────────────┐       ┌──────────────────────┐
│       Ticket         │       │     RouteStop        │
├──────────────────────┤       ├──────────────────────┤
│ - id: int            │       │ - id: int            │
│ - ticket_number: str │       │ - route_id: int (FK) │
│ - user_id: int (FK)  │       │ - stop_name: string  │
│ - schedule_id: int   │       │ - stop_order: int    │
│ - seat_number: string│       │ - latitude: decimal  │
│ - fare: decimal      │       │ - longitude: decimal │
│ - status: enum       │       └──────────────────────┘
│ - qr_code: text      │                │
└──────────────────────┘                │ 1
                                        │
                                        ▼
                               ┌──────────────────────┐
                               │      Schedule        │
                               ├──────────────────────┤
                               │ - id: int            │
                               │ - route_id: int (FK) │
                               │ - bus_id: int (FK)   │
                               │ - driver_id: int (FK)│
                               │ - departure_time: dt │
                               │ - arrival_time: dt   │
                               │ - status: enum       │
                               └──────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de classes complet créé avec un outil UML]**

## 6. Diagramme d'activité - Processus Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│           DIAGRAMME D'ACTIVITÉ - CHECK-IN/CHECK-OUT             │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │     Début       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Démarrer Service│
                    │     ANPR        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Vérifier statut │
                    │   service IA    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              │              ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Service Online │      │     │ Service Offline│
     └───────┬────────┘      │     └───────┬────────┘
             │               │             │
             ▼               │             ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Activer caméra │      │     │ Afficher erreur│
     └───────┬────────┘      │     └───────┬────────┘
             │               │             │
             ▼               │             ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Capturer frame │      │     │     Fin        │
     └───────┬────────┘      │     └────────────────┘
             │               │
             ▼               │
     ┌────────────────┐      │
     │ Envoyer à ANPR │      │
     └───────┬────────┘      │
             │               │
             ▼               │
     ┌────────────────┐      │
     │ Plaque détectée│      │
     │      ?         │      │
     └───────┬────────┘      │
             │               │
      ┌──────┴──────┐        │
      │             │        │
      ▼             ▼        │
┌──────────┐  ┌──────────┐   │
│   Oui    │  │   Non    │   │
└────┬─────┘  └────┬─────┘   │
     │             │         │
     ▼             │         │
┌──────────────┐   │         │
│ Choisir type │   │         │
│ (IN/OUT)     │   │         │
└──────┬───────┘   │         │
       │           │         │
       ▼           │         │
┌──────────────┐   │         │
│ Enregistrer  │   │         │
│ gate_event   │   │         │
└───────┬───────┘   │         │
        │           │         │
        ▼           │         │
┌──────────────┐   │         │
│ Afficher     │◀──┘         │
│ résultat     │             │
└───────┬──────┘             │
        │                     │
        ▼                     │
┌──────────────┐             │
│ Continuer ?  │─────────────┘
└───────┬───────┘
        │
        ▼
┌──────────────┐
│     Fin      │
└──────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme d'activité créé avec un outil UML]**

## 7. Diagramme de déploiement

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DIAGRAMME DE DÉPLOIEMENT                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              << device >>                                        │
│                              Serveur Web                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐    │
│  │   << container >>  │    │   << container >>  │    │   << container >>  │    │
│  │    Frontend        │    │     Backend        │    │   ANPR Service     │    │
│  │    (Next.js)       │    │  (Spring Boot)     │    │   (FastAPI)        │    │
│  │    Port: 3000      │    │    Port: 4000      │    │   Port: 8001       │    │
│  └────────┬───────────┘    └────────┬───────────┘    └────────┬───────────┘    │
│           │                         │                         │                 │
│           │    REST API             │                         │                 │
│           │◀───────────────────────▶│                         │                 │
│           │                         │                         │                 │
│           │    WebSocket STOMP      │                         │                 │
│           │◀───────────────────────▶│                         │                 │
│           │                         │                         │                 │
│           │         REST API (Détection)                      │                 │
│           │◀─────────────────────────────────────────────────▶│                 │
│           │                         │                         │                 │
│           │         MJPEG Stream                              │                 │
│           │◀─────────────────────────────────────────────────▶│                 │
│           │                         │                         │                 │
└───────────┼─────────────────────────┼─────────────────────────┼─────────────────┘
            │                         │                         │
            │                         ▼                         │
            │              ┌────────────────────┐               │
            │              │   << database >>   │               │
            │              │      MySQL         │               │
            │              │    Port: 8889      │               │
            │              └────────────────────┘               │
            │                                                   │
            ▼                                                   ▼
┌────────────────────┐                              ┌────────────────────┐
│   << browser >>    │                              │   << device >>     │
│   Client Web       │                              │   Webcam/Caméra    │
│   (Chrome, Safari) │                              │   ANPR             │
└────────────────────┘                              └────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de déploiement créé avec un outil UML]**

## 6. Conclusion

L'analyse et la conception présentées dans ce chapitre nous permettent d'avoir une vision claire de :
- Les différents acteurs et leurs interactions avec le système
- Le flux de données pour les cas d'utilisation principaux
- La structure des données et les relations entre entités

Cette conception servira de base pour l'implémentation détaillée dans le chapitre suivant.

---

# CHAPITRE 4 : TECHNOLOGIES ET OUTILS UTILISÉS

## 1. Introduction

Ce chapitre présente en détail les technologies et outils utilisés pour le développement du système de suivi de bus. Le choix de ces technologies a été guidé par des critères de performance, de modernité et d'adéquation avec les besoins du projet.

## 2. Technologies utilisées

### Stack Technique Complet

| Catégorie | Technologie | Version | Usage |
|-----------|-------------|---------|-------|
| **Frontend** | Next.js | 16.0.3 | Framework React |
| **Frontend** | React | 19.2.0 | Bibliothèque UI |
| **Frontend** | TypeScript | 5.x | Typage statique |
| **Frontend** | Tailwind CSS | 4.1.17 | Styles CSS |
| **Frontend** | Mapbox GL JS | 3.4.0 | Cartographie |
| **Backend** | Spring Boot | 3.2.0 | Framework Java |
| **Backend** | Spring Security | 6.x | Sécurité |
| **Backend** | Spring Data JPA | 3.x | Persistance |
| **Backend** | WebSocket STOMP | - | Temps réel |
| **ANPR** | Python | 3.11 | Langage service ANPR |
| **ANPR** | FastAPI | 0.104.x | Framework API Python |
| **ANPR** | YOLOv8 | latest | Détection de plaques |
| **ANPR** | EasyOCR | latest | Reconnaissance caractères |
| **ANPR** | OpenCV | 4.x | Traitement d'images |
| **Base de données** | MySQL | 8.x | Stockage données |
| **Authentification** | JWT (jjwt) | 0.12.3 | Jetons d'accès sécurisés |
| **Build** | Maven | 3.9.x | Gestion des dépendances |
| **Tests E2E** | Selenium | 4.x | Tests automatisés UI |
| **Tests** | JUnit 5 | 5.x | Tests unitaires Java |
| **Qualité code** | SonarQube | Cloud | Analyse statique |

### 2.1 Next.js 16

**Next.js** est un framework React qui offre :

- **Server-Side Rendering (SSR)** : Améliore le SEO et les performances
- **App Router** : Système de routage moderne basé sur les dossiers
- **API Routes** : Création d'endpoints API intégrés
- **Turbopack** : Bundler ultra-rapide pour le développement

```typescript
// Exemple de structure App Router
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <DashboardShell />
}
```

### 2.2 Spring Boot 3.2

**Spring Boot** est le framework backend Java choisi pour :

- Son écosystème robuste et mature
- Spring Security pour la sécurisation des APIs
- Spring Data JPA pour la persistance des données
- Support natif de WebSocket avec STOMP

```java
// Structure du contrôleur REST
@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {
    
    private final BusService busService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses() {
        List<BusResponse> buses = busService.getAllBuses();
        return ResponseEntity.ok(ApiResponse.success(buses));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<BusResponse>> createBus(
            @Valid @RequestBody BusRequest request) {
        BusResponse bus = busService.createBus(request);
        return ResponseEntity.ok(ApiResponse.success("Bus créé", bus));
    }
}
```

### 2.3 WebSocket STOMP

**WebSocket STOMP** permet la communication bidirectionnelle en temps réel avec Spring :

```java
// Backend - Contrôleur WebSocket
@Controller
@RequiredArgsConstructor
public class WebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final GpsService gpsService;
    
    @MessageMapping("/gps/update")
    public void handleGpsUpdate(@Payload GpsUpdateRequest request) {
        GpsResponse response = gpsService.updateGpsPosition(request);
        // Broadcast à tous les abonnés
        messagingTemplate.convertAndSend("/topic/gps-updates", response);
        // Notification spécifique au bus
        messagingTemplate.convertAndSend("/topic/bus/" + request.getBusId(), response);
    }
}

// Scheduler pour broadcast automatique
@Scheduled(fixedRate = 5000)
public void broadcastAllGpsPositions() {
    List<GpsResponse> positions = gpsService.getLatestPositions();
    messagingTemplate.convertAndSend("/topic/gps-updates", positions);
}
```

```typescript
// Frontend - Connexion STOMP avec SockJS
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const stompClient = new Client({
  webSocketFactory: () => new SockJS('http://localhost:4000/ws'),
  onConnect: () => {
    stompClient.subscribe('/topic/gps-updates', (message) => {
      const data = JSON.parse(message.body);
      updateBusPosition(data.busId, data.latitude, data.longitude);
    });
  }
});
stompClient.activate();
```

### 2.4 Mapbox GL JS

**Mapbox GL JS** est utilisé pour l'affichage des cartes :

```typescript
// Composant MapboxMap
const MapboxMap = ({ buses, onBusClick }) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-7.9811, 31.6295], // Marrakech
      zoom: 12
    })
    
    buses.forEach(bus => {
      new mapboxgl.Marker()
        .setLngLat([bus.longitude, bus.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${bus.bus_number}</h3>`))
        .addTo(map)
    })
  }, [buses])
}
```

---

## 3. Historique du transport au Maroc

Le transport urbain au Maroc a connu une évolution progressive depuis les années 1960. Initialement basé sur des bus classiques gérés par des sociétés publiques, le secteur s'est ouvert à la concurrence et à la privatisation dans les années 2000. Malgré l'introduction de nouveaux opérateurs et de bus modernes, la digitalisation des processus (suivi GPS, pointage électronique, gestion automatisée) reste très limitée. La majorité des opérations (pointage, contrôle, reporting) se fait encore manuellement, ce qui ralentit l'efficacité et la fiabilité du service. Ce projet s'inscrit dans une démarche de modernisation et d'alignement avec les standards internationaux du transport intelligent.

---

# CHAPITRE 2 : CONTEXTE GÉNÉRAL DU PROJET

## 1. Introduction

Ce chapitre présente le contexte général du projet, incluant la problématique identifiée, les objectifs à atteindre et la méthodologie adoptée pour le développement.

## 2. Présentation du projet

### 2.1 Problématique

Le secteur du transport public au Maroc souffre d'un retard technologique important. Dans de nombreuses villes, le pointage des bus et des conducteurs se fait encore manuellement, à l'aide de papier et de stylo. Cette méthode traditionnelle engendre non seulement des pertes de temps et des erreurs, mais favorise aussi les fraudes et les vols par les personnes en charge du contrôle. Ce manque de modernisation nuit à l'efficacité, à la transparence et à la fiabilité du service public. 

La solution proposée dans ce projet vise à répondre à cette problématique en introduisant une plateforme numérique de suivi en temps réel et d'automatisation du pointage grâce à l'intelligence artificielle (ANPR). Elle permet de fiabiliser le processus, de réduire les risques de fraude et d'améliorer la gestion globale de la flotte.

### 2.1 bis Historique du transport au Maroc

Le transport public au Maroc a connu plusieurs phases d'évolution. Dès le début du XXe siècle, les premières lignes de tramway et d'autobus ont été mises en place dans les grandes villes comme Casablanca et Rabat. Cependant, la modernisation du secteur a longtemps été freinée par le manque d'investissements et l'absence de digitalisation. Ce n'est qu'à partir des années 2010, avec l'arrivée de nouveaux opérateurs et l'introduction de technologies comme le tramway moderne, que le secteur a commencé à se transformer. Malgré ces avancées, la majorité des réseaux de bus reste encore gérée de façon traditionnelle, d'où la nécessité d'une solution innovante comme celle proposée dans ce projet.

### 2.2 Objectifs du projet

#### Objectifs principaux :
- Développer une application web permettant le suivi en temps réel des bus
- Créer des interfaces dédiées pour chaque type d'utilisateur
- Implémenter un système de communication en temps réel

#### Objectifs spécifiques :
| Objectif | Description |
|----------|-------------|
| Suivi GPS | Afficher la position des bus sur une carte interactive |
| Multi-rôles | Interfaces pour admin, conducteur et client |
| Temps réel | Mise à jour automatique sans rechargement |
| Gestion de flotte | Outils d'administration pour la flotte |
| Réservation | Système de réservation de tickets |

### 2.3 Solution proposée

Notre solution est un **système de suivi de bus en temps réel** comprenant :

1. **Application Web responsive**
   - Interface adaptée desktop et mobile
   - Carte interactive avec Mapbox

2. **Architecture multi-rôles**
   - Portail Administrateur
   - Portail Conducteur
   - Portail Client

3. **Backend robuste**
   - API RESTful
   - Communication WebSocket
   - Base de données relationnelle

## 3. Démarche et planification

### 3.1 La méthode SCRUM

Pour la gestion de ce projet, nous avons adopté la méthodologie **Agile SCRUM** qui permet :
- Un développement itératif et incrémental
- Une adaptation rapide aux changements
- Une livraison régulière de fonctionnalités

### 3.2 Pourquoi SCRUM ?

| Avantage | Application au projet |
|----------|----------------------|
| **Flexibilité** | Adaptation aux besoins changeants |
| **Visibilité** | Suivi clair de l'avancement |
| **Qualité** | Tests réguliers à chaque sprint |
| **Communication** | Échanges fréquents avec l'encadrant |

### 3.3 L'équipe et rôles

| Rôle | Responsabilité |
|------|----------------|
| **Product Owner** | Définition des besoins et priorités |
| **Scrum Master** | Facilitation du processus Scrum |
| **Développeur** | Conception et implémentation |

### 3.4 Identification du backlog des tâches

#### Sprint 1 : Configuration et Base
- Configuration de l'environnement de développement
- Mise en place de la base de données
- Création de l'architecture du projet

#### Sprint 2 : Authentification et Utilisateurs
- Système d'authentification JWT
- Gestion des rôles utilisateurs
- Pages de connexion et inscription

#### Sprint 3 : Fonctionnalités Core
- Intégration de la carte Mapbox
- Suivi GPS en temps réel
- Gestion de la flotte

#### Sprint 4 : Portails Utilisateurs
- Dashboard administrateur
- Portail conducteur
- Portail client

#### Sprint 5 : Service ANPR
- Développement du service Python FastAPI
- Intégration YOLOv8 pour la détection de plaques
- OCR pour la lecture des plaques marocaines
- Interface Check-in/Check-out

#### Sprint 6 : Finalisation
- Tests et corrections
- Optimisation des performances
- Documentation

### 3.5 Diagramme de Gantt

Le diagramme de Gantt ci-dessous présente la planification temporelle du projet :

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE GANTT - PROJET BUS TRACKING                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Tâches                    │ S1  │ S2  │ S3  │ S4  │ S5  │ S6  │ S7  │ S8  │ S9  │ S10 │ S11│ S12│
├───────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼────┼────┤
│ Analyse des besoins       │████ │████ │     │     │     │     │     │     │     │     │    │    │
│ Conception UML            │     │████ │████ │     │     │     │     │     │     │     │    │    │
│ Config. environnement     │     │     │████ │     │     │     │     │     │     │     │    │    │
│ Base de données           │     │     │████ │████ │     │     │     │     │     │     │    │    │
│ Backend Spring Boot       │     │     │     │████ │████ │████ │     │     │     │     │    │    │
│ Authentification JWT      │     │     │     │     │████ │████ │     │     │     │     │    │    │
│ Frontend Next.js          │     │     │     │     │     │████ │████ │████ │     │     │    │    │
│ Intégration Mapbox        │     │     │     │     │     │     │████ │████ │     │     │    │    │
│ WebSocket temps réel      │     │     │     │     │     │     │     │████ │████ │     │    │    │
│ Service ANPR Python       │     │     │     │     │     │     │     │     │████ │████ │████│    │
│ Interface Check-in/out    │     │     │     │     │     │     │     │     │     │████ │████│    │
│ Tests & Validation        │     │     │     │     │     │     │     │     │     │     │████│████│
│ Documentation             │     │     │     │     │     │     │     │     │     │     │████│████│
└───────────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴────┴────┘

Légende : ████ = Période d'exécution   S = Semaine
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de Gantt créé avec un outil comme Microsoft Project, GanttProject ou Monday.com]**

---

# CHAPITRE 3 : ANALYSE ET CONCEPTION

## 1. Introduction

Ce chapitre présente l'analyse et la conception du système à travers différents diagrammes UML. Ces modèles permettent de visualiser l'architecture et le fonctionnement de l'application.

## 2. Langage de modélisation

Nous utilisons **UML (Unified Modeling Language)** pour modéliser notre système. UML est un langage de modélisation graphique standardisé qui permet de :
- Visualiser la structure du système
- Spécifier les comportements attendus
- Construire les différents composants
- Documenter l'architecture

## 3. Diagramme de cas d'utilisation général

Le diagramme de cas d'utilisation général présente les interactions entre les acteurs et le système.

### Acteurs du système :

| Acteur | Description |
|--------|-------------|
| **Administrateur** | Gère la flotte, les utilisateurs et supervise le système |
| **Conducteur** | Conduit le bus, signale les incidents |
| **Client/Passager** | Consulte les positions des bus, réserve des tickets |
| **Système GPS** | Envoie les positions des véhicules |
| **Système ANPR** | Détecte et reconnaît les plaques d'immatriculation |

### Cas d'utilisation principaux :

```
┌─────────────────────────────────────────────────────────────────┐
│                    Système de Suivi de Bus                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Administrateur│───▶│ Gérer la flotte      │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Gérer les utilisateurs│                 │
│          │            ├──────────────────────┤                 │
│          │            │ Voir les statistiques │                 │
│          │            ├──────────────────────┤                 │
│          │            │ Gérer les routes      │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Superviser ANPR       │                 │
│                       ├──────────────────────┤                 │
│                       │ Voir Check-in/out    │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │  Conducteur  │───▶│ Commencer un trajet   │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Signaler un incident  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir son itinéraire   │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │    Client    │───▶│ Suivre un bus         │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Réserver un ticket    │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir les horaires     │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Système ANPR │───▶│ Détecter plaque       │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Enregistrer Check-in  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Enregistrer Check-out │                 │
│                       └──────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation créé avec un outil UML comme StarUML, Lucidchart ou draw.io]**

## 4. Diagramme de cas d'utilisation - ANPR Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│              Système ANPR - Check-in/Check-out                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐                                             │
│   │   Caméra     │                                             │
│   └──────┬───────┘                                             │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────────────┐                                     │
│   │ Capturer image       │                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Détecter plaque      │───▶│ YOLOv8 Model         │        │
│   │ (YOLOv8)             │    │ (best.pt)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Lire caractères      │───▶│ EasyOCR              │        │
│   │ (OCR)                │    │ (ar + en)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Parser format        │                                     │
│   │ marocain             │                                     │
│   │ (SÉRIE|LETTRE|RÉGION)│                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Enregistrer événement│                                     │
│   │ (CHECK_IN/CHECK_OUT) │                                     │
│   └──────────────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation ANPR créé avec un outil UML]**

## 4. Diagrammes de séquence

### 4.1 DS pour le cas d'utilisation : Authentification

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│ Client │          │ Frontend │          │ Backend  │          │   BD   │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ Saisir identifiants│                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ POST /api/auth/login│                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ SELECT user        │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │ Retour user        │
    │                    │                     │◀───────────────────│
    │                    │                     │                    │
    │                    │                     │ Vérifier password  │
    │                    │                     │ (bcrypt.compare)   │
    │                    │                     │                    │
    │                    │                     │ Générer JWT        │
    │                    │                     │                    │
    │                    │ {token, user}       │                    │
    │                    │◀────────────────────│                    │
    │                    │                     │                    │
    │                    │ Stocker token       │                    │
    │                    │ (localStorage)      │                    │
    │                    │                     │                    │
    │ Redirection        │                     │                    │
    │ selon rôle         │                     │                    │
    │◀───────────────────│                     │                    │
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence d'authentification]**

### 4.2 DS pour le cas d'utilisation : Mise à jour GPS en temps réel

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│  GPS   │          │ Backend  │          │WebSocket │          │ Client │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ POST /api/gps/update                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ Enregistrer position│                    │
    │                    │ dans BD             │                    │
    │                    │                     │                    │
    │                    │ sendToTopic         │                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ Broadcast STOMP   │
    │                    │                     │ message to subs   │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │                    │ Mettre à jour
    │                    │                     │                    │ la carte
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence de mise à jour GPS]**

### 4.3 DS pour le cas d'utilisation : Détection de plaque ANPR

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐          ┌────────┐
│ Caméra │          │ Frontend │          │  ANPR    │          │Backend │          │   BD   │
│        │          │          │          │ Service  │          │        │          │        │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘          └───┬────┘
    │                    │                     │                    │                    │
    │ Flux vidéo MJPEG   │                     │                    │                    │
    │───────────────────▶│                     │                    │                    │
    │                    │                     │                    │                    │
    │                    │ Capture frame       │                    │                    │
    │                    │────────────────────▶│                    │                    │
    │                    │                     │                    │                    │
    │                    │                     │ YOLOv8 détection  │                    │
    │                    │                     │ de plaque          │                    │
    │                    │                     │                    │                    │
    │                    │                     │ EasyOCR lecture   │                    │
    │                    │                     │ des caractères     │                    │
    │                    │                     │                    │                    │
    │                    │ {plate, confidence} │                    │                    │
    │                    │◀────────────────────│                    │                    │
    │                    │                     │                    │                    │
    │                    │ POST /api/gate-events                   │                    │
    │                    │──────────────────────────────────────── ▶│                    │
    │                    │                     │                    │                    │
    │                    │                     │                    │ INSERT gate_event │
    │                    │                     │                    │───────────────────▶│
    │                    │                     │                    │                    │
    │                    │                     │                    │ Confirmation      │
    │                    │                     │                    │◀───────────────────│
    │                    │                     │                    │                    │
    │                    │ {success: true}     │                    │                    │
    │                    │◀─────────────────────────────────────────│                    │
    │                    │                     │                    │                    │
    │                    │ Afficher résultat   │                    │                    │
    │                    │ sur l'interface     │                    │                    │
    │                    │                     │                    │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence ANPR créé avec un outil UML]**

## 5. Diagramme de classes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE CLASSES                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│        User          │       │       Driver         │
├──────────────────────┤       ├──────────────────────┤
│ - id: int            │       │ - id: int            │
│ - email: string      │◀──────│ - user_id: int (FK)  │
│ - password: string   │  1  1 │ - license_number: str│
│ - role: enum         │       │ - license_expiry: date│
│ - first_name: string │       │ - status: enum       │
│ - last_name: string  │       │ - rating: decimal    │
│ - phone: string      │       │ - total_trips: int   │
│ - is_active: boolean │       └──────────────────────┘
├──────────────────────┤                │
│ + login()            │                │ 1
│ + register()         │                │
│ + updateProfile()    │                │
└──────────────────────┘       ┌──────────────────────┐
         │                     │        Bus           │
         │ 1                   ├──────────────────────┤
         │                     │ - id: int            │
         │                     │ - bus_number: string │
         │                     │ - plate_number: str  │
         │                     │ - model: string      │
         │                     │ - capacity: int      │
         │                     │ - status: enum       │
         │                     │ - current_driver_id  │
         ├────────────────────▶│──────────────────────┤
         │                     │ + updateLocation()   │
         │                     │ + getStatus()        │
         │                     └──────────────────────┘
         │                               │
         │ 1                             │
         │                               ▼
┌──────────────────────┐       ┌──────────────────────┐
│       Ticket         │       │     RouteStop        │
├──────────────────────┤       ├──────────────────────┤
│ - id: int            │       │ - id: int            │
│ - ticket_number: str │       │ - route_id: int (FK) │
│ - user_id: int (FK)  │       │ - stop_name: string  │
│ - schedule_id: int   │       │ - stop_order: int    │
│ - seat_number: string│       │ - latitude: decimal  │
│ - fare: decimal      │       │ - longitude: decimal │
│ - status: enum       │       └──────────────────────┘
│ - qr_code: text      │                │
└──────────────────────┘                │ 1
                                        │
                                        ▼
                               ┌──────────────────────┐
                               │      Schedule        │
                               ├──────────────────────┤
                               │ - id: int            │
                               │ - route_id: int (FK) │
                               │ - bus_id: int (FK)   │
                               │ - driver_id: int (FK)│
                               │ - departure_time: dt │
                               │ - arrival_time: dt   │
                               │ - status: enum       │
                               └──────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de classes complet créé avec un outil UML]**

## 6. Diagramme d'activité - Processus Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│           DIAGRAMME D'ACTIVITÉ - CHECK-IN/CHECK-OUT             │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │     Début       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Démarrer Service│
                    │     ANPR        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Vérifier statut │
                    │   service IA    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              │              ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Service Online │      │     │ Service Offline│
     └───────┬────────┘      │     └───────┬────────┘
             │               │             │
             ▼               │             ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Activer caméra │      │     │ Afficher erreur│
     └───────┬────────┘      │     └───────┬────────┘
             │               │             │
             ▼               │             ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Capturer frame │      │     │     Fin        │
     └───────┬────────┘      │     └────────────────┘
             │               │
             ▼               │
     ┌────────────────┐      │
     │ Envoyer à ANPR │      │
     └───────┬────────┘      │
             │               │
             ▼               │
     ┌────────────────┐      │
     │ Plaque détectée│      │
     │      ?         │      │
     └───────┬────────┘      │
             │               │
      ┌──────┴──────┐        │
      │             │        │
      ▼             ▼        │
┌──────────┐  ┌──────────┐   │
│   Oui    │  │   Non    │   │
└────┬─────┘  └────┬─────┘   │
     │             │         │
     ▼             │         │
┌──────────────┐   │         │
│ Choisir type │   │         │
│ (IN/OUT)     │   │         │
└──────┬───────┘   │         │
       │           │         │
       ▼           │         │
┌──────────────┐   │         │
│ Enregistrer  │   │         │
│ gate_event   │   │         │
└───────┬───────┘   │         │
        │           │         │
        ▼           │         │
┌──────────────┐   │         │
│ Afficher     │◀──┘         │
│ résultat     │             │
└───────┬──────┘             │
        │                     │
        ▼                     │
┌──────────────┐             │
│ Continuer ?  │─────────────┘
└───────┬───────┘
        │
        ▼
┌──────────────┐
│     Fin      │
└──────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme d'activité créé avec un outil UML]**

## 7. Diagramme de déploiement

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DIAGRAMME DE DÉPLOIEMENT                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              << device >>                                        │
│                              Serveur Web                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐    │
│  │   << container >>  │    │   << container >>  │    │   << container >>  │    │
│  │    Frontend        │    │     Backend        │    │   ANPR Service     │    │
│  │    (Next.js)       │    │  (Spring Boot)     │    │   (FastAPI)        │    │
│  │    Port: 3000      │    │    Port: 4000      │    │   Port: 8001       │    │
│  └────────┬───────────┘    └────────┬───────────┘    └────────┬───────────┘    │
│           │                         │                         │                 │
│           │    REST API             │                         │                 │
│           │◀───────────────────────▶│                         │                 │
│           │                         │                         │                 │
│           │    WebSocket STOMP      │                         │                 │
│           │◀───────────────────────▶│                         │                 │
│           │                         │                         │                 │
│           │         REST API (Détection)                      │                 │
│           │◀─────────────────────────────────────────────────▶│                 │
│           │                         │                         │                 │
│           │         MJPEG Stream                              │                 │
│           │◀─────────────────────────────────────────────────▶│                 │
│           │                         │                         │                 │
└───────────┼─────────────────────────┼─────────────────────────┼─────────────────┘
            │                         │                         │
            │                         ▼                         │
            │              ┌────────────────────┐               │
            │              │   << database >>   │               │
            │              │      MySQL         │               │
            │              │    Port: 8889      │               │
            │              └────────────────────┘               │
            │                                                   │
            ▼                                                   ▼
┌────────────────────┐                              ┌────────────────────┐
│   << browser >>    │                              │   << device >>     │
│   Client Web       │                              │   Webcam/Caméra    │
│   (Chrome, Safari) │                              │   ANPR             │
└────────────────────┘                              └────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de déploiement créé avec un outil UML]**

## 6. Conclusion

L'analyse et la conception présentées dans ce chapitre nous permettent d'avoir une vision claire de :
- Les différents acteurs et leurs interactions avec le système
- Le flux de données pour les cas d'utilisation principaux
- La structure des données et les relations entre entités

Cette conception servira de base pour l'implémentation détaillée dans le chapitre suivant.

---

# CHAPITRE 4 : TECHNOLOGIES ET OUTILS UTILISÉS

## 1. Introduction

Ce chapitre présente en détail les technologies et outils utilisés pour le développement du système de suivi de bus. Le choix de ces technologies a été guidé par des critères de performance, de modernité et d'adéquation avec les besoins du projet.

## 2. Technologies utilisées

### Stack Technique Complet

| Catégorie | Technologie | Version | Usage |
|-----------|-------------|---------|-------|
| **Frontend** | Next.js | 16.0.3 | Framework React |
| **Frontend** | React | 19.2.0 | Bibliothèque UI |
| **Frontend** | TypeScript | 5.x | Typage statique |
| **Frontend** | Tailwind CSS | 4.1.17 | Styles CSS |
| **Frontend** | Mapbox GL JS | 3.4.0 | Cartographie |
| **Backend** | Spring Boot | 3.2.0 | Framework Java |
| **Backend** | Spring Security | 6.x | Sécurité |
| **Backend** | Spring Data JPA | 3.x | Persistance |
| **Backend** | WebSocket STOMP | - | Temps réel |
| **ANPR** | Python | 3.11 | Langage service ANPR |
| **ANPR** | FastAPI | 0.104.x | Framework API Python |
| **ANPR** | YOLOv8 | latest | Détection de plaques |
| **ANPR** | EasyOCR | latest | Reconnaissance caractères |
| **ANPR** | OpenCV | 4.x | Traitement d'images |
| **Base de données** | MySQL | 8.x | Stockage données |
| **Authentification** | JWT (jjwt) | 0.12.3 | Jetons d'accès sécurisés |
| **Build** | Maven | 3.9.x | Gestion des dépendances |
| **Tests E2E** | Selenium | 4.x | Tests automatisés UI |
| **Tests** | JUnit 5 | 5.x | Tests unitaires Java |
| **Qualité code** | SonarQube | Cloud | Analyse statique |

### 2.1 Next.js 16

**Next.js** est un framework React qui offre :

- **Server-Side Rendering (SSR)** : Améliore le SEO et les performances
- **App Router** : Système de routage moderne basé sur les dossiers
- **API Routes** : Création d'endpoints API intégrés
- **Turbopack** : Bundler ultra-rapide pour le développement

```typescript
// Exemple de structure App Router
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <DashboardShell />
}
```

### 2.2 Spring Boot 3.2

**Spring Boot** est le framework backend Java choisi pour :

- Son écosystème robuste et mature
- Spring Security pour la sécurisation des APIs
- Spring Data JPA pour la persistance des données
- Support natif de WebSocket avec STOMP

```java
// Structure du contrôleur REST
@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {
    
    private final BusService busService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses() {
        List<BusResponse> buses = busService.getAllBuses();
        return ResponseEntity.ok(ApiResponse.success(buses));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<BusResponse>> createBus(
            @Valid @RequestBody BusRequest request) {
        BusResponse bus = busService.createBus(request);
        return ResponseEntity.ok(ApiResponse.success("Bus créé", bus));
    }
}
```

### 2.3 WebSocket STOMP

**WebSocket STOMP** permet la communication bidirectionnelle en temps réel avec Spring :

```java
// Backend - Contrôleur WebSocket
@Controller
@RequiredArgsConstructor
public class WebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final GpsService gpsService;
    
    @MessageMapping("/gps/update")
    public void handleGpsUpdate(@Payload GpsUpdateRequest request) {
        GpsResponse response = gpsService.updateGpsPosition(request);
        // Broadcast à tous les abonnés
        messagingTemplate.convertAndSend("/topic/gps-updates", response);
        // Notification spécifique au bus
        messagingTemplate.convertAndSend("/topic/bus/" + request.getBusId(), response);
    }
}

// Scheduler pour broadcast automatique
@Scheduled(fixedRate = 5000)
public void broadcastAllGpsPositions() {
    List<GpsResponse> positions = gpsService.getLatestPositions();
    messagingTemplate.convertAndSend("/topic/gps-updates", positions);
}
```

```typescript
// Frontend - Connexion STOMP avec SockJS
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const stompClient = new Client({
  webSocketFactory: () => new SockJS('http://localhost:4000/ws'),
  onConnect: () => {
    stompClient.subscribe('/topic/gps-updates', (message) => {
      const data = JSON.parse(message.body);
      updateBusPosition(data.busId, data.latitude, data.longitude);
    });
  }
});
stompClient.activate();
```

### 2.4 Mapbox GL JS

**Mapbox GL JS** est utilisé pour l'affichage des cartes :

```typescript
// Composant MapboxMap
const MapboxMap = ({ buses, onBusClick }) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-7.9811, 31.6295], // Marrakech
      zoom: 12
    })
    
    buses.forEach(bus => {
      new mapboxgl.Marker()
        .setLngLat([bus.longitude, bus.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${bus.bus_number}</h3>`))
        .addTo(map)
    })
  }, [buses])
}
```

---

## 3. Historique du transport au Maroc

Le transport urbain au Maroc a connu une évolution progressive depuis les années 1960. Initialement basé sur des bus classiques gérés par des sociétés publiques, le secteur s'est ouvert à la concurrence et à la privatisation dans les années 2000. Malgré l'introduction de nouveaux opérateurs et de bus modernes, la digitalisation des processus (suivi GPS, pointage électronique, gestion automatisée) reste très limitée. La majorité des opérations (pointage, contrôle, reporting) se fait encore manuellement, ce qui ralentit l'efficacité et la fiabilité du service. Ce projet s'inscrit dans une démarche de modernisation et d'alignement avec les standards internationaux du transport intelligent.

---

# CHAPITRE 2 : CONTEXTE GÉNÉRAL DU PROJET

## 1. Introduction

Ce chapitre présente le contexte général du projet, incluant la problématique identifiée, les objectifs à atteindre et la méthodologie adoptée pour le développement.

## 2. Présentation du projet

### 2.1 Problématique

Le secteur du transport public au Maroc souffre d'un retard technologique important. Dans de nombreuses villes, le pointage des bus et des conducteurs se fait encore manuellement, à l'aide de papier et de stylo. Cette méthode traditionnelle engendre non seulement des pertes de temps et des erreurs, mais favorise aussi les fraudes et les vols par les personnes en charge du contrôle. Ce manque de modernisation nuit à l'efficacité, à la transparence et à la fiabilité du service public. 

La solution proposée dans ce projet vise à répondre à cette problématique en introduisant une plateforme numérique de suivi en temps réel et d'automatisation du pointage grâce à l'intelligence artificielle (ANPR). Elle permet de fiabiliser le processus, de réduire les risques de fraude et d'améliorer la gestion globale de la flotte.

### 2.1 bis Historique du transport au Maroc

Le transport public au Maroc a connu plusieurs phases d'évolution. Dès le début du XXe siècle, les premières lignes de tramway et d'autobus ont été mises en place dans les grandes villes comme Casablanca et Rabat. Cependant, la modernisation du secteur a longtemps été freinée par le manque d'investissements et l'absence de digitalisation. Ce n'est qu'à partir des années 2010, avec l'arrivée de nouveaux opérateurs et l'introduction de technologies comme le tramway moderne, que le secteur a commencé à se transformer. Malgré ces avancées, la majorité des réseaux de bus reste encore gérée de façon traditionnelle, d'où la nécessité d'une solution innovante comme celle proposée dans ce projet.

### 2.2 Objectifs du projet

#### Objectifs principaux :
- Développer une application web permettant le suivi en temps réel des bus
- Créer des interfaces dédiées pour chaque type d'utilisateur
- Implémenter un système de communication en temps réel

#### Objectifs spécifiques :
| Objectif | Description |
|----------|-------------|
| Suivi GPS | Afficher la position des bus sur une carte interactive |
| Multi-rôles | Interfaces pour admin, conducteur et client |
| Temps réel | Mise à jour automatique sans rechargement |
| Gestion de flotte | Outils d'administration pour la flotte |
| Réservation | Système de réservation de tickets |

### 2.3 Solution proposée

Notre solution est un **système de suivi de bus en temps réel** comprenant :

1. **Application Web responsive**
   - Interface adaptée desktop et mobile
   - Carte interactive avec Mapbox

2. **Architecture multi-rôles**
   - Portail Administrateur
   - Portail Conducteur
   - Portail Client

3. **Backend robuste**
   - API RESTful
   - Communication WebSocket
   - Base de données relationnelle

## 3. Démarche et planification

### 3.1 La méthode SCRUM

Pour la gestion de ce projet, nous avons adopté la méthodologie **Agile SCRUM** qui permet :
- Un développement itératif et incrémental
- Une adaptation rapide aux changements
- Une livraison régulière de fonctionnalités

### 3.2 Pourquoi SCRUM ?

| Avantage | Application au projet |
|----------|----------------------|
| **Flexibilité** | Adaptation aux besoins changeants |
| **Visibilité** | Suivi clair de l'avancement |
| **Qualité** | Tests réguliers à chaque sprint |
| **Communication** | Échanges fréquents avec l'encadrant |

### 3.3 L'équipe et rôles

| Rôle | Responsabilité |
|------|----------------|
| **Product Owner** | Définition des besoins et priorités |
| **Scrum Master** | Facilitation du processus Scrum |
| **Développeur** | Conception et implémentation |

### 3.4 Identification du backlog des tâches

#### Sprint 1 : Configuration et Base
- Configuration de l'environnement de développement
- Mise en place de la base de données
- Création de l'architecture du projet

#### Sprint 2 : Authentification et Utilisateurs
- Système d'authentification JWT
- Gestion des rôles utilisateurs
- Pages de connexion et inscription

#### Sprint 3 : Fonctionnalités Core
- Intégration de la carte Mapbox
- Suivi GPS en temps réel
- Gestion de la flotte

#### Sprint 4 : Portails Utilisateurs
- Dashboard administrateur
- Portail conducteur
- Portail client

#### Sprint 5 : Service ANPR
- Développement du service Python FastAPI
- Intégration YOLOv8 pour la détection de plaques
- OCR pour la lecture des plaques marocaines
- Interface Check-in/Check-out

#### Sprint 6 : Finalisation
- Tests et corrections
- Optimisation des performances
- Documentation

### 3.5 Diagramme de Gantt

Le diagramme de Gantt ci-dessous présente la planification temporelle du projet :

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE GANTT - PROJET BUS TRACKING                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Tâches                    │ S1  │ S2  │ S3  │ S4  │ S5  │ S6  │ S7  │ S8  │ S9  │ S10 │ S11│ S12│
├───────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼────┼────┤
│ Analyse des besoins       │████ │████ │     │     │     │     │     │     │     │     │    │    │
│ Conception UML            │     │████ │████ │     │     │     │     │     │     │     │    │    │
│ Config. environnement     │     │     │████ │     │     │     │     │     │     │     │    │    │
│ Base de données           │     │     │████ │████ │     │     │     │     │     │     │    │    │
│ Backend Spring Boot       │     │     │     │████ │████ │████ │     │     │     │     │    │    │
│ Authentification JWT      │     │     │     │     │████ │████ │     │     │     │     │    │    │
│ Frontend Next.js          │     │     │     │     │     │████ │████ │████ │     │     │    │    │
│ Intégration Mapbox        │     │     │     │     │     │     │████ │████ │     │     │    │    │
│ WebSocket temps réel      │     │     │     │     │     │     │     │████ │████ │     │    │    │
│ Service ANPR Python       │     │     │     │     │     │     │     │     │████ │████ │████│    │
│ Interface Check-in/out    │     │     │     │     │     │     │     │     │     │████ │████│    │
│ Tests & Validation        │     │     │     │     │     │     │     │     │     │     │████│████│
│ Documentation             │     │     │     │     │     │     │     │     │     │     │████│████│
└───────────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴────┴────┘

Légende : ████ = Période d'exécution   S = Semaine
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de Gantt créé avec un outil comme Microsoft Project, GanttProject ou Monday.com]**

---

# CHAPITRE 3 : ANALYSE ET CONCEPTION

## 1. Introduction

Ce chapitre présente l'analyse et la conception du système à travers différents diagrammes UML. Ces modèles permettent de visualiser l'architecture et le fonctionnement de l'application.

## 2. Langage de modélisation

Nous utilisons **UML (Unified Modeling Language)** pour modéliser notre système. UML est un langage de modélisation graphique standardisé qui permet de :
- Visualiser la structure du système
- Spécifier les comportements attendus
- Construire les différents composants
- Documenter l'architecture

## 3. Diagramme de cas d'utilisation général

Le diagramme de cas d'utilisation général présente les interactions entre les acteurs et le système.

### Acteurs du système :

| Acteur | Description |
|--------|-------------|
| **Administrateur** | Gère la flotte, les utilisateurs et supervise le système |
| **Conducteur** | Conduit le bus, signale les incidents |
| **Client/Passager** | Consulte les positions des bus, réserve des tickets |
| **Système GPS** | Envoie les positions des véhicules |
| **Système ANPR** | Détecte et reconnaît les plaques d'immatriculation |

### Cas d'utilisation principaux :

```
┌─────────────────────────────────────────────────────────────────┐
│                    Système de Suivi de Bus                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Administrateur│───▶│ Gérer la flotte      │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Gérer les utilisateurs│                 │
│          │            ├──────────────────────┤                 │
│          │            │ Voir les statistiques │                 │
│          │            ├──────────────────────┤                 │
│          │            │ Gérer les routes      │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Superviser ANPR       │                 │
│                       ├──────────────────────┤                 │
│                       │ Voir Check-in/out    │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │  Conducteur  │───▶│ Commencer un trajet   │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Signaler un incident  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir son itinéraire   │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │    Client    │───▶│ Suivre un bus         │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Réserver un ticket    │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir les horaires     │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Système ANPR │───▶│ Détecter plaque       │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Enregistrer Check-in  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Enregistrer Check-out │                 │
│                       └──────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation créé avec un outil UML comme StarUML, Lucidchart ou draw.io]**

## 4. Diagramme de cas d'utilisation - ANPR Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│              Système ANPR - Check-in/Check-out                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐                                             │
│   │   Caméra     │                                             │
│   └──────┬───────┘                                             │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────────────┐                                     │
│   │ Capturer image       │                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Détecter plaque      │───▶│ YOLOv8 Model         │        │
│   │ (YOLOv8)             │    │ (best.pt)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Lire caractères      │───▶│ EasyOCR              │        │
│   │ (OCR)                │    │ (ar + en)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Parser format        │                                     │
│   │ marocain             │                                     │
│   │ (SÉRIE|LETTRE|RÉGION)│                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Enregistrer événement│                                     │
│   │ (CHECK_IN/CHECK_OUT) │                                     │
│   └──────────────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation ANPR créé avec un outil UML]**

## 4. Diagrammes de séquence

### 4.1 DS pour le cas d'utilisation : Authentification

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│ Client │          │ Frontend │          │ Backend  │          │   BD   │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ Saisir identifiants│                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ POST /api/auth/login│                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ SELECT user        │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │ Retour user        │
    │                    │                     │◀───────────────────│
    │                    │                     │                    │
    │                    │                     │ Vérifier password  │
    │                    │                     │ (bcrypt.compare)   │
    │                    │                     │                    │
    │                    │                     │ Générer JWT        │
    │                    │                     │                    │
    │                    │ {token, user}       │                    │
    │                    │◀────────────────────│                    │
    │                    │                     │                    │
    │                    │ Stocker token       │                    │
    │                    │ (localStorage)      │                    │
    │                    │                     │                    │
    │ Redirection        │                     │                    │
    │ selon rôle         │                     │                    │
    │◀───────────────────│                     │                    │
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence d'authentification]**

### 4.2 DS pour le cas d'utilisation : Mise à jour GPS en temps réel

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│  GPS   │          │ Backend  │          │WebSocket │          │ Client │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ POST /api/gps/update                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ Enregistrer position│                    │
    │                    │ dans BD             │                    │
    │                    │                     │                    │
    │                    │ sendToTopic         │                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ Broadcast STOMP   │
    │                    │                     │ message to subs   │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │                    │ Mettre à jour
    │                    │                     │                    │ la carte
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence de mise à jour GPS]**

### 4.3 DS pour le cas d'utilisation : Détection de plaque ANPR

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐          ┌────────┐
│ Caméra │          │ Frontend │          │  ANPR    │          │Backend │          │   BD   │
│        │          │          │          │ Service  │          │        │          │        │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘          └───┬────┘
    │                    │                     │                    │                    │
    │ Flux vidéo MJPEG   │                     │                    │                    │
    │───────────────────▶│                     │                    │                    │
    │                    │                     │                    │                    │
    │                    │ Capture frame       │                    │                    │
    │                    │────────────────────▶│                    │                    │
    │                    │                     │                    │                    │
    │                    │                     │ YOLOv8 détection  │                    │
    │                    │                     │ de plaque          │                    │
    │                    │                     │                    │                    │
    │                    │                     │ EasyOCR lecture   │                    │
    │                    │                     │ des caractères     │                    │
    │                    │                     │                    │                    │
    │                    │ {plate, confidence} │                    │                    │
    │                    │◀────────────────────│                    │                    │
    │                    │                     │                    │                    │
    │                    │ POST /api/gate-events                   │                    │
    │                    │──────────────────────────────────────── ▶│                    │
    │                    │                     │                    │                    │
    │                    │                     │                    │ INSERT gate_event │
    │                    │                     │                    │───────────────────▶│
    │                    │                     │                    │                    │
    │                    │                     │                    │ Confirmation      │
    │                    │                     │                    │◀───────────────────│
    │                    │                     │                    │                    │
    │                    │ {success: true}     │                    │                    │
    │                    │◀─────────────────────────────────────────│                    │
    │                    │                     │                    │                    │
    │                    │ Afficher résultat   │                    │                    │
    │                    │ sur l'interface     │                    │                    │
    │                    │                     │                    │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence ANPR créé avec un outil UML]**

## 5. Diagramme de classes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE CLASSES                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│        User          │       │       Driver         │
├──────────────────────┤       ├──────────────────────┤
│ - id: int            │       │ - id: int            │
│ - email: string      │◀──────│ - user_id: int (FK)  │
│ - password: string   │  1  1 │ - license_number: str│
│ - role: enum         │       │ - license_expiry: date│
│ - first_name: string │       │ - status: enum       │
│ - last_name: string  │       │ - rating: decimal    │
│ - phone: string      │       │ - total_trips: int   │
│ - is_active: boolean │       └──────────────────────┘
├──────────────────────┤                │
│ + login()            │                │ 1
│ + register()         │                │
│ + updateProfile()    │                │
└──────────────────────┘       ┌──────────────────────┐
         │                     │        Bus           │
         │ 1                   ├──────────────────────┤
         │                     │ - id: int            │
         │                     │ - bus_number: string │
         │                     │ - plate_number: str  │
         │                     │ - model: string      │
         │                     │ - capacity: int      │
         │                     │ - status: enum       │
         │                     │ - current_driver_id  │
         ├────────────────────▶│──────────────────────┤
         │                     │ + updateLocation()   │
         │                     │ + getStatus()        │
         │                     └──────────────────────┘
         │                               │
         │ 1                             │
         │                               ▼
┌──────────────────────┐       ┌──────────────────────┐
│       Ticket         │       │     RouteStop        │
├──────────────────────┤       ├──────────────────────┤
│ - id: int            │       │ - id: int            │
│ - ticket_number: str │       │ - route_id: int (FK) │
│ - user_id: int (FK)  │       │ - stop_name: string  │
│ - schedule_id: int   │       │ - stop_order: int    │
│ - seat_number: string│       │ - latitude: decimal  │
│ - fare: decimal      │       │ - longitude: decimal │
│ - status: enum       │       └──────────────────────┘
│ - qr_code: text      │                │
└──────────────────────┘                │ 1
                                        │
                                        ▼
                               ┌──────────────────────┐
                               │      Schedule        │
                               ├──────────────────────┤
                               │ - id: int            │
                               │ - route_id: int (FK) │
                               │ - bus_id: int (FK)   │
                               │ - driver_id: int (FK)│
                               │ - departure_time: dt │
                               │ - arrival_time: dt   │
                               │ - status: enum       │
                               └──────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de classes complet créé avec un outil UML]**

## 6. Diagramme d'activité - Processus Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│           DIAGRAMME D'ACTIVITÉ - CHECK-IN/CHECK-OUT             │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │     Début       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Démarrer Service│
                    │     ANPR        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Vérifier statut │
                    │   service IA    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              │              ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Service Online │      │     │ Service Offline│
     └───────┬────────┘      │     └───────┬────────┘
             │               │             │
             ▼               │             ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Activer caméra │      │     │ Afficher erreur│
     └───────┬────────┘      │     └───────┬────────┘
             │               │             │
             ▼               │             ▼
     ┌────────────────┐      │     ┌────────────────┐
     │ Capturer frame │      │     │     Fin        │
     └───────┬────────┘      │     └────────────────┘
             │               │
             ▼               │
     ┌────────────────┐      │
     │ Envoyer à ANPR │      │
     └───────┬────────┘      │
             │               │
             ▼               │
     ┌────────────────┐      │
     │ Plaque détectée│      │
     │      ?         │      │
     └───────┬────────┘      │
             │               │
      ┌──────┴──────┐        │
      │             │        │
      ▼             ▼        │
┌──────────┐  ┌──────────┐   │
│   Oui    │  │   Non    │   │
└────┬─────┘  └────┬─────┘   │
     │             │         │
     ▼             │         │
┌──────────────┐   │         │
│ Choisir type │   │         │
│ (IN/OUT)     │   │         │
└──────┬───────┘   │         │
       │           │         │
       ▼           │         │
┌──────────────┐   │         │
│ Enregistrer  │   │         │
│ gate_event   │   │         │
└───────┬───────┘   │         │
        │           │         │
        ▼           │         │
┌──────────────┐   │         │
│ Afficher     │◀──┘         │
│ résultat     │             │
└───────┬──────┘             │
        │                     │
        ▼                     │
┌──────────────┐             │
│ Continuer ?  │─────────────┘
└───────┬───────┘
        │
        ▼
┌──────────────┐
│     Fin      │
└──────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme d'activité créé avec un outil UML]**

## 7. Diagramme de déploiement

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DIAGRAMME DE DÉPLOIEMENT                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              << device >>                                        │
│                              Serveur Web                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐    │
│  │   << container >>  │    │   << container >>  │    │   << container >>  │    │
│  │    Frontend        │    │     Backend        │    │   ANPR Service     │    │
│  │    (Next.js)       │    │  (Spring Boot)     │    │   (FastAPI)        │    │
│  │    Port: 3000      │    │    Port: 4000      │    │   Port: 8001       │    │
│  └────────┬───────────┘    └────────┬───────────┘    └────────┬───────────┘    │
│           │                         │                         │                 │
│           │    REST API             │                         │                 │
│           │◀───────────────────────▶│                         │                 │
│           │                         │                         │                 │
│           │    WebSocket STOMP      │                         │                 │
│           │◀───────────────────────▶│                         │                 │
│           │                         │                         │                 │
│           │         REST API (Détection)                      │                 │
│           │◀─────────────────────────────────────────────────▶│                 │
│           │                         │                         │                 │
│           │         MJPEG Stream                              │                 │
│           │◀─────────────────────────────────────────────────▶│                 │
│           │                         │                         │                 │
└───────────┼─────────────────────────┼─────────────────────────┼─────────────────┘
            │                         │                         │
            │                         ▼                         │
            │              ┌────────────────────┐               │
            │              │   << database >>   │               │
            │              │      MySQL         │               │
            │              │    Port: 8889      │               │
            │              └────────────────────┘               │
            │                                                   │
            ▼                                                   ▼
┌────────────────────┐                              ┌────────────────────┐
│   << browser >>    │                              │   << device >>     │
│   Client Web       │                              │   Webcam/Caméra    │
│   (Chrome, Safari) │                              │   ANPR             │
└────────────────────┘                              └────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de déploiement créé avec un outil UML]**

## 6. Conclusion

L'analyse et la conception présentées dans ce chapitre nous permettent d'avoir une vision claire de :
- Les différents acteurs et leurs interactions avec le système
- Le flux de données pour les cas d'utilisation principaux
- La structure des données et les relations entre entités

Cette conception servira de base pour l'implémentation détaillée dans le chapitre suivant.

---

# CHAPITRE 4 : TECHNOLOGIES ET OUTILS UTILISÉS

## 1. Introduction

Ce chapitre présente en détail les technologies et outils utilisés pour le développement du système de suivi de bus. Le choix de ces technologies a été guidé par des critères de performance, de modernité et d'adéquation avec les besoins du projet.

## 2. Technologies utilisées

### Stack Technique Complet

| Catégorie | Technologie | Version | Usage |
|-----------|-------------|---------|-------|
| **Frontend** | Next.js | 16.0.3 | Framework React |
| **Frontend** | React | 19.2.0 | Bibliothèque UI |
| **Frontend** | TypeScript | 5.x | Typage statique |
| **Frontend** | Tailwind CSS | 4.1.17 | Styles CSS |
| **Frontend** | Mapbox GL JS | 3.4.0 | Cartographie |
| **Backend** | Spring Boot | 3.2.0 | Framework Java |
| **Backend** | Spring Security | 6.x | Sécurité |
| **Backend** | Spring Data JPA | 3.x | Persistance |
| **Backend** | WebSocket STOMP | - | Temps réel |
| **ANPR** | Python | 3.11 | Langage service ANPR |
| **ANPR** | FastAPI | 0.104.x | Framework API Python |
| **ANPR** | YOLOv8 | latest | Détection de plaques |
| **ANPR** | EasyOCR | latest | Reconnaissance caractères |
| **ANPR** | OpenCV | 4.x | Traitement d'images |
| **Base de données** | MySQL | 8.x | Stockage données |
| **Authentification** | JWT (jjwt) | 0.12.3 | Jetons d'accès sécurisés |
| **Build** | Maven | 3.9.x | Gestion des dépendances |
| **Tests E2E** | Selenium | 4.x | Tests automatisés UI |
| **Tests** | JUnit 5 | 5.x | Tests unitaires Java |
| **Qualité code** | SonarQube | Cloud | Analyse statique |

### 2.1 Next.js 16

**Next.js** est un framework React qui offre :

- **Server-Side Rendering (SSR)** : Améliore le SEO et les performances
- **App Router** : Système de routage moderne basé sur les dossiers
- **API Routes** : Création d'endpoints API intégrés
- **Turbopack** : Bundler ultra-rapide pour le développement

```typescript
// Exemple de structure App Router
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <DashboardShell />
}
```

### 2.2 Spring Boot 3.2

**Spring Boot** est le framework backend Java choisi pour :

- Son écosystème robuste et mature
- Spring Security pour la sécurisation des APIs
- Spring Data JPA pour la persistance des données
- Support natif de WebSocket avec STOMP

```java
// Structure du contrôleur REST
@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {
    
    private final BusService busService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses() {
        List<BusResponse> buses = busService.getAllBuses();
        return ResponseEntity.ok(ApiResponse.success(buses));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<BusResponse>> createBus(
            @Valid @RequestBody BusRequest request) {
        BusResponse bus = busService.createBus(request);
        return ResponseEntity.ok(ApiResponse.success("Bus créé", bus));
    }
}
```

### 2.3 WebSocket STOMP

**WebSocket STOMP** permet la communication bidirectionnelle en temps réel avec Spring :

```java
// Backend - Contrôleur WebSocket
@Controller
@RequiredArgsConstructor
public class WebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final GpsService gpsService;
    
    @MessageMapping("/gps/update")
    public void handleGpsUpdate(@Payload GpsUpdateRequest request) {
        GpsResponse response = gpsService.updateGpsPosition(request);
        // Broadcast à tous les abonnés
        messagingTemplate.convertAndSend("/topic/gps-updates", response);
        // Notification spécifique au bus
        messagingTemplate.convertAndSend("/topic/bus/" + request.getBusId(), response);
    }
}

// Scheduler pour broadcast automatique
@Scheduled(fixedRate = 5000)
public void broadcastAllGpsPositions() {
    List<GpsResponse> positions = gpsService.getLatestPositions();
    messagingTemplate.convertAndSend("/topic/gps-updates", positions);
}
```

```typescript
// Frontend - Connexion STOMP avec SockJS
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const stompClient = new Client({
  webSocketFactory: () => new SockJS('http://localhost:4000/ws'),
  onConnect: () => {
    stompClient.subscribe('/topic/gps-updates', (message) => {
      const data = JSON.parse(message.body);
      updateBusPosition(data.busId, data.latitude, data.longitude);
    });
  }
});
stompClient.activate();
```

### 2.4 Mapbox GL JS

**Mapbox GL JS** est utilisé pour l'affichage des cartes :

```typescript
// Composant MapboxMap
const MapboxMap = ({ buses, onBusClick }) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-7.9811, 31.6295], // Marrakech
      zoom: 12
    })
    
    buses.forEach(bus => {
      new mapboxgl.Marker()
        .setLngLat([bus.longitude, bus.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${bus.bus_number}</h3>`))
        .addTo(map)
    })
  }, [buses])
}
```

---

## 3. Historique du transport au Maroc

Le transport urbain au Maroc a connu une évolution progressive depuis les années 1960. Initialement basé sur des bus classiques gérés par des sociétés publiques, le secteur s'est ouvert à la concurrence et à la privatisation dans les années 2000. Malgré l'introduction de nouveaux opérateurs et de bus modernes, la digitalisation des processus (suivi GPS, pointage électronique, gestion automatisée) reste très limitée. La majorité des opérations (pointage, contrôle, reporting) se fait encore manuellement, ce qui ralentit l'efficacité et la fiabilité du service. Ce projet s'inscrit dans une démarche de modernisation et d'alignement avec les standards internationaux du transport intelligent.

---

# CHAPITRE 2 : CONTEXTE GÉNÉRAL DU PROJET

## 1. Introduction

Ce chapitre présente le contexte général du projet, incluant la problématique identifiée, les objectifs à atteindre et la méthodologie adoptée pour le développement.

## 2. Présentation du projet

### 2.1 Problématique

Le secteur du transport public au Maroc souffre d'un retard technologique important. Dans de nombreuses villes, le pointage des bus et des conducteurs se fait encore manuellement, à l'aide de papier et de stylo. Cette méthode traditionnelle engendre non seulement des pertes de temps et des erreurs, mais favorise aussi les fraudes et les vols par les personnes en charge du contrôle. Ce manque de modernisation nuit à l'efficacité, à la transparence et à la fiabilité du service public. 

La solution proposée dans ce projet vise à répondre à cette problématique en introduisant une plateforme numérique de suivi en temps réel et d'automatisation du pointage grâce à l'intelligence artificielle (ANPR). Elle permet de fiabiliser le processus, de réduire les risques de fraude et d'améliorer la gestion globale de la flotte.

### 2.1 bis Historique du transport au Maroc

Le transport public au Maroc a connu plusieurs phases d'évolution. Dès le début du XXe siècle, les premières lignes de tramway et d'autobus ont été mises en place dans les grandes villes comme Casablanca et Rabat. Cependant, la modernisation du secteur a longtemps été freinée par le manque d'investissements et l'absence de digitalisation. Ce n'est qu'à partir des années 2010, avec l'arrivée de nouveaux opérateurs et l'introduction de technologies comme le tramway moderne, que le secteur a commencé à se transformer. Malgré ces avancées, la majorité des réseaux de bus reste encore gérée de façon traditionnelle, d'où la nécessité d'une solution innovante comme celle proposée dans ce projet.

### 2.2 Objectifs du projet

#### Objectifs principaux :
- Développer une application web permettant le suivi en temps réel des bus
- Créer des interfaces dédiées pour chaque type d'utilisateur
- Implémenter un système de communication en temps réel

#### Objectifs spécifiques :
| Objectif | Description |
|----------|-------------|
| Suivi GPS | Afficher la position des bus sur une carte interactive |
| Multi-rôles | Interfaces pour admin, conducteur et client |
| Temps réel | Mise à jour automatique sans rechargement |
| Gestion de flotte | Outils d'administration pour la flotte |
| Réservation | Système de réservation de tickets |

### 2.3 Solution proposée

Notre solution est un **système de suivi de bus en temps réel** comprenant :

1. **Application Web responsive**
   - Interface adaptée desktop et mobile
   - Carte interactive avec Mapbox

2. **Architecture multi-rôles**
   - Portail Administrateur
   - Portail Conducteur
   - Portail Client

3. **Backend robuste**
   - API RESTful
   - Communication WebSocket
   - Base de données relationnelle

## 3. Démarche et planification

### 3.1 La méthode SCRUM

Pour la gestion de ce projet, nous avons adopté la méthodologie **Agile SCRUM** qui permet :
- Un développement itératif et incrémental
- Une adaptation rapide aux changements
- Une livraison régulière de fonctionnalités

### 3.2 Pourquoi SCRUM ?

| Avantage | Application au projet |
|----------|----------------------|
| **Flexibilité** | Adaptation aux besoins changeants |
| **Visibilité** | Suivi clair de l'avancement |
| **Qualité** | Tests réguliers à chaque sprint |
| **Communication** | Échanges fréquents avec l'encadrant |

### 3.3 L'équipe et rôles

| Rôle | Responsabilité |
|------|----------------|
| **Product Owner** | Définition des besoins et priorités |
| **Scrum Master** | Facilitation du processus Scrum |
| **Développeur** | Conception et implémentation |

### 3.4 Identification du backlog des tâches

#### Sprint 1 : Configuration et Base
- Configuration de l'environnement de développement
- Mise en place de la base de données
- Création de l'architecture du projet

#### Sprint 2 : Authentification et Utilisateurs
- Système d'authentification JWT
- Gestion des rôles utilisateurs
- Pages de connexion et inscription

#### Sprint 3 : Fonctionnalités Core
- Intégration de la carte Mapbox
- Suivi GPS en temps réel
- Gestion de la flotte

#### Sprint 4 : Portails Utilisateurs
- Dashboard administrateur
- Portail conducteur
- Portail client

#### Sprint 5 : Service ANPR
- Développement du service Python FastAPI
- Intégration YOLOv8 pour la détection de plaques
- OCR pour la lecture des plaques marocaines
- Interface Check-in/Check-out

#### Sprint 6 : Finalisation
- Tests et corrections
- Optimisation des performances
- Documentation

### 3.5 Diagramme de Gantt

Le diagramme de Gantt ci-dessous présente la planification temporelle du projet :

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE GANTT - PROJET BUS TRACKING                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Tâches                    │ S1  │ S2  │ S3  │ S4  │ S5  │ S6  │ S7  │ S8  │ S9  │ S10 │ S11│ S12│
├───────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼────┼────┤
│ Analyse des besoins       │████ │████ │     │     │     │     │     │     │     │     │    │    │
│ Conception UML            │     │████ │████ │     │     │     │     │     │     │     │    │    │
│ Config. environnement     │     │     │████ │     │     │     │     │     │     │     │    │    │
│ Base de données           │     │     │████ │████ │     │     │     │     │     │     │    │    │
│ Backend Spring Boot       │     │     │     │████ │████ │████ │     │     │     │     │    │    │
│ Authentification JWT      │     │     │     │     │████ │████ │     │     │     │     │    │    │
│ Frontend Next.js          │     │     │     │     │     │████ │████ │████ │     │     │    │    │
│ Intégration Mapbox        │     │     │     │     │     │     │████ │████ │     │     │    │    │
│ WebSocket temps réel      │     │     │     │     │     │     │     │████ │████ │     │    │    │
│ Service ANPR Python       │     │     │     │     │     │     │     │     │████ │████ │████│    │
│ Interface Check-in/out    │     │     │     │     │     │     │     │     │     │████ │████│    │
│ Tests & Validation        │     │     │     │     │     │     │     │     │     │     │████│████│
│ Documentation             │     │     │     │     │     │     │     │     │     │     │████│████│
└───────────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴────┴────┘

Légende : ████ = Période d'exécution   S = Semaine
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de Gantt créé avec un outil comme Microsoft Project, GanttProject ou Monday.com]**

---

# CHAPITRE 3 : ANALYSE ET CONCEPTION

## 1. Introduction

Ce chapitre présente l'analyse et la conception du système à travers différents diagrammes UML. Ces modèles permettent de visualiser l'architecture et le fonctionnement de l'application.

## 2. Langage de modélisation

Nous utilisons **UML (Unified Modeling Language)** pour modéliser notre système. UML est un langage de modélisation graphique standardisé qui permet de :
- Visualiser la structure du système
- Spécifier les comportements attendus
- Construire les différents composants
- Documenter l'architecture

## 3. Diagramme de cas d'utilisation général

Le diagramme de cas d'utilisation général présente les interactions entre les acteurs et le système.

### Acteurs du système :

| Acteur | Description |
|--------|-------------|
| **Administrateur** | Gère la flotte, les utilisateurs et supervise le système |
| **Conducteur** | Conduit le bus, signale les incidents |
| **Client/Passager** | Consulte les positions des bus, réserve des tickets |
| **Système GPS** | Envoie les positions des véhicules |
| **Système ANPR** | Détecte et reconnaît les plaques d'immatriculation |

### Cas d'utilisation principaux :

```
┌─────────────────────────────────────────────────────────────────┐
│                    Système de Suivi de Bus                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Administrateur│───▶│ Gérer la flotte      │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Gérer les utilisateurs│                 │
│          │            ├──────────────────────┤                 │
│          │            │ Voir les statistiques │                 │
│          │            ├──────────────────────┤                 │
│          │            │ Gérer les routes      │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Superviser ANPR       │                 │
│                       ├──────────────────────┤                 │
│                       │ Voir Check-in/out    │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │  Conducteur  │───▶│ Commencer un trajet   │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Signaler un incident  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir son itinéraire   │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │    Client    │───▶│ Suivre un bus         │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Réserver un ticket    │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Voir les horaires     │                 │
│                       └──────────────────────┘                 │
│                                                                 │
│   ┌──────────────┐    ┌──────────────────────┐                 │
│   │ Système ANPR │───▶│ Détecter plaque       │                 │
│   └──────────────┘    ├──────────────────────┤                 │
│          │            │ Enregistrer Check-in  │                 │
│          │            ├──────────────────────┤                 │
│          └───────────▶│ Enregistrer Check-out │                 │
│                       └──────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation créé avec un outil UML comme StarUML, Lucidchart ou draw.io]**

## 4. Diagramme de cas d'utilisation - ANPR Check-in/Check-out

```
┌─────────────────────────────────────────────────────────────────┐
│              Système ANPR - Check-in/Check-out                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐                                             │
│   │   Caméra     │                                             │
│   └──────┬───────┘                                             │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────────────┐                                     │
│   │ Capturer image       │                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Détecter plaque      │───▶│ YOLOv8 Model         │        │
│   │ (YOLOv8)             │    │ (best.pt)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐    ┌──────────────────────┐        │
│   │ Lire caractères      │───▶│ EasyOCR              │        │
│   │ (OCR)                │    │ (ar + en)            │        │
│   └──────────┬───────────┘    └──────────────────────┘        │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Parser format        │                                     │
│   │ marocain             │                                     │
│   │ (SÉRIE|LETTRE|RÉGION)│                                     │
│   └──────────┬───────────┘                                     │
│              │                                                  │
│              ▼                                                  │
│   ┌──────────────────────┐                                     │
│   │ Enregistrer événement│                                     │
│   │ (CHECK_IN/CHECK_OUT) │                                     │
│   └──────────────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de cas d'utilisation ANPR créé avec un outil UML]**

## 4. Diagrammes de séquence

### 4.1 DS pour le cas d'utilisation : Authentification

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│ Client │          │ Frontend │          │ Backend  │          │   BD   │
└───┬────┘          └────┬─────┘          └────┬─────┘          └───┬────┘
    │                    │                     │                    │
    │ Saisir identifiants│                     │                    │
    │───────────────────▶│                     │                    │
    │                    │                     │                    │
    │                    │ POST /api/auth/login│                    │
    │                    │────────────────────▶│                    │
    │                    │                     │                    │
    │                    │                     │ SELECT user        │
    │                    │                     │───────────────────▶│
    │                    │                     │                    │
    │                    │                     │ Retour user        │
    │                    │                     │◀───────────────────│
    │                    │                     │                    │
    │                    │                     │ Vérifier password  │
    │                    │                     │ (bcrypt.compare)   │
    │                    │                     │                    │
    │                    │                     │ Générer JWT        │
    │                    │                     │                    │
    │                    │ {token, user}       │                    │
    │                    │◀────────────────────│                    │
    │                    │                     │                    │
    │                    │ Stocker token       │                    │
    │                    │ (localStorage)      │                    │
    │                    │                     │                    │
    │ Redirection        │                     │                    │
    │ selon rôle         │                     │                    │
    │◀───────────────────│                     │                    │
    │                    │                     │                    │
```

**[📸 CAPTURE D'ÉCRAN À AJOUTER : Diagramme de séquence d'authentification]**

### 4.2 DS pour le cas d'utilisation : Mise à jour GPS en temps réel

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│  GPS   │          │ Backend  │          │WebSocket │          │