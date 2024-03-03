
# Policy Tracker

Policy Tracker is a Node.js application that provides functionalities to manage and track insurance policies.


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/products/tools/compass) installed and running
- [Postman](https://www.postman.com/downloads/) installed and running

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Sonali-Mali93/PolicyTracker.git

```
2. Go to the project directory

```bash
cd PolicyTracker

```
3. Install dependencies::
```bash
npm install

```
4. Create a .env file in the root directory and Add your MongoDB connection string:
```bash
MONGODB_URI=mongodb://username:password@localhost:27017/PolicyTrackerDB
```

## Running the Application
```bash
nodemon start
```

The application will be accessible at http://localhost:3000

## Usage

### Uploading CSV Data

- Use the POST endpoint `/` to upload a CSV file containing policy data.

### Searching Policies

- Use the GET endpoint `/search/policy/:username` to search for policy information by username.

### Aggregated Policies by User
- Use the GET endpoint `/aggregated-policies` to get aggregated policy information by each user.


### Scheduling Messages
- Use the POST endpoint `/schedule-message` to schedule a message with parameters message, day, and time.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URI`



## Authors

- [@Sonali-Mali93](https://github.com/Sonali-Mali93)

