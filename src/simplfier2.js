// const simplify = require('simplify-geometry');
const simplify = require('simplify-geojson');
const cleanCoords = require('@turf/clean-coords');
const fs = require("fs");


const PATH = '../data';
const file_name = 'Canada2_polygon.geojson';
const country_name = file_name.split('_')[0].toLowerCase();
const exmp_dir = 'exmaples';


function simplifyShape(file, tolerance=1, highQuality=false) {
  const json =  fs.readFileSync(`${PATH}/${file_name}`);
  const data = JSON.parse(json);

  checkSimplified(data, 'BEFORE');
  const options = {tolerance: tolerance, highQuality: highQuality};
  const clear = cleanCoords(data);
  var ans = simplify(clear, tolerance);
  const size_after = checkSimplified(ans, 'AFTER');

  if (!fs.existsSync(`${PATH}/${exmp_dir}/${country_name}`)) {
    fs.mkdirSync(`${PATH}/${exmp_dir}/${country_name}`);
  }

const t = (String(tolerance)).replace('.', '');
const new_file_name = `${country_name}_t-${t}_l-${size_after}.geojson`;
fs.writeFileSync(`${PATH}/${exmp_dir}/${country_name}/${new_file_name}`, JSON.stringify(ans));
}


function getArray(arr) {
  var last = arr;
  while (true) {
    if (Array.isArray(arr[0][0][0])) {
      last = structuredClone(arr);
      arr = arr[0];
    } else {
      break;
    }
  }
  return last;
}


function checkSimplified(data, str='') {
  const data_arr = [];
  var data_size = 0;
  arr = getArray(data.features[0].geometry.coordinates);
  arr.forEach(element => {
    data_arr.push(element[0].length);
    data_size += element[0].length;
  });
  console.log(`#########################--${str}--#########################`);
  console.log(data_arr);
  console.log(data_size);
  console.log('############################################################');
  return data_size;
}

simplifyShape(file='a', tolerance=2, highQuality=true);


    


// // Simplify the polygon with a tolerance of 0.5
// const simplifiedPolygon = simplify(cords.coordinates[0], 1.5);

// console.log(cords.coordinates[0].length);
// console.log(simplifiedPolygon.length)
// console.log(simplifiedPolygon);  // Output: [[1, 1], [4, 4]]

