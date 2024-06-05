# Foreign Education Consultancy Service (FECS)

## Overview

FECS is a web application designed to streamline the process of applying to foreign universities. It provides functionalities for users to register, login, fill out application forms, and check their application status.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)

## Technologies Used

- Node.js
- Express.js
- MySQL
- HTML/EJS/CSS
- JavaScript


## Project Structure
fecs/
├── client/
│ ├── index.html
│ ├── studentregister.html
│ ├── applicationform.html
│ ├── applicationstatus.html
│ └── asset/
│ └── main.css
├── db.js
├── index.js
├── routes/
│ ├── login.js
│ └── signup.js
└── README.md

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MySQL installed and running

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/fecs.git
    cd fecs
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add your database credentials:
    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=Consultancy
    ```

## Database Setup

### Create the database and tables

Run the following SQL commands to create the necessary database and tables:

```sql
CREATE DATABASE Consultancy;

USE Consultancy;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE consultants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255)
);

CREATE TABLE universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (university_id) REFERENCES universities(id)
);

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    consultant_id INT,
    application_status VARCHAR(50),
    language_proficiency_score INT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (consultant_id) REFERENCES consultants(id)
);
Running the Application
Start the server:

sh
Copy code
npm start
Open your browser and navigate to http://localhost:3000.

API Endpoints
User Authentication
GET /login: Serve the login page.
POST /login: Authenticate user and redirect to the application status page.
Application Form
GET /applicationform: Serve the application form page.
POST /applicationform: Submit application form data.
Application Status
GET /applicationstatus: Serve the application status page based on user's language proficiency score.
Future Enhancements
Implement user profile management.
Add email notifications for application updates.
Integrate payment gateway for application fees.
Enhance the UI/UX with modern frameworks.






