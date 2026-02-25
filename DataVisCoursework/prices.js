function Prices() {

  this.name = 'Prices';
  this.id = 'prices';
  this.loaded = false;

  // variables
  var bubbles = [];
  var currentYearIndex = 0;
  var hoveredBubble = null;
  var maxAmt;
  var years = [];
  var yearButtons = [];
  var self = this;
  var r;
  var g;
  var blueCol;

  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/food/fruits.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      }
    );
  };

  this.destroy = function() {
    for (let btn of yearButtons) btn.remove();
    yearButtons = [];
    bubbles = [];
    years = [];
    maxAmt = 0;
    currentYearIndex = 0;
    hoveredBubble = null;
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    var rows = this.data.getRows();
    var numColumns = this.data.getColumnCount();

    r = this.data.getColumn("R");
    g = this.data.getColumn("G");
    blueCol = this.data.getColumn("B");

    // year buttons
    for (var i = 1; i < numColumns - 3; i++) {
      let y = this.data.columns[i];
      years.push(y);
      let b = createButton(y);

      b.parent('years');
      b.mousePressed(function() {
        self.changeYear(y);
      });
      yearButtons.push(b);
    }

    // build bubbles
    maxAmt = 0;

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].get(0) != "") {
        var b = new Bubble(rows[i].get(0), r[i], g[i], blueCol[i]);

        for (var j = 1; j < numColumns - 3; j++) {
          if (rows[i].get(j) != "") {
            let raw = rows[i].get(j);
            let n = parseFloat(raw.replace("$", ""));
            if (n > maxAmt) maxAmt = n;
            b.data.push(n);
          } else {
            b.data.push(0);
          }
        }

        bubbles.push(b);
      }
    }

    for (var i = 0; i < bubbles.length; i++) {
      bubbles[i].setData(0);
    }
  };

  this.changeYear = function(year) {
    const yIndex = years.indexOf(year);
    if (yIndex === -1) return;

    currentYearIndex = yIndex;

    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].setData(yIndex);
    }
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    let bestD = Infinity;
    hoveredBubble = null;

    // because you translate to center, hover check must use centered mouse coords
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;

    push();
    translate(width / 2, height / 2);

    for (var i = 0; i < bubbles.length; i++) {
     
        bubbles[i].update(bubbles);
      let d = dist(mx, my, bubbles[i].pos.x, bubbles[i].pos.y);
      if (d <= bubbles[i].size / 2 && d < bestD) {
        bestD = d;
        hoveredBubble = bubbles[i];
      }

      bubbles[i].draw();
    }

    pop();

    // Tooltip
    if (hoveredBubble) {
      let value = hoveredBubble.data[currentYearIndex] ?? 0;

      let line1 = "Name: " + hoveredBubble.name;
      let line2 = "Where: " + years[currentYearIndex];
      let line3 = "Price: " + value + "$";

      push();
      resetMatrix();
      textSize(16);
      textAlign(LEFT, TOP);

      let padding = 6;
      let lineH = 18;
      let tw = max(textWidth(line1), textWidth(line2), textWidth(line3));

      // place tooltip, but keep it inside canvas
      let boxW = tw + padding * 2;
      let boxH = lineH * 3 + padding * 2;

      let x = mouseX + 10;
      let y = mouseY + 10;

      if (x + boxW > width) x = mouseX - 10 - boxW;
      if (y + boxH > height) y = mouseY - 10 - boxH;
      if (x < 0) x = 0;
      if (y < 0) y = 0;

      noStroke();
      fill(0);
      rect(x, y, boxW, boxH);

      fill(255);
      text(line1, x + padding, y + padding);
      text(line2, x + padding, y + padding + lineH);
      text(line3, x + padding, y + padding + lineH * 2);
      pop();
    }
      
      
  };

  //  BOUNCING BUBBLE (drop-in)
  function Bubble(_name, r_, g_, b_) {
    this.name = _name;

    this.r = parseInt(String(r_).trim(), 10);
    this.g = parseInt(String(g_).trim(), 10);
    this.b = parseInt(String(b_).trim(), 10);

    if ([this.r, this.g, this.b].some(v => isNaN(v))) {
      this.r = random(0, 255);
      this.g = random(0, 255);
      this.b = random(0, 255);
    }

    this.size = 20;
    this.target_size = 20;

    // Start random inside centered space
    let rad = this.size / 2;
    this.pos = createVector(
      random(-width / 2 + rad, width / 2 - rad),
      random(-height / 2 + rad, height / 2 - rad)
    );

    // Velocity
    this.vel = p5.Vector.random2D().mult(random(1.2, 2.5));

    this.data = [];

    this.draw = function() {
      push();
      textAlign(CENTER, CENTER);
      noStroke();
      fill(this.r, this.g, this.b);
      ellipse(this.pos.x, this.pos.y, this.size);
      fill(0);
      text(this.name, this.pos.x, this.pos.y);
      pop();
    };

      
      this.update = function(_bubbles) {
  // smooth speed across FPS
  let dt = deltaTime / 16.666; // ~1 at 60fps
  this.pos.add(p5.Vector.mult(this.vel, dt));

  // ---- bounce on walls (center coords) ----
  let r = this.size / 2;
  let left = -width / 2 + r;
  let right = width / 2 - r;
  let top = -height / 2 + r;
  let bottom = height / 2 - r;

  if (this.pos.x < left)  { this.pos.x = left;  this.vel.x *= -1; }
  if (this.pos.x > right) { this.pos.x = right; this.vel.x *= -1; }
  if (this.pos.y < top)   { this.pos.y = top;   this.vel.y *= -1; }
  if (this.pos.y > bottom){ this.pos.y = bottom;this.vel.y *= -1; }

  // ---- bounce off other bubbles ----
  for (let other of _bubbles) {
    if (other === this) continue;

    let dx = this.pos.x - other.pos.x;
    let dy = this.pos.y - other.pos.y;
    let d = Math.sqrt(dx*dx + dy*dy);

    let minD = (this.size/2) + (other.size/2);

    if (d > 0 && d < minD) {
      // 1) push apart so they don't overlap
      let overlap = minD - d;
      let nx = dx / d;
      let ny = dy / d;

      this.pos.x += nx * (overlap / 2);
      this.pos.y += ny * (overlap / 2);
      other.pos.x -= nx * (overlap / 2);
      other.pos.y -= ny * (overlap / 2);

      // 2) only bounce if moving toward each other
      let rvx = this.vel.x - other.vel.x;
      let rvy = this.vel.y - other.vel.y;
      let relSpeed = rvx * nx + rvy * ny;

      if (relSpeed < 0) {
        // swap the velocity components along the collision normal (equal mass)
        let v1n = this.vel.x * nx + this.vel.y * ny;
        let v2n = other.vel.x * nx + other.vel.y * ny;

        // tangential parts stay the same
        this.vel.x += (v2n - v1n) * nx;
        this.vel.y += (v2n - v1n) * ny;

        other.vel.x += (v1n - v2n) * nx;
        other.vel.y += (v1n - v2n) * ny;
      }
    }
  }

  // ---- size animation (your old logic) ----
  if (this.size < this.target_size) this.size += 1;
  else if (this.size > this.target_size) this.size -= 1;
};


    this.setData = function(i) {
      this.target_size = map(this.data[i], 0, maxAmt, 20, 250);
    };
  }
}
