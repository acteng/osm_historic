import * as fs from "fs";
import * as readline from "readline";

function include(tags) {
  // From https://flrec.ifas.ufl.edu/geomatics/hochmair/pubs/hochmair_zielstra_neis_TRB2013.pdf
  // Used regex to transform the SQL query into JS...
  // s/=/==/g14
  // s/AND/\&\&/g14
  // s/OR /|| /g14
  // s#(tags->'\([^']*\)')#tags\["\1\"\]#g14

  return (
    (tags["highway"] == "track" &&
      tags["bicycle"] == "designated" &&
      tags["motor_vehicle"] == "no") ||
    (tags["highway"] == "path" && tags["bicycle"] == "yes") ||
    (tags["highway"] == "path" &&
      (tags["bicycle"] == "designated" || tags["bicycle"] == "official")) ||
    (tags["highway"] == "service" &&
      tags["bicycle"] == "designated" &&
      tags["motor_vehicle"] == "no") ||
    (tags["highway"] == "pedestrian" &&
      (tags["bicycle"] == "yes" || tags["bicycle"] == "official")) ||
    (tags["highway"] == "footway" &&
      (tags["bicycle"] == "yes" || tags["bicycle"] == "official")) ||
    tags["highway"] == "cycleway" ||
    (tags["highway"] == "bridleway" && tags["bicycle"] != "no") ||
    tags["cycleway"] == "track" ||
    tags["cycleway"] == "opposite_track" ||
    tags["cycleway"] == "lane" ||
    tags["cycleway:left"] == "lane" ||
    tags["cycleway:right"] == "lane" ||
    tags["cycleway:both"] == "lane" ||
    tags["cycleway"] == "opposite_lane" ||
    tags["cycleway"] == "shared_busway" ||
    tags["cycleway:left"] == "shared_busway" ||
    tags["cycleway:right"] == "shared_busway"
  );
}

console.error(`{"type": "FeatureCollection", "features": [`);

let rl = readline.createInterface({
  input: fs.createReadStream(process.argv[2]),
});
rl.on("line", (line) => {
  let f = JSON.parse(line);
  if (include(f.properties)) {
    // Clear properties for smaller output
    let osm_id = f.properties["@id"];
    f.properties = {osm_id};
    console.error(JSON.stringify(f) + ",");
  }
});
rl.on("close", () => {
  console.error(`]}`);
});
