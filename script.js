import * as fs from "fs";
import turfLength from "@turf/length";

// npm dumps stuff to STDOUT, so output on STDERR
console.error(`LSOA11CD,total_length_meters_2011`);
for (let file of fs.readdirSync("split")) {
  if (file == "null.json") {
    // Things that didn't match to any LSOA
    continue;
  }

  let gj = JSON.parse(fs.readFileSync(`split/${file}`, { encoding: "utf8" }));
  let sum = 0;
  for (let f of gj.features) {
    sum += turfLength(f, { units: "kilometers" }) * 1000.0;
  }
  console.error(`${file.replace(".json", "")},${sum.toFixed(1)}`);
}
