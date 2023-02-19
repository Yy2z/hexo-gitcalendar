import requests
import re
from http.server import BaseHTTPRequestHandler
import json

def list_split(items, n):
    return [items[i:i + n] for i in range(0, len(items), n)]

def getdata(name):
    gitpage = requests.get(f"https://github.com/{name}")
    data = gitpage.text
    datadatereg = re.compile(r'data-date="(.*?)" data-level')
    datacountreg = re.compile(r'data-count="(.*?)" data-date')
    datadate = datadatereg.findall(data)
    datacount = datacountreg.findall(data)
    contributions = sum(map(int, datacount))
    datalist = [{"date": date, "count": int(count)} for date, count in zip(datadate, datacount)]
    datalistsplit = list_split(datalist, 7)
    return {"total": contributions, "contributions": datalistsplit}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = self.path
        user = path.split('?')[1]
        data = getdata(user)
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
        return
