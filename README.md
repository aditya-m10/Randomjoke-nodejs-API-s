# Nodejs Random joke api with user authentication

##NOTE:-
In this project JWTToken authorization is used which have expiry time. jwt cant be destroyed ,it is removed from the browser for logout and and generated for login through browser. so for early logout  flag is used in this code .


## Run
### Install Packages 
### `npm install`

### Start server 
#### `nodemon`

## REST APIs
### Users
### `User signup  -     POST     /api/users/signup`
### `User login   -     POST     /api/users/login `
### `View profile -     GET     /api/users/me`
### `User logout  -     POST    /api/users/logout`
### Random joke 
### `Random joke  -  GET     /api/random-joke`
