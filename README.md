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

### Authentification

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| POST | `/auth/register` | Créer un compte | Non |
| POST | `/auth/login` | Se connecter | Non |
| POST | `/auth/refresh` | Renouveler l'access token | Non |
| POST | `/auth/logout` | Se déconnecter | Non |
| GET | `/auth/google` | Lancer le flux Google OAuth | Non |
| GET | `/auth/google/callback` | Callback Google OAuth | Non |

### Utilisateurs

| Méthode | Route | Description | Rôle requis |
|---|---|---|---|
| GET | `/users/:id` | Récupérer un utilisateur | Tout utilisateur connecté |
| PATCH | `/users/:id/role` | Modifier le rôle d'un utilisateur | ADMIN uniquement |

Toutes les routes `/users` nécessitent le header :
```
Authorization: Bearer <access_token>
```

---

## Modèle de données
### Les modèles Events et Inscript seront ajouté aux modèles déjà existants de Kynetic

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
---

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
