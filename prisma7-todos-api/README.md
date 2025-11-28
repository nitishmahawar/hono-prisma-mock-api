# Bruno API Documentation - Prisma7 Todos API

This folder contains the complete Bruno API collection for the Prisma7 Todos API with both Development and Production environments.

## 📁 Collection Structure

```
prisma7-todos-api/
├── bruno.json                      # Collection configuration
├── environments/
│   ├── Development.bru             # Local development environment
│   └── Production.bru              # Production environment
├── Users/                          # User endpoints (5 requests)
│   ├── Get All Users.bru
│   ├── Get User by ID.bru
│   ├── Create User.bru
│   ├── Update User.bru
│   └── Delete User.bru
├── Posts/                          # Post endpoints (5 requests)
│   ├── Get All Posts.bru
│   ├── Get Post by ID.bru
│   ├── Create Post.bru
│   ├── Update Post.bru
│   └── Delete Post.bru
├── Comments/                       # Comment endpoints (5 requests)
│   ├── Get All Comments.bru
│   ├── Get Comment by ID.bru
│   ├── Create Comment.bru
│   ├── Update Comment.bru
│   └── Delete Comment.bru
├── Albums/                         # Album endpoints (5 requests)
│   ├── Get All Albums.bru
│   ├── Get Album by ID.bru
│   ├── Create Album.bru
│   ├── Update Album.bru
│   └── Delete Album.bru
├── Photos/                         # Photo endpoints (5 requests)
│   ├── Get All Photos.bru
│   ├── Get Photo by ID.bru
│   ├── Create Photo.bru
│   ├── Update Photo.bru
│   └── Delete Photo.bru
└── Todos/                          # Todo endpoints (6 requests)
    ├── Get All Todos.bru
    ├── Get Todo by ID.bru
    ├── Create Todo.bru
    ├── Update Todo.bru
    ├── Toggle Todo.bru
    └── Delete Todo.bru
```

**Total: 31 API endpoints**

## 🚀 Getting Started

### 1. Install Bruno

Download and install Bruno from: https://www.usebruno.com/

### 2. Open the Collection

1. Launch Bruno
2. Click "Open Collection"
3. Navigate to this folder (`prisma7-todos-api`)
4. Select the folder to load the collection

### 3. Select Environment

Choose your environment from the dropdown in the top-right corner:

- **Development**: Uses `http://localhost:3000/api`
- **Production**: Uses `https://your-production-domain.com/api`

## 🌍 Environments

### Development Environment

```
baseUrl: http://localhost:3000/api
userId: 1
postId: 1
commentId: 1
albumId: 1
photoId: 1
todoId: 1
```

### Production Environment

```
baseUrl: https://your-production-domain.com/api
userId: 1
postId: 1
commentId: 1
albumId: 1
photoId: 1
todoId: 1
```

**Note**: Update the `baseUrl` in `Production.bru` with your actual production domain.

## 📝 Environment Variables

All endpoints use environment variables for dynamic values:

- `{{baseUrl}}` - API base URL
- `{{userId}}` - User ID for testing
- `{{postId}}` - Post ID for testing
- `{{commentId}}` - Comment ID for testing
- `{{albumId}}` - Album ID for testing
- `{{photoId}}` - Photo ID for testing
- `{{todoId}}` - Todo ID for testing

You can modify these values in the environment files to test with different IDs.

## 🔍 API Endpoints Overview

### 👥 Users (5 endpoints)

- **GET** `/users` - Get all users with pagination
- **GET** `/users/:id` - Get user by ID with related data
- **POST** `/users` - Create a new user
- **PUT** `/users/:id` - Update a user
- **DELETE** `/users/:id` - Delete a user

### 📝 Posts (5 endpoints)

- **GET** `/posts` - Get all posts with pagination
- **GET** `/posts/:id` - Get post by ID with comments
- **POST** `/posts` - Create a new post
- **PUT** `/posts/:id` - Update a post
- **DELETE** `/posts/:id` - Delete a post

### 💬 Comments (5 endpoints)

