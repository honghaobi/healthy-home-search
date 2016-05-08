function bubbleChart() {

  // Constants for sizing
  var width = 1200;
  var height = 800;

  // tooltip for mouseover functionality
  var tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width/2, y: height/2 };

  // Used when setting up force and
  // moving around nodes
  var damper = 0.102;

  var svg = null;
  var bubbles = null;
  var nodes = [];

  // arrays for the sorted Data==>

  var weekDayCenters = {};
  var monthDayCenters = {};
  var timeOfDayCenters = {};
  var typeCenters = {};

  function createCenters(centerObj, centerCounts, rows) {
    var hSpacing = 550/(centerCounts/rows);
    var count = 1;
    for (var i = 0; i <= centerCounts; i++) {
      if (i <= Math.ceil(centerCounts/rows) - 1) {
        centerObj[i] = {
          x: 250 + hSpacing * count,
          y: 300
        }
        count += 1;
      } else if (i <= Math.ceil((2 * centerCounts)/rows) - 1) {
        centerObj[i] = {
          x: 250 + hSpacing * (count - (centerCounts/rows)),
          y: 400
        }
        count += 1;
      } else {
        centerObj[i] = {
          x: 250 + hSpacing * (count - (centerCounts * 2)/rows),
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
        typeCenters[property].x = 250 + hSpacing * count;
        typeCenters[property].y = 300;
        count += 1;
      } else if(count < uniqueCrimeCount * 2/3) {
        typeCenters[property].x = 250 + hSpacing * (count - Math.floor(uniqueCrimeCount/3));
        typeCenters[property].y = 400;
        count += 1;
      } else {
        typeCenters[property].x = 250 + hSpacing * (count - Math.floor((uniqueCrimeCount * 2)/3));
        typeCenters[property].y = 500;
        count += 1;
      }
    }
  }

  function charge(d) {
    return -Math.pow(d.radius, 2.0)/9
  }

  var force = d3.layout.force()
    .size([width, height])
    .charge(charge)
    .gravity(-0.001)
    .friction(0.9);

  var radiusScale = d3.scale.pow()
    .exponent(0.5)
    .range([2, 40]);

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

  const margin = {top: 20, right: 20, bottom: 30, left: 30};

  const x = d3.scale.linear()
    .range([margin.left + 40, width - margin.left - margin.right - 40]);

  const xMap = (d) => { console.log(d); return x(d.id) }

  const y = d3.scale.linear()
    .range([height - margin.top - margin.bottom - 40, margin.bottom + 40]);

  const yMap = (d) => { console.log(d);return y(d.value) }

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  var chart = function chart(selector, rawData) {
    // console.log(rawData);

    // weekDayCenters = {
    //   monday: 0,
    //   tuesday: 0,
    //   wednesday: 0,
    //   thursday: 0,
    //   friday: 0,
    //   saturday: 0,
    //   sunday: 0
    // };
    //
    // for (var i = 0; i < 6; i++) {
    //   weekDayCenters[i] = {x: 200 + 100 * i, y: height/2}
    // }

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

    // x.domain(d3.extent(nodes.map(node => { return node.created }))).nice();
    // y.domain(d3.extent(nodes.map(node => { return node.value }))).nice();

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
  };

  function splitBubbles(displayName) {
    force.on('tick', function(e) {
      bubbles.each(moveToCenters(e.alpha, displayName))
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });
    });
    force.start();
  }

  function moveToCenters(alpha, displayName) {
    return function (d) {
      if (displayName === 'by_day_of_week') {
        var target = weekDayCenters[d.byDayofWeek];
      } else if (displayName === 'by_day_of_month') {
        var target = monthDayCenters[d.byDayofMonth];
      } else if (displayName === 'by_time_of_day') {
        var target = timeOfDayCenters[d.time];
      } else if (displayName === 'by_crime_type') {
        var target = typeCenters[d.summarized_offense_description];
      } else {
        var target = center;
      }
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }


  chart.toggleDisplay = function(displayName) {
    splitBubbles(displayName);
  };

  function scatterPlot() {
    hideYears();
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + 200 +')')
      .call(xAxis)
      .attr('x', width)
      .attr('y', height);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    force.on('tick', (e) => {
      bubbles.each(moveToAxes(e.alpha))
      .attr('cx', (d) => { return d.x; })
      .attr('cy', (d) => { return d.y; });
    });
    force.start();
  }

  function moveToAxes(alpha) {
    return function(d) {
      console.log(d.month);
      d.x = d.x + (x(d.month) - d.x) * damper * alpha * 1.1;
      d.y = d.y + (y(d.value) - d.y) * damper * alpha * 1.1;
    };
  }

  function hideYears() {
    svg.selectAll('.year').remove();
  }

  function hideAxes() {
    svg.selectAll('g').remove();
  }

  function showYears() {
    var yearsData = d3.keys(yearsTitleX);
    var years = svg.selectAll('.year').data(yearsData);

      years.enter().append('text')
        .attr('class', 'year')
        .attr('x', function(d) { return yearsTitleX[d]; })
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text(function(d) { return d; });
  }

  function showDetail(d) {
    var content = '<span class="name">Crime: </span><span class="value">' +
                  d.summarized_offense_description +
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
      const button = d3.select(this);

      button.classed('active', true);

      const buttonId = button.attr('id');

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
