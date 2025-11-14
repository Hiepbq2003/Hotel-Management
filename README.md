# FU-FA25-SE1879-JV-SBA301-G2
## Hotel Management System

This project is a comprehensive hotel management system, built to support operations from online booking, room management, services, check-in/check-out, payment processing, to staff and customer management.

***

## Technologies Used

The project is built using a decoupled (backend/frontend directories) architecture with the following core technologies:

### Backend (API Server)
* **Language:** Java
* **Framework:** Spring Boot
* **Database:** MySQL
* **ORM:** Hibernate JPA
* **Security:** JWT (JSON Web Tokens)
* **Payment:** VNPay Integration

### Frontend (Client Application)
* **Library:** React
* **Routing:** React Router DOM
* **UI/Styling:** Bootstrap, MDB React UI Kit
* **Other components:** Chart.js (for Dashboard)

***

## Key Features

The system supports the following detailed management operations:

### 1. Reservation and Customer Management
* **Reservation:** Manages booking information, unique reservation codes, and arrival/departure dates (`arrival_date`, `departure_date`).
* **Check-in/Check-out:** Allows staff to update room status and generate invoices.
* **Customer and Guest:** Distinguishes between customer accounts (`customer_account`) and staying guest information (`guest`).

### 2. Room and Rate Management
* **Room Type:** Manages room types with details on capacity, bed information (`bed_info`), and base price.
* **Room:** Manages specific rooms with status (`status`: available, occupied, maintenance) and floor number.
* **Rate Plan/Room Rate:** Supports multiple rate plans and daily room rates.
* **Amenities:** Manages hotel amenities and amenities specific to each room type.

### 3. Service and Operations
* **Service:** Manages supplementary services and their prices.
* **Invoice & Payment:** Generates invoices and processes payments using multiple methods, including VNPay integration.
* **Task Management:** Supports managing housekeeping and maintenance tasks.

### 4. System Management and Reporting
* **User Account:** Manages user roles (`role`: admin, manager, reception, housekeeping).
* **Dashboard:** Provides key statistics and reports.

***

## Setup and Run Instructions

### 1. Database Setup (MySQL)
1.  Ensure you have **MySQL** (or MariaDB) installed.
2.  Create a new database with the name configured in `application.properties`: **`hotel_management`**
3.  Use the `hotel.sql` file to create all necessary tables:
    ```bash
    mysql -u root -p hotel_management < hotel.sql
    ```
    (Note: The default username is **`root`** and the password is **`123456a`** as configured in `application.properties`)

### 2. Backend Setup (Spring Boot)
1.  Navigate to the **`backend/HotelManagement`** directory.
2.  Check and update the database connection, JWT, and VNPay configurations in the **`src/main/resources/application.properties`** file if necessary.
    * **Port:** `8083`
3.  Use Maven to build and run the application:
    ```bash
    ./mvnw spring-boot:run
    ```

### 3. Frontend Setup (React)
1.  Navigate to the **`frontend/hotel_management`** directory.
2.  Install dependencies:
    ```bash
    npm install
  
3.  Run the Frontend application:
    ```bash
    npm start

    The Frontend application will run on port **3000** (typical default for React and referenced in the Backend's `vnpay.return-url` config).
