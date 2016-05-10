function bubbleChart() {

  var width = 1300;
  var height = 750;
  var tooltip = floatingTooltip('gates_tooltip', 240);
  var center = { x: width/2, y: height/2 };
  var damper = 0.102;
  var svg = null;
  var bubbles = null;
  var nodes = [];

  var force = d3.layout.force()
    .size([width, height])
    .charge(charge)
    .gravity(-0.001)
    .friction(0.9);
  var radiusScale = d3.scale.pow()
    .exponent(0.5)
    .range([2, 40]);

  var margin = {top: 20, right: 20, bottom: 30, left: 30};
  var x = d3.scale.linear()
    .range([margin.left + 40, width - margin.left - margin.right - 40]);
  var xMap = function(d) { console.log(d); return x(d.id) }
  var y = d3.scale.linear()
    .range([height - margin.top - margin.bottom - 40, margin.bottom + 40]);
  var yMap = function(d) { console.log(d);return y(d.value) }
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  var chart = function chart(selector, rawData) {
    var bubblesColorArray = [""];
    var randomColorArray = [];
    var arrayOfRandomColor = function(n) {

      for (var i = 0; i < n; i++) {
        var randomColor = "#" + ((1<<24)*Math.random()|0).toString(16);
        randomColorArray.push(randomColor);
      }
    }
    arrayOfRandomColor(50);

    var fillColor = d3.scale.ordinal().range(randomColorArray);

    nodes = createRealNodes(rawData);

    force.nodes(nodes);
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .classed('svg-content-responsive', true)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    bubbles = svg.selectAll('.bubble')
      .data(nodes, function(rawData) { return rawData.id });

    bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function(d) { return fillColor(d.group); })
      .attr('stroke', function(d) { return d3.rgb(fillColor(d.group)).darker(); })
      .attr('stroke-width', .3)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

     bubbles.transition()
      .duration(2000)
      .attr('r', function(d) { return d.radius; });

    splitBubbles();
    hideLabels();
  };

  var monthDays = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"];
  var weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var hourTime = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
  var months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var monthSections = ["1st-10th", "11th-20th", "21st-31st"];
  var timeSections = ["12AM-7AM", "8AM-3PM", "4PM-12PM"];

  var weekDayCenters = {};
  var monthDayCenters = {};
  var timeOfDayCenters = {};
  var typeCenters = {};
  var weekDayLabelCenters = {
    0: {x:310, y:640},
    1: {x:460, y:640},
    2: {x:590, y:640},
    3: {x:720, y:640},
    4: {x:830, y:640},
    5: {x:960, y:640},
    6: {x:1110, y:640}
  }

  var monthDayLabelCenters = {
    0: {x:180, y:200},
    1: {x:180, y:400},
    2: {x:180, y:600}
  }

  var timeLabelCenters = {
    0: {x:180, y:200},
    1: {x:180, y:400},
    2: {x:180, y:600}
  }

  function createCenters(centerObj, centerCounts, rows) {
    var hSpacing = 550/(centerCounts/rows);
    var count = 1;
    for (var i = 0; i <= centerCounts; i++) {
      if (i <= Math.ceil(centerCounts/rows) - 1) {
        centerObj[i] = {
          x: 400 + hSpacing * count,
          y: 300
        }
        count += 1;
      } else if (i <= Math.ceil((2 * centerCounts)/rows) - 1) {
        centerObj[i] = {
          x: 400 + hSpacing * (count - (centerCounts/rows)),
          y: 400
        }
        count += 1;
      } else {
        centerObj[i] = {
          x: 400 + hSpacing * (count - (centerCounts * 2)/rows),
          y: 500
        }
        count += 1;
      }
    }
  }

  function createTypeCenters(rawData) {
    var uniqueArray = [];
    for (var i = 0; i < rawData.original_data.length; i++) {
      if (uniqueArray.indexOf(rawData.original_data[i].summarized_offense_description) < 0) {
        typeCenters[rawData.original_data[i].summarized_offense_description] = {
          x: null , y: null
        };
      }
    }

    var uniqueCrimeCount = Object.keys(typeCenters).length;
    var hSpacing = 550/(uniqueCrimeCount/3);
    var count = 1;

    for (property in typeCenters) {
      if (count < uniqueCrimeCount/3 ) {
        typeCenters[property].x = 400 + hSpacing * count;
        typeCenters[property].y = 300;
        count += 1;
      } else if(count < uniqueCrimeCount * 2/3) {
        typeCenters[property].x = 400 + hSpacing * (count - Math.floor(uniqueCrimeCount/3));
        typeCenters[property].y = 400;
        count += 1;
      } else {
        typeCenters[property].x = 400 + hSpacing * (count - Math.floor((uniqueCrimeCount * 2)/3));
        typeCenters[property].y = 500;
        count += 1;
      }
    }
  }

  function charge(d) {
    return -Math.pow(d.radius, 2.0)/9
  }

  function createRealNodes(rawData) {
    createCenters(weekDayCenters, 7, 1);
    createCenters(monthDayCenters, 31, 3);
    createCenters(timeOfDayCenters, 24, 3);
    createTypeCenters(rawData);

    var noders = [];
    var myNodes = rawData.original_data.map(function(d) {

      var byDayofWeek = new Date(Date.parse(d.occurred_date_or_date_range_start
      )).getUTCDay();
      var byDayofMonth = new Date(Date.parse(d.occurred_date_or_date_range_start
      )).getUTCDate();
      var time = new Date(Date.parse(d.occurred_date_or_date_range_start
      )).getUTCHours();
      noders.push ({
        id: noders.length,
        radius: 10,
        summarized_offense_description: d.summarized_offense_description,
        month: d.month,
        year: d.year,
        byDayofMonth: byDayofMonth,
        byDayofWeek: byDayofWeek,
        time: time,
        group: d.summarized_offense_description,
        x: Math.random() * 900,
        y: Math.random() * 800
      });
    });
    return noders;
  }

  function splitBubbles(toCenters) {
    hideLabels();
    showLables(toCenters);
    force.on('tick', function(e) {
      bubbles.each(moveToCenters(e.alpha, toCenters))
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });
    });
    force.start();
  }

  function moveToCenters(alpha, toCenters) {
    return function (d) {
      if (toCenters === 'weekDayCenters') {
        var target = weekDayCenters[d.byDayofWeek];
      } else if (toCenters === 'monthDayCenters') {
        var target = monthDayCenters[d.byDayofMonth];
      } else if (toCenters === 'timeOfDayCenters') {
        var target = timeOfDayCenters[d.time];
      } else if (toCenters === 'typeCenters') {
        var target = typeCenters[d.summarized_offense_description];
      } else {
        var target = center;
      }
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  chart.toggleDisplay = function(toCenters) {
    splitBubbles(toCenters);
  };

  function hideLabels() {
    svg.selectAll('.d3_labels').remove();
  }

  function showLables(toCenters) {
    if (toCenters === 'weekDayCenters') {
      var labelCenterLoc = weekDayLabelCenters;
      var labeText = weekDays;
    } else if (toCenters === 'monthDayCenters') {
      var labelCenterLoc = monthDayLabelCenters;
      var labeText = monthSections;
    } else if (toCenters === 'timeOfDayCenters') {
      var labelCenterLoc = timeLabelCenters;
      var labeText = timeSections;
    } else if (toCenters === 'typeCenters') {
      var centerObj = typeCenters;
    }
    var dataCenters = svg.selectAll('.d3_labels').data(d3.keys(labelCenterLoc));
      dataCenters.enter().append('text')
        .attr('class', 'd3_labels')
        .attr('x', function (d) {
          return labelCenterLoc[d].x; })
        .attr('y', function (d) { return labelCenterLoc[d].y; })
        .attr('text-anchor', 'middle')
        .text(function(d) { return labeText[d]; });
  }

  function showDetail(d) {
    var content = '<span class="name">Crime: </span><span class="value">' +
                  d.summarized_offense_description +
                  '</span>' + '</br>' +
                  '<span class="name">Date of Occurance: </span><span class="value">' +
                  months[d.month] + "-" + monthDays[d.byDayofMonth] + "-" +
                  d.year +
                  '</span>' + '</br>' +
                  '<span class="name">Time of Occurance: </span><span class="value">' +
                  hourTime[d.time] + " On " + weekDays[d.byDayofWeek] +
                  '</span>';
    tooltip.showTooltip(content, d3.event);
  }

  function hideDetail(d) {
     tooltip.hideTooltip();
  }

  return chart;
}

var myBubbleChart = bubbleChart();

function display(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart('.crime_graph', data);
}

function setupButtons() {
  d3.select('.safe_menu')
    .selectAll('.button')
    .on('click', function () {
      d3.selectAll('.button').classed('active', false);
      var button = d3.select(this);

      button.classed('active', true);

      var buttonId = button.attr('id');

      myBubbleChart.toggleDisplay(buttonId);
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// Load the data.

d3.json('crime.json', display);

// setup the buttons.
setupButtons();
