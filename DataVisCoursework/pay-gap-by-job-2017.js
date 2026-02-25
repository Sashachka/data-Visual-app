function PayGapByJob2017() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap by job: 2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-by-job-2017';

  // Property to represent whether data has been loaded.
  this.loaded = false;
 
  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;
   
  //colors to make gradient with
   this.colMen = color(0, 150, 255);
  this.colWomen = color(255, 105, 180);

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
 
  };

  this.setup = function() {
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the axes.
    this.addAxes();

    // Get data from the table object.
    var jobs = this.data.getColumn('job_subtype');
    var propFemale = this.data.getColumn('proportion_female');
    var payGap = this.data.getColumn('pay_gap');
    var numJobs = this.data.getColumn('num_jobs');
    var totalFem = this.data.getColumn('num_jobs_female');
    var totalMen = this.data.getColumn('num_jobs_male');

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);
    totalFem= stringsToNumbers(totalFem);
    totalMen= stringsToNumbers(totalMen);

    // Set ranges for axes.
    //
    // Use full 100% for x-axis (proportion of women in roles).
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    var payGapMin = -20;
    var payGapMax = 20;

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    fill(255);
    stroke(0);
    strokeWeight(1);
    
    //additional code to draw boxes above circles
    let hoveredIndex = -1;
let hoveredX = 0;
let hoveredY = 0;
let hoveredSize = 0;

    for (i = 0; i < this.data.getRowCount(); i++) {
      // Draw an ellipse for each point.
      
      let x = map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad);
      let y = map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad);
      let size = map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax);
      
      //gradient math
      let amt = map(payGap[i], payGapMin, payGapMax, 0, 1);
      amt = constrain(amt, 0, 1);
      let gradCol = lerpColor(this.colWomen, this.colMen, amt);
      
      fill(gradCol);
      ellipse(
        x, y, size
      );
      
      //new additional code
      let d = dist(mouseX, mouseY, x, y);
  if (d <= size / 2) {
    hoveredIndex = i;
    hoveredX = x;
    hoveredY = y;
    hoveredSize = size;
  }
      
     //let d = dist(mouseX, mouseY, x, y);
      //if (d <= size / 2)  {
      
      // here till let i new code
      if (hoveredIndex !== -1) {
      let i = hoveredIndex;

      push();
      fill(0);
      textSize(16);
      textAlign(LEFT, TOP);
        
      //let info = jobs[i];
        
         
        let line1 = "Job: "   + jobs[i];
        let line2 = "Gap: "   + payGap[i].toFixed(1) + "%";
        let line3 = "Total people: " + numJobs[i];
        let line4 = "Women working: " + totalFem[i];
        let line5 = "Men working "+ totalMen[i];
        
      let tw = max(
      textWidth(line1),
      textWidth(line2),
        textWidth(line3),
        textWidth(line4),
        textWidth(line5),
    
    );
        
        let lineH = 18;              
      let linesCount = 5;          
      let padding = 6;
        
        
      rect(mouseX, mouseY,
       tw + padding * 2,
       lineH * linesCount + padding * 2);
      fill(255);
        let tx = mouseX + padding;
        let ty = mouseY + padding;
     text(line1, tx, ty);
    text(line2, tx, ty + lineH);
        text(line3, tx, ty + lineH*2);
        text(line4, tx, ty + lineH*3); 
        text(line5, tx, ty + lineH*4);
      pop();

     // return true;
    }
      
    }
    
    textSize(15);
    fill(0, 150, 255);
    text("men", 10 + this.pad,(height / 2)-5);
    fill(255, 105, 180);
    text("women",970, (height / 2)-5);
    
    strokeWeight(3);
    fill('white');
    text("men are payed more",width / 2, 10);
    text("women are payed more",width / 2, 550 );
    strokeWeight(1);
    
    
   // this.mouseOver(mouseX, mouseY);
  };

  this.addAxes = function () {
    stroke(200);

    // Add vertical line.
    line(width / 2,
         0 + this.pad,
         width / 2,
         height - this.pad);

    // Add horizontal line.
    line(0 + this.pad,
         height / 2,
         width - this.pad,
         height / 2);
  };
}
