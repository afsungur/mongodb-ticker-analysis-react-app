
# React Web Application for MongoDB Ticker Data Analysis

This repository includes the source code of the React Web Component of a Financial Ticker Data Analysis Application.   This React App connects to the MongoDB Atlas through MongoDB Realm Application Services. 

## Resources to review before working on this project:
- https://www.mongodb.com/developer/article/time-series-candlestick/ 
- https://www.mongodb.com/developer/article/time-series-candlestick-sma-ema/
- https://www.mongodb.com/developer/article/time-series-macd-rsi/
- https://www.investopedia.com/terms/t/technicalindicator.asp
- https://www.investopedia.com/terms/t/technicalanalysis.asp

## Example Screenshots


## Demo

## Pre-Requisites of Running the React Application

- Before uploading the things on a hosting, test everything on a machine.
- Clone this repository. And change the current directory to this folder.
	- ```bash
		cd mongodb-ticker-analysis-react-app
		```
- Make sure you've installed at least the following `node` and `npm` version on the machine where you are going to test React app.
	- ```bash
		node --version
		v17.8.0

		npm --version
		8.5.5
		```

- Make sure that you've followed the instructions given in the another repository that covers the steps of deploying a Realm Application. In order to run this React Application without any problem, you need to have Realm Application first.
- After you successfully created a Realm Application, note the id of it.
- Some amount of data should have already been populated in the database. 
- Change the `REALM_APP_ID` parameter in the `public/config.js` file in this repo accordingly with the Realm Application Id that you got from the previous step.
- Run the given command to install npm packages
	- ```bash
		npm install
		```

## Running the React Application 

- Make sure you `node_modules/` folder has been created.
- Run the development server:
	- ```bash
		npm start
		```

- After a while, it automatically opens launches a new tab in the browser with the following url ```http://localhost:3000/```

## Verification of the Configuration
- In order to make sure React Application both connect to the Realm Application Services and MongoDB Atlas, check the followings out:
	- dsadsa
	- dsadsadsadsa

> Written with [StackEdit](https://stackedit.io/).
