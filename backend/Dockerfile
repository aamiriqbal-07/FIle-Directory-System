FROM python:3.9

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create wait-for-db script
RUN echo '#!/bin/bash\n\
while ! nc -z db 3306; do\n\
  echo "Waiting for MySQL..."\n\
  sleep 1\n\
done\n\
echo "MySQL is up - executing command"\n\
exec "$@"' > /app/wait-for-db.sh

RUN chmod +x /app/wait-for-db.sh

# Command to run the application
CMD ["./wait-for-db.sh", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]