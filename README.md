
# JAKAS Backend

This repository facilitates the backend of JAKAS Application, including a pre-trained machine learning model designed for angkot fare prediction. Developed using Node.js, it utilizes several libraries and technologies to deliver the necessary functionality. 

## Usage
### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Jakas-Technologies/JAKAS-backend.git
   ```

2. **Install Node Modules:**
   ```bash
   npm install
   ```

3. **Create .env File:**
   Duplicate the `.env.example` file and name it `.env`. Fill in the configuration values according to your requirements.
   ```env
   # Example .env

   # GCP API Key
   GOOGLE_API_KEY=your_api_key_here

   # JWT Secret Keys
   ACCESS_TOKEN_SECRET=your_secret_key
   REFRESH_TOKEN_SECRET=your_secret_key

   # Database Connection
   DB_USERNAME='your_database_username'
   DB_PASSWORD='your_database_password'
   DB_DATABASE='your_database_name'
   DB_HOST='your_database_host'
   DB_DIALECT='your_database_dialect'

   # Payment Gateway Server Key
   MIDTRANS_SERVER_KEY='your_midtrans_server_key'
   ```
    

4. **Run the Application:**
   ```bash
   npm run devStart
   ```

   The application can now be accessed at `http://localhost:3000`.

### Accessing Endpoint

Once the server is running, you can access the endpoints of the application.

#### POST /jakas/api/user/register

Submit a POST request with user data.

Request:
```json
{
    "name": "jakas user",
    "age": 15,
    "email": "user1@email.com",
    "password": "pass1"
}

```

Response:
```json
{
    "success": true,
    "message": "user successfully created",
    "user": {
        "id": 1,
        "name": "jakas user",
        "age": 15,
        "userType": "Student",
        "email": "user1@email.com",
        "password": "<encrypted password>",
        "updatedAt": "2023-12-18T21:44:45.887Z",
        "createdAt": "2023-12-18T21:44:45.887Z",
        "accessToken": null,
        "refreshToken": null
    }
}
```

#### POST /jakas/api/driver/register

Submit a POST request with driver data.

Request:
```json
{
    "name": "jakas driver",
    "age": 36,
    "licensePlate": "1234ABC",
    "routeName": "Cicaheum-Ciroyom",
    "email": "driver1@email.com",
    "password": "word1"
}

```

Response:
```json
{
    "success": true,
    "message": "user successfully created",
    "user": {
        "id": 1,
        "name": "jakas driver",
        "age": 36,
        "licensePlate": "1234ABC",
        "routeName": "Cicaheum-Ciroyom",
        "routeId": 1,
        "email": "driver1@email.com",
        "password": "<encrypted password>",
        "updatedAt": "2023-12-19T06:32:54.692Z",
        "createdAt": "2023-12-19T06:32:54.692Z",
        "accessToken": null,
        "refreshToken": null
    }
}
```
#### POST /jakas/api/user/login and /jakas/api/driver/login

Submit a POST request with login information.

Request:
```json
{
    "email": "user1@email.com",
    "password": "pass1"
}

```

Response:
```json
{
    "success": true,
    "message": "login successful",
    "user": {
        "id": 1,
        "name": "jakas user",
        "age": 15,
        "userType": "Student",
        "email": "user1@email.com",
        "password": "$2b$10$ujRgY1npp0Mgdsr1q1I1t.KMD01p7i0Zy8kIh7rXM3Yr47BAwjVJG",
        "accessToken": null,
        "refreshToken": null,
        "createdAt": "2023-12-18T21:44:45.887Z",
        "updatedAt": "2023-12-20T04:36:46.050Z"
    },
    "accessToken": "<generated token>",
    "refreshToken": "<generated token>"
}
```

The database will be updated with the tokens values

#### POST /jakas/api/track/getJurusan

Submit a POST request with origin and destination coordinates and also the route name (jurusan).

Request:
```json
{
    "location": [
        [-6.8844557076610755, 107.60639617679556],  // originLng, originLat
        [-6.900212281711285, 107.59926836517025]    // destinationLng, destinationLat
    ]
}
```

The response will show all available angkot from that route (jurusan).

Response:
```json
{
    "success": true,
    "message": "location is within the routes",
    "drivers": [
        {
            "id": 3,
            "name": "jakas driver 3",
            "age": 52,
            "licensePlate": "9101GHI",
            "routeName": "Cicaheum-Ciroyom",
            "routeId": 1,
            "email": "driver3@email.com",
            "password": "$2b$10$0lH2tv4ns.qJ4yJtS11N3eYOrdvBAcbLIILbDhtOWm04wQ9Cz9GAS",
            "accessToken": null,
            "refreshToken": null,
            "createdAt": "2023-12-20T11:28:58.357Z",
            "updatedAt": "2023-12-20T11:28:58.357Z"
        },
        {
            "id": 1,
            "name": "jakas driver 1",
            "age": 42,
            "licensePlate": "1234ABC",
            "routeName": "Cicaheum-Ciroyom",
            "routeId": 1,
            "email": "driver2@email.com",
            "password": "$2b$10$Y8bZ9SV57uQ4Cl3lkQib5urdt5gJaLLUG52c2gKRe.z63qUBiZfm6",
            "accessToken": null,
            "refreshToken": null,
            "createdAt": "2023-12-20T11:26:13.891Z",
            "updatedAt": "2023-12-20T13:09:52.015Z"
        }
    ]
}
```

#### POST /jakas/api/fare/predict

Submit a POST request with data including origin and destination coordinates.

Request:
```json
{
   "originLat": -6.907192649564511,
   "originLng": 107.56701380695162,
   "destinationLat": -6.897920894672473,
   "destinationLng": 107.59286315024411,
   "passengerType": "Student"
}

```

Response:
```json
{
    "status": "OK",
    "data": {
        "passengerType": "Student",
        "distance": 5517,
        "fare": 4000,
        "fuelPrice": 10000
    }
}
```