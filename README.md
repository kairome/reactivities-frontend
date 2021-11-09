![Deploy to GKE](https://github.com/kairome/reactivities-frontend/workflows/google/badge.svg)


# Reactivities - Frontend

See the app in action by visiting [reactivities.artem-dev.com](http://reactivities.artem-dev.com)

You will need to register to access the app, no email required. Just a username that is not already in use and a password.

To view the backend part of the app, visit [reactivities-backend](https://github.com/kairome/reactivities-backend)

## Description

Reactivities is a demo application meant to showcase my abilities as a fullstack developer.

The application itself features activities as the main entry point. You can create/edit/delete an activity that consists of name, description, date, location, venue and a category.\
Activity host can also cancel/re-activate the activity.

As a user, you can follow/attend others' activities. If you attend an activity, your name will appear on the card and everyone will have the ability to view your user profile.

Following an activity subscribes the user to certain events and notifies them when activity changes. Events that send notifications:
 - activity edited
 - activity deleted
 - activity cancelled/activated
 - there are new messages in activity's chat

Also, you can chat about an activity in real time on activity's page.


## Tech stack

Main stack - React and Typescript, built with webpack.

State management - [Recoil](https://www.npmjs.com/package/recoil)

Api requests - [react-query](https://www.npmjs.com/package/react-query) and [axios](https://www.npmjs.com/package/axios)

Web sockets - [signalr](https://www.npmjs.com/package/@microsoft/signalr)

## Launch

### Development

First, set up the environment file: `echo "ENV=dev" > .env` in project root.

`ENV=prod` will point to self, since the production version is deployed to GKE cluster with a front facing nginx container redirecting the traffic to pods inside the cluster.

#### Commands

`yarn` - install all dependencies
`yarn start` - to launch the development mode. App will be available on `localhost:3000` and point to local backend.

`yarn lint` - to run lint on the project

`yarn fix-lint` - to fix lint errors

`yarn check-types` - run tsc with --no-emit flag to type check the app

### Production

`yarn build` - will build the production version of the app.

`node staticServer/index.js` - launches the express static server

You can also build a docker image and test it with
`make build-image && make test-run` - this will build a docker image with tag `reactivities-frontend` and launch container that will be available on `http://localhost:8585`.\
Container will self-remove after you exit the process.


The app is deployed to Google Kubernetes Engine on tag creation.

Pipeline config can be found in `.github/workflows/google.yml`
