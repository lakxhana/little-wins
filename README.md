# little-wins

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/lakxhana/little-wins?utm_source=oss&utm_medium=github&utm_campaign=lakxhana%2Flittle-wins&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

A React application containerized with Docker.

## Prerequisites

Before running this project, you need to install Docker on your machine:

### macOS
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install and launch Docker Desktop
3. Verify installation: `docker --version`

### Windows
1. Install WSL 2 (Windows Subsystem for Linux 2):
   ```powershell
   wsl --install
   ```
   Or follow: https://docs.microsoft.com/en-us/windows/wsl/install

2. Download Docker Desktop for Windows from: https://www.docker.com/products/docker-desktop
3. During installation, ensure "Use WSL 2 based engine" is enabled
4. Restart your computer if prompted
5. Launch Docker Desktop
6. Verify installation: `docker --version`

### Linux
1. Install Docker using your distribution's package manager
2. Verify installation: `docker --version`

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd little-wins
```

### 2. Run with Docker Compose

**Build and start the application:**
```bash
docker-compose up --build
```

**Or run in detached mode (background):**
```bash
docker-compose up --build -d
```

### 3. Access the Application

Once the container is running, open your browser and navigate to:
```
http://localhost:3000
```

You should see the "Little Wins" React application.

## Common Commands

### Start the application
```bash
docker-compose up -d
```

### Stop/Terminate the application

**Stop and remove containers (recommended):**
```bash
docker-compose down
```

**Stop containers but keep them (for quick restart):**
```bash
docker-compose stop
```

**Stop and remove containers, networks, and volumes:**
```bash
docker-compose down -v
```

**Force stop (if container is unresponsive):**
```bash
docker-compose kill
docker-compose down
```

**If running in foreground (not detached mode):**
Press `Ctrl + C` in the terminal, then run:
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild after code changes
```bash
docker-compose up --build -d
```

### Check container status
```bash
docker-compose ps
```

### Restart the container
```bash
docker-compose restart
```

## Project Structure

```
little-wins/
├── src/
│   ├── App.jsx          # Main React component
│   └── index.jsx        # React entry point
├── public/
│   └── index.html       # HTML template
├── Dockerfile           # Docker image configuration
├── docker-compose.yml   # Docker Compose configuration
├── package.json         # Node.js dependencies
└── README.md           # This file
```

## Troubleshooting

### Port 3000 already in use
If port 3000 is already in use, you can change it in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3000 to 3001 (or any available port)
```

### Docker not running
Make sure Docker Desktop is running. Check with:
```bash
docker ps
```

### Container keeps restarting
Check the logs for errors:
```bash
docker-compose logs
```

### Clean rebuild
If you encounter issues, try a clean rebuild:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Remove all containers and images
```bash
docker-compose down --rmi all
```

## Development

For local development without Docker:
```bash
npm install
npm start
```

## Notes

- The application runs in production mode inside Docker
- Changes to source code require rebuilding the Docker image
- For hot-reload during development, uncomment the volumes section in `docker-compose.yml`
