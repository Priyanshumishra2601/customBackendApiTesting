# customBackendApiTesting
Technical Implementation & Design Decisions
Technology Stack

Node.js & Express: Selected for its lightweight, asynchronous nature and efficiency in building scalable REST APIs.

MongoDB: Chosen for its schema flexibility and seamless integration with JSON-based transaction models.

JWT (JSON Web Tokens): Implemented to provide secure, stateless authentication without server-side session overhead.

Key Features

Role-Based Access Control (RBAC): Restricts sensitive operations (Create, Update, Delete) to Admin roles to simulate real-world security protocols.

Data Validation: Utilized Joi to enforce strict input schemas, ensuring data integrity and reducing runtime exceptions.

Development Trade-offs

Database Choice: Opted for MongoDB's flexibility over relational strictness; schema consistency was managed through application-level validation (Joi).

Testing Strategy: Prioritized comprehensive manual testing via Postman to cover edge cases and real-world scenarios within the project timeline.
