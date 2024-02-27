// H A L A T I O N
//
// Version 1
//
// by Joakim Hertze (www.hertze.se)
//
// ---------------------------------------------------------------------

#target photoshop


// Settings ------------------------------------------------------------

var save = false;
var threshold = "auto";
var global_threshold = "auto";
var bloom = 15;
var effect_multiply = 1;
var darken_local = 60;
var darken_global = 40;
var red_inner = 204;
var green_inner = 120;
var blue_inner = 0;
var red_outer = 204;
var green_outer = 17;
var blue_outer = 0;
var red_global = 13;
var green_global = 4;
var blue_global = 0;

// ---------------------------------------------------------------------


// DO NOT EDIT BELOW THIS LINE -----------------------------------------

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource> 
<name>Halation</name> 
<menu>automate</menu>
<enableinfo>true</enableinfo>
<eventid>aded9a83-71d4-4d2b-88d6-17198e86d9e0</eventid>
<terminology><![CDATA[<< /Version 1
					   /Events <<
					   /aded9a83-71d4-4d2b-88d6-17198e86d9e0 [(Halation) <<
					   /recipe [(Recipe) /string]
					   /savestatus [(Save) /boolean]
					   >>]
						>>
					 >> ]]></terminology>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/


function displayDialog(thisRecipe, saveStatus, runmode) {
	// Display dialog box.
	var dialog = new Window("dialog");
	dialog.text = "Halation";
	dialog.orientation = "column";
	dialog.alignChildren = ["left", "top"];
	dialog.spacing = 10;
	dialog.margins = 20;

	dialog.statictext1 = dialog.add("statictext", undefined, undefined, { name: "label" });
	if (runmode != "edit") {
		dialog.statictext1.text = "Paste your recipe here:";
	} else {
		dialog.statictext1.text = "Edit your recipe here:";
	}
	dialog.statictext1.alignment = ["fill", "top"];

	dialog.edittext1 = dialog.add("edittext", undefined, undefined, { multiline: true });
	dialog.edittext1.alignment = ["fill", "top"];
	dialog.edittext1.size = [500, 50];
	dialog.edittext1.text = thisRecipe ? thisRecipe : '';
	
	dialog.savestatus = dialog.add("checkbox", undefined, "Save and close when done");
	if (saveStatus !== undefined) {
		dialog.savestatus.value = (saveStatus.toLowerCase() === "true");
	} else {
		dialog.savestatus.value
	}

	var buttons = dialog.add( "group" );
	var submit = buttons.add("button", undefined, undefined, { name: "submit" });
	submit.text = "Use this recipe";
	
	submit.onClick = function () {
		thisRecipe = dialog.edittext1.text;
		saveStatus = dialog.savestatus.value.toString();
		dialog.close();
	};
	
	if (runmode != "edit") {
		var without = buttons.add("button", undefined, undefined, { name: "without" });
		without.text = "Use default settings";
		
		without.onClick = function () {
			thisRecipe = "none";
			saveStatus = false;
			dialog.close();
		};
	}
	
	dialog.show();

	return {
		"recipe": thisRecipe,
		"savestatus": saveStatus
	};
}

function getRecipe() {
	// Retrieve recipe from action or dialog
	if (!app.playbackParameters.count) {
		//normal run (from scripts menu)

		var result = displayDialog();
		
		if (!result.recipe || result.recipe == '') { isCancelled = true; return } else {
			var d = new ActionDescriptor;
			d.putString(stringIDToTypeID('recipe'), result.recipe);
			d.putString(stringIDToTypeID('savestatus'), result.savestatus);
			app.playbackParameters = d;		
			return result;
		}
	}
	else {
		var recipe = app.playbackParameters.getString(stringIDToTypeID('recipe'));
		var savestatus = app.playbackParameters.getString(stringIDToTypeID('savestatus'));
		
		if (app.playbackDisplayDialogs == DialogModes.ALL) {
			// user run action in dialog mode (edit action step)
			var result = displayDialog(recipe, savestatus, "edit");
			if (!result.recipe || result.recipe == "") { isCancelled = true; return } else {
				var d = new ActionDescriptor;
				d.putString(stringIDToTypeID('recipe'), result.recipe);
				d.putString(stringIDToTypeID('savestatus'), result.savestatus);
				app.playbackParameters = d;
			}
			executeScript = false;
			return result;
		}
		if (app.playbackDisplayDialogs != DialogModes.ALL) {
			// user run script without recording
			return {
				"recipe": recipe,
				"savestatus": savestatus
			};
		}
	}
}

