function Box(x, y, width, height, category){
    
    var x = x;
    var y =y;
    var height;
    var width;
    this.category = category;
    
    
    this.mouseOver = function(mouseX, mouseY){
        //is the mouse over the box
        if(mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height){
            return this.category.name;
        }
        return false;
    }
    
    this.draw= function(){
        stroke(0);
        fill(category.colour);
        rect(x, y, width, height);
    }
}