## base url
http://iamskillful.dre4success.com:7657/api

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

**POST**: /login: Log user in
- **params**:
    - email: `String`
    - password: `String`
    
        
    
