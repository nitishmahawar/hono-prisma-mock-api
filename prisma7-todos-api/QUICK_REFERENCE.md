# Bruno Collection Quick Reference

## 🎯 Quick Start

1. **Install Bruno**: Download from https://www.usebruno.com/
2. **Open Collection**: File → Open Collection → Select `prisma7-todos-api` folder
3. **Select Environment**: Choose "Development" or "Production" from dropdown
4. **Start Testing**: Click any request and hit "Send"

## 🌍 Environments

| Environment | Base URL                                 | Use Case         |
| ----------- | ---------------------------------------- | ---------------- |
| Development | `http://localhost:3000/api`              | Local testing    |
| Production  | `https://your-production-domain.com/api` | Live API testing |

## 📊 Collection Stats

- **Total Endpoints**: 31
- **Resources**: 6 (Users, Posts, Comments, Albums, Photos, Todos)
- **Environments**: 2 (Development, Production)
- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE

## 🔗 Endpoint Summary

### Users (5)

```
GET    /users              → List all users
GET    /users/:id          → Get user details
POST   /users              → Create user
PUT    /users/:id          → Update user
DELETE /users/:id          → Delete user
```

### Posts (5)

```
GET    /posts              → List all posts
GET    /posts/:id          → Get post details
POST   /posts              → Create post
PUT    /posts/:id          → Update post
DELETE /posts/:id          → Delete post
```

### Comments (5)

```
GET    /comments           → List all comments
GET    /comments/:id       → Get comment details
POST   /comments           → Create comment
PUT    /comments/:id       → Update comment
DELETE /comments/:id       → Delete comment
```

### Albums (5)

```
GET    /albums             → List all albums
GET    /albums/:id         → Get album details
POST   /albums             → Create album
PUT    /albums/:id         → Update album
DELETE /albums/:id         → Delete album
```

### Photos (5)

```
GET    /photos             → List all photos
GET    /photos/:id         → Get photo details
POST   /photos             → Create photo
PUT    /photos/:id         → Update photo
DELETE /photos/:id         → Delete photo
```

### Todos (6)

```
GET    /todos              → List all todos
GET    /todos/:id          → Get todo details
POST   /todos              → Create todo
PUT    /todos/:id          → Update todo
PATCH  /todos/:id/toggle   → Toggle completion
DELETE /todos/:id          → Delete todo
```

## 🔧 Environment Variables

| Variable    | Default                     | Description     |
| ----------- | --------------------------- | --------------- |
| `baseUrl`   | `http://localhost:3000/api` | API base URL    |
| `userId`    | `1`                         | Test user ID    |
| `postId`    | `1`                         | Test post ID    |
| `commentId` | `1`                         | Test comment ID |
| `albumId`   | `1`                         | Test album ID   |
| `photoId`   | `1`                         | Test photo ID   |
| `todoId`    | `1`                         | Test todo ID    |

## 📝 Common Query Parameters

| Parameter   | Type    | Description                  | Endpoints                      |
| ----------- | ------- | ---------------------------- | ------------------------------ |
| `page`      | number  | Page number (default: 1)     | All list endpoints             |
| `limit`     | number  | Items per page (default: 10) | All list endpoints             |
| `search`    | string  | Search term                  | All list endpoints             |
| `userId`    | number  | Filter by user               | Posts, Comments, Albums, Todos |
| `postId`    | number  | Filter by post               | Comments                       |
| `albumId`   | number  | Filter by album              | Photos                         |
| `completed` | boolean | Filter by status             | Todos                          |

## 🧪 Testing Scenarios

### Scenario 1: Create Complete User Profile

1. **Create User** → `POST /users`
2. **Create Post** → `POST /posts` (use userId from step 1)
3. **Create Album** → `POST /albums` (use userId from step 1)
4. **Create Todo** → `POST /todos` (use userId from step 1)

### Scenario 2: Blog Post Workflow

1. **Get All Users** → `GET /users` (pick a user)
2. **Create Post** → `POST /posts`
3. **Add Comment** → `POST /comments` (use postId from step 2)
4. **Get Post Details** → `GET /posts/:id` (see post with comments)

### Scenario 3: Photo Album

1. **Create Album** → `POST /albums`
2. **Add Photos** → `POST /photos` (repeat with different photos)
3. **Get Album** → `GET /albums/:id` (see all photos)

### Scenario 4: Todo Management

1. **Create Todo** → `POST /todos` (completed: false)
2. **Toggle Todo** → `PATCH /todos/:id/toggle` (mark complete)
3. **Get Completed Todos** → `GET /todos?completed=true`

## 💡 Pro Tips

### 1. Use Query Parameter Shortcuts

Disabled parameters (prefixed with `~`) are kept as examples:

```
params:query {
  page: 1
  limit: 10
  ~search: example    ← Remove ~ to activate
}
```

### 2. Chain Requests

Use response data from one request in another:

1. Create a user → Copy the `id` from response
2. Update environment variable `userId`
3. Use in subsequent requests

### 3. Bulk Testing

Use Bruno's "Run Collection" feature to test all endpoints at once.

### 4. Environment Switching

Quickly switch between Dev and Prod to compare responses.

## 🎨 Response Examples

### Success Response (List)

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

### Success Response (Single)

```json
{
  "id": 1,
  "name": "John Doe",
  ...
}
```

### Error Response

```json
{
  "error": "Error message here"
}
```

## 🚨 Common HTTP Status Codes

| Code | Meaning      | When It Happens                   |
| ---- | ------------ | --------------------------------- |
| 200  | OK           | Successful GET, PUT, DELETE       |
| 201  | Created      | Successful POST                   |
| 400  | Bad Request  | Validation error, duplicate entry |
| 404  | Not Found    | Resource doesn't exist            |
| 500  | Server Error | Internal server error             |

## 🔍 Debugging Tips

### Request Not Working?

1. ✅ Check environment is selected
2. ✅ Verify server is running (`pnpm dev`)
3. ✅ Confirm resource ID exists
4. ✅ Review request body format
5. ✅ Check required fields

### Need Test Data?

```bash
pnpm db:seed
```

### View Database

```bash
pnpm db:studio
```

## 📚 Resources

- **Full Documentation**: See `README.md` in this folder
- **API Reference**: See `../API_DOCS.md`
- **Bruno Docs**: https://docs.usebruno.com/

---

**Made with ❤️ for efficient API testing**
