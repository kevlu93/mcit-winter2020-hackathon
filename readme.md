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
Future extensions of this project include the afore-mentioned Heroku deployment, as well as some sort of opt-in community based "Popular Tasks" feed, which could help users come up with ideas on what they should be doing for the classes, ie. an external paper or reading that many classmates found useful. This would also require some sort of language processing that can group similarly worded or themed tasks together. Additionally, we would also want to overhaul the front-end of the app to use the React framework. By integrating React with the existing Express, Node, and MongoDB frameworks, we'd be able to truly modernize the app.

### Tools used

* [MongoDB](https://www.mongodb.com/) - General purpose, document-based, distributed database built for modern application developers and for the cloud era.
* [Node.js](https://nodejs.org/en/) - Asynchronous event-driven JavaScript runtime designed to build scalable network applications.
* [Heroku](https://www.heroku.com/) - Platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.
* [Express.js](https://www.expressjs.com) - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. APIs.

### Acknowledgments

* [Tutorial on user authentication](https://scotch.io/tutorials/easy-node-authentication-setup-and-local) - This tutorial was helpful in shaping how to structure the project as well as implement passwords.

