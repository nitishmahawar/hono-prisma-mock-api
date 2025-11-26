# Prisma7 Todos API - Endpoints Documentation

A comprehensive REST API built with Hono, Prisma, and PostgreSQL featuring users, posts, comments, albums, photos, and todos.

## Base URL

```
http://localhost:3000/api
```

## Common Query Parameters

Most list endpoints support the following query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term for filtering results

## Response Format

All list endpoints return data in this format:

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## 👥 Users API

### GET /api/users

Get all users with pagination and search.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name, username, or email

**Example:**

```bash
GET /api/users?page=1&limit=10&search=john
```

### GET /api/users/:id

Get a single user by ID with all related data.

**Example:**

```bash
GET /api/users/1
```

**Response includes:**

- User details
- All posts
- All albums
- All todos
- All comments

### POST /api/users

Create a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "website": "https://johndoe.com",
  "street": "123 Main St",
  "suite": "Apt 4",
  "city": "New York",
  "zipcode": "10001",
  "lat": "40.7128",
  "lng": "-74.0060",
  "companyName": "Acme Corp",
  "companyCatchPhrase": "Innovation at its best",
  "companyBs": "synergize cutting-edge solutions"
}
```

**Required fields:** `name`, `username`, `email`

### PUT /api/users/:id

Update a user.

**Request Body:** (all fields optional)

```json
{
  "name": "John Updated",
  "email": "newemail@example.com"
}
```

### DELETE /api/users/:id

Delete a user and all related data (cascading delete).

---

## 📝 Posts API

### GET /api/posts

Get all posts with pagination and filtering.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `userId` - Filter by user ID
- `search` - Search by title or body

**Example:**

```bash
GET /api/posts?userId=1&page=1&limit=10
```

### GET /api/posts/:id

Get a single post by ID.

**Response includes:**

- Post details
- User information
- All comments with user data

### POST /api/posts

Create a new post.

**Request Body:**

```json
{
  "title": "My First Post",
  "body": "This is the content of my post...",
  "userId": 1
}
```

**All fields required**

### PUT /api/posts/:id

Update a post.

**Request Body:** (all fields optional)

```json
{
  "title": "Updated Title",
  "body": "Updated content..."
}
```

### DELETE /api/posts/:id

Delete a post and all related comments.

---

## 💬 Comments API

### GET /api/comments

Get all comments with pagination and filtering.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `postId` - Filter by post ID
- `userId` - Filter by user ID
- `search` - Search by name, email, or body

**Example:**

```bash
GET /api/comments?postId=1&page=1&limit=10
```

### GET /api/comments/:id

Get a single comment by ID.

**Response includes:**

- Comment details
- Post information
- User information (if available)

### POST /api/comments

Create a new comment.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "body": "Great post! Thanks for sharing.",
  "postId": 1,
  "userId": 1
}
```

**Required fields:** `name`, `email`, `body`, `postId`  
**Optional:** `userId`

### PUT /api/comments/:id

Update a comment.

**Request Body:** (all fields optional)

```json
{
  "name": "Updated Name",
  "body": "Updated comment..."
}
```

### DELETE /api/comments/:id

Delete a comment.

---

## 📚 Albums API

### GET /api/albums

Get all albums with pagination and filtering.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `userId` - Filter by user ID
- `search` - Search by title

**Example:**

```bash
GET /api/albums?userId=1&page=1&limit=10
```

### GET /api/albums/:id

Get a single album by ID.

**Response includes:**

- Album details
- User information
- All photos

### POST /api/albums

Create a new album.

**Request Body:**

```json
{
  "title": "My Vacation Photos",
  "userId": 1
}
```

**All fields required**

### PUT /api/albums/:id

Update an album.

**Request Body:**

```json
{
  "title": "Updated Album Title"
}
```

### DELETE /api/albums/:id

Delete an album and all related photos.

---

## 📸 Photos API

### GET /api/photos

Get all photos with pagination and filtering.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `albumId` - Filter by album ID
- `search` - Search by title

**Example:**

```bash
GET /api/photos?albumId=1&page=1&limit=10
```

### GET /api/photos/:id

Get a single photo by ID.

**Response includes:**

- Photo details
- Album information
- User information

### POST /api/photos

Create a new photo.

**Request Body:**

```json
{
  "title": "Beautiful Sunset",
  "url": "https://picsum.photos/600/600",
  "thumbnailUrl": "https://picsum.photos/150/150",
  "albumId": 1
}
```

**All fields required**

### PUT /api/photos/:id

Update a photo.

**Request Body:** (all fields optional)

```json
{
  "title": "Updated Photo Title",
  "url": "https://picsum.photos/600/600"
}
```

### DELETE /api/photos/:id

Delete a photo.

---

## ✅ Todos API

### GET /api/todos

Get all todos with pagination and filtering.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `userId` - Filter by user ID
- `completed` - Filter by completion status (true/false)
- `search` - Search by title

**Example:**

```bash
GET /api/todos?userId=1&completed=false&page=1&limit=10
```

### GET /api/todos/:id

Get a single todo by ID.

**Response includes:**

- Todo details
- User information

### POST /api/todos

Create a new todo.

**Request Body:**

```json
{
  "title": "Complete project documentation",
  "completed": false,
  "userId": 1
}
```

**Required fields:** `title`, `userId`  
**Optional:** `completed` (default: false)

### PUT /api/todos/:id

Update a todo.

**Request Body:** (all fields optional)

```json
{
  "title": "Updated todo title",
  "completed": true
}
```

### PATCH /api/todos/:id/toggle

Toggle the completion status of a todo.

**Example:**

```bash
PATCH /api/todos/1/toggle
```

### DELETE /api/todos/:id

Delete a todo.

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, duplicate entry)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**

```json
{
  "error": "Error message here"
}
```

## Common Error Codes

- `P2002` - Unique constraint violation (duplicate entry)
- `P2003` - Foreign key constraint violation (related record not found)
- `P2025` - Record not found

---

## Testing the API

### Using cURL

```bash
# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","username":"johndoe","email":"john@example.com"}'

# Update a user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'

# Delete a user
curl -X DELETE http://localhost:3000/api/users/1
```

### Using JavaScript/Fetch

```javascript
// Get all posts
const response = await fetch("http://localhost:3000/api/posts");
const data = await response.json();

// Create a new post
const response = await fetch("http://localhost:3000/api/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "My Post",
    body: "Post content...",
    userId: 1,
  }),
});
```

---

## Development

Start the development server:

```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

## Database Seeding

To populate the database with mock data:

```bash
pnpm db:seed
```

This will create:

- 20 users
- 60-100 posts
- 60-300 comments
- 40-80 albums
- 200-800 photos
- 100-200 todos
