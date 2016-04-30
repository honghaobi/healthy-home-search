'use strict'

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

  var weekDayCenters = {
    0: { x: 200, y: height / 2 },
    1: { x: 325, y: height / 2 },
    2: { x: 450, y: height / 2 },
    3: { x: 575, y: height / 2 },
    4: { x: 700, y: height / 2 },
    5: { x: 825, y: height / 2 },
    6: { x: 950, y: height / 2 }
  }

  var monthDayCenters = {
    1: { x: 250, y: 200 },
    2: { x: 300, y: 200 },
    3: { x: 350, y: 200 },
    4: { x: 400, y: 200 },
    5: { x: 450, y: 200 },
    6: { x: 500, y: 200 },
    7: { x: 550, y: 200 },
    8: { x: 600, y: 200 },
    9: { x: 650, y: 200 },
    10: { x: 700, y: 300 },
    11: { x: 250, y: 300 },
    12: { x: 300, y: 300 },
    13: { x: 350, y: 300 },
    14: { x: 400, y: 300 },
    15: { x: 450, y: 300 },
    16: { x: 500, y: 300 },
    17: { x: 550, y: 300 },
    18: { x: 600, y: 300 },
    19: { x: 650, y: 300 },
    20: { x: 700, y: 300 },
    21: { x: 250, y: 400 },
    22: { x: 300, y: 400 },
    23: { x: 350, y: 400 },
    24: { x: 400, y: 400 },
    25: { x: 450, y: 400 },
    26: { x: 500, y: 400 },
    27: { x: 550, y: 400 },
    28: { x: 600, y: 400 },
    29: { x: 650, y: 400 },
    30: { x: 700, y: 400 },
    31: { x: 700, y: 400 },
  }
  var timeOfDayCenters = null;
  var typeCenters = null;

  var monthCenters = {
    0: { x: 100, y: 300 },
    1: { x: 200, y: 300 },
    2: { x: 300, y: 300 },
    3: { x: 400, y: 300 },
    4: { x: 500, y: 300 },
    5: { x: 600, y: 300 },
    6: { x: 700, y: 300 },
    7: { x: 200, y: 450 },
    8: { x: 300, y: 450 },
    9: { x: 400, y: 450 },
    10: { x: 500, y: 450 },
    11: { x: 600, y: 450 },
    12: { x: 700, y: 450 }
  };

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
      })
    })
    console.log(noders);
    noders.sort(function(a, b) { return b.value - a.value });
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
    console.log(rawData);

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
      .data(nodes, (rawData) => { return rawData.id });

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
      .attr('r', (d) => { return d.radius; });

    groupBubbles();
  };

  function groupBubbles() {
    hideYears();
    hideAxes();

    force.on('tick', (e) => {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', (d) => { return d.x })
        .attr('cy', (d) => { return d.y });
    });

    force.start();
  }

  function moveToCenter (alpha) {
    return (d) => {
      d.x = d.x + (center.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (center.y - d.y) * damper * alpha * 1.1;
    }
  };

  function splitBubblestoMonths() {
    // showYears();
    // hideAxes();
    force.on('tick', (e) => {
      bubbles.each(moveToMonths(e.alpha))
        .attr('cx', (d) => { return d.x; })
        .attr('cy', (d) => { return d.y; });
    });
    force.start();
  }

  function moveToMonths(alpha) {
    return function (d) {
      var target = monthCenters[d.month];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  function splitBubblestoDaysofWeek() {
    force.on('tick', (e) => {
      bubbles.each(moveToWeeks(e.alpha))
        .attr('cx', (d) => { return d.x; })
        .attr('cy', (d) => { return d.y; });
    });
    force.start();
  }

  function moveToWeeks(alpha) {
    return function (d) {
      var target = weekDayCenters[d.byDayofWeek];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  function splitBubblestoDaysofMonth() {
    force.on('tick', (e) => {
      bubbles.each(moveToDays(e.alpha))
        .attr('cx', (d) => { return d.x; })
        .attr('cy', (d) => { return d.y; });
    });
    force.start();
  }

  function moveToDays(alpha) {
    return function (d) {
      var target = monthDayCenters[d.byDayofMonth];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

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
    console.log(d.summarized_offense_description);
    var content = '<span class="name">Crime: </span><span class="value">' +
                  d.summarized_offense_description +
                  '</span><br/>' +
                  '<span class="name">Day of the Week </span><span class="value">' +
                  addCommas(d.byDayofWeek) +
                  '</span><br/>'
    tooltip.showTooltip(content, d3.event);
  }

  function hideDetail(d) {
     tooltip.hideTooltip();
  }

  chart.toggleDisplay = function(displayName) {
    if (displayName === 'all_crime') {
      groupBubbles();
      // scatterPlot();
    } else if (displayName === 'by_day_of_week') {
      splitBubblestoDaysofWeek();
    } else if (displayName === 'by_day_of_month') {
      splitBubblestoDaysofMonth();
    } else if (displayName === 'by_month_of_year') {
      splitBubblestoMonths();
    } else if (displayName === 'by_time_of_day') {

    } else if (displayName === 'by_crime_type') {

      groupBubbles();
    } else {
      console.log('default');
      groupBubbles();
    }
  };

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
