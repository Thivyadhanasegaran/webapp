## Assignment 01:
Cloud-Native Application README:
•	Programming Language: Node.js
•	Relational Database: MySQL
•	Backend Framework: Express.js
•	ORM Framework: Sequelize

Installation:
npm init --> to initialize npm packages
npm install —> to install all dependencies.
npm start —> to start the server.

Health Check (/healthz)
•	Checks if the application has connectivity to the database..
•	Returns HTTP "200 OK" —> if the connection is successful.
•	Returns HTTP "503 Service Unavailable" —> if the connection is unsuccessful

Method: GET
•	Description: Endpoint to check the health of the application.
•	Success Response —> "200 OK".
•	Other Endpoints in Method: GET—> Other endpoints are not implemented and will return a "404 Not Found response".

Other API request
•	Method: POST,DELETE,PUT,PATCH
•	Description: Other API requests are not implemented as per the requirement and will return a "405 Method not allowed" irrespective of whether DB is connected or not.

Middlewares
•	checkDBConnection: Middleware to ensure the application has connectivity to the database.
•	checkPayloadAndQueryParams: Middleware to check if there is any request body with payload and also if there is any query params in the request, if yes it will return —>"400 Bad request" irrespective of whether DB is connected or not.

## Assignment 02:

POST request --> /v1/user

• User can create an account by providing email address, password, first name, and last name --> 201
• While account creation, account_created and account_updated field should be set to the current time. Even if the user gives any value for account_created and account_updated field then it should be ignored.
• Email Address: Users should provide a valid email address and it cant be empty --> 400
                 If email address already exists - 400
• Password: Password should be securely hashed using the BCrypt password hashing scheme with salt.
            If the password field is empty --> 400
• First Name and Last Name: Users should provide their first name and last name.
                            If it is empty -->400
• Response Payload: The response payload should include the user's email address, first name, last name, and the timestamp of account creation. However, the password should never be returned in the response payload.

GET request --> /v1/user/self

• User can retrieve account information from the application based on their authentication credentials such as user ID and password -->200
• If there is mismatch in the username, password or if the user entered details doesnt exist or if the username or password is empty --> 400
• If there is no db connection -->503
• Response Payload: When a user requests their account information, the response payload should include all fields for the user except for the password.


PUT request --> /v1/user/self
• Users can only update their own account information and they must be authenticated using basic authentication -->204
• If the user is not authenticated or if user provides invalid username and password--->401
• Users should only be allowed to update the following fields: First Name, Last Name, Password, if anyother fields are present in the payload then -->400
• Similarly if the provided First Name, Last Name, Password is invalid or empty -->400
• No DB connection -->503
• Account_updated field should be updated when the user update is successful.

## Assignment 03:

GitHub Actions Integration Tests Workflow:

 The repository includes a GitHub Actions workflow named "test-checker" specifically designed for integration testing of the /v1/user endpoint.

Workflow Description:

The workflow consists of the following steps:

• Install MySQL: Starts the MySQL service.
• Configure MySQL: Sets up the MySQL database by creating a database, user, and granting necessary privileges.
• Use Node.js: Sets up Node.js environment 
• Set up environment variables: Sets up environment variables required for the application to connect to the MySQL database.
• Install Dependencies: Installs the project dependencies using npm.
• Start the application: Starts the application by running "npm start".
• Run Tests: Executes the integration tests defined in the "test" directory using the "npm test" command.

Test Environment Configuration:

The workflow utilizes secrets to securely configure the MySQL database connection. The following secrets are required:

- MYSQL_ROOT_PASSWORD: Root password for MySQL.
- DB_USER: Username for the MySQL database.
- DB_PASSWORD: Password for the MySQL database user.
- DB: Name of the MySQL database.
- MYSQL_HOST: Hostname of the MySQL server.

These secrets are used to create and configure the MySQL database during workflow execution. Additionally, environment variables are set both in the workflow and in a ".env" file to ensure proper configuration of the application.

 Execution Flow:

• The workflow starts by installing and configuring MySQL to create the necessary database and user.
• Sets Node.js environment.
• Environment variables are configured to establish the connection between the application and MySQL database.
• Dependencies are installed, and the application is started.
• Integration tests are executed against the running application to validate the functionality of the "/v1/user" endpoint.

The workflow ensures that the application interacts correctly with the MySQL database and that the "/v1/user" endpoint behaves as expected according to the specified test cases.

## Assignment 04:
 
• A custom image will be created from CentOS 8 Stream and it is configured to run in the default VPC.
• This image includes dependencies such as MySQL and Node.js, along with the creation of specific user and group profiles based on given requirements  (user: csye6225, group: csye6225).
• The web application service is set to automatically start using a systemd file named webapp.service.
• Deployment of the custom image to a GCP service account requires following specific roles to be enabled
1. Compute Engine Instance Admin (v1).
2. Service Account User.
A JSON key is downloaded from the Service Account and it is stored securely as a secret in the organization's web application repository.
• Two workflows have been developed: test-build and test-checker.
• Test-checker workflow includes integration tests, building project artifacts, Packer initialization, formatting, and validation commands.
• Test-validator workflow also contains integration tests and builds project artifacts. Additionally, it includes authentication, Packer initialization, Packer building, and the creation of a custom image upon merge.

## Assignment 05:
• Packer template has been updated to remove mysql installation step in install_dependencies shell script.
• DB configuration and user creation are achieved through terraform code.


## Assignment 06:
• Updated the Packer template to include installation and configuration of the Ops Agent.
• Utilized a provisioner to install the Ops Agent by executing the provided installation script.
• Configured the Ops Agent to streamline application logs to Google Cloud Observability.

Ops Agent Configuration:
• Modified the ops-agent-config.yaml file to specify the logging configuration for application logs.
• Ensured that the configuration correctly specifies the paths to application logs and their format (JSON).
• Updated the logging configuration in the web application code to write logs in structured JSON format.
• Utilized libraries like Winston to format logs in JSON and ensure compatibility with Google Cloud Observability.
• Adjusted logging statements within the application code to generate structured logs.
• Ensured that logs include necessary context and are appropriately categorized by severity.


## Assignment 07:
• Publish Message to Pub/Sub Topic on User Account Creation
Whenever a new user account is created, the web application publishes a message to a Pub/Sub topic. This message contains relevant information in JSON format that will be utilized by a Cloud Function to send an email to the user and track the link verification process.
• The payload (message) published to the Pub/Sub topic includes information as 
Username: The username of the newly created user.
• All API calls from user accounts that have not been verified are now blocked until the user completes the email verification process. (GET/UPDATE api request)

• Email Verification Process
The email verification process involves the following steps:

When a user requests to verify their email, the web application checks the validity of the verification link.
If the link is valid and within the allowed time frame (2 minutes from the current time), the user is marked as isVerified column to true in the database.
If the link is invalid or has expired, appropriate error messages are returned to the user.

• Endpoints
Verify Email Endpoint
Endpoint: /verify-email
Method: GET
Description: Verifies the email address of a user by checking the validity of the verification link.
Parameters:
username: The username of the user requesting email verification.
token: The verification token associated with the user.
Middleware:
Basic Authentication Middleware: Used to authenticate API requests.
Database Connection Middleware: Checks the database connection before processing API requests.
Payload and Query Parameters Middleware: Validates payload and query parameters of API requests.
Response:
200 OK: If the email is successfully verified.
400 Bad Request: If the email verification link is invalid or has expired.
500 Internal Server Error: If there is an internal server error during the verification process.

