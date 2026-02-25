
function Fruits(){

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Fruits';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'fruits';

  // Property to represent whether data has been loaded.
  this.loaded = false;
    
    //variables
      var bubbles = [];
    var currentYearIndex = 0;
var hoveredBubble = null;
      var maxAmt;
      var years = [];
      var yearButtons = [];
    var self = this;
    //var short = ["milk", "cheese", " cerase meat", "non cerase meat", " fish", " eggs", ""]

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/food/foodData.csv', 'csv', 'header',
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
        bubbles = [];
        
};
    
     

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
      var rows = this.data.getRows();
    var numColumns = this.data.getColumnCount();
      
     
    
    for(var i = 5; i < numColumns; i++)
    {
        var y = this.data.columns[i];
        years.push(y);
        b = createButton(y,y);
        b.parent('years');
        b.mousePressed(function()
        {
            self.changeYear(this.elt.value);
        });
        yearButtons.push(b);
        
        
    }
    
    
    maxAmt = 0;
    
    for(var i = 0; i < rows.length; i++)
    {
        if(rows[i].get(0) != "")
        {
            var b = new Bubble(rows[i].get(0));
            
            for(var j = 5; j < numColumns; j++)
            {
                if(rows[i].get(j) != "")
                {
                    var n = rows[i].getNum(j);
                    if(n > maxAmt)
                    {
                        maxAmt = n; //keep a tally of the highest value
                    }
                     b.data.push(n);
                }
                else
                {
                      b.data.push(0);
                }
                
            }
            
            bubbles.push(b);
        }
        
    }
    
    for(var i = 0; i < bubbles.length; i++)
    {
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
      hoveredBubble = null;
      let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
    
      push();
    translate(width/2, height/2);
    for(var i = 0; i < bubbles.length; i++)
    {
         bubbles[i].update(bubbles);

        let d = dist(mx, my, bubbles[i].pos.x, bubbles[i].pos.y);
    if (d <= bubbles[i].size / 2) {
      hoveredBubble = bubbles[i];
    }

    bubbles[i].draw();

    }
       pop();
    //additional code for info boxes like waffle
      
      if (hoveredBubble) {
    let value = hoveredBubble.data[currentYearIndex] ?? 0;

    let line1 = "Fruit: " + hoveredBubble.name;
    let line2 = "Year: " + years[currentYearIndex];
    let line3 = "Amount: " + value;

    push();
    resetMatrix();        // draw in screen coordinates
    textSize(16);
    textAlign(LEFT, TOP);

    let padding = 6;
    let lineH = 18;
    let tw = max(textWidth(line1), textWidth(line2), textWidth(line3));

    // small offset so the box isn't exactly under the cursor
    let x = mouseX + 10;
    let y = mouseY + 10;

    noStroke();
    fill(0);
    rect(x, y, tw + padding * 2, lineH * 3 + padding * 2);

    fill(255);
    text(line1, x + padding, y + padding);
    text(line2, x + padding, y + padding + lineH);
    text(line3, x + padding, y + padding + lineH * 2);
    pop();
  }
    };
    

     function Bubble(_name)
{
    this.size = 20;
    this.target_size = 20;
    this.pos = createVector(0,0);
    this.direction = createVector(0,0);
    this.name = _name;
    this.color = color(random(0,255), random(0,255), random(0,255));
    this.data = [];
    
    this.draw = function()
    {
        push();
        textAlign(CENTER);
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
        fill(0);
        text(this.name,this.pos.x,this.pos.y);
        
        
        pop();
        
    };
    
    this.update = function(_bubbles)
    {
        this.direction.set(0,0);
        
        for(var i = 0; i < _bubbles.length; i++) { 
            if(_bubbles[i].name != this.name) { 
                var v = p5.Vector.sub(this.pos,_bubbles[i].pos);
             var d = v.mag(); 
             
             if(d < this.size/2 + _bubbles[i].size/2) {
                 if(d > 0){ 
                     this.direction.add(v);
             } 
                  
                     else { 
                         this.direction.add(p5.Vector.random2D());
                         
             }
             } 
                
            }
        }        
        //this.direction.add(p5.Vector.random2D().add(0.01));
        this.direction.normalize();
      this.pos.add(this.direction);
        
      //chatGPT
        //not above or below canvas, restrictions for x & y values
        let r = this.size / 2;
let left = -width / 2 + r;
let right = width / 2 - r;
let top = -height / 2 + r;
let bottom = height / 2 - r;

this.pos.x = constrain(this.pos.x, left, right);
this.pos.y = constrain(this.pos.y, top, bottom);
        
        if(this.size < this.target_size)
        {
            this.size += 1;
        }
        else if(this.size > this.target_size)
        {
            this.size -= 1;
        }
       
    };
    
    this.setData = function(i)
    {
        this.target_size = map(this.data[i], 0, maxAmt, 20, 250);
    };
    
    
} 
      
    
}

