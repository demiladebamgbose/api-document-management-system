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

#### Create a new user

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
}```


#### Login a user
```
POST - /api/v1/users

Post data
{
  emailaddress: 'example@host.com',
  password: 'password'
}```


#### Create a new document

Documnent can only be created by an existing and authenticated user.
```
POST - /api/v1/users

Post data
{
  title: 'Documnent title',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

}```


## API Reference

API endpoints currently supported.

##### Users

|Request type	|Endpoint	|Action|
|---------------|:-----------:|------|
|POST	|/api/users	|Create a new user
|GET	|/api/users	|Get all users
|GET	|/api/users:id	|Get a user
|PUT	|/api/users/:id	|Update user information
|DELETE	|/api/users/:id	|Remove a user from database


##### Documents

| Request type|	Endpoint |	Action|
|--------------|:--------|-------
|POST	|/api/documents		|Create a new document
|GET	|/api/documents		|Retrieve all documents
|GET	|/api/documents/:id		|Retrieve a specific document
|GET	|/api/users/:id/documents	|Retrieve all documents accesible  by a user
|GET	|/api/documents/?role=Admin	|Retrieve all documents that have role set as Admin
|GET	|/api/documents/limit=10	|Retrieve documents 10 at a time
|GET	|/api/documents/?limit=10&page=2 	|Retrieve all documents with an offset of two
|PUT	|/api/documents/:id	|Update a specific document
|DELETE	|/api/documents/:id	|Remove a specific document from storage


##### Roles

|Request type	|Endpoint	|Action|
|---------------|:-----------:|------|
|POST	|/api/roles		|Create a new role|
|GET	|/api/roles		|Retrieve all roles|
|PUT	|/api/roles/:id		|Edit a role|
|GET	|/api/roles/:id		|Retrieve a role
|DELETE	|/api/roles/:id		|Delete a role



