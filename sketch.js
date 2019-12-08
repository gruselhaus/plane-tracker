let mappa;
let planeMap;
let canvas;
let url = "https://opensky-network.org/api/states/all?icao24=";
let time;
const pos = {
  lat: 0,
  lon: 0,
  track: 0
};

let visible = false;
let params = null;
const options = {
  lat: 0,
  lng: 0,
  zoom: 3,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
};
let planes = [];

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  let params = getURLParams();
  if (params.icao24 === undefined || params.icao24 === "") {
    alert("Please provide a valid icao24 Transponder adress!");
  } else {
    const icao24 = params.icao24.toLowerCase();
    url += icao24;
  }
  mappa = new Mappa("Leaflet");
  planeMap = mappa.tileMap(options);
  planeMap.overlay(canvas);
  getData();
  time = setInterval(getData, 500);
}

const getData = async () => {
  visible = true;
  const data = await httpGet(url);
  let formatted = JSON.parse(data);
  planes = [];
  for (const state of formatted.states) {
    planes.push(new Plane(state));
  }
};

function draw() {
  clear();
  if (visible) {
    for (const plane of planes) {
      plane.show();
    }
  }
}

class Plane {
  constructor(states) {
    this.states = states;
  }

  show() {
    const lat = this.states[6];
    const lon = this.states[5];
    const pix = planeMap.latLngToPixel(lat, lon);
    const callsign = this.states[1];
    stroke(0);
    strokeWeight(0.5);
    if (callsign === "") {
      fill(240, 200, 123, 150);
      ellipse(pix.x, pix.y, 12, 12);
      return;
    }
    fill(100, 200, 123, 200);
    ellipse(pix.x, pix.y, 12, 12);
    beginShape();
    stroke(0);
    strokeWeight(1);
    noFill();
    vertex(pix.x + cos(45) * 12, pix.y - sin(135) * 12);
    vertex(pix.x + 20, pix.y - 15);
    vertex(pix.x + 80, pix.y - 15);
    endShape();
    strokeWeight(0.2);
    fill(0);
    text(callsign, pix.x + 24, pix.y - 17);
  }
}
