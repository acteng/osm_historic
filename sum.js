import * as fs from "fs";
import turfLength from "@turf/length";

function sum(dir) {
  let mapping = {};
  for (let file of fs.readdirSync(dir)) {
    let gj = JSON.parse(
      fs.readFileSync(`${dir}/${file}`, { encoding: "utf8" }),
    );
    let sum = 0;
    for (let f of gj.features) {
      sum += turfLength(f, { units: "kilometers" }) * 1000.0;
    }
    mapping[file.replace(".json", "")] = sum.toFixed(1);
  }
  return mapping;
}

let sums_2011 = sum("2011/split");
let sums_2016 = sum("2016/split");
let sums_2020 = sum("2020/split");

// npm dumps stuff to STDOUT, so output on STDERR
console.error(`LAD11CD,total_length_meters_2011,length_meters_2016,length_meters_2020`);
let seen = new Set();
for (let [lad, sum_2011] of Object.entries(sums_2011)) {
  seen.add(lad);
  let sum_2016 = sums_2016[lad] || 0.0;
  let sum_2020 = sums_2020[lad] || 0.0;
  console.error(`${lad},${sum_2011},${sum_2016},${sum_2020}`);
}

// Handle places only in 2020
for (let [lad, sum_2020] of Object.entries(sums_2020)) {
  if (!seen.has(lad)) {
    let sum_2016 = sums_2016[lad] || 0.0;
    console.error(`${lad},0.0,${sum_2016},${sum_2020}`);
  }
}
