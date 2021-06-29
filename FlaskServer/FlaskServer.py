from flask import Flask, render_template, request, Response, jsonify
from flask_socketio import SocketIO, emit, send
import os
# from flask_cors import CORS,cross_origin
import redis
import json
import random
import time

# default is 'redis'   defined in docker-compose.yml file
redisName = os.environ.get('REDIS_NAME')

# UIhost = "http://localhost:3000"
UIhost = "http://127,0.0.1:3000"

red = redis.Redis(host=redisName)

app = Flask(__name__)
app.debug = True

MsgsAmount = 5

# CORS(app,support_credentials=True)           # should be removed in prudoction version

socketio = SocketIO(app, cors_allowed_origins="*")     # for development
# socketio = SocketIO(app,cors_allowed_origins=UIhost)  # for production


@socketio.on('requestDevices')
def requestDevices():
    # try:
    devices = [
        {"vendor": "Juniper", "deviceName": "name0", "ip": "127.0.0.0"},
        {"vendor": "Cisco", "deviceName": "name1", "ip": "127.0.1.0"},
        {"vendor": "Cisco", "deviceName": "name2", "ip": "127.0.2.0"},
        {"vendor": "Juniper", "deviceName": "name0", "ip": "127.0.0.1"},
        {"vendor": "Cisco", "deviceName": "name1", "ip": "127.0.1.2"},
        {"vendor": "Cisco", "deviceName": "name2", "ip": "127.0.2.3"}
    ]
    socketio.emit("responseDevices", devices)
    # except Exception as e:
    #     socketio.emit("Error","FlaskError:"+str(e))


@socketio.on('requestDeviceMsgs')
def requestDeviceMsgs(deviceData, lastMsgIndex):
    # try:
    id = deviceData['ip']
    if not red.exists(id):   # if device in not already defined - define it
        if 'selected' in deviceData:
            del deviceData['selected']
        if 'msgs' in deviceData:    # !!!
            del deviceData['msgs']  # !!!
        red.hmset(id, deviceData)
    dataResponse = red.lrange(
        id+':messages', -(lastMsgIndex+MsgsAmount), -(lastMsgIndex+1))
    dataResponse = [item.decode('utf-8') for item in dataResponse]
    socketio.emit("responseDeviceMsgs", (deviceData, dataResponse))
    # except Exception as e:
    #     socketio.emit("Error","FlaskError:"+str(e))


@socketio.on('requestSendMsg')
def requestSendMsg(data):
    # try:
    # time.sleep(0.3)
    print("requestSendMsg")
    red.rpush(data['ip']+':messages', data['msg'])
    # print("msg: "+data['msg'])
    msg = json.loads(data['msg'])
    deviceResponse = SendToDevice(msg['content'])
    serverMsg = json.dumps({"time": str(
        int(time.time()*1000)), "content": deviceResponse, "sentBy": "device"})
    red.rpush(data['ip'] + ':messages', serverMsg)
    # time.sleep(0.3)
    print(serverMsg, data["ip"])
    socketio.emit("responseSendMsg", (serverMsg, data['ip']))
    # except Exception as e:
    #     socketio.emit("Error","FlaskError:"+str(e))


def SendToDevice(msgContent):
    # time.sleep(1000)
    return str("hey i received the message "+msgContent)


@app.route('/')
def home():
    return ("yes flask is running")


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0")


# @app.route('/redis', methods=['POST'])
# def redis_conn():
#     req = dict(request.form)
#     data = req['data']
#     try:
#         resp = red.execute_command(data)
#         if isinstance(resp, bytes):
#             resp = str(resp, 'utf-8')
#         elif isinstance(resp, list):
#             resp = str([device.decode('utf-8') for device in resp])
#     except Exception as e:
#         resp = str(e)
#     resp = jsonify(resp)
#     resp.headers['Access-Control-Allow-Origin'] = '*'
#     return resp
#
#
# @app.route('/DB', methods=['POST', 'GET'])
# def DB():
#     if request.method == 'POST':
#         pass
#     elif request.method == 'GET':
#         dataKeys = red.scan()[1]
#         dataVals = red.mget(dataKeys)
#         dataKeys = [device.decode('utf-8') for device in dataKeys]
#         dataVals = [device.decode('utf-8') for device in dataVals]
#         data = dict(zip(dataKeys, dataVals))
#         return render_template('DB.html', data=data)


# @app.route('/getDB', methods=['GET','POST'])
# def getDB():
#     if request.method == 'POST':
#         deviceData = request.json
#         # print(deviceData)
#         id = deviceData['ip']
#         if not red.exists(id):   # if device in not already defined - define it
#             red.hmset(id, deviceData)
#         dataResponse = red.lrange(id+':messages',0,-1)
#         resp = jsonify(dataResponse)
#         return resp
#     elif request.method == 'GET':
#         devices = {
#             "127.0.0.0/24":{"vendor": "Juniper", "deviceName": "name0","ip":"127.0.0.0/24"},
#             "127.0.1.0/24":{"vendor": "Cisco", "deviceName": "name1","ip":"127.0.1.0/24"},
#             "127.0.2.0/24":{"vendor": "Cisco", "deviceName": "name2","ip":"127.0.2.0/24"},
#         }
#         # red.rpush(r"127.0.0.0/24:messages",r'{"time":"'+str(time.time())+'","content":"my very first message"}')
#         socketio.emit("getDB",json.dumps(devices))
#         return "ok"
#
#
# @app.route('/addToDB', methods=['POST'])
# def addToDB():
#     data = request.json
#     deviceIP,msg = data['ip'],data['msg']
#     red.rpush(deviceIP+':messages',msg)
#     return 'ok'
