google.charts.load('current', {'packages':['table','corechart']});
google.charts.setOnLoadCallback(drawSampleTable);

function drawSampleTable() {
    sampleData = 
        [
            ["FULL NAME","TEAM","POS","PPG","RPG","APG","SPG","BPG"],
            ["Kawhi Leonard","TOR","F",26.9,7.6,3.3,1.86,0.48],
            ["LeBron James","LAL","F",26.8,8.7,7.8,1.43,0.64],
            ["Kevin Durant","GSW","F",27.5,7,5.8,0.8,1.18],
            ["Giannis Antetokounmpo","MIL","F",27.2,12.7,6,1.4,1.45],
            ["Stephen Curry","GSW","G",28.4,5.2,5.3,1.29,0.39]
        ]

        drawTableFromCSV(sampleData)
    }

async function drawTableFromCSV(csv) {
    await google.charts.load('current', {'packages':['table']});
    //console.log("CSV passed into drawTable function:", csv)
    let table_data = new google.visualization.DataTable();
    //console.log("Number of columns should be:",csv[0].length)
    
    csv = numCastCSV(csv)
    var string_col_count = 0

    for (let i=0;i<csv[0].length;i++){
            if(isNaN(csv[1][i])) {
                table_data.addColumn('string', csv[0][i]);
                string_col_count++
            } else {
                table_data.addColumn('number', csv[0][i]);
            }
        }
    //console.log("# of string type columns:",string_col_count)

    function numCastCSV(csv) {
        newCSV = []
        for (let i=0; i<csv.length;i++) {
            newRow = []
            row=csv[i]
            row.forEach(val => isNaN(val) ? newRow.push(val) : newRow.push(Number(val)))
            
            newCSV.push(newRow)
        }
        return newCSV
    }

    try {
        table_data.addRows(csv.slice(1,));
    } catch (err) {
        console.error("There was an issue loading your data, please make sure it is properly formatted and try again.")
    }
    
    var table = new google.visualization.Table(document.getElementById('table_div'));
    
    var options = {
        allowHtml: true,
        cssClassNames: {
          tableCell: 'small-font'
        },
        showRowNumber: true, 
        width: '100%', 
        height: '250px', 
        pageSize: 5
      };
    
    table.draw(table_data, options);
    }