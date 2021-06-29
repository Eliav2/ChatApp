#!/bin/sh
python3 FlaskServer/FlaskServer.py &
npm start --prefix ./ReactFront
