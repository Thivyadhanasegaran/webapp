Cloud-Native Application README:
•	Programming Language: Node.js
•	Relational Database: MySQL
•	Backend Framework: Express.js
•	ORM Framework: Sequelize

Installation:
npm init
npm install —> to install all dependencies
npm start —> to start the server

Health Check (/healthz)
•	Checks if the application has connectivity to the database.
•	Returns HTTP "200 OK" —> if the connection is successful.
•	Returns HTTP "503 Service Unavailable" —> if the connection is unsuccessful.

Method: GET
•	Description: Endpoint to check the health of the application.
•	Success Response —> "200 OK"
•	Other Endpoints in Method: GET—> Other endpoints are not implemented and will return a "404 Not Found response".

Other API request
•	Method: POST,DELETE,PUT,PATCH
•	Description: Other API requests are not implemented as per the requirement and will return a "405 Method not allowed" irrespective of whether DB is connected or not.

Middleware
•	checkDBConnection: Middleware to ensure the application has connectivity to the database.
•	checkPayloadAndQueryParams: Middleware to check if there is any request body with payload and also if there is any query params in the request, if yes it will return —>"400 Bad request" irrespective of whether DB is connected or not.
