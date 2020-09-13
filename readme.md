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
    
**POST** /post - Create a post by user
  - **params**:
    - title: `String`
    - details: `String`
    - image: `String`

    Only `title` and `details` are compulsory. You can use this endpoint `/upload/profile` to upload image and use the url returned as the value for `image`.

**GET** /post - View all posts by a user

**GET** /post/:id - View a single post by a user.  
    The `:id` is the `_id` returned when you created the post or when you view all

**PUT**: /post/:id - Update a particular post by the user  
    Takes same param as when post is created

**DELETE**: /post/:id - Delete a particular post by a user