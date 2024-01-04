# osm_historic

Determine if old OSM data on cycling infrastructure could help with uplift modelling

## Measure total length of cycling infrastructure in the past

Output: A CSV with LSOA, a total length in 2011, and a total length in 2020

### Idea 1: Manually

#### Get an old osm.pbf of England

Geofabrik has old osm.pbfs, if you click on "raw directory index". But <https://download.geofabrik.de/europe/united-kingdom/england.html> and for Europe only go back to 2014.

From <https://wiki.openstreetmap.org/wiki/Planet.osm/full>, I found the oldest pbf dump at <https://planet.openstreetmap.org/pbf/full-history/history-221219.osm.pbf>, which is 112GB. But then thankfully I found <https://planet.osm.org/planet/full-history/> and went for a 2013 history dump <https://planet.osm.org/planet/full-history/2013/history_2013-02-05_1701.osm.bz2>, only 40GB (15 minutes to download with gigabit fiber)!

From <https://osmcode.org/osmium-tool/manual.html#working-with-history-files>, then we can turn a history dump into a regular dump:

```
osmium time-filter history_2013-02-05_1701.osm.bz2 2011-01-01T00:00:00Z -o 2011.osm.pbf
```

That took about 2 hours, and now down to 10 GB. Then we can clip to a bounding box of England (cheers bboxfinder.com), using the fastest extraction strategy and removing unneeded metadata:

```
osmium extract -b -6.020508,49.696062,2.329102,55.949200 2011.osm.pbf -o england_2011.pbf -f pbf,add_metadata=false -s simple
```

That took just 30 seconds, with output just 175 MB.

(TODO: Is it faster to clip first, then time-filter?)

#### Extract cycling infrastructure from it (like in ATIP browse)

#### Split by LSOA boundaries

#### Sum length

### Idea 2: ohsome

Something like <https://hex.ohsome.org/#/cycleways_w/2011-06-01T00:00:00Z/8/52.07429015262514/-0.6955267371189224> might just work

## Validate if old OSM data had enough cycling data mapped in the first place

- Using Ohsome Quality Analyst?
- Or checking for a sample of schemes known to have been built between 2011 and 2020
