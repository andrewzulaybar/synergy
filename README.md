# Synergy

<b>What is Synergy?</b>
<p>
[syn·er·gy] /ˈsinərjē/: noun
<br>
<i>The interaction or cooperation of two or more organizations, substances, or other agents to produce a combined effect greater than the sum of their separate effects.</i> [Google, 2019]

Synergy is a simple dashboard web application for centralizing personal finance management. This application allows for the storage, visualization, and analysis of a user's accounts and transactions data.

<b>What's the motivation behind this project?</b>

Synergy was built with the following points in mind:
* To simplify the UI of common dashboard budgeting applications. Often, the UI can become convoluted with widgets and provide an overload of information. Synergy aims to keep the UI simple, clean, and easy to navigate.
* To increase awareness of the distribution of one's expenses. Synergy attempts to bring numbers to life through the usage of intuitive and beautiful charts that update dynamically. 
* To act as a single point of financial control. Managing several accounts at different institutions can be a bit tedious at times, especially if it requires having to use different applications. By integrating Plaid Link, Synergy aggregates account data and allows for a more effective, complete overview.

You can view a live version of the project at the following link:
[https://synergy-expenses.herokuapp.com/](https://synergy-expenses.herokuapp.com/)

## Getting Started

### Prerequisites

This project assumes that you have [Node.js](https://nodejs.org/en/) installed, and that you have accounts set up with [MongoDB Atlas](https://cloud.mongodb.com/user#/atlas/login) and [Plaid](https://dashboard.plaid.com/signin).

Once you create a cluser in MongoDB Atlas, create a database called 'transactions' and two collections called 'transactionsCollection' and 'usersItems'. The former collection will store the transaction data, while the latter will store the user and item data.

### Installing

1. Clone the git repository into a local project folder.

```
git clone https://github.com/andrewzulaybar/expense-tracker.git
```

2. Run ```cd client``` to change directories into the 'client' folder.

3. Create a .env file, then add the following constant to the file:

```js
// 'public-key' can be found on your Plaid Dashboard
REACT_APP_PLAID_PUBLIC_KEY='public-key' 
```

4. In order to make changes to the server locally, go to the 'package.json' file and replace the line ```"proxy": "https://synergy-expenses.herokuapp.com/"``` with ```"proxy": "http://localhost:8000"```.

5. Run ```cd ..``` to change directories out of the 'client' folder.

6. Create a .env file at top level, then add the following constants to the file:

```js
/** 
 *  Can be obtained from going into your cluster and following these steps:
 *  1. Press the 'Command Line Tools' tab
 *  2. Under 'Connect To Your Cluster', click the 'Connect Instructions' button 
 *  3. Under 'Choose a connection method', click the 'Connect Your Application' button
 *  4. Under 'Connection String Only', copy the connection string and replace <password> with your own password
 */
CONNECTION_STRING='connection-string'

// 'client-id', 'development-secret-key', and 'public-key' can all be found on your Plaid Dashboard
PLAID_CLIENT_ID='client-id'
PLAID_PUBLIC_KEY='public-key'
PLAID_SECRET_KEY='development-secret-key'
```

7. Run ```npm run client-server-install``` to install dependencies.

8. Start the server with ```npm run dev```, and then open up http://localhost:3000.

## Tests

Testing has not been integrated into the project as of [Aug. 26, 2019].

## Built With

* [React](https://reactjs.org/) - Front-end JavaScript library.
* [Ant Design](https://www.npmjs.com/package/antd) - Front-end UI library with React components.
* [Node.js](https://nodejs.org/en/) - Runtime JavaScript environment.
* [Express](https://expressjs.com/) - Back-end framework for building REST API.
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service.