function processRecipe(runtimesettings) {
	// Process the recipe and change settings
	var thisRecipe = runtimesettings.recipe;
	var saveStatus = runtimesettings.savestatus;
	save = (saveStatus.toLowerCase() === "true");
	thisRecipe = thisRecipe.replace(/\s+/g, ""); // Removes spaces
	thisRecipe = thisRecipe.replace(/;+$/, ""); // Removes trailing ;
	
	// Check recipe against syntax
	const regex = new RegExp('^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]|(auto));([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]|(auto));([0-9]|([1-9][0-9])|100);([1-3]);([0-9]|([1-9][0-9])|100);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]));([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$', 'gm');
	
	if (regex.exec(thisRecipe) !== null) {
		thisRecipe = thisRecipe.split(";"); // Splits into array at ;
		threshold = (thisRecipe[0] === "auto") ? "auto" : parseInt(thisRecipe[0]);
		global_threshold = (thisRecipe[1] === "auto") ? "auto" : parseInt(thisRecipe[1]);
		bloom = parseInt(thisRecipe[2]);
		effect_multiply = parseInt(thisRecipe[3]);
		darken_global = parseInt(thisRecipe[4]);
		red_inner = parseInt(thisRecipe[5]);
		green_inner = parseInt(thisRecipe[6]);
		blue_inner = parseInt(thisRecipe[7]);
		red_outer = parseInt(thisRecipe[8]);
		green_outer = parseInt(thisRecipe[9]);
		blue_outer = parseInt(thisRecipe[10]);
		red_global = parseInt(thisRecipe[11]);
		green_global = parseInt(thisRecipe[12]);
		blue_global = parseInt(thisRecipe[13]);
	} else {
		executeScript = false;
		alert("Sorry, but that recipe is faulty! Please check it's syntax and it's settings and then try again.");
	}
}

function applyThreshold(layer, value) {
	layer.threshold(value);
}

function duplicateLayer(layer, name) {
	var duplicate = layer.duplicate();
	duplicate.name = name;
	return duplicate;
}


function findBrightestLevelInHistogram() {
	var histogram = app.activeDocument.histogram;
	var brightestLevel = histogram.length - 1;
	while (histogram[brightestLevel] === 0 && brightestLevel >= 0) {
		brightestLevel--;
	}
	return brightestLevel;
}


