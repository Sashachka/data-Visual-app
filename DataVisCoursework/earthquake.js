//a lot from this was from climate-change.js as base, fruits.js & tech-diversity-gender as additions
function Earthquake() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Earthquakes';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'earthquake';

  // Property to represent whether data has been loaded.
  this.loaded = false;
    
    //code sketch for waffles 
    var magnitude;
    var years;
    this.month;
    var yearButtons = [];
    this.NumYears;
     
  //for siplaying info to box
  this.cdi;
  this.mmi;
  this.sig;
  this.nst;
  this.dmin;
  
  this.selectedYear = null;
  this.byYear = {};
  
  // colours
    var colours = ['aqua', 'blue','olive', 'yellow','orange','red', 'maroon', 'purple'];
  
  //from climate change so this is for x- y
  // Names for each axis.
  this.xAxisLabel = 'month';
  this.yAxisLabel = 'magnitude';

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Margin positions around the plot. Left and bottom have double
    // margin size to make space for axis and tick labels on the canvas.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: false,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 12,
    numYTickLabels: 8,
  };

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/earthquake_data_tsunami.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };
  
  this.destroy = function() {
  for (let btn of yearButtons) {
    btn.remove();
  }
  yearButtons = [];
        
};

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    
     this.NumYears = [];
    years = this.data.getColumn('Year').map(m => int(m));
    this.month = this.data.getColumn('Month').map(m => int(m));
    magnitude = this.data.getColumn('magnitude').map(m => float(m));
    
    this.cdi = this.data.getColumn('cdi').map(m => float(m));
    this.mmi = this.data.getColumn('mmi').map(m => float(m));
    this.sig = this.data.getColumn('sig').map(m => float(m));
    this.nst = this.data.getColumn('nst').map(m => float(m));
    this.dmin = this.data.getColumn('dmin').map(m => float(m));

    
    //my code
    for(let i = 0; i < years.length; i++){
      let temp = years[i];
      if(!this.NumYears.includes(temp)){
        this.NumYears.push(temp);
      }
    }
   
    //ens of my code
    
   this.byYear = {}; // reset

    //my code+ chatGpt code
for (let i = 0; i < this.month.length; i++) {
  const y = years[i];          // year of this quake
  const m = this.month[i];     // month 1..12
  const mag = magnitude[i];
  
  //maybe instead of hardcoding this i will try changing this on loop but planing
  const cdi = this.cdi[i];
  const mmi = this.mmi[i];
  const sig = this.sig[i]; 
  const nst = this.nst[i];
  const dmin = this.dmin[i];

  //my code
  if (!this.byYear[y]) {
    this.byYear[y] = {};
  }
  if (!this.byYear[y][m]) {
    this.byYear[y][m] = [];
  }
  this.byYear[y][m].push({
    mag: mag,
    cdi: cdi,
    mmi: mmi,
    sig: sig,
    nst: nst,
    dmin: dmin
  });
}
    //chatGpt code
    this.selectedYear = this.NumYears[0]; // or last one if you prefer
   

	fill(0);
    textSize(20);
    var numColumns = this.data.getColumnCount();
    
    var self = this;
    for(var i = 0; i < this.NumYears.length; i++)
    {
        var y = this.NumYears[i]; 
        var b = createButton(y, y);
        b.parent('years');
        b.mousePressed(function()
        {
             self.changeYear(this.elt.value);
        });
        yearButtons.push(b);
        
        
    }
    
  };
  
  


  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
   
     textSize(16);
    textAlign('center', 'center');

    // Set min and max years: assumes data is sorted by year.
    this.minYear = 1;
    this.maxYear = 12;
    
    //// Find min and max temperature for mapping to canvas height.
    this.minTemperature = 1;
    this.maxTemperature = 9;

  

    
    //
    drawYAxisTickLabels(this.minTemperature,
                        this.maxTemperature,
                        this.layout,
                        this.mapTemperatureToHeight.bind(this),
                        1);
    

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);
    
     for (let year = this.minYear; year <= this.maxYear; year++) {
    drawXAxisTickLabel(year,              // value
                     this.layout,       // layout object
                     this.mapYearToWidth.bind(this)); // mapFunction
       
       
}
      
    
    
    //drawing rectangles so magnitudes
// If no year selected yet, nothing to draw
if (!this.selectedYear || !this.byYear[this.selectedYear]) {
  return;
}
    
    // store hovered bar info (if any)
