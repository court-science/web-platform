google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(drawSampleTable);
//google.charts.setOnLoadCallback(drawTableFromCSV(csv));

function drawSampleTable() {
    var table_data = new google.visualization.DataTable();

        table_data.addColumn('string', 'Name');
        table_data.addColumn('number', 'PTS');
        table_data.addColumn('number', 'REB');
        table_data.addColumn('number', 'AST');
        table_data.addRows([
            ['Lebron James',  26.4, 8.1, 10.7],
            ['Kawhi Leonard',   28.2,  9.3, 4.2],
            ['Kevin Durant', 30.1, 8.5, 5.6],
            ['Stephen Curry',   29.5,  5.5, 8.3]
        ]);

    
    var table = new google.visualization.Table(document.getElementById('table_div'));
    
    table.draw(table_data, {showRowNumber: true, width: '100%', height: '100%'});
    }

function drawTableFromCSV(csv) {
    //console.log("CSV passed into drawTable function:", csv)
    var table_data = new google.visualization.DataTable();
    console.log("Number of columns should be:",csv[0].length)
    
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
    console.log("# of string type columns:",string_col_count)

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
        console.error(err)
    }
    
    var table = new google.visualization.Table(document.getElementById('table_div'));
    
    table.draw(table_data, {showRowNumber: true, width: '100%', height: '100%', pageSize: 7});
    }