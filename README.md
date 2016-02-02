# Local assets
Build for download all online resources to local machince and create server for access it. (Build with `express` version 4.11.X and `NodeJS` version 0.10.X)


## How to use
- Clone this repo to your machince.
- `npm install`


## START SERVER
- `./bin/www`
- `DEBUG=local-assets:* ./bin/www` (with debug mode)


## How to use
- Add all resoueces that you want to download for use in this server in file `resources.json` in JSON array.
- Then start server with command `./bin/www` in your terminal.
- Then you can access all resources from `http://localhost:6969/path/is/you/want/to/use`.
- *** NOTE - you can change port with `PORT=port_is_you_want_to_use ./bin/www` (Default port is `6969`)


## Example resources.json
```javascript
[
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/angular.js/2.0.0-beta.2/angular2.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/riot/2.3.15/riot.min.js"
]
```


## Hot Fixed problem
- run command `./bin/restore` in your terminal and then start server (OSX)