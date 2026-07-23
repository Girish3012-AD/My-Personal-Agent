Dashboard quickstart

Overview

- Backend: http://localhost:8001
- Frontend: http://localhost:5173

One-click startup

A convenience script is provided at dashboard/START.bat to open separate terminals for the backend and frontend and launch your browser. Edit the BACKEND_CMD and FRONTEND_CMD variables at the top of the batch file if your project uses different start commands.

Chat command center

The dashboard includes a floating chat command widget (bottom-right). Available commands:

- help
- status
- services
- agents
- tasks
- logs
- memory
- models
- restart <name>
- clear

Notes and recommendations

- If you changed the backend port, prefer using environment variables to avoid hardcoding (e.g., BACKEND_PORT=8001 or VITE_BACKEND_URL).
- Add a lightweight health endpoint (e.g., GET /health) if your backend doesn't already expose one; the dashboard "status" command uses it to display liveness.
- If the repository will be published, create a private GitHub repo and push the current branch. Example commands are provided in the root-level instructions after committing.
