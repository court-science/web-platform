google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(drawSampleTable);

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