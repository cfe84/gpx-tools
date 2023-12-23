Simple script that you run in a folder that contains GPX traces of your hikes, runs, rides, and produces csv or a formatted table of your performance on that trace.

It also supports segments and easily allows you to list your timings and compare with past performance. Use the json file in the test folder as an example for the segments.json file.

To get a scrapy cli Strava-like, I recommend using osmAnd+ to record your traces, foldersync to save to your cloud, then run gpx-tools on that folder.

`npm i -g gpx-tools` to install

`gpx-tools -h` to understand how to use