let hovered = null;

var groupWidth = this.layout.plotWidth() / (this.maxYear - this.minYear + 1) * 0.8;

for (let month = this.minYear; month <= this.maxYear; month++) {
  const quakes =(this.byYear[this.selectedYear][month]) || [];  // magnitudes in this month of selectedYear

  const n = quakes.length;
  if (n === 0) {
    continue;
  }

  const baseX = this.mapYearToWidth(month);
  const barWidth = groupWidth / n;
  
  //for hovering
  let hoveredIndex = -1;
let hoveredX = 0;
let hoveredY = 0;
let hoveredSize = 0;


//my code
  for (let k = 0; k < n; k++) {
    const quake = quakes[k];
  const mag = quake.mag;
  const cdi = quake.cdi;
    const mmi = quake.mmi;
    const sig = quake.sig;
    const nst = quake.nst;
    const dmin = quake.dmin;

    const x = baseX - groupWidth / 2 + k * barWidth + barWidth / 2;

    const topY = this.mapTemperatureToHeight(mag);
    const bottomY = this.layout.bottomMargin;
    const h = bottomY - topY;
    
    const rectX = x - barWidth / 2 + 30;
    const rectY = topY;
    const rectW = barWidth;
    const rectH = h;
    

    let idx = floor(map(mag,
                        this.minTemperature, this.maxTemperature,
                        0, colours.length));
    idx = constrain(idx, 0, colours.length - 1);

    fill(colours[idx]);
    noStroke();

    rect(rectX, rectY, rectW, rectH);
    
     //drawing box for mouse Over thing

  if (mouseX >= rectX && mouseX <= rectX + rectW &&
    mouseY >= rectY && mouseY <= rectY + rectH) {
    hovered = {
    year: this.selectedYear,
    month: month,
    magnitude: mag,
      cdi: cdi,
      mmi: mmi,
      sig: sig,
      nst: nst,
      dmin: dmin,
    x: rectX,
    y: rectY,
    w: rectW,
    h: rectH
  };
  }
    

        
        if (hovered) {
          push();
          textSize(14);
          textAlign(LEFT, TOP);

          const line1 = 'Year: ' + hovered.year;
          const line2 = 'Month: ' + hovered.month;
          const line3 = 'Magnitude: ' + hovered.magnitude.toFixed(1);
          const line4 = 'CDI: ' + hovered.cdi.toFixed(1);
          const line5 = 'MMI: ' + hovered.mmi.toFixed(1);
          const line6 = 'SIG: ' + hovered.sig.toFixed(1);
          const line7 = 'NST: ' + hovered.nst.toFixed(1);
          const line8 = 'DMIN: ' + hovered.dmin.toFixed(1);
          

  const padding = 6;
  const lineH = 18;

        
  const tw = max(textWidth(line1),
                 textWidth(line2), 
                 textWidth(line3),
                textWidth(line4),
                textWidth(line5),
                textWidth(line6),
                textWidth(line7),
                textWidth(line8));
  const boxX = mouseX + 10;
  const boxY = mouseY + 10;

  fill(0);
  rect(boxX, boxY,
       tw + padding * 2,
       lineH * 9 + padding * 2);

  fill(255);
  let tx = boxX + padding;
  let ty = boxY + padding;

  text(line1, tx, ty);
  text(line2, tx, ty + lineH);
  text(line3, tx, ty + lineH * 2);
    text(line4, tx, ty + lineH * 4);
          text(line5, tx, ty + lineH * 5);
          text(line6, tx, ty + lineH * 6); 
          text(line7, tx, ty + lineH * 7); 
          text(line8, tx, ty + lineH * 8);  

  pop();
          //end my code
}

  }
    
  }     
  };
  
  //chat gpt
  
  this.mapTemperatureToHeight = function(value) {
    return map(value,
               this.minTemperature,
               this.maxTemperature,
               this.layout.bottomMargin, // Lower temperature at bottom.
               this.layout.topMargin);   // Higher temperature at top.
  };
  

  this.mapYearToWidth = function(value) {
    return map(value,
               this.minYear,
                this.maxYear,
               this.layout.leftMargin, // Lower temperature at bottom.
               this.layout.rightMargin-50);   // Higher temperature at top.
  };
  //enf code chatGPT
  
   this.changeYear = function(year) {
   this.selectedYear = year;
  console.log('Year button clicked, selectedYear =', this.selectedYear);
      };


}