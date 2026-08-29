# RescueMeals

A food waste management platform that connects food donors, NGOs, and volunteers to help redirect surplus food to people who need it.

## Features
- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **Email Verification**: Account activation and password reset functionality via email.
- **Food Donation**: Users can donate raw ingredients or cooked meals.
- **Request Management**: Volunteers and receivers can view and accept donation requests.
- **Cart System**: Ability to add required items to a cart.
- **Role-Based Access**: Specialized views for Donators, Receivers, and Volunteers.

## Technology Stack
- **Frontend**: AngularJS, HTML5, CSS3, Bootstrap 4
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: Passport.js (Local & Social Strategies), JSON Web Tokens (JWT)
- **Email/Mailing**: Nodemailer

## Local Setup

1. **Install Dependencies**  
   Ensure you have Node.js installed. Navigate to the project directory and run:
   ```bash
   npm install
   ```

2. **Configuration**  
   - The application expects a MongoDB connection string. Currently, it connects to a cluster in `server.js`. Make sure to replace it with your own local or cloud MongoDB URI if needed.
   - For email features (like activation links), configure the Nodemailer transport in `routes/api.js` with your valid SMTP credentials.

3. **Start the Application**  
   Run the following command to start the server:
   ```bash
   npm start
   ```

4. **Access the App**  
   Open your browser and go to `http://localhost:8080` to view the application.
