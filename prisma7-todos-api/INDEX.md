# 📖 Collection Index

Welcome to the **Prisma7 Todos API** Bruno Collection! This index provides a complete overview of all available endpoints.

## 📁 Collection Contents

### Configuration Files

- `bruno.json` - Collection configuration
- `environments/Development.bru` - Local development settings
- `environments/Production.bru` - Production settings

### Documentation Files

- `README.md` - Complete usage guide
- `QUICK_REFERENCE.md` - Quick lookup reference
- `CHANGELOG.md` - Version history
- `INDEX.md` - This file

---

## 🔗 All Endpoints (31 Total)

### 👥 Users (5 endpoints)

| #   | Method | Endpoint     | Description                | File                       |
| --- | ------ | ------------ | -------------------------- | -------------------------- |
| 1   | GET    | `/users`     | List all users (paginated) | `Users/Get All Users.bru`  |
| 2   | GET    | `/users/:id` | Get user by ID             | `Users/Get User by ID.bru` |
| 3   | POST   | `/users`     | Create new user            | `Users/Create User.bru`    |
| 4   | PUT    | `/users/:id` | Update user                | `Users/Update User.bru`    |
| 5   | DELETE | `/users/:id` | Delete user                | `Users/Delete User.bru`    |

**Key Features:**

- Search by name, username, or email
- Includes related posts, albums, todos, and comments
- Cascading deletes

---

### 📝 Posts (5 endpoints)

| #   | Method | Endpoint     | Description                | File                       |
| --- | ------ | ------------ | -------------------------- | -------------------------- |
| 6   | GET    | `/posts`     | List all posts (paginated) | `Posts/Get All Posts.bru`  |
| 7   | GET    | `/posts/:id` | Get post by ID             | `Posts/Get Post by ID.bru` |
| 8   | POST   | `/posts`     | Create new post            | `Posts/Create Post.bru`    |
| 9   | PUT    | `/posts/:id` | Update post                | `Posts/Update Post.bru`    |
| 10  | DELETE | `/posts/:id` | Delete post                | `Posts/Delete Post.bru`    |

**Key Features:**

- Filter by userId
- Search by title or body
- Includes user info and comments

---

### 💬 Comments (5 endpoints)

| #   | Method | Endpoint        | Description                   | File                             |
| --- | ------ | --------------- | ----------------------------- | -------------------------------- |
| 11  | GET    | `/comments`     | List all comments (paginated) | `Comments/Get All Comments.bru`  |
| 12  | GET    | `/comments/:id` | Get comment by ID             | `Comments/Get Comment by ID.bru` |
| 13  | POST   | `/comments`     | Create new comment            | `Comments/Create Comment.bru`    |
| 14  | PUT    | `/comments/:id` | Update comment                | `Comments/Update Comment.bru`    |
| 15  | DELETE | `/comments/:id` | Delete comment                | `Comments/Delete Comment.bru`    |

**Key Features:**

- Filter by postId or userId
- Search by name, email, or body
- Includes post and user info

---

### 📚 Albums (5 endpoints)

| #   | Method | Endpoint      | Description                 | File                         |
| --- | ------ | ------------- | --------------------------- | ---------------------------- |
| 16  | GET    | `/albums`     | List all albums (paginated) | `Albums/Get All Albums.bru`  |
| 17  | GET    | `/albums/:id` | Get album by ID             | `Albums/Get Album by ID.bru` |
| 18  | POST   | `/albums`     | Create new album            | `Albums/Create Album.bru`    |
| 19  | PUT    | `/albums/:id` | Update album                | `Albums/Update Album.bru`    |
| 20  | DELETE | `/albums/:id` | Delete album                | `Albums/Delete Album.bru`    |

**Key Features:**

- Filter by userId
- Search by title
- Includes all photos in album

---

### 📸 Photos (5 endpoints)

