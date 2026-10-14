#!/usr/bin/evn python3
# -*- encoding: utf-8 -*-

from flask import Flask
import os

app = Flask(__name__)

@app.route('/catalina')
def catalina():
    
    command = 'tail -n 1000 /xxx/xxx/xxx/tomcat/logs/catalina.out'
 
    textlist = os.popen(command).readlines()
    
    result = '<h1>Last 100 lines log</h1>'
    
    for line in textlist:
    
        result = '%s<br>%s'%(result,line)
    
    return result

if __name__ == '__main__':
    app.run(host="localhost", port=30000)
