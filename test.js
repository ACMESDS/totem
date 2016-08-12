// UNCLASSIFIED
/**
 * Test a Totem configurations using 
 * 
 * 		. setup.sh CONFIG
 * 
 * or
 * 		node test.js APP CONFIG
 * 
 * with CONFIG = N0, N1, ... and APP = app1
 * */

require("../enum").test({

	N0: function () {
		var TOTEM = require("../totem").extend({ name:"app1", mysql: { host: "localhost", user: "root", pass: "NGA" }});
	},
			
	N1: function () {
		
		var TOTEM = require("../totem");

		console.log({
			test: "I am simply the default Totem interface",
			default_fetcher_endpts: TOTEM.fetcher,
			default_protect_mode: TOTEM.protected,
			default_cores_used: TOTEM.cores
		});
	},
	
	N2: function () {
		
		console.log({
			test:
`I **will be** a Totem client running in protected mode, 
with 2 cores and default routes`
		});

		var TOTEM = require("../totem").start({
			protected: true,
			cores: 2
		});
		
	},
	
	N3: function () {
		
		var TOTEM = require("../totem").start({
			mysql: {
				host: "localhost",
				user: "root",
				pass: "NGA"
			},
			
			init: function () {
				
				console.log({
					test:
`I **have become** a Totem client, with no cores, unprotected, but 
I do have mysql database from which I've derived my site parms`,

					mysql_derived_parms: TOTEM.site
				});
			}
		});
		
	},
	
	N4: function () {
		
		var TOTEM = require("../totem").start({
			encrypt: "test",
			mysql: {
				host: "localhost",
				user: "root",
				pass: "NGA"
			},
			fetcher: {
				dothis: function dothis(req,res) {  //< named handlers are shown in trace in console
					res( "123" );
					
					console.log({
						test:		
`PKI-encrypted Totem service, 2 cores, unprotected, with a mysql database, and add routes\n
to (dothis,orthis) endpoints.  If the servers client.pfx does not exists, Totem will\n
create the client.pfx and associated pems (public client.crt and private client.key).` ,

						do_query: req.query
					});
				},

				orthis: function orthis(req,res) {
					
					if (req.query.x)
						res( [{x:req.query.x+1,y:req.query.x+2}] );
					else
						res( new Error("We have a problem huston") );
						
					console.log({
						test: `Like dothis, but need an x=value query`,
						or_query: req.query,
						or_user: [req.client,req.group]
					});
				}
			},
			
			init: function () {
				console.log({
					test: "try one of my **encrypted** data fetcher endpoints",
					added_fetchers: TOTEM.fetcher
				});
			}
		});
		
	},
	
	N5: function () {
		console.log({test:"reserved"});
	},
	
	E1: function () {

		var ENGINE = require("../engine");
		var TOTEM = require("../totem");

		console.log({
			test: "A default geoEngine client",
			a_tau_template: ENGINE.tau("somejob.pdf"),
			engine_errors: ENGINE.error,
			get_endpts: TOTEM.reader,
			my_paths: TOTEM.paths
		});
		
	},
	
	E2: function () {

		var TOTEM = require("../totem");
		
		TOTEM.start({
			
			init: function () {

				console.log({
					test: "geoEngine being powered down"
				});
				
				TOTEM.stop();
			}
		});

		var ENGINE = require("../engine").config({
			thread: TOTEM.thread
		});

	},
			
	E3: function () {
		
		var TOTEM = require("../totem").start({

			reader: {
				merge: {
					chipper: function Chipper(req,res) {				
						res( 123 );
					}
				}
			},
			
			mysql: {
				host: "localhost",
				user: "root",
				pass: "NGA"
			}
			
		});

		var ENGINE = require("../engine").config({
			thread: TOTEM.thread
		});

		console.log({
			test: "Starting a trivial geoEngine with a chipper fetcher and a database"
		});

	},
	
	C1: function () {
		
		var CHIPPER = require("../chipper");
		
		var TOTEM = require("../totem").start({
			trace: "C>",

			reader: {
				merge: CHIPPER.chippers
			},				
			
			mysql: {
				host: "localhost",
				user: "root",
				pass: "NGA"
			},
			
			init: function () {

				console.log({
					test: "Test my default endpoints",
					my_readers: TOTEM.reader
				});
			}
		});
		
		CHIPPER.config({
			thread: TOTEM.thread
		});

	},
	
	D1: function () {
		
		var TOTEM = require("../debe").start({
			//encrypt: "test",
			
			mysql: {
				host: "localhost",
				user: "root",
				pass: "NGA"
			},
			
			init: function () {

				console.log({
					test: "Encrypted geoDebe client with a database"
					//debe_mysql:TOTEM.mysql,
					//debe_site: TOTEM.site
				});
				
			}
			
		});
			
	}
	
});	

	
// UNCLASSIFIED
