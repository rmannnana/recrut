# Recrut — Gestions d'évènement

L'application a pour objectif de permettre la publication des évènements et la gestion des inscriptions des participants.

---

## Stack technique
### Le projet construit sur un projet déà existant : Kynetic

| Outil | Version | Rôle |
|---|---|---|
| NestJS | 11.0.21 | Framework backend |
| Prisma | 6.19.3 | ORM |
| PostgreSQL | 16 | Base de données |
| Docker | - | Conteneurisation de la DB |
| Passport.js | - | Stratégies d'authentification |
| JWT | - | Gestion des tokens |

---

## Endpoints disponibles
### _Les endpoint attendus pour le projet seront ajoutés aux endpoints déjà fournis par Kynetic_
### Mais pour avoir "api" au debut de chaque requête comme demandé dans les consignes, j'ai ajouté la ligne
```bash
    app.setGlobalPrefix('api');
```
dans main.ts.

### Authentification

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| POST | `/api/auth/register` | Créer un compte | Non |
| POST | `/api/auth/login` | Se connecter | Non |
| POST | `/api/auth/refresh` | Renouveler l'access token | Non |
| POST | `/api/auth/logout` | Se déconnecter | Non |
| GET | `/api/auth/google` | Lancer le flux Google OAuth | Non |
| GET | `/api/auth/google/callback` | Callback Google OAuth | Non |

### Utilisateurs

| Méthode | Route | Description | Rôle requis |
|---|---|---|---|
| GET | `/api/users/:id` | Récupérer un utilisateur | Tout utilisateur connecté |
| PATCH | `/api/users/:id/role` | Modifier le rôle d'un utilisateur | ADMIN uniquement |

Toutes les routes `/users` nécessitent le header :
```
Authorization: Bearer <access_token>
```

---

## Modèle de données
### Les modèles Events et Inscript seront ajouté aux modèles déjà existants de Kynetic
### Pour la entre User et Inscription, j'ai ajouter cette ligne au modèle User:
```bash
  inscriptions  Inscription[]
```

### User

| Champ | Type | Description |
|---|---|---|
| id | String (UUID) | Identifiant unique |
| email | String | Email unique |
| password | String? | Mot de passe hashé (null si OAuth) |
| role | Enum | USER, MODERATOR, ADMIN |
| googleId | String? | ID Google (null si email/password) |
| createdAt | DateTime | Date de création |
| updatedAt | DateTime | Date de mise à jour |

### RefreshToken

| Champ | Type | Description |
|---|---|---|
| id | String (UUID) | Identifiant unique |
| token | String | Token UUID unique |
| userId | String | Référence vers l'utilisateur |
| expiresAt | DateTime | Date d'expiration |
| createdAt | DateTime | Date de création |

### Event

| Champ | Type | Description |
|---|---|---|
| id | String (UUID) | Identifiant unique |
| title | String | 100 caractères max |
| description | String? | Description optionnelle |
| date | DateTime | 2025-11-15T18:00:00Z |
| location | String | Lieu obligatoire |
| capacity | int | Obligatoire et superieur à zéro |
| createdAt | DateTime | Date de création de l'évènement |

### Inscription

| Champ | Type | Description |
|---|---|---|
| id | String (UUID) | Identifiant unique |
| eventId | String (UUID) | référence à l'évènement |
| firstName | String | prénom de l'utilisateur |
| lastName | String | nom de l'utilisateur |
| email | String | email unique |
| registeredAt | DateTime | Date de d'inscription |

#### Après l'ajout des modèles:
```bash
    npx prisma migrate dev --name ajout-event-inscription
```
#### Pour que ce soit pris en compte dans la base de données.

---

## Stockage
### La base de données est dans un conteneur dont les informations sont renseigné dans docker-compose.yml
### Il s'agit d'une base de données PostgreSQL, mais toutes autre BD de type SQL peut être utilisée.
### _Pour générer et migration le modèle de données vers la base de données:_
```bash
    npx prisma generate
    docker compose up -d  /// Parce qu'on utilise un conteneur Docker pour la base de données PostgreSQL.
    npx prisma migrate dev --name init
```


## Sécurité
### _Ce sont les même techniques de sécurité de Kynetic_

- **Helmet** : headers de sécurité HTTP appliqués globalement
- **Rate limiting** : 20 requêtes/minute sur toutes les routes, 10 requêtes/minute sur les routes d'authentification
- **Validation** : tous les body de requête sont validés via `class-validator`, les champs non déclarés sont rejetés
- **Passwords** : hashés avec bcrypt (10 rounds)
- **Refresh tokens** : stockés en base, révocables à tout moment, expiration à 7 jours

---

## Ajout du module events

Pour la création et la gestion d'évènements :

```bash
nest g module events
nest g service events
nest g controller events
```
