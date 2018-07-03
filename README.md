### google-places-app
Microservice for searching places using Google api

### Minimum Requirement
> Nodejs v8.0.0
> MongoDB
> Redis

### Development Tools
> Eslint
> Nodemon
> Git

### Setup codebase

> git clone https://github.com/shishir99111/google-places-app.git
> cd google-places-app
> npm install
> create .env file
    ```
    NODE_ENV=staging
    PORT=5520

    ### MongoDB Configuration ######
    DB_URI=localhost
    DB_NAME=hdfc-assignment-staging

    ### Redis Configuration #########
    ### Session expiry set to 1 month for development 60*60*24*30 ###
    REDIS_CONNECTION_URL=redis://127.0.0.1:6379
    REDIS_PASSWORD=<YOUR REDIS PASSWORD>
    REDIS_UNIX_SOCKET=<PATH FOR "redis.sock" HERE>
    REDIS_SESSION_EXPIRY_TIME=2592000

    # Google Places Configuration
    GOOGLE_PLACES_KEY=<YOUR GOOGLE PLACES KEY>

    ## UUID SHA1 Custom Namespace for Hashing
    SHA1_NAMESPACE=bf6ccc8a-146b-4cfc-b413-ba2bf5fe4000
    ```
> create Database with default user.
> mongo
> use hdfc-assignment-staging
> db.getCollection('users').insert({
    "name" : "System User",
    "email" : "system@example.com",
    "password" : "$2a$10$gxlwDUQEWHD15vAci1ct6.se7HzFd2DZLiKHPOm9/5AAq22czTYdC",
    "is_active" : true
})
this is a sample user with credentials (email/password) as (system@example.com/system@123).

> node index.js

## Routes:
Base URL: `/hdfc-api/${NODE_ENV}/v1`

- POST /authentication :
Get authenticated to generate token to access secured routes.
- GET /places :
Gets the places as result for the keyword passed.
- GET /searches :
Get search history of the user.
- /user/logout:
  To invalidate the session token for access.
- GET /ping
  API to listen the Heartbeat.

### Authentication Mechanism
Having simple username/password based authentication api which returns a token on successfull attempt of authentication. This is token is unique everytime which is generated using the power of UUID Library.

Utilised the Redis InMemory DataStore for the Session Management. For every session, Its data is stored in Redis having Token generated via UUID V5 Library as key and user related data as Value, having configured a TTL of Sesion Time to avoid bottlenecking of Memory and implement session expiry as well as session refresh.
As with every new request coming in with a particular token its TTL gets extended by specific amount of time.

### Log Management:

Library Used: Winston, Morgan, Winston-daily-rotate-file.
Logging Levels: levels: {
                            error: 0,
                            warn: 1,
                            info: 2,
                            debug: 3,
                        },
There are two main Transport Configured for Logging.
    - Console: For Development, Staging Environment.
    - File Based: For Development as well as Production Environment.

Co-relation ID is maintained for the mapping of Requst and Response. EveryDay new file is generated for the generated logs and added into it inside /log folder in Project Working Directory.

### Data Modelling and Database Structure

Please refer to the '/model' directory for the Schema. Have utilised the Mongoose ORM Library to generate the Schema.
Collections: user, place.
### Error Handling

Library Used: Boom, Joi Validate.
All the Errors are handled centrally at handleError middleware. Utilised the Boom Library for the standard Error Response with for maintaining proper Error Codes.
Joi Library for the Input Validation and Error Responses if the Request Input doesn't matches the validation.