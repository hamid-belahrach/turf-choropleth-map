const format = d3.format(',');
const width = 960;
const height = 500;

function initTooltip(){
    return d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Sessions: </strong><span class='details'>${ d.sessions ? format(d.sessions): 0}</span>`);
}

function initMapColors(){
    return d3.scaleThreshold()
        .domain([50, 100, 200, 400, 800, 1600, 500000])
        .range(['#00bfff', '#00b2ee', '#00a6dd', '#0080aa', '#068', '#004d66', '#034']);
}

function initSvg(){
    return d3.select('#choroplethmap')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style("fill", "rgb(221, 221, 221)")
        .append('g')
        .attr('class', 'map');
}

function initProjection() {
    return d3.geoRobinson()
        .scale(148)
        .rotate([352, 0, 0])
        .translate( [width / 2, height / 2]);
}

function initPath(){
    return d3.geoPath().projection(projection);
}

function ready(error, data, sessions) {
    const populationById = {};
    sessions.forEach(d => { populationById[d.id] = +d.sessions; });
    data.features.forEach(d => { d.sessions = populationById[d.id] });

    svg.append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', d => color(populationById[d.id]))
        .style('stroke', 'white')
        .style('opacity', 0.8)
        .style('stroke-width', 0.3)
        // tooltips
        .on('mouseover',function(d){
            tip.show(d);
            d3.select(this)
                .style('opacity', 1)
                .style('stroke-width', 3);
        })
        .on('mouseout', function(d){
            tip.hide(d);
            d3.select(this)
                .style('opacity', 0.8)
                .style('stroke-width',0.3);
        });
    svg.append('path')
        .datum(topojson.mesh(data.features, (a, b) => a.id !== b.id))
        .attr('class', 'names')
        .attr('d', path);
}

function update(error, data, sessions){
    const populationById = {}
    sessions.forEach(d => { populationById[d.id] = +d.sessions; });
    data.features.forEach(d => { d.sessions = populationById[d.id] });
    svg.selectAll('path')
        .data(data.features)
        .style('fill', d => color(populationById[d.id]));
}

const tip = initTooltip();
const color = initMapColors();
const svg = initSvg();
const projection = initProjection();
const path = initPath()
svg.call(tip);

d3.json('./world_countries.json').then(function(d) {
    // sample data
    var data = [{"id": "SAU", "name": "Saudi Arabia", "sessions": 1300}];
    ready(null, d, data)
});

$("#datepicker1").flatpickr({
    dateFormat: "Y-m-d",
    wrap: true,
    onChange: function(selectedDates, dateStr, instance) {
        console.log("selectedDates: ", selectedDates);
        console.log("dateStr: ", dateStr);
        console.log("instance: ", instance);
        d3.json('./world_countries.json').then(d => {
            // sample data
            var data = [{"id":"ESP", "name": "Spain", "sessions": 1}];
            update(null, d, data)
        });
    }
});

$("#datepicker2").flatpickr({
    dateFormat: "Y-m-d",
    wrap: true,
    onChange: function (selectedDates, dateStr, instance) {
        console.log("selectedDates: ", selectedDates);
        console.log("dateStr: ", dateStr);
        console.log("instance: ", instance);
        d3.json('./world_countries.json').then(d => {
            // sample data
            var data = [{"id": "ESP", "name": "Spain", "sessions": 1}];
            update(null, d, data)
        });
    }
});