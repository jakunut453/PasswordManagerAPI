# passwordManagerAPI
An api made with nodejs for an password manager application. Using express and mysql

### Installation

clone the repository. Run the 
```
npm install
```
command to make sure all the required modules are present

#### Database setup

Run the following MySql commands to initialize the database
```
create table users(username varchar(10), password varchar(10), userid integer)
create table entry(userid int, website varchar(20), username varchar(10), password varchar(10)     )
```

MySql workbench is a nice tool to manage the Database, and Postman is a good tool to test the API.
### API routes

| Task          | Route         | Request         | Response        |
| ------------- | ------------- | --------------- | --------------- |
| User account registration: Create a user account.  | [POST] /app/user  | Request Data: { 'username': str,'password': str} | Response Data: { 'status': 'account created'} |
| User account login: Provide ability to log into the panel using the user credentials.  | [POST] /app/user/auth  | Request Data: {'username': str,'password': str} | Response Data: {  'status': 'success','userId': int}|
| List of saved usernames and passwords for different websites: Provide ability for user to see list of previously stored website usernames & passwords. | [GET] /app/sites/list/?user={userId}| Request Data: None | Response Data: List of stored website username & passwords |
| Save a new username & password for website: Provide ability for user to add new username & password for a website. | [POST] /app/sites?user={userId} | Request Data: { 'website': str, 'username': str, 'password': str } | Response Data: { 'status': 'success' }|
