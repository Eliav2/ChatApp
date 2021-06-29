# run these commands in case the docker-compose dosen't work properly
#!/bin/bash   
docker run --name redis -d redis
docker run -e REDIS_NAME=redis --name flask --link redis -p 5000:5000 -it -d flaskapp
# sudo docker-compose up