function colorOverlay(red, green, blue) {
	
	var idset = stringIDToTypeID( "set" );
		var desc239 = new ActionDescriptor();
		var idnull = stringIDToTypeID( "null" );
			var ref3 = new ActionReference();
			var idproperty = stringIDToTypeID( "property" );
			var idlayerEffects = stringIDToTypeID( "layerEffects" );
			ref3.putProperty( idproperty, idlayerEffects );
			var idlayer = stringIDToTypeID( "layer" );
			var idordinal = stringIDToTypeID( "ordinal" );
			var idtargetEnum = stringIDToTypeID( "targetEnum" );
			ref3.putEnumerated( idlayer, idordinal, idtargetEnum );
		desc239.putReference( idnull, ref3 );
		var idto = stringIDToTypeID( "to" );
			var desc240 = new ActionDescriptor();
			var idscale = stringIDToTypeID( "scale" );
			var idpercentUnit = stringIDToTypeID( "percentUnit" );
			desc240.putUnitDouble( idscale, idpercentUnit, 416.666667 );
			var idsolidFill = stringIDToTypeID( "solidFill" );
				var desc241 = new ActionDescriptor();
				var idenabled = stringIDToTypeID( "enabled" );
				desc241.putBoolean( idenabled, true );
				var idpresent = stringIDToTypeID( "present" );
				desc241.putBoolean( idpresent, true );
				var idshowInDialog = stringIDToTypeID( "showInDialog" );
				desc241.putBoolean( idshowInDialog, true );
				var idmode = stringIDToTypeID( "mode" );
				var idblendMode = stringIDToTypeID( "blendMode" );
				var idmultiply = stringIDToTypeID( "multiply" );
				desc241.putEnumerated( idmode, idblendMode, idmultiply );
				var idcolor = stringIDToTypeID( "color" );
					var desc242 = new ActionDescriptor();
					var idred = stringIDToTypeID( "red" );
					desc242.putDouble( idred, red );
					var idgrain = stringIDToTypeID( "grain" );
					desc242.putDouble( idgrain, green );
					var idblue = stringIDToTypeID( "blue" );
					desc242.putDouble( idblue, blue );
				var idRGBColor = stringIDToTypeID( "RGBColor" );
				desc241.putObject( idcolor, idRGBColor, desc242 );
				var idopacity = stringIDToTypeID( "opacity" );
				var idpercentUnit = stringIDToTypeID( "percentUnit" );
				desc241.putUnitDouble( idopacity, idpercentUnit, 100.000000 );
			var idsolidFill = stringIDToTypeID( "solidFill" );
			desc240.putObject( idsolidFill, idsolidFill, desc241 );
		var idlayerEffects = stringIDToTypeID( "layerEffects" );
		desc239.putObject( idto, idlayerEffects, desc240 );
	executeAction( idset, desc239, DialogModes.NO );
	
}

function rasterizeLayer() {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
	desc.putReference(stringIDToTypeID("null"), ref);
	desc.putEnumerated(stringIDToTypeID("what"), stringIDToTypeID("rasterizeItem"), stringIDToTypeID("layerStyle"));
	executeAction(stringIDToTypeID("rasterizeLayer"), desc, DialogModes.NO);
}


function saveClose() {
	var file_ending = app.activeDocument.name.split('.').pop().toLowerCase();
	var fPath = app.activeDocument.path;
	
	if (file_ending == "tif" || file_ending == "tiff") {
		// Save out the image as tiff
		var tiffFile = new File(fPath);
		tiffSaveOptions = new TiffSaveOptions();
		tiffSaveOptions.imageCompression = TIFFEncoding.NONE;
		tiffSaveOptions.layers = false;
		tiffSaveOptions.embedColorProfile = true;
		app.activeDocument.saveAs(tiffFile, tiffSaveOptions, false, Extension.LOWERCASE);
	} else {
		// Save out the image as jpeg
		var jpgFile = new File(fPath);
		jpgSaveOptions = new JPEGSaveOptions();
		jpgSaveOptions.formatOptions = FormatOptions.OPTIMIZEDBASELINE;
		jpgSaveOptions.embedColorProfile = true;
		jpgSaveOptions.matte = MatteType.NONE;
		jpgSaveOptions.quality = 12;
		app.activeDocument.saveAs(jpgFile, jpgSaveOptions, false, Extension.LOWERCASE);
	}
	app.activeDocument.close();
}


// Initial properties, settings and calculations

app.preferences.rulerUnits = Units.PIXELS;
app.displayDialogs = DialogModes.NO;

var doc_height = app.activeDocument.height;
var doc_width = app.activeDocument.width;
var ratio = doc_height / doc_width;


// Decide the shortest side
if (ratio > 1) {
	var negative_size = doc_width;
} else {
	var negative_size = doc_height;
}

