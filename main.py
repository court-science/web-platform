from flask import Flask, render_template, request, url_for
import os
#import spider

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


'''
@app.route('/main', methods = ['POST'])
def main():
    if request.method == 'POST':
        if 'Data selection' in request.form:
            user_csv = request.form['Data selection']
            final_index = len(request.form)
        else:
            user_csv = request.files['myCSV']
            final_index = len(request.form) + 1
        print(user_csv)

        user_stats = []

        print(request.form)

        for i in range(1, final_index):
            if request.form['stat' + str(i)] != 'false':
                user_stats.append(request.form['stat' + str(i)])
        print(user_stats)

        spider.court_science_magic(user_csv, user_stats)

        pdf_path = spider.send_pdf_path()

        return render_template('response.html', pdf_path = pdf_path)
'''

if __name__ == '__main__':
    app.run()

