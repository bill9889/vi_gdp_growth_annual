const W = 1700, H = 400; // dimensions of canvas
const time = 500; // number of x tick values
const step = W/time; // time step

let count = 0; // steps counter
let ticks_year = 0;
let step_year = 0;
let pos, fy, c, infected, colors, maxH, l, f, csv;

var minYears = 2000;
var maxYears = 2021;
var yearRange = maxYears - minYears;
var maxDuration = 12;
var minDuration = -12;
var durationRange =  maxDuration - minDuration;
var marginX = 30;
var marginY = 30;

var legendX = 1680;
var legendY = 250;
var legendW = 200;
var legendH = 300;


function preload() {
  csv = loadTable('NY_GDP_PCAP_Interpolated_v2.csv', 'csv');
}

function setup() {
  const canvas = createCanvas(W + legendW, H * 2);
  canvas.parent('canvasDiv');
  frameRate(45);

  // array containing the x positions of the line graph, scaled to fit the canvas
  posx = Float32Array.from({ length: time }, (_, i) => map(i, 0, time, marginX, W - marginX));
  
  // function to map the number of infected people to a specifiec height (here the height of the canvas)
  fy = _ => map(_,  maxDuration + 1, 0, 0, H) ;
  
  // colors based on height stored in an array list.
  //colors = d3.range(H).map(i => d3.interpolateWarm(norm(i, 0, H)));

  num_g8 = Array.from ({length: csv.getRowCount()}, (_, i) => i)
  colors = d3.scaleOrdinal().domain(num_g8).range(d3.schemeCategory10);
  console.log();
}


function draw() {
  background('#fff');

  var graphHeight = (H * 2) - marginY * 2;
  var graphWidth = (W) - marginX * 2;

  stroke(230);
  for (var i = 0; i <= maxDuration; i++) {
    line(marginX, marginY + i * (graphHeight / (maxDuration)), marginX + graphWidth, marginY + i * (graphHeight / (maxDuration )));
  }

  for (var i = 0; i < yearRange - 1; i++) {
     line(marginX + (i + 1) * (graphWidth / (yearRange - 1)), marginY, marginX + (i + 1) * (graphWidth / (yearRange - 1)), marginY + graphHeight);
  }
  
  for (var i = 0; i < yearRange; i++) {
    textAlign(CENTER, TOP);    
    text(round(minYears + i * (yearRange / (yearRange - 1))), marginX + (graphWidth / (yearRange - 1)) * i, marginY + graphHeight + 5);
  }

  for (var i = 0; i <= maxDuration; i++) {
    textAlign(RIGHT, CENTER);
    text(round(maxDuration - i * (durationRange / (maxDuration ))), marginX - 5, marginY + (graphHeight / (maxDuration)) * i);
  }


  for (let c = 0; c < csv.getRowCount(); c++) {
    fill(colors(c));
    noStroke();
    rect(legendX + 10, legendY + 14 + 35 * (c), 10, 10);
  }

  fill("#fff");

  for (let c = 0; c < csv.getRowCount(); c++) {
    country = csv.getString(c, 0);    
    textAlign(LEFT);
    fill(0);
    text(country, legendX + 30, legendY + 20 + 35 * (c), legendW - 10);
  }
  
  stroke(0)

  // frameCount
  f = frameCount;
  
  // store that number at each step (the x-axis tick values)
  if (f&step) {
    count += 1;
  }

  // iterate over data list to rebuild curve at each frame
  for (let i = 1; i < count && count < time; i++) {
    
    x1 = posx[i];
    x2 = posx[i+1];

    for (let c = 0; c < csv.getRowCount(); c++) {
      curr_point = csv.getString(c, i);
      next_point = csv.getString(c, i  + 1 );

      y1 = fy(curr_point);
      y2 = fy(next_point);
      strokeWeight(2);
      stroke(colors(c));
      line(x1, y1, x2, y2);
    }    
  }

  
  // reset data and count
  if (count%time===0) {
    count = 0;
    step_year = 0;
  }

}
