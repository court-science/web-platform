    function allowDropStats(ev) {
        var stats = document.getElementById('drop-stats').children.length;
        if (stats<max_stats && target_id.includes('stat')) ev.preventDefault();
    }

    function allowDropScatter(ev) {
        if(target_id.includes('stat')) ev.preventDefault();
    }

    function allowDropPlayers(ev) {
        if (document.getElementById('drop-players').children.length<max_players && target_id.includes('name')) ev.preventDefault();
    }

    function allowDropPlayersBack(ev) {
        if(target_id.includes('name')) ev.preventDefault();
    }

    function allowDropStatsBack(ev) {
        if(target_id.includes('stat')) ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
        target_id = ev.target.id;
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        court_science_magic(inputCSV);
    }

    function dropScatter(ev) {
        ev.preventDefault();
        if(ev.target.children.length == 1) {
            let stat = ev.target.children[0];
            ev.target.removeChild(stat);
            document.getElementById('drag-stats').appendChild(stat);
        }
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        court_science_magic(inputCSV);
    }

    function disableDrop(ev) {
        ev.stopPropagation();
    }

    function CSV_to_parsed_df(data, rows, cols) {
        var obj_df = [];
        for (var i=1; i<data.length; i++) {
            var obj = {};
            for (var col of cols) {
                obj[data[0][col]] = data[i][col];
            }
            obj['Plot'] = rows.includes(i);
            obj_df.push(obj);
        }
        return obj_df;
    }

    function loadJSON(callback) {

        var xobj = new XMLHttpRequest();
        
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'static/Definitions.json', true);
        xobj.onreadystatechange = function () {
              if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
              }
        };
        xobj.send(null);
     }

    function getHoverDefinition(stat, id) {
        loadJSON(function(response) {
            // Parse JSON string into object
            var JSON_parsed = JSON.parse(response);
            var stat_to_search = stat.toUpperCase();

            if (JSON_parsed.hasOwnProperty(stat_to_search)) {
                document.getElementById(id).setAttribute("title", JSON_parsed[stat_to_search]);
            }
        });
    }

    function main(data) {

        var lst_stats = [window.name_index];
        var lst_players = [];
        var players_children = document.getElementById('drop-players').children;
        var stats_children = [];
        if(!scatter_input.checked) stats_children = document.getElementById('drop-stats').children;
        else {stats_children.push(document.getElementById('drop-stats-x').children[0]);
            stats_children.push(document.getElementById('drop-stats-y').children[0]);}
        var div_to_add = document.getElementById('chart-row');
        var chart = document.getElementById('chart-div');

        for (ch of stats_children) {
            lst_stats.push(parseInt(ch.value));
        }

        for (ch of players_children) {
            lst_players.push(parseInt(ch.value));
        }

        var obj_df = CSV_to_parsed_df(data, lst_players, lst_stats);
        
        chart.remove();
        div_to_add.insertAdjacentHTML('beforeend', "<div id='chart-div' class='col-md-10 col-md-offset-1 text-center'>");
        
        if(radar_input.checked) {
            radarChart(obj_df);
        } else if(bar_input.checked) {
            groupedBarChart(obj_df);
        }
        else {
            scatterChart(obj_df);
        }
    }

    function court_science_magic (inputCSV) {
        Papa.parse(inputCSV, {
            download: true,
            dynamicTyping: true,
            complete: function(results) {
                if(scatter_input.checked) var stats = document.getElementById('drop-stats-x').children.length + document.getElementById('drop-stats-y').children.length;
                else var stats = document.getElementById('drop-stats').children.length;
                var players = document.getElementById('drop-players').children.length;
                if(stats >= min_stats && stats <= max_stats && players >= min_players && players <= max_players) {
                    main(results['data']);
                }
            }
        });
    }

    function papaParse(inputCSV) {
        Papa.parse(inputCSV, {
            download: true,
            complete: function(results) {
                let df = results['data'];
                        
                //Re-draw table with any update to the input CSV
                drawTableFromCSV(df);

                window.num_players = df.length - 1;
                let headers = df[0];
                let sample_data = df[1];
                let num_str = "0123456789";
                let headers_filtered = [];
                let headers_filtered_index = [];
                let count = 1;
                window.name_index = 0;
                let name_found = false;

                for (let i = 0; i < headers.length; i++) {
                    if (num_str.includes(sample_data[i][0])) {
                        headers_filtered.push(headers[i]);
                        headers_filtered_index.push(i);
                    }
                    if (headers[i].toUpperCase().includes("NAME") && !name_found) {
                        window.name_index = i;
                        name_found = true;
                    }
                }
                if(!name_found) {
                    alert("Please include a 'player name' column in your spreadsheet to identify players!")
                } else {
                    window.num_stats = headers_filtered.length;
                    var stats_drag = document.getElementById('drag-stats');
                    var players_drag = document.getElementById('drag-players');
                    var players_drop = document.getElementById('drop-players');
                    stats_drag.innerHTML = '';
                    players_drag.innerHTML = '';
                    if(!scatter_input.checked) document.getElementById('drop-stats').innerHTML = '';
                    else {document.getElementById('drop-stats-x').innerHTML = ''; document.getElementById('drop-stats-y').innerHTML = '';}
                    players_drop.innerHTML = '';

                    for (let i=0; i < headers_filtered.length; i++) {

                        let name = "'stat" + String(count) + "'";
                        let id = "stat" + String(count);
                        let string_to_add = "<button type='button' style='margin-right: 2%; margin-bottom: 2%' class='btn btn-primary' ondragover='disableDrop(event)' ondrop='disableDrop(event)' name='" + headers_filtered[i] + "' draggable='true' ondragstart='drag(event)' id=" + name + " value=" + "'"+ headers_filtered_index[i] + "'>" + headers_filtered[i] + "</button>";
                        stats_drag.insertAdjacentHTML('beforeend', string_to_add);
                        getHoverDefinition(headers_filtered[i], id);
                        count += 1;

                    }

                    count = 1;

                    for (let i = 1; i < df.length; i++) {

                        let player_name = df[i][name_index];
                        let name = "'name" + String(count) + "'";
                        let name_attr = "'" + player_name + "'";
                        let string_to_add = "<button type='button' style='margin-right: 2%; margin-bottom: 2%' class='btn btn-primary' ondragover='disableDrop(event)' ondrop='disableDrop(event)' name=" + name_attr + " draggable='true' ondragstart='drag(event)' id=" + name + " value=" + "'"+ i + "'>" + player_name + "</button>";
                        players_drag.insertAdjacentHTML('beforeend', string_to_add);
                        count++;

                    }
                }
            }
        });
    }

    function resetButton() {
        dropDown.disabled = false;
        inputElement.disabled = false;
        papaParse(inputCSV);
        document.getElementById('chart-div').remove();
        document.getElementById('chart-row').insertAdjacentHTML('beforeend', "<div id='chart-div' class=\"col-md-10 col-md-offset-1 text-center\"><img id=\"starter-img\" alt=\"Radar-Chart.png\" class=\"display-chart\"></div>");
        document.getElementById('starter-img').src = img_src;
    }

    function handleFiles() {
        inputCSV = this.files[0];
        papaParse(inputCSV);
        dropDown.value = "";
    }

    function handleLocalFiles() {
        inputCSV = dropDown.value;
        papaParse(inputCSV);
        inputElement.value=null;
    }

    function handleRadar() {
        if(radar_input.checked) {
            console.log(checked_charts[checked_charts.length-1]);
            if(checked_charts[checked_charts.length-1] != "Radar") {
                resetButton();
                stats_div.innerHTML = "<div id='drop-stats'>\n" +
                    "            <div class='drop-zone' ondrop='drop(event)' ondragover='allowDropStats(event)'></div>\n" +
                    "            </div>";
                document.getElementById('drop-players').innerHTML = '';
                document.getElementById('chart-div').remove();
                document.getElementById('chart-row').insertAdjacentHTML('beforeend', "<div id='chart-div' class=\"col-md-10 col-md-offset-1 text-center\"><img src=\"static/Radar-Chart.png\" id=\"starter-img\" alt=\"Radar-Chart.png\" class=\"display-chart\"></div>");
            }
            var stats = document.getElementById('drop-stats').children.length;
            var players = document.getElementById('drop-players').children.length;
            stats_message.innerHTML = "*Drop 3-7 stats";
            players_message.innerHTML = "*Drop 1-3 players";
            max_players=3;
            max_stats=7;
            min_stats = 3;
            min_players = 1;
            if(stats==0 && players==0) document.getElementById('starter-img').src = 'static/Radar-Chart.png';
            img_src = "static/Radar-Chart.png";
            checked_charts.push("Radar");
            if(stats >= min_stats && stats <= max_stats && players >= min_players && players <= max_players) {
                court_science_magic(inputCSV)
            } else if((stats > 0 && stats < min_stats) || (stats > max_stats) || (players > 0 && players < min_players) || (players > max_players)) {
                document.getElementById('chart-div').remove();
                document.getElementById('chart-row').insertAdjacentHTML('beforeend', "<div id='chart-div' class=\"col-md-10 col-md-offset-1 text-center\"><img src=\"static/Radar-Chart.png\" id=\"starter-img\" alt=\"Radar-Chart.png\" class=\"display-chart\"></div>");
                // alert("Please select " + min_stats + "-" + max_stats + " stats and " + min_players + "-" + max_players + " players to plot!");
            }
        }
    }

    function handleBar() {
        if(bar_input.checked) {
            console.log(checked_charts[checked_charts.length-1]);
            if(checked_charts[checked_charts.length-1] != "Bar") {
                resetButton();
                stats_div.innerHTML = "<div id='drop-stats'>\n" +
                    "            <div class='drop-zone' ondrop='drop(event)' ondragover='allowDropStats(event)'></div>\n" +
                    "            </div>";
                document.getElementById('drop-players').innerHTML = '';
                document.getElementById('chart-div').remove();
                document.getElementById('chart-row').insertAdjacentHTML('beforeend', "<div id='chart-div' class=\"col-md-10 col-md-offset-1 text-center\"><img src=\"static/Bar-Chart (3).png\" id=\"starter-img\" alt=\"Radar-Chart.png\" class=\"display-chart\"></div>")
            }
            var stats = document.getElementById('drop-stats').children.length;
            var players = document.getElementById('drop-players').children.length;
            stats_message.innerHTML = "*Drop 1-5 stats";
            players_message.innerHTML = "*Drop 1-5 players";
            max_players=5;
            max_stats=5;
            min_stats = 1;
            min_players = 1;
            if(stats==0 && players==0) document.getElementById('starter-img').src = 'static/Bar-Chart (3).png';
            img_src = "static/Bar-Chart (3).png";
            checked_charts.push("Bar");
            if(stats >= min_stats && stats <= max_stats && players >= min_players && players <= max_players) {
                court_science_magic(inputCSV)
            } else if((stats > 0 && stats < min_stats) || (stats > max_stats) || (players > 0 && players < min_players) || (players > max_players) || (stats > 0 && players < min_players)) {
                document.getElementById('chart-div').remove();
                document.getElementById('chart-row').insertAdjacentHTML('beforeend', "<div id='chart-div' class=\"col-md-10 col-md-offset-1 text-center\"><img src=\"static/Bar-Chart (3).png\" id=\"starter-img\" alt=\"Radar-Chart.png\" class=\"display-chart\"></div>")
                // alert("Please select " + min_stats + "-" + max_stats + " stats and " + min_players + "-" + max_players + " players to plot!");
            }
        }
    }

    function handleScatter() {
        if(scatter_input.checked) {
            console.log(checked_charts[checked_charts.length-1]);
            var stats = document.getElementById('drop-stats').children.length;
            var players = document.getElementById('drop-players').children.length;
            stats_message.innerHTML = "*Drop one stat for each axis";
            players_message.innerHTML = "*Drop players to highlight";
            max_players=100;
            max_stats=2;
            min_stats = 2;
            min_players = 0;
            document.getElementById('chart-div').remove();
            document.getElementById('chart-row').insertAdjacentHTML('beforeend', "<div id='chart-div' class=\"col-md-10 col-md-offset-1 text-center\"><img src=\"static/Scatter-Chart.png\" id=\"starter-img\" alt=\"Radar-Chart.png\" class=\"display-chart\"></div>")
            document.getElementById('starter-img').src = 'static/Scatter-Chart.png';
            img_src = "static/Scatter-Chart.png";
            resetButton();
            stats_div.innerHTML =   "   <div class='row'>" +
            "   <div class='drop-stats-x col-md-12' id='drop-stats-x' ondrop='dropScatter(event)' ondragover='allowDropScatter(event)'></div>" +
            " </div>" +
            " <div class='row'>" +
            "   <div class='drop-stats-y col-md-12' id='drop-stats-y' ondrop='dropScatter(event)' ondragover='allowDropScatter(event)'></div>" +
            " </div>";
            document.getElementById('drop-players').innerHTML = '';
            checked_charts.push("Scatter");
            if(stats >= min_stats && stats <= max_stats && players >= min_players && players <= max_players) {
                court_science_magic(inputCSV)
            }
        }
    }

    function searchBarPlayers() {
      var input, filter, container, buttons, i, txtValue;
      input = document.getElementById('searchInputPlayers');
      filter = input.value.toUpperCase();
      container = document.getElementById("drag-players");
      buttons = container.getElementsByTagName('button');

      for (i = 0; i < buttons.length; i++) {
        txtValue = buttons[i].name;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          buttons[i].style.display = "";
        } else {
          buttons[i].style.display = "none";
        }
      }
    }

    function searchBarStats() {
      var input, filter, container, buttons, i, txtValue;
      input = document.getElementById('searchInputStats');
      filter = input.value.toUpperCase();
      container = document.getElementById("drag-stats");
      buttons = container.getElementsByTagName('button');

      for (i = 0; i < buttons.length; i++) {
        txtValue = buttons[i].name;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          buttons[i].style.display = "";
        } else {
          buttons[i].style.display = "none";
        }
      }
    }

    function sendMail() {
        var link = "mailto:contact@courtscience.ca"
                 + "&subject=" + escape("Feedback about Court Science")
                //  + "&body=" + escape(document.getElementById('myText').value)
        ;
    
        window.location.href = link;
    }