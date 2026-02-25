function PieChart(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;
  

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  
  
  //new code+
this.draw = function(data, labels, colours, title) {

  if (data.length == 0) {
    alert('Data has length zero!');
  } else if (![labels, colours].every((array) => {
    return array.length == data.length;
  })) {
    alert(`Data (length: ${data.length})
Labels (length: ${labels.length})
Colours (length: ${colours.length})
Arrays must be the same length!`);
  }

  var angles = this.get_radians(data);
  var lastAngle = 0;
  var colour;
  var name;

  // clear slices info for this frame
  this.slices = [];

  for (var i = 0; i < data.length; i++) {
    if (labels) {
      name = labels[i];
    } else {
      name = map(i, 0, data.length, 0, 255);
    }

    if (colours) {
      colour = colours[i];
    } else {
      colour = map(i, 0, data.length, 0, 255);
    }

    fill(colour);
    stroke(0);
    strokeWeight(1);

    // end angle for this slice
    let endAngle = lastAngle + angles[i];

    // draw slice
    arc(this.x, this.y,
        this.diameter, this.diameter,
        lastAngle, endAngle + 0.001); // Hack for gap

    // store slice info for hover/click detection
    this.slices.push({
      start: lastAngle,
      end: endAngle,
      label: labels[i],
      value: data[i],
      colour: colour
    });

    if (labels) {
      this.makeLegendItem(labels[i], i, colour);
    }

    lastAngle += angles[i];
  }

  if (title) {
    noStroke();
    textAlign('center', 'center');
    textSize(24);
    text(title, this.x, this.y - this.diameter * 0.6);
  }

  //calling mouse over
  this.mouseOver(mouseX, mouseY);
};

  
 
  //new code for mouse over
  this.mouseOver = function(mouseX, mouseY) {
  // mouse in circle or not
  let d = dist(mouseX, mouseY, this.x, this.y);
  if (d > this.diameter / 2) {
    return false; // outside pie
  }

  //angle of mouse relative to the center
  let angle = atan2(mouseY - this.y, mouseX - this.x);
  if (angle < 0) {
    angle += TWO_PI;
  }

    //additional code for info boxes in tech-diversity :Race and British Food attitudes.
  //which slice contains this angle
  for (let i = 0; i < this.slices.length; i++) {
    let s = this.slices[i];
    if (angle >= s.start && angle <= s.end) {

      push();
      fill(0);
      textSize(16);
      textAlign(LEFT, TOP);
      let info = s.label + ": " + s.value.toFixed(1);
      let tw = textWidth(info);
      rect(mouseX, mouseY, tw + 20, 24);
      fill(255);
      text(info + ("%"), mouseX + 5, mouseY + 4);
      pop();

      return true;
    }
  }

  return false;
};



  this.makeLegendItem = function(label, i, colour) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + (this.labelSpace * i) - this.diameter / 3;
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill('black');
    noStroke();
    textAlign('left', 'center');
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };
}
