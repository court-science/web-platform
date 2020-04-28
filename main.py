from flask import Flask, render_template, request, url_for
from spider import court_science_magic, send_pdf_path, send_blob_name, delete_blob
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/main', methods = ['POST'])
def main():
    if request.method == 'POST':
        user_csv = request.files['myCSV']
        print(user_csv)

        user_stats = []

        #print(len(request.form))

        for i in range(len(request.form)):
            if request.form['stat' + str(i + 1)] != 'false':
                user_stats.append(request.form['stat' + str(i + 1)])
        print(user_stats)

        court_science_magic(user_csv, user_stats)

        pdf_path = send_pdf_path()

        return render_template('response.html', pdf_path = pdf_path)


if __name__ == '__main__':
    app.run()