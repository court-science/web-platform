from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def output():
    return render_template('index.html')


@app.route('/main', methods = ['POST'])
def main():
    user_csv = request.form['']


if __name__ == '__main__':
    app.run()