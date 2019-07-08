'''
Purpose: 

Ingest any excel or csv document with stats as column headers and player names and create custom visualizations (Spider Plots)

Method:

1. Convert sheet from stats document into a dataframe
2. Turn columns from raw stats totals and percentages/ratios into percentile Rankings
3. Identify subsets of parameters (stat headers) from which to generate plots and add them into the datasource_chart_types dictionary
	i) Default number of chart combinations allow for four subsets of stats to create four plots per player
	ii) Adjusting the figure size and dimentions allows for more than four plots if necessary
4. 


'''


import matplotlib.pyplot as plt
import pandas as pd
from math import pi
import decimal
import matplotlib.backends.backend_pdf

datasource_sheets = {
	'nbastuffer': 'PG_Ranks.xlsx',
	'sportradar': 'SG_Ranks.xlsx'
}

datasource_chart_types = {

	'nbastuffer' : {
		'Per Game Stats': ['Name','Assists','Turnover','Points','Steals','Interceptions'],
		'Efficiency Stats' : ['Name','PER','FG%','3PT%','2PT%','True Shoot %']
	},

	'sportradar' : {
		'Per Game Stats': ['Name','Assists','Turnover','Points','Steals','Interceptions'],
		'Efficiency Stats' : ['Name','PER','FG%','3PT%','2PT%','True Shoot %']
	}
}

def choose_datasource(datasource):
	
	if 'xlsx' in filetype:

		df = pd.read_excel(datasource_sheets.get(datasource))
		df = df.fillna(0)
		df = df.drop(0)

	global pdf
	pdf = matplotlib.backends.backend_pdf.PdfPages(datasource + ' Spider Plots.pdf')

	global chart_types
	chart_types = position_chart_types.get(datasource)

	return df


	gamer_df = pd.read_excel('PG_Ranks.xlsx', sheet_name='Values - Weighted')
	gamer_df = gamer_df.fillna(0)
	gamer_df = gamer_df.drop(0)
 
# ------- PART 1: Define a function that do a plot for one line of the dataset! 

def make_spider(player_row_index, spider_df, position):
 
	my_dpi=96
	fig = plt.figure(figsize=(1000/my_dpi, 1000/my_dpi), dpi=my_dpi)
	chart_index=0

	for key, value in chart_types.items():
		chart_df = spider_df[chart_types.get(key)] 

		color=my_palette[chart_index]
		# number of variable
		categories=list(chart_df)[1:]
		N = len(categories)
		 
		# What will be the angle of each axis in the plot? (we divide the plot / number of variable)
		angles = [n / float(N) * 2 * pi for n in range(N)]
		angles += angles[:1]
		 
		# Initialise the spider plot
		ax = plt.subplot(2,2,chart_index+1, polar=True, )
		# plt.subplots_adjust(bottom=0.1, right=0.9, top=0.9, left=0.125)
		 
		# If you want the first axis to be on top:
		ax.set_theta_offset(pi / 2)
		ax.set_theta_direction(-1)
		 
		# Draw one axe per variable + add labels labels yet
		plt.xticks(angles[:-1], categories, color='b', size=8)
		 
		# Draw ylabels
		ax.set_rlabel_position(0)
		plt.yticks([20,40,60,80,100], ["20","40","60","80","100"], color="grey", size=7)
		plt.ylim(0,100)
		 
		# Ind1
		fig.suptitle(spider_df['Name'][player_row_index]+'\nRank '+str(player_row_index))
		values=chart_df.loc[player_row_index].drop('Name').values.flatten().tolist()
		values += values[:1]
		ax.plot(angles, values, color=color, linewidth=2, linestyle='solid')
		ax.fill(angles, values, color=color, alpha=0.4)
		# fig.suptitle(spider_df.loc['Gamertag'][player_row_index], fontsize=16)
		 
		# Add a title
		plt.title(key, size=11, color=color, y=1.1)
		# ------- PART 2: Apply to all individuals
		# initialize the figure
		chart_index+=1

	fig.tight_layout()	
	pdf.savefig(fig)
	plt.close()
	# fig.savefig(chart_df['Gamertag'][player_row_index]+'-'+gamer_df['Name'][player_row_index]+".pdf")


# Create a color palette:
my_colours = ['b','g','r','y','p','o']
 
# Loop to plot

def check_filetype(filename): 
    if '.xlsx' in filename: 
        print ('Excel file recognized')
        return

    elif '.csv' in filename: 
        print ('CSV file recognized')
		return

    else: 
        print ('ERR: File type is not recognized.\nPlease upload an .xlsx or .csv file')
        return

def percentile_rank(df):
	for i in df.columns:
		df_perc[i] = df[i].rank(pct=True)
