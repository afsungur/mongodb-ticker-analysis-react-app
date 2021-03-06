# React Web Application for MongoDB Ticker Data Analysis

## Contents

- [Intro](https://github.com/afsungur/mongodb-ticker-analysis-react-app#intro)
- [Resources to review before working on this project](https://github.com/afsungur/mongodb-ticker-analysis-react-app#resources-to-review-before-working-on-this-project)
- [Pre-Requisites of Running the React Application](https://github.com/afsungur/mongodb-ticker-analysis-react-app#pre-requisites-of-running-the-react-application)
- [Running the React Application](https://github.com/afsungur/mongodb-ticker-analysis-react-app#running-the-react-application)
- [Verification of the Configuration](https://github.com/afsungur/mongodb-ticker-analysis-react-app#verification-of-the-configuration)
- [Building React Application](https://github.com/afsungur/mongodb-ticker-analysis-react-app#building-react-application)
- [Example Screenshots](https://github.com/afsungur/mongodb-ticker-analysis-react-app#example-screenshots)

## Intro
This repository includes the source code of the React Web Component of an [Atlas App Services Application](https://www.mongodb.com/docs/atlas/app-services/) which is an end-to-end application to analyze financial market data. This React App connects to MongoDB Atlas through [MongoDB Realm WEB SDK](https://www.mongodb.com/docs/realm/web/). 

Please review [the other repository](https://github.com/afsungur/mongodb-ticker-analysis-atlas-app) that covers how to deploy the Atlas App Services Application.

## Resources to review before working on this project:
- https://www.mongodb.com/developer/article/time-series-candlestick/ 
- https://www.mongodb.com/developer/article/time-series-candlestick-sma-ema/
- https://www.mongodb.com/developer/article/time-series-macd-rsi/
- https://www.investopedia.com/terms/t/technicalindicator.asp
- https://www.investopedia.com/terms/t/technicalanalysis.asp

## Pre-Requisites of Running the React Application

- Before uploading the files on a hosting, test everything on a local machine or server.
- Clone this repository. 
- And change the current directory to this folder.
	- ```bash
		cd mongodb-ticker-analysis-react-app
		```
- Make sure you've installed the minimum version of the following `node` and `npm` on the machine that you are going to test this React app.
	- ```bash
		node --version
		v17.8.0

		npm --version
		8.5.5
		```


- Make sure that you've followed the instructions given in [the other repository](https://github.com/afsungur/mongodb-ticker-analysis-atlas-app) that covers the steps of deploying an Atlas App Services Application. In order to run this React Application without any problem, you need to have Atlas App Services Application first. 
- After you successfully created an Atlas App Services Application, note the `id` of it.
- Some data should have already been populated in the database if you've successfully deployed the App Services Application.
- Change the `REALM_APP_ID` parameter in the `public/config.js` file in this repo accordingly with the App Services Application Id that you got from the previous step.

- Run the given command to install npm packages
	- ```bash
		npm install
		```

## Running the React Application 

- Make sure `node_modules/` folder has been created after you installed the application through `npm install`.
- Run the development server:
	- ```bash
		npm start
		```

- After a while, it automatically launches a new tab in the default browser with the following URL: ```http://localhost:3000/```

## Verification of the Configuration
- In order to make sure that this React Application connects to both App Services Application and Atlas Database Cluster, check the followings out:
	- Check the "Latest Information" section on the main page. After a few seconds, some statistics need to be displayed as shown in the below.
	- ![Latest info](images/latestinfo.png) 


## Building React Application

- After you've completed your changes in this React Application, you can build it as shown in the below:
	- ![Build React App](images/built.png) 
- After you've built the app, you can upload the files under the build/ directory into [Atlas App Services Hosting](https://www.mongodb.com/docs/atlas/app-services/hosting/).


## Example Screenshots

### Form
![Form](images/form01.png)

### Candlestick Charts
![Candlestick Chart along with Moving and Exponential Moving Averages](images/cs.png)

### RSI

![RSI](images/rsi.png)

### MACD
![MACD](images/macd.png)

### Stochastic Oscillator
![Stochastic Oscillator](images/stochasticoscillator.png)

### Rule Adding
![Rule Adding](images/ruleadd.png)
