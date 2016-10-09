# Totem DEBE

[![Forked from SourceForge](https://sourceforge.net)]

[Totem](https://git.geointapps.org/acmesds/transfer)'s TOTEM module provides an HTTP-HTTPS service configured with/without the 
following options:
  
	+ routing methods for table, engine, and file objects
	+ Denial-of-Service protection
	+ web sockets for inter-client communications
	+ client profiles (banning, journalling, hawking, challenge tags and polling)
	+ account management by priviledged hawks and normal users
	+ hyper-threading in a master-worker or master-only relationship
	+ PKI channel encryption and authentication
	+ no faults run state
	+ transfer, indexing, saving and selective cacheing of static mime files
	+ anti-bot challenges: (riddle), (card), (ids), (yesno), (rand)om, (bio)metric
	+ full crude syncronized data operations with mutiple endpoints
  
TOTEM thus replaces a slew of god-awful middleware (like Express).

To synchronize multiple data nodes, TOTEM uses the following 
Crude | HTTP requests:
  
	select	| GET 	 /NODE $ NODE ...
	update	| PUT 	 /NODE $ NODE ...
	insert	| POST 	 /NODE $ NODE ...
	delete	| DELETE /NODE $ NODE ...
  
 where a data NODE can reference a mysql or emulated table:
  
  	NODE = TABLE.TYPE?PARMS
  
or reference a language agnostic (e.g. jade skin, js, py, matlab, 
emulated matlab, r, opencv, etc) engine:

	NODE = ENGINE.TYPE?PARMS

or reference a file:

	NODE = FILE.TYPE?PARMS
  
where FILE = AREA/PATH provides redirection of the requested PATH
to a service defined AREA, and where 

	TYPE = db | txt | xml | csv | json | ...

returns NODE data in the specified format (additional types can
be supported by the next higher assembly using the TOTEM.reader). 

To start TOTEM with options use:

	var TOTEM = require("totem").start({
		// options
	});

where the startup options include:
  
	// CRUDE interface

	select: cb(req,res),
	update: cb(req,res),
	delete: cb(req,res),
	insert: cb(req,res),
	execute: cb(req,res),

	// NODE routers

	worker: {		// computed results from stateful engines
		select: cb(req,res),
		update: cb(req,res),
		... 	},

	emulator: {		// emulate virtual tables
		select: {
			TABLE: cb(req,res),
			TABLE: cb(req,res),
			...		},
		...		},

	sender: {		// return raw files
		AREA: cb(req,res),
		AREA: cb(req,res),
		...		},

	reader: {		// readers
		user: cb(req,res),	// manage users

		wget: cb(req,res),	// fetch from other services
		curl: cb(req,res),
		http: cb(req,res),

		TYPE: cb(req,res),	// index (scan, parse etc) files
		TYPE: cb(req,res),
		...		},
	
	// server specific
	
	port	: number of this http/https (0 disables listening),
	host	: "domain name" of http/https service,
	encrypt	: "passphrase" for a https server ("" for http),
	cores	: number of cores in master-worker relationship (0 for master only),

	paths	: {  // paths to various things
		... },

	site	: {  // vars and functions assessible to jade skins
		... },

	prettyError(err)	: format an error message,
	stop() 		: stop the service,
	thread(cb) 	: provide sql connection to cb(sql),

	// antibot protection

	nofaults: switch to enable/disabled server fault protection,
	busy	: number of millisecs to check busyness (0 disables),

	riddles	: number of riddles to create for anti-bot protection (0 disables)

	map		: {	 // map riddle DIGIT to JPEG files
		DIGIT:["JPEG1","JPEG2", ...],
		DIGIT:["JPEG1","JPEG2", ...],
		...	},

	// User administration 

	guest	: {	 // default guest profile 
		... },

	create(owner,pass,cb) 	: makes a cert with callback cb,
	validator(req,res) 		: validate cert during each request,
	emitter(socket) 		: communicate with users over web sockets,

	// Data fetching services

	retries	: count for failed fetches (0 no retries)
	notify	: switch to trace every fetch

	// MySQL db service

	mysql	: {host,user,pass,...} db connection parameters (null for no db),

	// Derived parameters

	name	: "service name"
		// derives site parms from mysql openv.apps by Nick=name
		// sets mysql name.table for guest clients,
		// identifies server cert name.pfx file

	started: start time
	site: {db parameters} loaded for specified opts.name,
	url : {master,worker} urls for specified opts.cores,
	all the ENUM enumerators

Options are specified using ENUM-copy conventions:

	options =  {
		key: value, 						// set 
		"key.key": value, 					// index and set
		"key.key.": value,					// index and append
		OBJECT: [ function (){}, ... ], 	// add prototypes
		Function: function () {} 			// add callback
		:
		:
	}
 
## Installation

Download and unzip into your project/totem folder and revise the project/config module as needed
for your [Totem](https://git.geointapps.org/acmesds/transfer) project.  Typically, you will
want to:

	ln -s project/config/debe.sh config.sh
	ln -s project/config/maint.sh maint.sh
	ln -s project/config/certs certs
	
to override the defaults.

## Usage


Below sample use-cases are from totem/config.js:

	N1: function () {
		
		var TOTEM = require("../totem");

		Trace(
			"Im simply the default Totem interface so Im not running any service", {
			default_fetcher_endpts: TOTEM.reader,
			default_protect_mode: TOTEM.nofaults,
			default_cores_used: TOTEM.cores
		});
	},
	
	N2: function () {
		
		Trace(
`I **will be** a Totem client running in fault protection mode, 
with 2 cores and default routes` );

		var TOTEM = require("../totem").start({
			nofaults: true,
			cores: 2
		});
		
	},
	
	N3: function () {
		
		var TOTEM = require("../totem").start({
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			},
			
			init: function () {				
				Trace(
`I **have become** a Totem client, with no cores, but 
I do have mysql database from which I've derived my site parms`, {

					mysql_derived_parms: TOTEM.site
				});
			}
		});
		
	},
	
	N4: function () {
		
		var TOTEM = require("../totem").start({
			encrypt: ENV.SERVICE_PASS,
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			},
			reader: {
				dothis: function dothis(req,res) {  //< named handlers are shown in trace in console
					res( "123" );
					
					Trace(		
`PKI-encrypted Totem service, 2 cores, unprotected, with a mysql database, and \n
(dothis,orthis) endpoints.  If the servers client.pfx does not exists, Totem will\n
create the client.pfx and associated pems (public client.crt and private client.key).` , {

						do_query: req.query
					});
				},

				orthis: function orthis(req,res) {
					
					if (req.query.x)
						res( [{x:req.query.x+1,y:req.query.x+2}] );
					else
						res( new Error("We have a problem huston") );
						
					Trace(
`Like dothis, but needs an ?x=value query`, {
						or_query: req.query,
						or_user: [req.client,req.group]
					});
				}
			},
			
			init: function () {
				Trace(
					"try my **encrypted** (dothis,orthis) endpoints", {
					my_endpoints: TOTEM.reader
				});
			}
		});
		
	},
	
	N5: function () {
		var TOTEM = require("../totem").start({
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			},
	
			riddles: 10,
			
			init: function () {
				
				Trace(
`I am Totem client, with no cores but I do have mysql database and
I have anti-bot protection!!`, {
					mysql_derived_parms: TOTEM.site
				});
			}
		});
	}
	
[Totem](https://git.geointapps.org/acmesds/transfer)'s DEBE module provides an
example of how Totem can be integrated into higher level assemblies.


## License

[MIT](LICENSE)
