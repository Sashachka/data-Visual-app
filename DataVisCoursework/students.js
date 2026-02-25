function StudentsGrades() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Students Grades';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'student-grades';

  // Property to represent whether data has been loaded.
  this.loaded = false;

    //original variables
    var myScatter;
    
  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
     // studentData = loadTable('students.csv','csv', 'header');
    this.data = loadTable(
      './data/students.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
        //still keep it
      function(table) {
        self.loaded = true;
      });
  }; 

  this.setup = function() {
      //keep it
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
  };

    

  

  this.draw = function() {
      //keep it
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

      
        //code for studentsGrades
	myScatter = new Scatter(10, 10, 500, 500);
	myScatter.setupAxis(0, 100, 0, 100, 10, 10);
	var xPoints = [];
	var yPoints = [];
	
	var quizMarks = this.data.getColumn('quiz');// originaly both were studentData
	var projectMarks = this.data.getColumn('project');
	  var name = this.data.getColumn('firstName');
	  var surname = this.data.getColumn('surname');
	//console.log(quizMarks);
	//console.log(projectMarks);
	myScatter.addDataPoints(quizMarks, projectMarks, 3, 'red');
	myScatter.lineOfBestFit(quizMarks, projectMarks, 'blue');

	  
	  //start my code
	  let hoveredIndex = -1;

  for (var i = 0; i < quizMarks.length; i++) {
    let pos = myScatter.getScreenPos(quizMarks[i], projectMarks[i]);
    let d = dist(mouseX, mouseY, pos.x, pos.y);

    // adjust 8 to make the hover radius bigger/smaller
    if (d <= 8) {
      hoveredIndex = i;
    }
  }

  if (hoveredIndex !== -1) {
    let i = hoveredIndex;

    push();
    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);

    let line1 = "Student: " + name[i] + " "+ surname[i]; // or use name column if you have it
    let line2 = "Quiz: "    + quizMarks[i];
    let line3 = "Project: " + projectMarks[i];
	  

    let tw = max(
      textWidth(line1),
      textWidth(line2),
      textWidth(line3)
    );

    let lineH = 18;
    let linesCount = 3;
    let padding = 6;

    let boxX = mouseX + 10;
    let boxY = mouseY + 10;

    rect(boxX, boxY,
         tw + padding * 2,
         lineH * linesCount + padding * 2);

    fill(255);
    let tx = boxX + padding;
    let ty = boxY + padding;

    text(line1, tx, ty);
    text(line2, tx, ty + lineH);
    text(line3, tx, ty + lineH * 2);

    pop();
  }
     // end my code
};
}








