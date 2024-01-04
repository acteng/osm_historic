import * as fs from "fs";

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

let gj = JSON.parse(fs.readFileSync("highways.geojson", { encoding: "utf8" }));
gj.features = gj.features.filter((f) => include(f.properties));

// Too big!
//fs.writeFileSync("cycleways_filtered.geojson", JSON.stringify(gj));
console.error(`{"type": "FeatureCollection": [`);
for (let f of gj.features) {
  console.error(JSON.stringify(f) + ",");
}
console.error(`]}`);
