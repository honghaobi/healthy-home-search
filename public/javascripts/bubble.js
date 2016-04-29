const bubbleChart = () => {

  // Constants for sizing
  const width = 900;
  const height = 700;

  // tooltip for mouseover functionality
  const tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  const center = { x: width/2, y: height/2 };

  // Used when setting up force and
  // moving around nodes
  const damper = 0.102;

  let svg = null;
  let bubbles = null;
  let nodes = [];

  // arrays for the sorted Data==>
  let sortedSkorz = null;
  let yearsTitleX = null;
  let weekDayCenters = null;


  //Dont Touch ==>

  const charge = (d) => {
    return -Math.pow(d.radius, 2.0)/9
  }

  const force = d3.layout.force()
  .size([width, height])
  .charge(charge)
  .gravity(-0.001)
  .friction(0.9);

  //================================

  const radiusScale = d3.scale.pow()
    .exponent(0.5)
    .range([2, 40]);

  const createRealNodes = (rawData) => {
    const noders = [];
    const myNodes = rawData.original_data.map((d) => {

      const byDayofWeek = new Date(Date.parse(d.occurred_date_or_date_range_start
      )).getUTCDay();
      const byDayofMonth = new Date(Date.parse(d.occurred_date_or_date_range_start
      )).getUTCDate();
      const time = new Date(Date.parse(d.occurred_date_or_date_range_start
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
    noders.sort((a, b) => { return b.value - a.value })
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
    // .orient('bottom');

  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  const chart = (selector, rawData) => {
    console.log(rawData);

    // const maxAmount = d3.max(rawData.scores, (d) => { return +d.score; });
    // const skorz = getScores(rawData.scores);
    //   sortedSkorz = skorz.sort((a, b) => {
    //     return a - b;
    //   });

    //layout of the sorted graph ==>>>>
    // weekDayCenters = {};
    // for (var i = 0; i < sortedSkorz.length; i++) {
    //   weekDayCenters[sortedSkorz[i]] = {x: 200 + 100 * i, y: height/2}
    // }

    var randomColorArray = [];
    var arrayOfRandomColor = function(n) {

      for (var i = 0; i < n; i++) {
        var randomColor = "#" + ((1<<24)*Math.random()|0).toString(16);
        randomColorArray.push(randomColor);
      }
    }
    arrayOfRandomColor(50);


    const fillColor = d3.scale.ordinal().range(randomColorArray);

    //   yearsTitleX = {};
    //   for (var i = 0; i < sortedSkorz.length; i++) {
    //     yearsTitleX[sortedSkorz[i]] = width / ((sortedSkorz.length + 1) / (i + 1));
    //   }

    //====================================

    radiusScale.domain([0, 1]);
    nodes = createRealNodes(rawData);

    x.domain(d3.extent(nodes.map(node => { return node.created }))).nice();
    y.domain(d3.extent(nodes.map(node => { return node.value }))).nice();

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
      .attr('fill', (d) => { return fillColor(d.group); })
      .attr('stroke', (d) => { return d3.rgb(fillColor(d.group)).darker(); })
      .attr('stroke-width', 0.3)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

     bubbles.transition()
      .duration(2000)
      .attr('r', (d) => { return d.radius; });

    groupBubbles();
  };

  const groupBubbles = () => {
    hideYears();
    hideAxes();

    force.on('tick', (e) => {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', (d) => { return d.x })
        .attr('cy', (d) => { return d.y });
    });

    force.start();
  }

  const moveToCenter = (alpha) => {
    return (d) => {
      d.x = d.x + (center.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (center.y - d.y) * damper * alpha * 1.1;
    }
  };

  const splitBubbles = () => {
    showYears();
    hideAxes();
    force.on('tick', (e) => {
      bubbles.each(moveToYears(e.alpha))
        .attr('cx', (d) => { return d.x; })
        .attr('cy', (d) => { return d.y; });
    });
    force.start();
  }

  const moveToYears = (alpha) => {
    return (d) => {
      const target = year[d.value];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  const scatterPlot = () => {
    hideYears();
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + 100 +')')
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

  const moveToAxes = (alpha) => {
    return (d) => {
      d.x = d.x + (x(d.created) - d.x) * damper * alpha * 1.1;
      d.y = d.y + (y(d.value) - d.y) * damper * alpha * 1.1;
    };
  }

  const hideYears = () => {
    svg.selectAll('.year').remove();
  }

  const hideAxes = () => {
    svg.selectAll('g').remove();
  }

  const showYears = () => {
    const yearsData = d3.keys(yearsTitleX);
    const years = svg.selectAll('.year')
      .data(yearsData);

      years.enter().append('text')
        .attr('class', 'year')
        .attr('x', (d) => { return yearsTitleX[d]; })
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text((d) => { return d; });
  }

  const showDetail = (d) => {
    console.log(d.summarized_offense_description);
    const content = '<span class="name">Crime: </span><span class="value">' +
                  d.summarized_offense_description +
                  '</span><br/>' +
                  '<span class="name">Day of the Week </span><span class="value">' +
                  addCommas(d.byDayofWeek) +
                  '</span><br/>';
    tooltip.showTooltip(content, d3.event);
  }


  chart.toggleDisplay = (displayName) => {
    if (displayName === 'year') {
      splitBubbles();
    } else if (displayName === 'scatter') {
      scatterPlot();
    } else {
      groupBubbles();
    }
  };

  return chart;
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

// function getScores(arr) {
//   const scores = [];
//   for (var i = 0; i < arr.length; i++) {
//     if (scores.indexOf(arr[i].score) === -1) {
//       scores.push(arr[i].score)
//     }
//   }
//   return scores;
// }




//DONT TOUCH ==>

const hideDetail = (d) => {
  
   tooltip.hideTooltip();
}

const myBubbleChart = bubbleChart();

const display = (error, data) => {
  if (error) {
    console.log(error);
  }

  myBubbleChart('.crime_graph', data);
}

const setupButtons = () => {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      d3.selectAll('.button').classed('active', false);
      const button = d3.select(this);

      button.classed('active', true);

      const buttonId = button.attr('id');

      myBubbleChart.toggleDisplay(buttonId);
    });
}

const addCommas = (nStr) => {
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
