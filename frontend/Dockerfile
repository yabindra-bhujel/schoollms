# Use the official Node.js image with Alpine Linux as the base image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /frontend

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the React app will run (if needed)
# EXPOSE 3000

# Define the default command to run your React app
CMD ["npm", "start"]
