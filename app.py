from flask import Flask, render_template, request, session, redirect, jsonify
import sqlite3

app = Flask(__name__)
app.secret_key = ".env"
# Connect DB
def get_db():
    return sqlite3.connect("database.db")

#  Create tables
def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        user_id INTEGER
    )
    """)
    conn.commit()
    conn.close()

init_db()
@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = get_db()
        cur = conn.cursor()

        cur.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
        user = cur.fetchone()

        if user:
            session["user_id"] = user[0]
            return redirect("/home")

    return render_template("login.html")
# This reg route will allow the end-user to create an account first.
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = get_db()
        cur = conn.cursor()

        cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        conn.close()

        return redirect("/")

    return render_template("register.html")

@app.route("/home")
def home():
    if "user_id" not in session:
        return redirect("/")
    return render_template("index.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

# Get the data and send them to the database
@app.route("/posts", methods=["GET"])
def get_posts():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT posts.id, posts.title, posts.content, users.username
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.id DESC
    """)
    
    posts = cur.fetchall()
    conn.close()

    return jsonify([
        {
            "id": p[0],
            "title": p[1],
            "content": p[2],
            "username": p[3]
        }
        for p in posts
    ])
@app.route("/add_post", methods=["POST"])
def add_post():
    data = request.json

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
        (data["title"], data["content"], session["user_id"])
    )

    conn.commit()
    conn.close()

    return jsonify({"status": "ok"})

@app.route("/delete_post/<int:id>", methods=["DELETE"])
def delete_post(id):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("DELETE FROM posts WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"status": "deleted"})


@app.route("/edit_post/<int:id>", methods=["PUT"])
def edit_post(id):
    data = request.json

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "UPDATE posts SET title=?, content=? WHERE id=?",
        (data["title"], data["content"], id)
    )

    conn.commit()
    conn.close()

    return jsonify({"status": "updated"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)