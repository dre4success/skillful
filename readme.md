## base url
http://iamskillful.dre4success.com:7657

**POST**: /signup -- sign user up

  - **params**:
    - password: `String`
    - email: `String`
    - firstname: `String`
    - lastname: `String`
    - phoneNumber: `String`
    - skill: `String`
    - interest: `String`
    - skill: `String`
    - bio: `String`
    - profilePicture: `String`

    The compulsory ones are `['password', 'email', 'firstname', 'lastname', 'phoneNumber']`

**POST**: /upload/profile - Upload profile image 
 - **param**:
    - profileImage: `File`
    
    It uploads an image and returns back the url which you can attach to profilePicture or any other place needing an image url.

**POST**: /login - Log user in
- **params**:
    - email: `String`
    - password: `String`

## The below are protected routes.
#### Meaning you have to put the token from login as authorization bearer token for subsequent requests 

**GET**: /user - Fetch a logged in user. Useful for when user refreshes and you don't have to log them in again.

**PUT**: /user - Update user's profile
  - **params**:
    - firstname: `String`
    - lastname: `String`
    - interest: `String`
    - bio: `String`
    - skill: `String`
    - profilePicture: `String`

    They are not compulsory fields, but user can update anyone of them
    
        
    