//constructor to draw a scatter diagram
//the x and y coordinates set the canvas location and the width and height size
function Scatter(x, y, width, height) {
	//save parameter values as properties
	this.x = x;
	this.y = y;

	this.width = width;
	this.height = height;

	//setup the axis take smallest and largest possible values for the axis
	//also how far apart the scale should the ticks be for each axis.
	this.setupAxis = function(xMin, xMax, yMin, yMax, xTickSpacing, yTickSpacing) {
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;

		//set the drawing properties for the axis
		stroke(0);
		strokeWeight(1);
		fill(0);

		//we need some padding before the axis line for the ticks and labels
		//we can just set the padding for the xAxis -labled y as it relates to the
		//height of the diagram
		var yPadding = 15;
		//create a property for the height of the actual plot and it start y. not including
		//the padding
		this.plotHeight = this.height - yPadding;
		this.plotY = this.y;

		//the x padding is more tricky we don't know how wide the label is so
		//lets check each tick and find the widest
		var widestYTick = 0;
		for (var i = yMin; i <= yMax; i += yTickSpacing) {
			if (textWidth(i) > widestYTick) {
				widestYTick = textWidth(i);
			}
		}

		//set the x padding to be the widest label plus 5 for the tick
		var xPadding = widestYTick + 5;

		//create a width property and an x value for the plot without the padding
		this.plotWidth = this.width - xPadding;
		this.plotX = this.x + xPadding;

		//plot the x axis
		line(this.plotX, this.plotY + this.plotHeight, this.plotX + this.plotWidth,
			this.plotY + this.plotHeight);

		//plot the y axis
		line(this.plotX, this.plotY, this.plotX, this.plotY + this.plotHeight);


		//draw the x ticks
		//how far apart are the ticks on the screen
		var scaledXTickSpacing = map(xTickSpacing, 0, xMax, 0, this.plotWidth);
		var xTickValue = xMin;
		//align the text so it is in the centre of each tick
		textAlign(CENTER, TOP);
		//iterate through the ticks, draw the line and a label
		for (let i = this.plotX; i <= (this.plotX + this.plotWidth + 1); i +=
			scaledXTickSpacing) {
			line(i, this.plotY + this.plotHeight, i, this.plotY + this.plotHeight +
				yPadding * 0.66);
			text(xTickValue, i, this.plotY + this.plotHeight + yPadding * 0.66);
			xTickValue += xTickSpacing;
		}

		//draw the y ticks
		var scaledYTickSpacing = map(yTickSpacing, 0, yMax, 0, this.plotHeight);
		var yTickValue = yMax;
		textAlign(RIGHT, CENTER);
		for (let i = this.plotY; i < (this.plotY + this.plotHeight + 1); i +=
			scaledYTickSpacing) {
			line(this.plotX, i, this.plotX - 5, i);
			text(yTickValue, this.plotX - 5, i);
			yTickValue -= yTickSpacing;
		}
	};
	// additional code to get x & y
	this.getScreenPos = function(xValue, yValue) {
    var pointX = round(map(xValue, this.xMin, this.xMax,
                           this.plotX, this.plotWidth + this.plotX));
    var pointY = round(map(yValue, this.yMin, this.yMax,
                           this.plotHeight + this.plotY, this.plotY));
    return { x: pointX, y: pointY };
  }

	//Add a single data point to the diagram the x and y value set the location
	//and the colour and size the look of the point
	this.addDataPoint = function(xValue, yValue, size, colour) {
		//if the data point is in the correct range for the graph add a point

		if (xValue >= this.xMin && xValue <= this.xMax &&
			yValue >= this.yMin && yValue <= this.yMax) {
			//use map to scale the point to the right location on the axis
			var pointX = round(map(xValue, this.xMin, this.xMax, this.plotX,
				this.plotWidth + this.plotX));
			var pointY = round(map(yValue, this.yMin, this.yMax, this.plotHeight +
				this.plotY, this.plotY));

			//switch the colour and plot
			fill(colour)
			noStroke();
			ellipse(pointX, pointY, size);
		}
	}

	//add arrays of x and y datapoints
	this.addDataPoints = function(xValues, yValues, size, colour) {
		if (xValues.length == yValues.length) {
			for (var i = 0; i < xValues.length; i++) {
				this.addDataPoint(xValues[i], yValues[i], size, colour);
			}
		} else {
			console.log("Error: the data point arrays aren't the same length")
		}
	}

	//draw a line of best fit from arrays of x and y data values
	this.lineOfBestFit = function(xValues, yValues, colour) {
		//if the two data arrays are the same length use the least squares forumula to
		//work out the m (gradient) and b(intercept) values.
		if (xValues.length == yValues.length) {
			var sumX = 0;
			var sumY = 0;
			var sumXY = 0;
			var sumX2 = 0;
			for (var i = 0; i < xValues.length; i++) {
				sumX += parseFloat(xValues[i]);
				sumY += parseFloat(yValues[i]);
				sumXY += parseFloat(xValues[i]) * parseFloat(yValues[i]);
				sumX2 += parseFloat(xValues[i]) * parseFloat(xValues[i]);
			}

			var m = (xValues.length * sumXY - sumX * sumY) / (xValues.length * sumX2 -
				sumX * sumX);
			var b = (sumY - m * sumX) / xValues.length;
			//console.log("y=" + m + "x+" + b);

			var scaleB = map(b, this.yMin, this.yMax, this.plotHeight +
				this.plotY, this.plotY);

			//if x is negative add plotY to the final param if positive take away
			if (m >= 0) {
				var endY = scaleB - (m * this.plotWidth) - this.plotY;
			} else {
				var endY = scaleB - (m * this.plotWidth) + this.plotY;
			}
			stroke(colour);
			line(this.plotX, scaleB, this.plotX + this.plotWidth, endY);
		} else {
			console.log("Error: the data point arrays aren't the same length")
		}
	}
}