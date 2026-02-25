// bassed and replaced tech-diversity-gender
function CatVsDog() {

  // Name for the visualisation to appear in the menu bar.
  this.name = "Cat Vs Dog";

  // Unique ID (keep this unique in your project)
  this.id = "cat-vs-dog";

  // Layout settings
  this.layout = {
    leftMargin: 130,
    rightMargin: width,
    topMargin: 30,
    bottomMargin: height,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    grid: true,
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // 50% line
  this.midX = (this.layout.plotWidth() / 2) + this.layout.leftMargin;

  
  // Colours and start of my code
  this.dogColour = color(243, 255, 82);
  this.catColour = color(255, 94, 82);
  this.noPetColour = color(255, 180, 82);
  //enf of my code

  this.loaded = false;

  this.preload = function () {
    var self = this;
    this.data = loadTable("./data/cats_vs_dogs2.csv", "csv", "header", function () {
      self.loaded = true;
    });
  };

  this.setup = function () {
    textSize(14);
  };

  this.destroy = function () {};

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    let hovered = null;

    this.drawCategoryLabels();

    var lineHeight = (height - this.layout.topMargin) / this.data.getRowCount();

    for (var i = 0; i < this.data.getRowCount(); i++) {
      var lineY = (lineHeight * i) + this.layout.topMargin;

      // Read row
      var row = {
        state: this.data.getString(i, "state"),

        dogPercent: this.data.getNum(i, "percent_dog_owners"),
        catPercent: this.data.getNum(i, "percent_cat_owners"),
        noPetPercent: this.data.getNum(i, "noPets"),

        catHouseholds: this.data.getNum(i, "n_cat_households"),
        catPopulation: this.data.getNum(i, "cat_population"),

        dogHouseholds: this.data.getNum(i, "n_dog_households"),
        dogPopulation: this.data.getNum(i, "dog_population"),

        noPetHouseholds: this.data.getNum(i, "noPetHouseHoldNum"),
        noPetPopulation: 0,
      };

      //widths
      let dogW = this.mapPercentToWidth(row.dogPercent);
      let catW = this.mapPercentToWidth(row.catPercent);

      //positions
      let dogX = this.layout.leftMargin;
      let catX = this.layout.rightMargin - catW;

      let barY = lineY;
      let barH = lineHeight - this.layout.pad;

      // Gap between dog andcat
      let gapX = dogX + dogW;
      let gapW = catX - gapX;

      
      noStroke();

      // dog bar
      fill(this.dogColour);
      rect(dogX, barY, dogW, barH);

      // noPetHousheld bar
      if (gapW > 0) {
        fill(this.noPetColour);
        rect(gapX, barY, gapW, barH);
      }

      // cat bar
      fill(this.catColour);
      rect(catX, barY, catW, barH);

      //checking draw box info and start of my code
      if (
        mouseX >= dogX && mouseX <= dogX + dogW &&
        mouseY >= barY && mouseY <= barY + barH
      ) {
        hovered = {
          state: row.state,
          type: "Dog owners",
          percent: row.dogPercent,
          households: row.dogHouseholds,
          population: row.dogPopulation,
        };
      } else if (
        gapW > 0 &&
        mouseX >= gapX && mouseX <= gapX + gapW &&
        mouseY >= barY && mouseY <= barY + barH
      ) {
        hovered = {
          state: row.state,
          type: "No pets",
          percent: row.noPetPercent,
          households: row.noPetHouseholds,
          population: row.noPetPopulation,
        };
      } else if (
        mouseX >= catX && mouseX <= catX + catW &&
        mouseY >= barY && mouseY <= barY + barH
      ) {
        hovered = {
          state: row.state,
          type: "Cat owners",
          percent: row.catPercent,
          households: row.catHouseholds,
          population: row.catPopulation,
        };
      }

      // State label (left side)
      fill(0);
      textAlign("right", "top");
      text(row.state, this.layout.leftMargin - this.layout.pad, lineY - 5);
    }

    // 50% line
    stroke(150);
    strokeWeight(1);
    line(this.midX, this.layout.topMargin, this.midX, this.layout.bottomMargin);

    //box info/ hovered
    if (hovered) {
      push();
      resetMatrix();
      textSize(14);
      textAlign(LEFT, TOP);

      const line1 = "State: " + hovered.state;
      const line2 = "Type: " + hovered.type;
      const line3 = "Percent: " + hovered.percent.toFixed(1) + "%";
      const line4 = "Households: " + hovered.households;
      const line5 = "Population: " + hovered.population;

      const padding = 6;
      const lineH = 18;

      const tw = max(
        textWidth(line1),
        textWidth(line2),
        textWidth(line3),
        textWidth(line4),
        textWidth(line5)
      );

      let boxX = mouseX + 20;
      let boxY = mouseY + 20;

      const boxW = tw + padding * 2;
      const boxH = lineH * 5 + padding * 2;

      // flip if off-screen
      if (boxX + boxW > width) boxX = mouseX - 20 - boxW;
      if (boxY + boxH > height) boxY = mouseY - 20 - boxH;

      // final safety clamp
      boxX = constrain(boxX, 0, width - boxW);
      boxY = constrain(boxY, 0, height - boxH);

      noStroke();
      fill(0);
      rect(boxX, boxY, boxW, boxH);

      fill(255);
      const tx = boxX + padding;
      const ty = boxY + padding;

      text(line1, tx, ty);
      text(line2, tx, ty + lineH);
      text(line3, tx, ty + lineH * 2);
      text(line4, tx, ty + lineH * 3);
      text(line5, tx, ty + lineH * 4);

      pop();
    }
    //end of my code
  };

  //changed male-female on cat and dog
  this.drawCategoryLabels = function () {
    fill(0);
    noStroke();
    textAlign("left", "top");
    text("Dog", this.layout.leftMargin, this.layout.pad);

    textAlign("center", "top");
    text("50%", this.midX, this.layout.pad);

    textAlign("right", "top");
    text("Cat", this.layout.rightMargin, this.layout.pad);
  };

  this.mapPercentToWidth = function (percent) {
    return map(percent, 0, 100, 0, this.layout.plotWidth());
  };
}
