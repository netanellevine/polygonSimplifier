const coordAll = require('@turf/meta').coordAll;
// const polygon = require('@turf/helpers').polygon;
// const multiPolygon = require('@turf/helpers').multiPolygon;
const cleanCoords =  require('@turf/clean-coords');
const turf = require('@turf/turf');
const convex = require('@turf/convex').default;
const fs = require("fs");


const PATH = '../data';
const exmp_dir = 'simplified';
const MAX_SIZE = 500;

function simplifyShape(file, level, concavity=Infinity) {
    // skip = -1 , low = defult = 0, medium = 1, high = 2
    const file_name = file;
    const country_name = file_name.split('_')[0].toLowerCase();
    const json =  fs.readFileSync(`${PATH}/${file_name}`);
    const data = JSON.parse(json);

    // In order to determine the concavity, we need to know the size of the shape.
    const before_length = coordAll(data).length;
    console.log("BEFORE ", before_length);

    // OPTIONAL-> Remove redundent coordinates.
    const clear = turf.cleanCoords(data.features[0]);
    console.log("AFTER cleanCoords ", coordAll(clear).length);

    // The concavity is determined by the size of the shape and the level of simplification.
    concavity = getConcavity(level, before_length);

    // Simplify the shape using the convex hull algorithm.
    var ans = convex(data, {'concavity': concavity});

    var after_length = coordAll(ans).length;
    console.log(`AFTER concavity: ${concavity}, length: ${after_length}`);

    // If the shape is still too big, we increase the concavity and try again.
    var jump = 2;
    while (after_length > MAX_SIZE) {
        var ans = convex(ans, {'concavity': concavity});
        concavity += jump;
        jump -= 0.1;
        after_length = coordAll(ans).length;
        console.log(`AFTER concavity: ${concavity}, length: ${after_length}`);
    }

    const c = (String(concavity)).replace('.', '');
    fs.writeFileSync(`simplified_${country_name}_concavity-${c}_length-${after_length}.geojson`, JSON.stringify(ans));
}



function getConcavity(level, size) {
    if (level == 0) 
    {
        return Infinity;
    }
    if (size < 1000) 
    {
        // if level is medium, return 5, else level is high -> return 2
        return level == 1 ? 5 : 3; 
    }
    if (size < 5000) 
    {
        return level == 1 ? 12 : 10;
    }
    if (size < 10000) 
    {
        return level == 1 ? 14 : 12;
    }
    else 
    {
        return level == 1 ? 17 : 15;
    }
}




const concat = 10
console.log('CANADA LONG------------------------------------------------------------');
simplifyShape(file='Canada_polygon.geojson', level = 0,  concavity=concat);
console.log('CANADA SHORT------------------------------------------------------------');
simplifyShape(file='map_canada.geojson', level = 0,  concavity=concat);
console.log('AUSTRALIA------------------------------------------------------------');
simplifyShape(file='australia.geojson', level = 0,  concavity=concat);
console.log('SWITZERLAND------------------------------------------------------------');
simplifyShape(file='switzerland.geojson', level = 0,  concavity=concat);
console.log('COLOMBIA------------------------------------------------------------');
simplifyShape(file='colombia.geojson', level = 0,  concavity=concat);
console.log('UK------------------------------------------------------------');
simplifyShape(file='uk.geojson', level = 0,  concavity=concat);

module.exports = {simplifyShape};