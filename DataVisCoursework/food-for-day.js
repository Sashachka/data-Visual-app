function FoodForDay() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Food for a day';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'food-for-day';

  // Property to represent whether data has been loaded.
  this.loaded = false;
    
    //code sketch for waffles 
    this.data;
    var waffles = [];
    var waffle;
  
  var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
		"Sunday"
	];

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/food/dataFood.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
      
    

	var values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate out',
		'Skipped meal', 'Left overs'
	];
	fill(0);
    textSize(20);
	for(var i = 0; i< days.length; i++){
		if(i<4){
			waffles.push(new Waffle(20+(i*220), 60, 200, 200,11,11,this.data, days[i], values));
		}else{
			waffles.push(new Waffle(20+((i-4)*220), 300, 200,200,11,11,this.data, days[i], values));
		}
	}
  
  };


  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
      
      for(var i = 0; i < waffles.length; i++){
		waffles[i].draw();
	}
    
    fill(0);
  textSize(20);
    
    
  for (let i = 0; i < days.length; i++) {
    let x = (i < 4) ? 20 + (i * 220) : 20 + ((i - 4) * 220);
    let y = (i < 4) ? 50 : 290;
    text(days[i], x+100, y);
  }
	
	for(var i = 0; i <waffles.length; i++){
		waffles[i].checkMouse(mouseX, mouseY);
	}
    
      
  };
}
