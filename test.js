// UNCLASSIFIED
/**
Unit test (aka run) a Totem configuration CONFIG using one the following methods:
 
 		. maint.sh CONFIG			# with new environment variables
 		node test.js CONFIG			# with current environment variables
		forever start test.js CONFIG  # keep it up forever and ever

A null CONFIG will return a list of available configurations.

Trace logs are prefixed by the issuing module:

		U>UNITTEST
			D>DEBE
				T>TOTEM
					V>DSVAR
				E>ENGINE
					R>RANDPR
				X>FLEX
					S>READER
				C>CHIPPER
					E>ENGINE
 
 * */

var 
	ENV = process.env,
	ENUM = require("enum"),
	CP = require("child_process"),
	Copy = ENUM.copy,
	Log = console.log;

ENUM.test({

	N1: function () {
		
		var TOTEM = require("../totem");

		Trace({
			msg: "Im simply a Totem interface so Im not even running as a service", 
			default_fetcher_endpts: TOTEM.byTable,
			default_protect_mode: TOTEM.faultless,
			default_cores_used: TOTEM.cores
		});
	},
	
	N2: function () {
		

		var TOTEM = require("../totem").config({
			name: "Totem1",
			faultless: true,
			cores: 2
		}, function (err) {
		
			Trace( err || 
`I'm a Totem service running in fault protection mode, no database, no UI; but I am running
with 2 cores and the default endpoint routes` );
			
		});
		
	},
	
	N3: function () {
		
		var TOTEM = require("../totem").config({
			name: "Totem1",
			
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			}
		},  function (err) {				
			Trace( err ||
`I'm a Totem service with no cores. I do, however, now have a mysql database from which I've derived 
my startup options (see the openv.apps table for the Nick="Totem").  
No endpoints to speak off (execept for the standard wget, riddle, etc) but you can hit "/files/" to index 
these files. `
			);
		});
		
	},
	
	N4: function () {
		
		var TOTEM = require("../totem").config({
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			},
			byTable: {
				dothis: function dothis(req,res) {  //< named handlers are shown in trace in console
					res( "123" );
					
					Trace({
						do_query: req.query
					});
				},

				dothat: function dothat(req,res) {
					
					if (req.query.x)
						res( [{x:req.query.x+1,y:req.query.x+2}] );
					else
						res( new Error("We have a problem huston") );
						
					Trace({
						msg: `Like dothis, but needs an ?x=value query`, 
						or_query: req.query,
						or_user: [req.client,req.group]
					});
				}
			}
		}, function (err) {
			Trace( err || {
				msg:
`As always, if the openv.apps Encrypt is set for the Nick="Totem" app, this service is now **encrypted** [*]
and has https (vs http) endpoints, here /dothis and /dothat endpoints.  Ive only requested only 1 worker (
aka core), Im running unprotected, and have a mysql database.  
[*] If my NICK.pfx does not already exists, Totem will create its password protected NICK.pfx cert from the
associated public NICK.crt and private NICK.key certs it creates.`,
				my_endpoints: TOTEM.byTable
			});
		});
		
	},
	
	N5: function () {
		var TOTEM = require("../totem").config({
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			},
	
			name: "Totem1",
			
			riddles: 20
		}, function (err) {
			Trace( err || {
				msg:
`I am Totem client, with no cores but I do have mysql database and I have an anti-bot shield!!  Anti-bot
shields require a Encrypted service, and a UI (like that provided by DEBE) to be of any use.`, 
				mysql_derived_parms: TOTEM.site
			});
		});
	},
	
	N6: function () { // db maint
		
		var TOTEM = require("../totem").config({
			name: "Totem1",
			
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			}
		},  function (err) {				
			Trace( err || "db maintenance" );
			
			TOTEM.thread( function (sql) {
				
				switch (0) {
					case 1: 
						sql.query( "select voxels.id as voxelID, chips.id as chipID from app.voxels left join app.chips on voxels.Ring = chips.Ring", function (err,recs) {
							Log(err);
							recs.each( function (n, rec) {
								sql.query("update app.voxels set chipID=? where ID=?", [rec.chipID, rec.voxelID], function (err) {
									Log(err);
								});
							});
						});
						break;
						
					case 2:
						sql.query("select ID, Ring from app.voxels", function (err, recs) {
							recs.each( function (n, rec) {
								sql.query(
									"update app.voxels set Point=geomFromText(?) where ?", 
									[ `POINT(${rec.Ring[0][0].x} ${rec.Ring[0][0].y})` , {ID: rec.ID} ], 
									function (err) {
										Log(err);
								});
							});
						});
						break;
						
					case 3:
						sql.query( "select voxels.id as voxelID, cache.id as chipID from app.voxels left join app.cache on voxels.Ring = cache.geo1", function (err,recs) {
							Log(err);
							recs.each( function (n, rec) {
								sql.query("update app.voxels set chipID=? where ID=?", [rec.chipID, rec.voxelID], function (err) {
									Log(err);
								});
							});
						});
						break;
						
					case 4:
						sql.query("select ID, geo1 from app.cache where bank='chip'", function (err, recs) {
							recs.each( function (n, rec) {
								if (rec.geo1)
									sql.query(
										"update app.cache set x1=?, x2=? where ?", 
										[ rec.geo1[0][0].x, rec.geo1[0][0].y, {ID: rec.ID} ], 
										function (err) {
											Log(err);
									});
							});
						});
						break;
						
					case 5: 
						var parms = {
ring: "[degs] closed ring [lon, lon], ... ]  specifying an area of interest on the earth's surface",
"chip length": "[m] length of chip across an edge",
"chip samples": "[pixels] number of pixels across edge of chip"
						};
						//get all tables and revise field comments with info data here -  archive parms - /parms in flex will
						//use getfileds to get comments and return into
				}
						
			});
			
		});
		
	},
		
	E1: function () {

		var ENGINE = require("../engine");
		var TOTEM = require("../totem");

		Trace({
			msg: "A Totem+Engine client has been created", 
			a_tau_template: ENGINE.tau("somejob.pdf"),
			engine_errors: ENGINE.error,
			get_endpts: TOTEM.byTable,
			my_paths: TOTEM.paths
		});
		
	},
	
	E2: function () {

		var TOTEM = require("../totem");
		
		TOTEM.config({}, function (err) {
			Trace( err || "Started but I will now power down" );
			TOTEM.stop();
		});

		var ENGINE = require("../engine").config({
			thread: TOTEM.thread
		});

	},
			
	E3: function () {

		var TOTEM = require("../totem").config({
			"byTable.": {
				chipper: function Chipper(req,res) {				
					res( 123 );
				}
			},
			
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			}
			
		});

		var ENGINE = require("../engine").config({
			thread: TOTEM.thread
		});
	},
	
	E4: function () {
		
		var TOTEM = require("../totem").config({
			"byTable.": {
				test: function Chipper(req,res) {
					
					var itau = [ENGINE.tau()];
					var otau = [ENGINE.tau()];

					switch (req.query.config) {
						case "cv": // program and step haar opencv machine 
							parm =	{
								tau: [], 
								ports: {
									frame:	 {},
									helipads: {scale:0.05,dim:100,delta:0.1,hits:10,cascade:["c1/cascade"]},
									faces:	 {scale:0.05,dim:100,delta:0.1,hits:10,cascade:["haarcascade_frontalface_alt","haarcascade_eye_tree_eyeglasses"]}
							}};

							itau[0].job = "test.jpg";
							console.log(parm);

							for (var n=0,N=1;n<N;n++)  // program N>1 to test reprogram
								console.log(`INIT[${n}] = `, ENGINE.opencv("opencv.Me.Thread1","setup",parm));

							for (var n=0,N=5;n<N;n++) // step N>1 to test multistep
								console.log(`STEP[${n}] = `, ENGINE.opencv("opencv.Me.Thread1","frame",itau));

							// returns badStep if the cascades were undefined at the program step
							console.log("STEP = ", ENGINE.opencv("opencv.Me.Thread1","helipads",otau));
							console.log(otau);
							break;

						// python machines fail with "cant find forkpty" if "import cv2" attempted

						case "py1": // program python machine
							parm =	{ 
								tau:	[{job:"redefine on run"}],
								ports: {	
							}};
							pgm = `
print 'Look mom - Im running python!'
print tau
tau = [{'x':[11,12],'y':[21,22]}]
`;

							// By default python attempts to connect to mysql.  
							// So, if mysql service not running or mysql.connector module not found, this will not run.
							console.log({py:pgm, ctx: parm});
							console.log("INIT = ", ENGINE.python("py1.thread",pgm,parm));
							console.log(parm.tau);
							break;

						case "py2": // program and step python machine 
							parm =	{ 
								tau:	[{job:"redefine on run"}],
								ports: { 	
									frame:	 {},
									helipads:{scale:1.01,dim:100,delta:0.1,hits:10,cascade:["c1/cascade"]},
									faces:	 {scale:1.01,dim:100,delta:0.1,hits:10,cascade:["haarcascade_frontalface_alt","haarcascade_eye_tree_eyeglasses"]}
							}};

							itau[0].job = "test.jpg";
							pgm = `
print 'Look mom - Im running python!'
def frame(tau,parms):
	print parms
	return -101
def helipads(tau,parms):
	print parms
	return -102
def faces(tau,parms):
	print parms
	return -103
`;		
							console.log({py:pgm, ctx: parm});
							console.log("INIT = ", ENGINE.python("py2.Me.Thread1",pgm,parm));
							// reprogramming ignored
							//console.log("INIT = ", ENGINE.python("py2.Me.Thread1",pgm,parm));

							for (var n=0,N=1; n<N; n++)
								console.log(`STEP[${n}] = `, ENGINE.python("py2.Me.Thread1","frame",itau));

							console.log("STEP = ", ENGINE.python("py2.Me.Thread1","helipads",otau));
							break;

						case "py3": // program and step python machine string with reinit along the way
							parm =	{ 
								tau:	[{job:"redefine on run"}],
								ports: {	
									frame:	 {},
									helipads:{scale:1.01,dim:100,delta:0.1,hits:10,cascade:["c1/cascade"]},
									faces:	 {scale:1.01,dim:100,delta:0.1,hits:10,cascade:["haarcascade_frontalface_alt","haarcascade_eye_tree_eyeglasses"]}
							}};

							itau[0].job = "test.jpg";
							pgm = `
print 'Look mom - Im running python!'
def frame(tau,parms):
	print parms
	return -101
def helipads(tau,parms):
	print parms
	return -102
def faces(tau,parms):
	print parms
	return -103
`;

							console.log({py:pgm, ctx: parm});
							console.log("INIT = ", ENGINE.python("py3",pgm,parm));
							console.log("STEP = ", ENGINE.python("py3","frame",itau));
							// reprogramming ignored
							//console.log("REINIT = ", ENGINE.python("py3",pgm,parm));
							//console.log("STEP = ", ENGINE.python("py3","frame",itau));
							console.log(otau);
							break;

						case "js": // program and step a js machine string
							parm =	{ 
								ports: {	
									frame:	 {},
									helipads:{scale:1.01,dim:100,delta:0.1,hits:10,cascade:["c1/cascade"]},
									faces:	 {scale:1.01,dim:100,delta:0.1,hits:10,cascade:["haarcascade_frontalface_alt","haarcascade_eye_tree_eyeglasses"]}
							}};

							itau[0].job = "test.jpg";
							pgm = `
CON.log('Look mom - Im running javascript!');
function frame(tau,parms) { 
	CON.log("here I come to save the day");
	tau[0].xyz=123; 
	return 0; 
}
function helipads(tau,parms) { 
	tau[0].results=666; 
	return 101; 
}
function faces(tau,parms) { return 102; }
`;

							console.log({py:pgm, ctx: parm});
							console.log("INIT = ", ENGINE.js("mytest",pgm,parm));
							// frame should return a 0 = null noerror
							console.log("STEP = ", ENGINE.js("mytest","frame",itau));
							console.log(itau);
							// helipads should return a 101 = badload error
							console.log("STEP = ", ENGINE.js("mytest","helipads",otau));
							console.log(otau);
							break;	
					}
					
					res( "thanks!" );
				}
			},
			
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			}
			
		}, function (err) {
			Trace( "Unit test my engines with /test?config=cv | py1 | py2 | py3 | js" );
		});

		var ENGINE = require("../engine").config({
			thread: TOTEM.thread
		});

	},
	
	C1: function () {
		
		var CHIPPER = require("../chipper");
		
		var TOTEM = require("../totem").config({
			"byTable.": {
				chip: CHIPPER.chippers,

				wfs: function (req,res) {
					res("here i go again");
					
					TOTEM.fetchers.http(ENV.WFS_TEST, function (data) {
						console.log(data);
					});
					
				}

			},				
			
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			}
		}, function (err) {
			Trace( err || "Go ahead and test my default /chip and /wfs endpoints", {
				my_readers: TOTEM.byTable
			});
		});
		
		CHIPPER.config({
			thread: TOTEM.thread
		});

	},
	
	D1: function () {
		var 
			DEBE = require("../debe").config({
				//name: ENV.SERVICE_NAME,

				mysql: {
					host: ENV.MYSQL_HOST,
					user: ENV.MYSQL_USER,
					pass: ENV.MYSQL_PASS
				},

				onFile: {
					"./public/uploads/": function (sql, name, path) {  // watch changes to a file				
						
						sql.getFirst(  // get client for registered file
							"UPLOAD",
							"SELECT ID,Client,Added FROM app.files WHERE least(?) LIMIT 1", 
							{Name: name, Area:"uploads"}, function (file) {

							if (file) {  // ingest only registered file
								var 
									now = new Date(),
									exit = new Date(),
									client = file.Client,
									added = file.Added,
									site = DEBE.site,
									port = name.tag("a",{href:"/files.view"}),
									url = site.urls.worker,
									metrics = "metrics".tag("a", {href:url+"/airspace.view"}),
										/* [
											"quality".tag("a",{href:url+"/airspace.view?options=quality"}),
											"clumping".tag("a",{href:url+"/airspace.view?options=clumping"}),
											"loitering".tag("a",{href:url+"/airspace.view?options=loitering"}),
											"corridors".tag("a",{href:url+"/airspace.view?options=corridors"}),
											"patterns".tag("a",{href:url+"/airspace.view?options=patterns"})
										].join(", "), */
									poc = site.distro.d;

								sql.getFirst(  // credit client for upload
									"UPLOAD",
									"SELECT `Group` FROM openv.profiles WHERE ? LIMIT 1", 
									{Client:client}, 
									function (prof) {

									exit.offsetDays( 30 );
										
									if ( prof ) {
										var 					
											group = prof.Group,
											revised = "revised".tag("a", {href:`/files.view?ID=${file.ID}`} ),
											notes = `
Thank you ${client} for your sample deposit to ${port} on ${now}.  If your 
sample passes initial quality assessments, additional ${metrics} will become available.  Unless
${revised}, these samples will expire on ${exit}.  Should you wish to remove these quality 
assessments from our worldwide reporting system, please contact ${poc} for consideration.
`;
										sql.query("UPDATE app.files SET ? WHERE ?", [{
												Notes: notes,
												Added: now,
												Expires: exit
											}, {ID: file.ID}
										], function (err) {
											DEBE.ingestFile(sql, path, name, file.ID, function (aoi) {
												//Trace( `CREDIT ${client}` );

												sql.query("UPDATE app.profiles SET Credit=Credit+? WHERE Client=?", [aoi.snr, client]);

												if (false)  // put upload into LTS - move this to file watchDog
													CP.exec(`zip ${path}.zip ${path}; rm ${path}; touch ${path}`, function (err) {
														Trace(`PURGED ${name}`);
													});
											});
										});

									}

									sql.release();
								});
							}
						});
					},

					"./public/js/": function (sql,name,ev) {
						sql.release();
					},

					"./public/py/": function (sql,name,ev) {
						sql.release();
					}

				}

			}, function (err) {
				Trace( err || 
`Yowzers - this does everything but eat!  An encrypted service, a database, a jade UI for clients,
usecase-engine plugins, file-upload watchers, and watch dogs that monitor system resources (jobs, files, 
clients, users, system health, etc).` 
				);
			});
	},
	
	D2: function () {
		var 
			DEBE = require("../debe").config({

			riddles: 10,
			mysql: {
				host: ENV.MYSQL_HOST,
				user: ENV.MYSQL_USER,
				pass: ENV.MYSQL_PASS
			},
			"byTable.": {
				wfs: function (req,res) {
					res("here i go again");
					
					TOTEM.fetchers.http(ENV.WFS_TEST, function (data) {
						console.log(data);
					});
				}
			}
		}, function (err) {
			Trace( "This bad boy in an encrypted service with a database and has an /wfs endpoint" );
		});
	},
	
	D3: function () {
		var 
			DEBE = require("../debe").config({
				name: "Totem1",

				mysql: {
					host: ENV.MYSQL_HOST,
					user: ENV.MYSQL_USER,
					pass: ENV.MYSQL_PASS
				}
			}, function (err) {
				Trace( err || "Stateful network flow manger started" );
			});
	}

});	

function Trace(msg,sql) {
	ENUM.trace("U>",msg,sql);	
}

// UNCLASSIFIED
