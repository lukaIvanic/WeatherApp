# WeatherApp

NodeJS, MySQL, Javascript.

API used: https://openweathermap.org/api

Doesn't work on phones because geolocation is blocked on non secure sites.

Used heroku for hosting.

Manual:

The send button send your location ( or random ) to the server which then saves that ping into the database.

When random is toggled on, instead of using the users location a random longitude and latitude is used (because of which it's uncommon te get unknown station).

List section just displays all the pings from the database.

Map, similar to list displays all pings, but on a map of earth. ( Clicking on points reveals information. )
