function Map() {
  this.name = "Map for water usage";
  this.id = "map";
  this.title = "Map for water usage";
  this.loaded = false;

  let img;
  let table;

  let painted = null;
  let overlay = null;

  let w = 0, h = 0;
  let oceanKey = null;
  let lastKey = null;

  //start of chatGPT code
  // key (rgb) for { region, waterDaily, population, r,g,b }
  const colorToRow = Object.create(null);

  // key to highlight mask
  const maskCache = Object.create(null);

  // ----- helpers -----
  const idx = (x, y, w) => 4 * (y * w + x);
  const keyFromRGB = (r, g, b) =>
    ((r & 255) << 16) | ((g & 255) << 8) | (b & 255);

  function getRGBAt(x, y) {
    if (x < 0 || y < 0 || x >= w || y >= h) return null;
    const p = idx(x, y, w);
    return {
      r: img.pixels[p],
      g: img.pixels[p + 1],
      b: img.pixels[p + 2],
    };
  }
    
    function nearestKey(r, g, b, maxDist = 30) {
  let bestKey = null;
  let bestD = 1e9;

  for (const kStr in colorToRow) {
    const k = Number(kStr);
    const rr = (k >> 16) & 255;
    const gg = (k >> 8) & 255;
    const bb = k & 255;

    const d = Math.abs(r - rr) + Math.abs(g - gg) + Math.abs(b - bb);
    if (d < bestD) { bestD = d; bestKey = k; }
  }
  return bestD <= maxDist ? bestKey : null;
}

  function buildMaskForKey(targetKey) {
    const tr = (targetKey >> 16) & 255;
    const tg = (targetKey >> 8) & 255;
    const tb = targetKey & 255;

    const tol = 4; // increase if edges are fuzzy, decrease if bleed
    const mask = new Uint8Array(w * h);

    let minX = w, minY = h, maxX = -1, maxY = -1;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = idx(x, y, w);
        const r = img.pixels[p];
        const g = img.pixels[p + 1];
        const b = img.pixels[p + 2];

        if (
          Math.abs(r - tr) <= tol &&
          Math.abs(g - tg) <= tol &&
          Math.abs(b - tb) <= tol
        ) {
          const i = y * w + x;
          mask[i] = 1;

          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < 0) return { mask, minX: 0, minY: 0, maxX: -1, maxY: -1 };
    return { mask, minX, minY, maxX, maxY };
  }

  function drawHighlightFromMask(entry) {
    overlay.clear();
    if (entry.maxX < 0) return;

    overlay.loadPixels();

    const HR = 255, HG = 255, HB = 0, HA = 120;
    const { mask, minX, minY, maxX, maxY } = entry;

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const i = y * w + x;
        if (!mask[i]) continue;

        const p = idx(x, y, w);
        overlay.pixels[p] = HR;
        overlay.pixels[p + 1] = HG;
        overlay.pixels[p + 2] = HB;
        overlay.pixels[p + 3] = HA;
      }
    }

    overlay.updatePixels();
  }
  //end of chatGPT code

  //my code
  function drawTooltip(row, mx, my) {
    const line1 = `Region: ${row.region}`;
    const line2 = `Water daily: ${row.waterDaily} L/person/day`;
      
      var water = row.waterDaily;
      var line4 = `Water in month: ${water*30} L/person/month`;
      var line5 = `Water in year: ${water*365} L/person/year`;
    const line3 = `Population: ${row.population}`;
      

    push();
    textSize(14);
    textAlign(LEFT, TOP);
    noStroke();

    const padding = 8;
    const lineH = 18;

    const tw = Math.max(textWidth(line1), textWidth(line2), textWidth(line3));
    const boxW = tw + padding * 9;
    const boxH = lineH * 3 + padding * 6;

    let boxX = mx + 12;
    let boxY = my + 12;

    boxX = constrain(boxX, 0, width - boxW);
    boxY = constrain(boxY, 0, height - boxH);

    fill(0, 180);
    rect(boxX, boxY, boxW, boxH, 6);

    fill(255);
    const tx = boxX + padding;
    const ty = boxY + padding;

    text(line1, tx, ty);
    text(line2, tx, ty + lineH);
    text(line4, tx, ty + lineH * 2);
      text(line5, tx, ty + lineH * 3);
      text(line3, tx, ty + lineH * 4);

    pop();
  }

  
    this.preload = function () {
  img = loadImage("./data/map2.png");
  table = loadTable("./data/waterUsage.csv", "csv", "header");
  // no this.loaded here
};

  //end of my code
  //
  //chat gpt code start from this to the end
  // Build lookup once here
  this.setup = function () {
    
    painted = createGraphics(width, height);
    painted.pixelDensity(1);

    overlay = createGraphics(width, height);
    overlay.pixelDensity(1);

    // build color lookup from table
    // (safe even if values are strings)
    for (let i = 0; i < table.getRowCount(); i++) {
  const cells = table.getRow(i).arr;

  const region     = cells[0];
  const waterDaily = cells[1];
  const population = cells[2];

  const rr = parseInt(cells[3], 10);
  const gg = parseInt(cells[4], 10);
  const bb = parseInt(cells[5], 10);

  if ([rr, gg, bb].some(v => Number.isNaN(v))) continue;

  const k = keyFromRGB(rr, gg, bb);
  colorToRow[k] = { region, waterDaily, population, r: rr, g: gg, b: bb };
}
      
     
this.loaded = true;
  };

  this.destroy = function () {
    if (painted) painted.remove();
    if (overlay) overlay.remove();
    painted = null;
    overlay = null;
  };

  this.draw = function () {
    if (!this.loaded) {
      background(240);
      fill(0);
      text("Loading map...", 20, 30);
      return;
    }

    // base render once
    if (!painted._renderedOnce) {
      img.resize(width, height);
      img.loadPixels();

      w = img.width;
      h = img.height;

      // ocean color = top-left pixel
      const tl = getRGBAt(0, 0);
      oceanKey = tl ? keyFromRGB(tl.r, tl.g, tl.b) : null;

      painted.clear();
      painted.image(img, 0, 0);

      painted._renderedOnce = true;
    }

    image(painted, 0, 0);

    img.loadPixels();

    const mx = floor(constrain(mouseX, 0, w - 1));
    const my = floor(constrain(mouseY, 0, h - 1));
    const rgb = getRGBAt(mx, my);
    if (!rgb) return;

    const rawKey = keyFromRGB(rgb.r, rgb.g, rgb.b);

    // ignore ocean
    if (rawKey === oceanKey) {
      overlay.clear();
      image(overlay, 0, 0);
      lastKey = null;
      return;
    }

    // lookup region by exact RGB
    
      
      let key = rawKey;
let row = colorToRow[key];

if (!row) {
  const nk = nearestKey(rgb.r, rgb.g, rgb.b, 30);
  if (nk != null) {
    key = nk;
    row = colorToRow[key];
  }
}

if (!row) {
  overlay.clear();
  image(overlay, 0, 0);
  lastKey = null;
  return;
}


    // highlight only when changed
    
      
      if (key !== lastKey) {
  lastKey = key;

  let entry = maskCache[key];
  if (!entry) {
    entry = buildMaskForKey(key);
    maskCache[key] = entry;
  }
  drawHighlightFromMask(entry);
}

    image(overlay, 0, 0);
    drawTooltip(row, mouseX, mouseY);
  };
}
