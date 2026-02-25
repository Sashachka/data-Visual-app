
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select('#app');
  var c = createCanvas(1024, 576);
  c.parent('app');

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new TechDiversityRace());
  //changed form techDiversityGender to catVsDog 
  gallery.addVisual(new CatVsDog());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
  gallery.addVisual(new BritishFoodAttitudes());
  //deleted visual with nutrients
  //gallery.addVisual(new Nutrients());
  gallery.addVisual(new Map());
  gallery.addVisual(new StudentsGrades());
  gallery.addVisual(new FoodForDay());
  gallery.addVisual(new Fruits());
  gallery.addVisual(new Earthquake());
  gallery.addVisual(new Prices());
  
}

function draw() {
  background(255);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}
