'''
Purpose: 

Ingest any excel or csv document with stats as column headers and player names and create custom visualizations (Spider Plots)

Method:

1. Convert sheet from stats document into a dataframe
2. Turn columns from raw stats totals and percentages/ratios into percentile Rankings
3. Identify subsets of parameters (stat headers) from which to generate plots and add them into the datasource_chart_types dictionary
	i) Default number of chart combinations allow for four subsets of stats to create four plots per player
	ii) Adjusting the figure size and dimentions allows for more than four plots if necessary
'''

import matplotlib.pyplot as plt
import itertools
import pandas as pd
from math import pi
import decimal
import matplotlib.backends.backend_pdf
from random import randint
from google.cloud import storage
import os
import datetime

my_palette = ['b','g','r','y','p','o']

def create_dataframe(sheet):
	df = pd.read_csv(sheet)
	df = df.fillna(0)
	df.index += 1

	return df


def generate_spider_plots(player_row_index, df, stats):
	my_dpi=96
	fig = plt.figure(figsize=(1000/my_dpi, 1000/my_dpi), dpi=my_dpi)
	color = my_palette[1]

	for x in stats:
		N = len(stats)
		df = df[stats].rank(pct=True)*100
		 
		# What will be the angle of each axis in the plot? (we divide the plot / number of variable)
		angles = [n / float(N) * 2 * pi for n in range(N)]
		angles += angles[:1]
		 
		# Initialise the spider plot
		ax = plt.subplot(2,2,1, polar=True)
		# plt.subplots_adjust(bottom=0.1, right=0.9, top=0.9, left=0.125)
		 
		# If you want the first axis to be on top:
		ax.set_theta_offset(pi / 2)
		ax.set_theta_direction(-1)
		 
		# Draw one axe per variable + add labels labels yet
		plt.xticks(angles[:-1], stats, color='b', size=8)
		 
		# Draw ylabels
		ax.set_rlabel_position(0)
		plt.yticks([20,40,60,80,100], ["20","40","60","80","100"], color="grey", size=7)
		plt.ylim(0,100)

		# Ind1
		fig.suptitle(full_df['FULL NAME'][player_row_index]+'\nPlayer #'+str(player_row_index))
		values = df.loc[player_row_index].values.flatten().tolist()
		values += values[:1]
		ax.plot(angles, values, color=color, linewidth=2, linestyle='solid')
		ax.fill(angles, values, color=color, alpha=0.4)
		 
		# Add a title
		# plt.title(full_df['FULL NAME'], size=11, color=color, y=1.1)

	#fig.tight_layout()
	pdf.savefig(fig)
	plt.close()


def upload_blob(bucket_name, source_file_name, destination_blob_name):
	"""Uploads a file to the bucket."""
	global pdf_url

	storage_client = storage.Client()
	bucket = storage_client.get_bucket(bucket_name)
	blob = bucket.blob(destination_blob_name)

	blob.upload_from_filename(source_file_name)

	print('File {} uploaded to {}.'.format(
        source_file_name,
        bucket_name))

	blob.make_public()
	pdf_url = blob.public_url


def court_science_magic(sheet, stats):
	global full_df, pdf, pdf_id, pdf_name

	pdf_id = datetime.datetime.utcnow().strftime("%Y-%m-%d-%H%M%S")
	pdf_name = 'static/pdf/Spider_Plots_id_' + str(pdf_id) + '.pdf'

	full_df = create_dataframe(sheet)
	pdf = matplotlib.backends.backend_pdf.PdfPages(pdf_name)

	for player_row_index in range(1, len(full_df.index) + 1):
		generate_spider_plots(player_row_index, full_df, stats)
		print (full_df['FULL NAME'][player_row_index]+' added to report. Row Index: '+str(player_row_index))
	pdf.close()

	#upload_blob('statsheet-storage-bucket', pdf_name, pdf_name)

	print("PDF report has been uploaded to Google Cloud Storage")

	#os.remove(pdf_name)


def delete_blob(bucket_name, blob_name):
	"""Deletes a blob from the bucket."""
	storage_client = storage.Client()
	bucket = storage_client.get_bucket(bucket_name)
	blob = bucket.blob(blob_name)

	blob.delete()

	print('Blob {} deleted.'.format(blob_name))
   

def send_pdf_path():
	return pdf_name


def send_blob_name():
	return pdf_name