- **GET** `/comments` - Get all comments with pagination
- **GET** `/comments/:id` - Get comment by ID
- **POST** `/comments` - Create a new comment
- **PUT** `/comments/:id` - Update a comment
- **DELETE** `/comments/:id` - Delete a comment

### 📚 Albums (5 endpoints)

- **GET** `/albums` - Get all albums with pagination
- **GET** `/albums/:id` - Get album by ID with photos
- **POST** `/albums` - Create a new album
- **PUT** `/albums/:id` - Update an album
- **DELETE** `/albums/:id` - Delete an album

### 📸 Photos (5 endpoints)

- **GET** `/photos` - Get all photos with pagination
- **GET** `/photos/:id` - Get photo by ID
- **POST** `/photos` - Create a new photo
- **PUT** `/photos/:id` - Update a photo
- **DELETE** `/photos/:id` - Delete a photo

### ✅ Todos (6 endpoints)

- **GET** `/todos` - Get all todos with pagination
- **GET** `/todos/:id` - Get todo by ID
- **POST** `/todos` - Create a new todo
- **PUT** `/todos/:id` - Update a todo
- **PATCH** `/todos/:id/toggle` - Toggle todo completion
- **DELETE** `/todos/:id` - Delete a todo

## 📋 Common Query Parameters

Most list endpoints support:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term for filtering
- Resource-specific filters (e.g., `userId`, `postId`, `completed`)

## ✨ Features

### Example Payloads

Each POST and PUT request includes realistic example data that you can use immediately.

### Documentation

Every endpoint includes inline documentation explaining:

- Required and optional fields
- Query parameters
- Response structure
- Special behaviors

### Query Parameters

GET requests include both active and disabled (~) query parameters for easy testing.

## 🧪 Testing Workflow

### Basic Flow

1. **Create a User** → Use "Create User" endpoint
2. **Create a Post** → Use the user ID from step 1
3. **Add Comments** → Use the post ID from step 2
4. **Create an Album** → Use the user ID
5. **Add Photos** → Use the album ID
6. **Create Todos** → Use the user ID

### Quick Test

1. Start your API server: `pnpm dev`
2. Switch to "Development" environment
3. Run "Get All Users" to verify the API is working
4. Test other endpoints as needed

## 🔄 Switching Between Environments

To switch from Development to Production:

1. Click the environment dropdown (top-right)
2. Select "Production"
3. All requests will now use the production base URL

## 📚 Additional Resources

- [API Documentation](../API_DOCS.md) - Complete API reference
- [Bruno Documentation](https://docs.usebruno.com/) - Learn more about Bruno
- [Project README](../README.md) - Project setup and information

## 🛠️ Customization

### Adding New Endpoints

1. Create a new `.bru` file in the appropriate folder
2. Use the existing files as templates
3. Update the `seq` number for ordering

### Modifying Environment Variables

Edit the environment files (`Development.bru` or `Production.bru`) to add or modify variables.

### Example: Adding an API Key

```
vars {
  baseUrl: http://localhost:3000/api
  apiKey: your-api-key-here
  userId: 1
}
```

Then use it in requests:

```
headers {
  Authorization: Bearer {{apiKey}}
}
```

## 💡 Tips

1. **Use Comments**: Disable query parameters with `~` prefix to keep them as examples
2. **Environment Variables**: Leverage variables for IDs to avoid hardcoding
3. **Sequential Testing**: Use the seq numbers to organize your workflow
4. **Documentation**: Each request has inline docs - click the "Docs" tab
5. **Collections**: Organize related requests into folders for better management

## 🐛 Troubleshooting

### API Not Responding

- Ensure the development server is running: `pnpm dev`
- Check that the port is correct (default: 3000)
- Verify the environment is set to "Development"

### 404 Errors

- Check that the resource ID exists in the database
- Run `pnpm db:seed` to populate test data
- Verify the endpoint URL is correct

### Validation Errors

- Review the request body against the schema
- Check required fields are included
- Ensure data types are correct (strings, numbers, booleans)

---

**Happy Testing! 🚀**
