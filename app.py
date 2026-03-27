from flask import Flask

app = Flask(__name__)
@app.route("/")
def func():
    return "Hello Efatha, Welcome to Flask and Docker development!"

app.run(host="0.0.0.0", port=5000)