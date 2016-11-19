## Api-document-management-system
[![Code Climate](https://codeclimate.com/github/demiladebamgbose/api-document-management-system/badges/gpa.svg)](https://codeclimate.com/github/demiladebamgbose/api-document-management-system)
![travis](https://travis-ci.org/demiladebamgbose/api-document-management-system.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/demiladebamgbose/api-document-management-system/badge.svg?branch=develop)](https://coveralls.io/github/demiladebamgbose/api-document-management-system?branch=develop)

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
  emailAddress: 'example@host.com'
  lastName: 'lastName',
  firstName: 'firstName',
  password: 'password',
  RoleId: 'Administrator' // Role has to be created before assignment.
}
```


#### Login a user

```
POST - /api/v1/users

Post data
{
  emailAddress: 'example@host.com',
  password: 'password'
}
```


#### Create a new document

Documnent can only be created by an existing and authenticated user.

```
POST - /api/v1/users

Post data
{
  title: 'Documnent title',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

}
```


## API Reference

API endpoints currently supported.

##### Users

|Request type	|Endpoint	|Action| Access |
|---------------|:-----------:|------|-------|
|POST	|/api/users	|Create a new user| All
|GET	|/api/users	|Get all users| Admin
|GET	|/api/users:id	|Get a user| Restricted
|PUT	|/api/users/:id	|Update user information| Restriced
|DELETE	|/api/users/:id	|Remove a user from database| Restricted


##### Documents

| Request type|	Endpoint |	Action| Accesible|
|--------------|:--------:|:---------:|---------|
|POST	|/api/documents		|Create a new document| All
|GET	|/api/documents		|Retrieve all documents| Restricted
|GET	|/api/documents/:id		|Retrieve a specific document | Restricted
|GET	|/api/users/:id/documents	|Retrieve all documents accesible  by a user | All
|GET	|/api/documents/?limit=10&RoleId=1	|Retrieve all documents that have roleId set as 1| Resticted
|GET	|/api/documents/limit=10	|Retrieve documents 10 at a time| Restricted
|GET	|/api/documents/?limit=10&page=2 	|Retrieve all documents with an offset of ten| Restricted
|PUT	|/api/documents/:id	|Update a specific document| Restricted
|DELETE	|/api/documents/:id	|Remove a specific document from the database| Restricted


##### Roles

|Request type	|Endpoint	|Action| Access
|---------------|:-----------:|------|-----|
|POST	|/api/roles		|Create a new role| Admin
|GET	|/api/roles		|Retrieve all roles| Admin
|PUT	|/api/roles/:id		|Edit a role| Admin
|GET	|/api/roles/:id		|Retrieve a role| Admin
|DELETE	|/api/roles/:id		|Delete a role| Admin