// Scale
var doc_scale = negative_size.value / 3600;

// Sets up existing image layer
app.activeDocument.activeLayer.isBackgroundLayer = false; // Unlocks background layer
var imagelayer = app.activeDocument.activeLayer;
imagelayer.name = "original"; // Names background layer


//
// MAIN ROUTINE
//


// Alert the brightest level found
//alert("Brightest level in the image: " + brightestLevel);

var executeScript = true;
var isCancelled = false;
var runtimesettings = getRecipe();
if (runtimesettings.recipe != "none") { processRecipe(runtimesettings); }

try {	
	if (executeScript == true) {
		
		if (threshold === "auto" || global_threshold === "auto") {
			var brightestLevel = findBrightestLevelInHistogram();
			if (threshold === "auto") {
				threshold = brightestLevel - 10;
			}
			if (global_threshold === "auto") {
				global_threshold = Math.round(brightestLevel - (65 / 255 * brightestLevel));
			}
		} else {
			var brightestLevel = 1;
		}
			
		var orangecutlayer = duplicateLayer(imagelayer, "cut");
		var orangelayer = duplicateLayer(imagelayer, "orange");
		var redcutlayer = duplicateLayer(imagelayer, "cut");
		var redlayer = duplicateLayer(imagelayer, "local");
		var globalcutlayer = duplicateLayer(imagelayer, "global cut");
		var globallayer = duplicateLayer(imagelayer, "global");
		
		applyThreshold(globalcutlayer, global_threshold);
		applyThreshold(globallayer, global_threshold - Math.round(60/255*brightestLevel));
		applyThreshold(orangecutlayer, threshold);
		applyThreshold(redcutlayer, threshold - 10);
		applyThreshold(orangelayer, threshold);
		applyThreshold(redlayer, threshold - 10);
		
		app.activeDocument.activeLayer = redlayer;
		colorOverlay(red_outer, green_outer, blue_outer);
		rasterizeLayer();
		
		app.activeDocument.activeLayer = orangelayer;
		colorOverlay(red_inner, green_inner, blue_inner);
		rasterizeLayer();
		
		redlayer.applyGaussianBlur(Math.round(doc_scale*bloom));
		orangelayer.applyGaussianBlur(Math.round(doc_scale*bloom));
		
		globalcutlayer.blendMode = BlendMode.DIFFERENCE;
		globalcutlayer.merge();
		
		globallayer.applyGaussianBlur(Math.round(doc_scale*20));
		
		app.activeDocument.activeLayer = globallayer;
		colorOverlay(red_global, green_global, blue_global);
		rasterizeLayer();
		
		globallayer.blendMode = BlendMode.SCREEN;
		
		var darken = globallayer.duplicate();
		darken.name = "darken midtones";
		darken.desaturate();
		darken.invert();
		darken.blendMode = BlendMode.MULTIPLY;
		darken.opacity = darken_global;
		
		orangecutlayer.invert();
		orangecutlayer.blendMode = BlendMode.MULTIPLY;
		orangecutlayer.merge();
		
		redcutlayer.invert();
		redcutlayer.blendMode = BlendMode.MULTIPLY;
		redcutlayer.merge();
		
		orangelayer.blendMode = BlendMode.SCREEN;
		orangelayer.merge();	
		redlayer.blendMode = BlendMode.SCREEN;
		
		for(var i = 0; i < effect_multiply - 1; i++) {
			var multiply = redlayer.duplicate();
			multiply.merge();
		}
		
		finalGroup = app.activeDocument.layerSets.add();
		finalGroup.name = "Halation";
		
		globallayer.move(finalGroup, ElementPlacement.INSIDE);
		darken.move(finalGroup, ElementPlacement.INSIDE);
		redlayer.move(finalGroup, ElementPlacement.INSIDE);
		
		app.activeDocument.flatten();
		
		if (save == true ) { saveClose(); }
	
	}
	
} catch (e) { alert(e); }