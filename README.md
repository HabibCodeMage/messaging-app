# Project README

## Video Demo
<video width="100%" height="340" controls>
  <source src="https://youtu.be/wEiz3va0EBE">
  Your browser does not support the video tag.
</video>

## Getting Started

This guide will help you set up and run the project using Docker Compose. Follow the steps below to get started.

### Prerequisites

- Docker
- Docker Compose
- Node.js (for Yarn)
- NVM(Node version manager)

### Step-by-Step Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```
1. **Docker compose up:**

   ```bash
   sudo docker compose up
   ```
# Run Backend

### Change Directory
   ```bash
   cd backend
   ```
### Use node 22.1.0
   ```bash
   nvm use 22.1.0
   ```
### Use yarn 1.22.19

  ```bash
yarn set version 1.22.19
   ```

### Install node modules
  ```bash
yarn 
   ```

### Run Local server
  ```bash
yarn run dev
   ```
# Run Frontend

### Change Directory
   ```bash
   cd frontend
   ```
### Use node 22.1.0
   ```bash
   nvm use 22.1.0
   ```
### Use yarn 1.22.19

  ```bash
yarn set version 1.22.19
   ```

### Install node modules
  ```bash
yarn 
   ```

### Run Local server
  ```bash
yarn run dev
   ```