# KUMA App API
This is the API for KUMA Application API. It's a RESTful API that provides access to the users, profile, and moods.

## Build
- Node.js
- Express
- MySQL
- Bcrypt
- JWT Token
- UUID
- Axios

## Installation

Below is the first step consist of instruction on installing and setting up your app.

Install NPM Package
```bash
  npm install 
```
Setting package.json
```bash
  npm init
```
Install Express.js 
```bash
  npm install express
```
Install MySQL database
```bash
  npm install mysql
```
Install Bcrypt
```bash
  npm install bcryptjs
```
Install JWT Token
```bash
  npm install jsonwebtoken
```
Install UUID
```bash
  npm install uuid
```
Install Axios
```bash
  npm install axios
```
To start the server
```bash
  npm <entry-file>
```


## API Endpoints

Base URL : http://localhost:8080

Deployment URL : https://kuma-capstone.et.r.appspot.com (Using JWT Token)

#### User 

| Endpoint | Parameter | Method    | Description                |
| :--------|:-------- | :------- | :------------------------- |
| /api/register |`-` | `POST` | Register New Email User |
| /api/login|`id`| `POST` | Login Email User  |
| /api/user-image|`id`      | `POST` | Upload User Image Profile |
| /api/update-user|`id`| `PUT` | Update User Profile |

Usage
```http
  POST /api/register
```
Response
```bash
{
    "error": false,
    "message": "Registration Successful"
}
```
Usage
```http
  POST /api/login
```
Response
```bash
{
    "error": false,
    "message": "success",
    "signinResult": {
        "userId": "<uuid>",
        "email": "testlag123@gmail.com",
        "name": "testing123",
        "token": "<jwttoken>"
    }
}
```
Usage
```http
  POST /api/user-image
```
Response
```bash
{
    "error": true,
    "message": "No image file provided"
} 

Note : You must include photo to upload. The photo will be store in Cloud Storage Bucket
```
Usage
```http
  PUT /api/update-user
```
Response
```bash
{
    "error": false,
    "message": "User updated successfully"
}
```


#### Moods
| Endpoint | Parameter | Method    | Description                |
| :--------|:-------- | :------- | :------------------------- |
| /api/new-mood-entry |`id` | `POST` | Entry New Mood for check-in|
| /api/get-mood-byId |`id`| `GET` | Get All Moods by Spesific User Id |

Usage
```http
  POST /api/new-mood-entry
```
Response
```bash
{
    "error": false,
    "message": "success",
    "uploadResult": {
        "id": 85,
        "date": "2023-06-15",
        "sub_mood": "Excited",
        "activities": "Home",
        "story": "So happy today",
        "userId": "<uuid>",
        "prediction": 3
    }
}
```
Usage
```http
  GET /api/get-mood-byId
```
Response
```bash
{
    "error": false,
    "message": "success",
    "moodResult": [
        {
            "id": 33,
            "userId": "<uuid>",
            "date": "2023-06-11",
            "sub_mood": "Excited",
            "activities": "Home",
            "story": "i'm so sleepy today",
            "prediction": "2",
            "created_at": "2023-06-11T06:08:17.000Z"
        },
        {
            "id": 69,
            "userId": "<uuid>",
            "date": "2023-06-11",
            "sub_mood": "Excited",
            "activities": "Home",
            "story": "i'm so sleepy today",
            "prediction": "1",
            "created_at": "2023-06-13T05:36:28.000Z"
        },
        {
            "id": 85,
            "userId": "<uuid>",
            "date": "2023-06-15",
            "sub_mood": "Excited",
            "activities": "Home",
            "story": "So happy today",
            "prediction": "3",
            "created_at": "2023-06-15T04:41:54.000Z"
        }
    ]
}
```
