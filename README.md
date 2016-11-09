## Api-document-management-system
[![Code Climate](https://codeclimate.com/github/demiladebamgbose/api-document-management-system/badges/gpa.svg)](https://codeclimate.com/github/demiladebamgbose/api-document-management-system)
![travis](https://travis-ci.org/demiladebamgbose/api-document-management-system.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/demiladebamgbose/api-document-management-system/badge.svg?branch=master)](https://coveralls.io/github/demiladebamgbose/api-document-management-system?branch=master)

Document Management System is an Application Program Interface that helps users manage their documents. A User can upload a document, edit and share with other users.The application permits users to work collaboratively on documents.

## Development
This is a REST API written in `JavaScript`, runs on `Node v6.7.0` and utilizes `ExpressJS` for routing. This API has several endpoints that handle everything from user authentication to document management itself. It makes use of `JSON Web Tokens (JWT)` to secure communications between the server and the client. This API makes use of `PostgreSQL` as the database and `Sequelize` as the `Object Relational Mapper (ORM)`.

## Installation
1. Install Nodejs
2. Install Posgress
3. Clone this repo or download the zipped file.
4. Navigate to the master branch.
5. Run
	- Run `npm install` to install all dependencies
	- Set up enviromental vriables in a `.env`  fille
	- Run `npm start`  and you are live!

## Code Example

### Create a new user

```
POST - /api/users

Post data
{
  username: 'username',
  emailaddress: 'example@host.com'
  lastname: 'lastname',
  firstname: 'firstname',
  password: 'password',
  RoleId: 'Administrator' // Role has to be created before assignment.
}
```
### Login a user
```
POST - /api/v1/users

Post data
{
  emailaddress: 'example@host.com',
  password: 'password'
}```

### Create a new document

Documnent can only be created by an existing and authenticated user.
```
POST - /api/v1/users

Post data
{
  title: 'Documnent title',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

}```


API Reference

API endpoints currently supported.

Users

Request type	Endpoint	Action
POST	/api/v1/users	Create a new user
GET	/api/v1/users	Get all users
GET	/api/v1/users:id	Get a user
PUT	/api/v1/users/:id	Update user information
DELETE	/api/v1/users/:id	Remove a user from database
Documents




| Request type|	Endpoint |	Action|
--------------|:--------|:-------
|POST	|/api/v1/documents	|Create a new document
|ET	|api/v1/documents	etrieve all documents
GET	/api/v1/documents/:id	Retrieve a specific document
GET	/api/v1/users/:id/documents	Retrieve all documents created by a user
GET	/api/v1/documents/?role=Andela	Retrieve all documents that contains 'Andela'
GET	/api/v1/documents/q=Andela&limit=10	Retrieve documents that contains 'Andela' in group of tens
GET	/api/v1/documents/?q=Andela&role=Test	Retrieve documents that contains 'Andela' with Test access
PUT	/api/v1/documents/:id	Update a specific document
DELETE	/api/v1/documents/:id	Remove a specific document from storage
Roles

Request type	Endpoint	Action
POST	/api/v1/role	Create a new role
GET	/api/v1/role	Retrieve all roles
PUT	/api/v1/role/:id	Edit a role
GET	/api/v1/role/:id	Retrieve a role
DELETE	/api/v1/role/:id	Delete a role



