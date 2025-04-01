# PowerShell script to initialize the development environment

Write-Host 'Initializing development environment...' -ForegroundColor Green

# Ensure Node.js is installed
if (-not (Get-Command 'node' -ErrorAction SilentlyContinue)) {
    Write-Host 'Node.js is not installed. Please install it and re-run the script.' -ForegroundColor Red
    exit
}

# Install Yarn globally
Write-Host 'Installing Yarn globally...'
npm install -g yarn

# Navigate to project root
\ = '\\..\..'
Write-Host "Navigating to repository: \"
cd \

# Install frontend dependencies
Write-Host 'Installing frontend dependencies...'
cd client
yarn install
cd ..

# Install backend dependencies
Write-Host 'Installing backend dependencies...'
cd server
npm install
cd ..

# Start Docker containers
Write-Host 'Starting Docker containers...'
docker-compose -f dev-setup/docker-compose.yml up -d

Write-Host 'Development environment setup complete!' -ForegroundColor Green
