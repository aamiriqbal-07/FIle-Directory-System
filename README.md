# File Directory Application

## Overview
This is a full-stack file directory application built with:
- **Frontend**: React (with Vite)
- **Backend**: FastAPI (Python)
- **Database**: MySQL
- **Containerization**: Docker and Docker Compose

The application provides a user-friendly UI for creating, renaming, deleting, and navigating files and folders, with data persistence via MySQL.

---

## Features
### UI Functionalities
1. **Create**:
   - Add a new file or folder.
   - Prompted to enter the name and type (file or folder).
2. **Rename**:
   - Edit the name of an existing file or folder.
3. **Delete**:
   - Remove files or folders (recursively deletes all sub-folders and files).
4. **Navigate**:
   - Drill down into folders or go back to parent directories via breadcrumbs.

---

## Instructions to Run Locally

### Prerequisites
1. Install Docker and Docker Compose.
2. Ensure port **3307**, **8000**, and **3000** are available.

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Start the application:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

4. MySQL is accessible on port **3307** (username: `root`, password: `12345`).

### Cleanup
To stop and remove the containers, run:
```bash
docker-compose down
```

---

## Backend API Endpoints
The backend provides RESTful endpoints for managing files and folders. Here are the available endpoints:

### 1. **Get Nodes**
Fetch the contents of a directory.
```bash
curl -X GET "http://localhost:8000/nodes/?parent_id=<parent_id>"
```
- **Query Parameters**:
  - `parent_id` (optional): ID of the parent folder (use `null` for root).
- **Response**: List of nodes (files/folders).

### 2. **Create Node**
Add a new file or folder.
```bash
curl -X POST "http://localhost:8000/nodes/" \
-H "Content-Type: application/json" \
-d '{"name": "<name>", "type": "<file|folder>", "parent_id": <parent_id>}'
```
- **Body Parameters**:
  - `name`: Name of the file/folder.
  - `type`: Either `file` or `folder`.
  - `parent_id` (optional): Parent folder ID.

### 3. **Update Node**
Rename or update a node.
```bash
curl -X PUT "http://localhost:8000/nodes/<node_id>/" \
-H "Content-Type: application/json" \
-d '{"name": "<new_name>", "type": "<file|folder>"}'
```
- **Path Parameter**:
  - `node_id`: ID of the node to update.
- **Body Parameters**:
  - `name`: New name.
  - `type`: Must remain the same (`file` or `folder`).

### 4. **Delete Node**
Delete a file or folder (recursively for folders).
```bash
curl -X DELETE "http://localhost:8000/nodes/<node_id>/"
```
- **Path Parameter**:
  - `node_id`: ID of the node to delete.

### 5. **Migrate Node**
Move a file or folder to another directory.
```bash
curl -X PUT "http://localhost:8000/migrate-node/<node_id>/" \
-H "Content-Type: application/json" \
-d '{"parent_id": <new_parent_id>}'
```
- **Path Parameter**:
  - `node_id`: ID of the node to move.
- **Body Parameter**:
  - `parent_id`: ID of the new parent folder.

---

## File Structure
```
.
├── backend
│   ├── app
│   │   ├── config.py       # Configuration settings
│   │   ├── crud.py         # CRUD operations
│   │   ├── database.py     # SQLAlchemy database setup
│   │   ├── main.py         # FastAPI entry point
│   │   ├── models.py       # Database models
│   │   └── routes.py       # API routes
│   ├── Dockerfile          # Dockerfile for the backend
│   └── requirements.txt    # Python dependencies
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── File.jsx
│   │   │   └── FileDirectory.jsx
│   │   ├── services
│   │   │   └── api.js      # API integration
│   │   └── index.css
│   ├── Dockerfile          # Dockerfile for the frontend
│   └── package.json        # Frontend dependencies
├── docker-compose.yml      # Docker Compose configuration
```

---

## Additional Notes
1. **Environment Variables**:
   - Update `.env` or Docker Compose if using a different database or ports.

2. **Browser Caching**:
   - If changes to CSS/JS are not reflecting, perform a hard refresh (Ctrl+Shift+R).

3. **MySQL Data Persistence**:
   - The database is stored in the `./mysql_data` folder for persistence.

