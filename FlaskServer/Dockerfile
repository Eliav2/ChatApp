from alpine

RUN apk add --no-cache python3-dev && \ 
	pip3 install --upgrade pip 
RUN pip3 install flask 
RUN pip3 install flask-cors
RUN pip3 install flask_socketio
RUN pip3 install redis

WORKDIR /app
COPY . /app

CMD python3 FlaskServer.py 
