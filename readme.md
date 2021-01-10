# MCIT ToDo List

## Overview

### Project summary

Simple ToDo Web Application that can help MCIT Online students track their tasks per course. Students can also see what tasks their (anonymous) classmates have recently completed.

Include the link to your Devpost project page here: [Devpost](https://...)

### Authors

* **Claudia Fernandes** - Devpost ID – clafer@seas.upenn.edu – [GitHub](https://github.com/camf87)
* **Kevin Lu** - Devpost ID – klu93@seas.upenn.edu – [GitHub](https://github.com/kevlu93)
* **Francisco Urra** - https://devpost.com/Francisco-hub-eng – furraqui@seas.upenn.edu – [GitHub](https://github.com/Francisco-hub-eng)

## Usage

Currently, the MCIT ToDo List can only be deployed on a local server. However, the ability to connect to a Mongo Atlas server has already been implented. Ideally, the MCIT ToDo List would be a Web Application that you can use going to https://mcit-todolist.herokuapp.com/ and creating your account. However, we were not able to get authentication to work with Heroku at this time. 

### Prerequisites

Node.js and MongoDB need to be installed on your computer in order to run the project locally. Instructions for your OS can be found on their respective websites.

### Installation

After installing Node.js and MongoDB, clone the repository. In the working directory, run the following command:
```
npm install


```
This should install all necessary node packagese to run the local app.


### Deployment

To deploy the app, run the following command in the terminal:

```
node server.js
```
The app should then be running on localhost:3000

## Additional information

### Tools used

Which frameworks, libraries, or other tools did you use to create your project?

* [MongoDB](https://www.mongodb.com/) - General purpose, document-based, distributed database built for modern application developers and for the cloud era.
* [Node.js](https://nodejs.org/en/) - Asynchronous event-driven JavaScript runtime designed to build scalable network applications.
* [Heroku](https://www.heroku.com/) - Platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.
* [Express.js](https://www.expressjs.com) - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. APIs.

### Acknowledgments

Use anyone else's code? Inspired by a particular project? List / link here.

* [Tutorial on user authentication](https://scotch.io/tutorials/easy-node-authentication-setup-and-local) - This tutorial was helpful in shaping how to structure the project as well as implement passwords.
* Item 2 
* Item 3

### License

If desired, add a section for your license. Reference sites like https://choosealicense.com can help you choose which license meets your needs.

*For example:*

>This package is licensed under the GNU General Public License v3.0 (<a href="https://choosealicense.com/licenses/gpl-3.0/" target="_blank">GPL-3</a>).
