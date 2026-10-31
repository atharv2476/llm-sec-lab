import json
b = {r["id"]: r for r in json.load(open("report_before.json"))}
a = {r["id"]: r for r in json.load(open("report.json"))}
for i in b:
    print(f"{i:9} {b[i]['name']:20} {b[i]['status']:9} -> {a[i]['status']}")
