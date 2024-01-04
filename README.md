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

That took just 30 seconds, with output just 175 MB. The equivalent extract today is about 1.2 GB, so that's a quick sense of how sparse OSM data was in 2011!

(TODO: Is it faster to clip first, then time-filter?)

#### Extract cycling infrastructure from it

There's no simple tag for cycling infra in OSM. Ohsome has a [thorough query](https://hex.ohsome.org/#/cycleways_w/2011-06-01T00:00:00Z/8/52.07429015262514/-0.6955267371189224) from a paper, but it's expressed as an Overpass query that we can't readily use. Let's just start with one simple case...

```
osmium tags-filter england_2011.pbf w/highway=cycleway -o cycleways.osm.pbf
osmium export cycleways.osm.pbf --geometry-type=linestring -o cycleways.geojson
```

We'll go back and improve this later.

#### Split by LSOA boundaries

Download 2011 LSOA boundaries as GJ from <https://geoportal.statistics.gov.uk/datasets/ons::lsoa-dec-2011-boundaries-generalised-clipped-bgc-ew-v3-2/explore>, and convert it to WGS84:

```
ogr2ogr lsoas_2011.geojson -t_srs EPSG:4326 ~/Downloads/LSOA_Dec_2011_Boundaries_Generalised_Clipped_BGC_EW_V3_-5359576152338500277.geojson -sql 'SELECT LSOA11CD, geometry FROM "LSOA_Dec_2011_Boundaries_Generalised_Clipped_BGC_EW_V3_-5359576152338500277"'
```

We want to take the England-wide cycleway GJ file and split it into one file per LSOA. First we add the `LSOA11CD` property to each LineString using [mapshaper](https://github.com/mbloch/mapshaper):

```
mapshaper cycleways.geojson -divide lsoas_2011.geojson -o cycleways_grouped.geojson
```

Then we split into a bunch of files:

```
mkdir split; cd split; mapshaper -i ../cycleways_grouped.geojson -split LSOA11CD -o format=geojson
```

#### Sum length

### Idea 2: ohsome

Something like <https://hex.ohsome.org/#/cycleways_w/2011-06-01T00:00:00Z/8/52.07429015262514/-0.6955267371189224> might just work

## Validate if old OSM data had enough cycling data mapped in the first place

- Using Ohsome Quality Analyst?
- Or checking for a sample of schemes known to have been built between 2011 and 2020
