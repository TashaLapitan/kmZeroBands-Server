

# zero kilometer bands



The mission of our app is to promote your local amateur music bands. Find a band that best fits your preferences and arrange a private gig. Bands or single performers can create and advertise their profile and proactively search for available requests on the gig board.



## User Stories

* As a user, I want to be able to log in on the login page
* As a user, I want to be able to sign into my account on the signup page
* As a user, I want to be able to log out from the navbar
* As a band POC, I want to be able to create a band profile page by filling in an intuitive form on my profile page
* As a band POC, I want to be able to edit my band info on my band profile page
* As a band POC, I want to be able to view available gigs on the gig board
* As a client, I want to be able to search for local bands in a given area on the homepage
* As a client, I want to be able to post custom gig advertisements on a gig board



## Client / Frontend

## React Router Routes (React App)



| Path         | Component     | Permission                 | Behavior                                                     |
| ------------ | ------------- | -------------------------- | ------------------------------------------------------------ |
| /            | Homepage      | Public  `<Route>`          | Home Page                                                    |
| /signup      | Signup        | Anon only `<AnonRoute>`    | Signup form, link to login, navigate to profile page after signup |
| /login       | Login         | `Anon only ` `<AnonRoute>` | Login form, link to signup, navigate to profile page after login |
| /myprofile   | ProfilePage   | User only `<PrivateRoute>` | User profile and band profile page, link to add a band       |
| /addgig      | AddGigPage    | User only `<PrivateRoute>` | Add gig form, on submission navigate to gig board            |
| /search      | SearchResults | Public  `<Route>`          | Display band search results, link to each band, link to add gig |
| /band/:title | BandPage      | Public  `<Route>`          | Band profile page                                            |
| /gigboard    | GigBoard      | Public  `<Route>`          | Gig board                                                    |
| /faq         | FAQ           | Public  `<Route>`          | Frequently asked questions                                   |







# Server / Backend

Models:

User model:

```
{
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: String,
    image: String,
    dateOfBirth: String,
    phoneNumber: [String],
    isBandPOC: {type: Boolean, default: false},
    bands: [{type: Schema.Type.ObjectId, ref:"Band"}],
    gigHistory: [{type: Schema.Type.ObjectId, ref:"Gig"}]
}
```



Band model:

```
{
    title: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: [String],
    genres: [String],
    phoneNumber: [String],
    contactInfo: {type: String, required: true},
    instagramUrl: [String],
    youtubeUrl: [String],
    pocID: {type: Schema.Type.ObjectId, ref:"User"},
    gigsHistory: [{type: Schema.Type.ObjectId, ref:"Gig"}],
    pricePerHour: Number,
    canCustomizePlaylist: Boolean,
    minNoticePeriod: Number
}
```



Gig model:

```
{
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {String},
    genres: [String],
    client: {type: Schema.Type.ObjectId, ref:"User"},
    band: {type: Schema.Type.ObjectId, ref:"Band"},
    pricePerHour: Number,
    isPending: Boolean
}
```



## API Endpoints (backend routes)



| HTTP Method | URL              | Request Body            | Success Status | Error Status | Description                                                  |
| ----------- | ---------------- | ----------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| `GET`       | `/auth/me`       | Saved session           | 200            | 404          | Check if user is logged in                                   |
| `POST`      | `/auth/signup`   | {name, email, password} | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| `POST`      | `/auth/login`    | {username, password}    | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| `GET`       | `/auth/logout`   | (empty)                 | 204            | 400          | Logs out the user                                            |
| `GET`       | `/api/user/:id`  | {id}                    |                |              | Get user info                                                |
| `PUT`       | `/api/user/:id`  | {user document}         | 201            | 400          | Edit user document                                           |
| `DELETE`    | `/api/user/:id`  | {id}                    | 200            | 400          | Delete user                                                  |
| `GET`       | `/api/bands`     |                         | 200            | 500          | Show all bands                                               |
| `GET`       | `/api/bands/:id` | {id}                    | 200            | 500          | Show one band by id                                          |
| `POST`      | `/api/bands`     | {band document}         | 201            | 500          | Add new band to the DB                                       |
| `PUT`       | `/api/bands/:id` | {band document}         | 200            | 500          | Edit band info                                               |
| `DELETE`    | `/api/bands/:id` | {id}                    | 202            | 500          | Delete band                                                  |
| `GET`       | `/api/gigs`      |                         | 201            | 400          | Return all gigs                                              |
| `GET`       | `/api/gigs/:id`  | {id}                    | 201            | 400          | Return one gig by id                                         |
| `POST`      | `/api/gigs`      | {gig document}          | 200            | 400          | Create and save new gig                                      |
| `PUT`       | `/api/gigs/:id`  | {gig document}          | 200            | 400          | Edit gig                                                     |
| `DELETE`    | `/api/gigs/:id`  | {id}                    | 200            | 400          | Delete gig                                                   |



## MVP:

* Authentication
* Search for bands (homepage)
* Search results page
* Band Page
* Post a gig Page
* Gig board page
* Edit, view and removal of user profile
* Creation, edit, view and removal of band profile
* FAQ



## Backlog:

* More detailed custom playlist section and search accordingly

* In-app messenger 

* Reviews

  



[User Flow](https://balsamiq.cloud/s568m02/p11kwen/r2278)

[Kanban](https://trello.com/b/1pM9kkIa/kmzeromusic)