| #   | Method | Endpoint      | Description                 | File                         |
| --- | ------ | ------------- | --------------------------- | ---------------------------- |
| 21  | GET    | `/photos`     | List all photos (paginated) | `Photos/Get All Photos.bru`  |
| 22  | GET    | `/photos/:id` | Get photo by ID             | `Photos/Get Photo by ID.bru` |
| 23  | POST   | `/photos`     | Create new photo            | `Photos/Create Photo.bru`    |
| 24  | PUT    | `/photos/:id` | Update photo                | `Photos/Update Photo.bru`    |
| 25  | DELETE | `/photos/:id` | Delete photo                | `Photos/Delete Photo.bru`    |

**Key Features:**

- Filter by albumId
- Search by title
- Includes album and user info

---

### ✅ Todos (6 endpoints)

| #   | Method | Endpoint            | Description                | File                       |
| --- | ------ | ------------------- | -------------------------- | -------------------------- |
| 26  | GET    | `/todos`            | List all todos (paginated) | `Todos/Get All Todos.bru`  |
| 27  | GET    | `/todos/:id`        | Get todo by ID             | `Todos/Get Todo by ID.bru` |
| 28  | POST   | `/todos`            | Create new todo            | `Todos/Create Todo.bru`    |
| 29  | PUT    | `/todos/:id`        | Update todo                | `Todos/Update Todo.bru`    |
| 30  | PATCH  | `/todos/:id/toggle` | Toggle completion status   | `Todos/Toggle Todo.bru`    |
| 31  | DELETE | `/todos/:id`        | Delete todo                | `Todos/Delete Todo.bru`    |

**Key Features:**

- Filter by userId or completed status
- Search by title
- Quick toggle endpoint for completion

---

## 🎯 Quick Navigation

### By HTTP Method

**GET Requests (11)**

- All "Get All" and "Get by ID" endpoints
- Used for retrieving data

**POST Requests (6)**

- All "Create" endpoints
- Used for creating new resources

**PUT Requests (5)**

- All "Update" endpoints (except Todo toggle)
- Used for full/partial updates

**PATCH Requests (1)**

- `PATCH /todos/:id/toggle` - Toggle todo completion
- Used for specific state changes

**DELETE Requests (6)**

- All "Delete" endpoints
- Used for removing resources

### By Resource Type

| Resource | Endpoints | CRUD    | Special         |
| -------- | --------- | ------- | --------------- |
| Users    | 5         | ✅ Full | Cascade delete  |
| Posts    | 5         | ✅ Full | Cascade delete  |
| Comments | 5         | ✅ Full | -               |
| Albums   | 5         | ✅ Full | Cascade delete  |
| Photos   | 5         | ✅ Full | -               |
| Todos    | 6         | ✅ Full | Toggle endpoint |

---

## 🔍 Search & Filter Capabilities

### Users

- Search: name, username, email
- Filter: -

### Posts

- Search: title, body
- Filter: userId

### Comments

- Search: name, email, body
- Filter: postId, userId

### Albums

- Search: title
- Filter: userId

### Photos

- Search: title
- Filter: albumId

### Todos

- Search: title
- Filter: userId, completed

---

## 📊 Statistics

- **Total Endpoints**: 31
- **Resources**: 6
- **HTTP Methods**: 5 (GET, POST, PUT, PATCH, DELETE)
- **Environments**: 2 (Development, Production)
- **Documentation Pages**: 4

---

## 🚀 Getting Started

1. **First Time Setup**

   - Install Bruno
   - Open this folder as a collection
   - Select "Development" environment
   - Run "Get All Users" to test

2. **Common Workflows**

   - See `QUICK_REFERENCE.md` for testing scenarios
   - See `README.md` for detailed instructions

3. **Need Help?**
   - Check inline docs in each request
   - Review the README for troubleshooting
   - Consult the API_DOCS.md in parent folder

---

**Happy API Testing! 🎉**
