from flask import Flask, render_template, request, url_for
from spider import court_science_magic

app = Flask(__name__)

@app.route('/')
def output():
    return render_template('index.html')


@app.route('/main', methods = ['POST', 'GET'])
def main():
    if request.method == 'POST':
        user_csv = request.form['myCSV']
        print(user_csv)
        user_stats = []
        for i in range(11):
            if request.form['stat' + str(i + 1)] != 'false':
                user_stats.append(request.form['stat' + str(i + 1)])
        print(user_stats)
    return "Hang in there cs fans!"


if __name__ == '__main__':
    app.run()