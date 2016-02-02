# How to use
- Clone this repo to your machince.
- `npm install`


## START SERVER
- `./bin/www`
- `DEBUG=local-assets:* ./bin/www` (with debug mode)


## How to use
- Add all resoueces that you want to download for use in this server in file `resources.json` in JSON array.
- Then start server with command `./bin/www` in your terminal.
- Then use can access all resources that your download from `http://localhost:6969/path/is/you/want/to/use`.
- *** NOTE - you can change port with `PORT=port_is_you_want_to_use ./bin/www`


## Hot Fixed issue
- run command `./bin/restore` in your terminal and then start server