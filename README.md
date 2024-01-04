# osm_historic

Determine if old OSM data on cycling infrastructure could help with uplift modelling

## Measure total length of cycling infrastructure in the past

Output: A CSV with LSOA, a total length in 2011, and a total length in 2020

### Idea 1: Manually

1) Get an old osm.pbf of England

2) Extract cycling infrastructure from it (like in ATIP browse)

3) Split by LSOA boundaries

4) Sum length

### Idea 2: ohsome

Something like <https://hex.ohsome.org/#/cycleways_w/2011-06-01T00:00:00Z/8/52.07429015262514/-0.6955267371189224> might just work

## Validate if old OSM data had enough cycling data mapped in the first place

- Using Ohsome Quality Analyst?
- Or checking for a sample of schemes known to have been built between 2011 and 2020
