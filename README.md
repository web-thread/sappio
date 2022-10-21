# sappio - a minimal node app with logging
[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

A logging app with router, swagger and cleaning tools

## Table of contents

1. [How to run](#how-to-run)
2. [Backlog](#backlog)

## How to run

You may utilize some cloud service to host the app, like AWS, Azure or GCloud, but in this case you might run locally. You can use the docker file by building and running the application with commands below
    
```>>> npm run docker:deploy IMAGE-NAME```

To host it locally, you must follow the instructions below:

1) Clone the repository typing on terminal `git clone git@github.com:dot-quiver/dot-quiver-api.git`;
2) Run the commands:
    
    2.1. `npm install`: install local dependencies;
    
    2.2. `npm start`: run the server locally;

3) Open a browser;
4) Type `localhost:8080` on the URL field;

## Backlog

I plan to:

1. add some other routes for educational purposes;
2. Provide automatic route explanations, also called a `swagger`.


