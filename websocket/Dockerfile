# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory to /websocket
WORKDIR /websocket

# Copy the current directory contents into the container at /websocket
COPY . /websocket

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 3001 available to the world outside this container
EXPOSE 5001

# Run app.py when the container launches
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "server:app"]
