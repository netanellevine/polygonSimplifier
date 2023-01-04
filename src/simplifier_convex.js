const coordAll = require('@turf/meta').coordAll;
const cleanCoords =  require('@turf/clean-coords').default;
const convex = require('@turf/convex').default;
const turf = require('@turf/turf');
const simplify = require('@turf/simplify').default;
const fs = require("fs");


const PATH = '../data';
const exmp_dir = 'simplified';
const MAX_SIZE = 500;

function simplifyShape(file, level=0) {
    // skip = -1 , low = default = 0, medium = 1, high = 2
    const file_name = file;
    const country_name = file_name.split('_')[0].toLowerCase();
    const json =  fs.readFileSync(`${PATH}/${file_name}`);
    const data = JSON.parse(json);
    var concavity;

    // In order to determine the concavity, we need to know the size of the shape.
    const before_length = coordAll(data).length;
    console.log("BEFORE ", before_length);

    var cop = JSON.parse(JSON.stringify(data));
    // if type is MultyPolygon, we need to convert it to Polygons.
    if (data.features[0].geometry.type == 'MultiPolygon') {
            simplifyMultyPolygon(cop);
    }
    else {
        console.log("BEFORE: ", coordAll(cop).length);
        var options = {precision: 6};
        cop = turf.truncate(cop, options);

        options = {tolerance: 0.1, highQuality: false, mutate: true};
        turf.simplify(cop, options);

        console.log("AFTER: ", coordAll(cop).length);
    }



    // // OPTIONAL-> Remove redundent coordinates.
    // const clear = cleanCoords(data.features[0]);
    // console.log("AFTER cleanCoords ", coordAll(clear).length);

    // // The concavity is determined by the size of the shape and the level of simplification.
    // concavity = getConcavity(level, before_length);

    // // Simplify the shape using the convex hull algorithm.
    // var ans = convex(data, {'concavity': concavity});

    var after_length = coordAll(cop).length;
    console.log("AFTER ", after_length);

    // // If the shape is still too big, we increase the concavity and try again.
    // var jump = 2;
    // while (after_length > MAX_SIZE) {
    //     var ans = convex(ans, {'concavity': concavity});
    //     concavity += jump;
    //     jump -= 0.1;
    //     after_length = coordAll(ans).length;
    //     console.log(`AFTER concavity: ${concavity}, length: ${after_length}`);
    // }

    // const c = (String(concavity)).replace('.', '');
    fs.writeFileSync(`simplified_${country_name}_length-${after_length}.geojson`, JSON.stringify(cop));
}



function simplifyMultyPolygon(data) {
    var length = data.features[0].geometry.coordinates.length;
    console.log("LENGTH", length);
    for (var i = 0; i < length; i++) {

        var polygon = turf.polygon(data.features[0].geometry.coordinates[i]);

        console.log("BEFORE: ", coordAll(polygon).length);

        var options = {precision: 6, mutate: true};
        turf.truncate(polygon, options);

        options = {tolerance: 0.1, highQuality: false, mutate: true};
        turf.simplify(polygon, options);

        data.features[0].geometry.coordinates[i] = polygon.geometry.coordinates;
    }
}



function getConcavity(level, size) {
    if (level == 0) 
    {
        return 1;
    }
    if (size < 1000) 
    {
        // if level is medium, return 5, else level is high -> return 2
        return level == 1 ? 5 : 3; 
    }
    if (size < 5000) 
    {
        // if level is medium, return 12, else level is high -> return 10
        return level == 1 ? 12 : 10;
    }
    if (size < 10000) 
    {
        // if level is medium, return 16, else level is high -> return 14
        return level == 1 ? 16 : 14;
    }
    else 
    {
        // if level is medium, return 20, else level is high -> return 16
        return level == 1 ? 20 : 16;
    }
}




const l = 2;
console.log('CANADA LONG------------------------------------------------------------');
simplifyShape(file='canada.geojson', level=l);
console.log('CANADA SHORT------------------------------------------------------------');
simplifyShape(file='map_canada.geojson', level=l);
console.log('AUSTRALIA------------------------------------------------------------');
simplifyShape(file='australia.geojson', level=l);
console.log('SWITZERLAND------------------------------------------------------------');
simplifyShape(file='switzerland.geojson', level=l);
console.log('COLOMBIA------------------------------------------------------------');
simplifyShape(file='colombia.geojson', level=l);
console.log('UK------------------------------------------------------------');
simplifyShape(file='uk.geojson', level=l);
console.log('JAPAN------------------------------------------------------------');
simplifyShape(file='japan.geojson', level=l);
console.log('RUSSIA------------------------------------------------------------');
simplifyShape(file='russia.geojson', level=l);
module.exports = {simplifyShape};