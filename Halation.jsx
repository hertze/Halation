// H A L A T I O N
//
// Version 2.0
//
// by Joakim Hertze (www.hertze.se)
//
// ---------------------------------------------------------------------

#target photoshop


// Settings ------------------------------------------------------------

var threshold = "auto";
var min_threshold = 235;
var bloom = 15;
var boost = 0;
var red_inner = 255;
var green_inner = 180;
var blue_inner = 50;
var red_outer = 235;
var green_outer = 0;
var blue_outer = 0;

var save = false;

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
	const regex = new RegExp('^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]|(auto));([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);([0-9]|([1-9][0-9])|100);(170|1[0-6][0-9]|[1-9][0-9]?|0);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]));([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]);([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$', 'gm');
	
	if (regex.exec(thisRecipe) !== null) {
		thisRecipe = thisRecipe.split(";"); // Splits into array at ;
		threshold = (thisRecipe[0] === "auto") ? "auto" : parseInt(thisRecipe[0]);
		min_threshold = parseInt(thisRecipe[1]);
		bloom = parseInt(thisRecipe[2]);
		boost = parseInt(thisRecipe[3]);
		red_inner = parseInt(thisRecipe[4]);
		green_inner = parseInt(thisRecipe[5]);
		blue_inner = parseInt(thisRecipe[6]);
		red_outer = parseInt(thisRecipe[7]);
		green_outer = parseInt(thisRecipe[8]);
		blue_outer = parseInt(thisRecipe[9]);
	} else {
		executeScript = false;
		alert("Sorry, but that recipe is faulty! Please check it's syntax and it's settings and then try again.");
	}
}

function findBrightestLevelInHistogram() {
	var histogram = doc.histogram;
	var brightestLevel = histogram.length - 1;
	while (histogram[brightestLevel] === 0 && brightestLevel >= 0) {
		brightestLevel--;
	}
	return brightestLevel;
}


function colorOverlay(red, green, blue) {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("layerEffects"));
	ref.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
	desc.putReference(stringIDToTypeID("null"), ref);

	var desc2 = new ActionDescriptor();
	var desc3 = new ActionDescriptor();
	desc3.putBoolean(stringIDToTypeID("enabled"), true);
	desc3.putBoolean(stringIDToTypeID("present"), true);
	desc3.putBoolean(stringIDToTypeID("showInDialog"), true);
	desc3.putEnumerated(stringIDToTypeID("mode"), stringIDToTypeID("blendMode"), stringIDToTypeID("multiply"));

	var desc4 = new ActionDescriptor();
	desc4.putDouble(stringIDToTypeID("red"), red);
	desc4.putDouble(stringIDToTypeID("grain"), green);
	desc4.putDouble(stringIDToTypeID("blue"), blue);
	desc3.putObject(stringIDToTypeID("color"), stringIDToTypeID("RGBColor"), desc4);

	desc3.putUnitDouble(stringIDToTypeID("opacity"), stringIDToTypeID("percentUnit"), 100.000000);
	desc2.putObject(stringIDToTypeID("solidFill"), stringIDToTypeID("solidFill"), desc3);
	desc2.putUnitDouble(stringIDToTypeID("scale"), stringIDToTypeID("percentUnit"), 416.666667);
	desc.putObject(stringIDToTypeID("to"), stringIDToTypeID("layerEffects"), desc2);

	executeAction(stringIDToTypeID("set"), desc, DialogModes.NO);
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
	var file_ending = doc.name.split('.').pop().toLowerCase();
	var fPath = doc.path;
	
	if (file_ending == "tif" || file_ending == "tiff") {
		// Save out the image as tiff
		var tiffFile = new File(fPath);
		tiffSaveOptions = new TiffSaveOptions();
		tiffSaveOptions.imageCompression = TIFFEncoding.NONE;
		tiffSaveOptions.layers = false;
		tiffSaveOptions.embedColorProfile = true;
		doc.saveAs(tiffFile, tiffSaveOptions, false, Extension.LOWERCASE);
	} else {
		// Save out the image as jpeg
		var jpgFile = new File(fPath);
		jpgSaveOptions = new JPEGSaveOptions();
		jpgSaveOptions.formatOptions = FormatOptions.OPTIMIZEDBASELINE;
		jpgSaveOptions.embedColorProfile = true;
		jpgSaveOptions.matte = MatteType.NONE;
		jpgSaveOptions.quality = 12;
		doc.saveAs(jpgFile, jpgSaveOptions, false, Extension.LOWERCASE);
	}
	doc.close(SaveOptions.DONOTSAVECHANGES);
}

function selectLowContrastAreas(imagelayer, threshold) {

    var lowContrastLayer = imagelayer.duplicate();
    lowContrastLayer.name = "Low Contrast Areas";

    lowContrastLayer.invert();
	lowContrastLayer.threshold(threshold);

	lowContrastLayer.applyGaussianBlur(doc_scale * Math.min(bloom, 20) / 2);

    // Create an alpha channel from the low contrast layer
    var alphaChannel = doc.channels.add();
    alphaChannel.kind = ChannelType.SELECTEDAREA;
    alphaChannel.name = "Low Contrast Areas";

    // Copy the low contrast layer to the alpha channel
    lowContrastLayer.copy();
    doc.activeChannels = [alphaChannel];
    doc.paste();

    // Load the alpha channel into the selection
    doc.selection.load(alphaChannel);

	try {
		doc.selection.contract(UnitValue(Math.round(doc_scale * Math.min(bloom, 20)), "px")); // Contract the selection
	} catch (e) {
		// An error will be thrown if there is no selection, so you can ignore it
	}

	// Delete the low contrast layer
	lowContrastLayer.remove();

	// Delete the alpha channel
    alphaChannel.remove();

}


// Initial properties, settings and calculations

var doc = app.activeDocument;

app.preferences.rulerUnits = Units.PIXELS;
app.displayDialogs = DialogModes.NO;

var doc_height = doc.height;
var doc_width = doc.width;
var ratio = doc_height / doc_width;


// Decide the shortest side
var negative_size = ratio > 1 ? doc_width : doc_height;

// Scale
var doc_scale = negative_size.value / 3600;

// Sets up existing image layer
doc.activeLayer.isBackgroundLayer = false; // Unlocks background layer
var imagelayer = doc.activeLayer;
imagelayer.name = "original"; // Names background layer

var myColor_black = new SolidColor(); 
myColor_black.rgb.red = 0; 
myColor_black.rgb.green = 0;  
myColor_black.rgb.blue = 0;


//
// MAIN ROUTINE
//

var executeScript = true;
var isCancelled = false;
var runtimesettings = getRecipe();
if (runtimesettings.recipe != "none") { processRecipe(runtimesettings); }

try {	
    if (executeScript == true) {
        // Calculate thresholds
        if (threshold === "auto") {
            var brightestLevel = Math.max(findBrightestLevelInHistogram(), min_threshold);
        } else {
            var brightestLevel = threshold;
        }

		var total_levels = Math.max(2, Math.min(5, Math.ceil(bloom / 5))); // Total number of iterations of the halation effect
		var levels_span = 20; // How many levels of the histogram should be spanned by the halation effect
		var levels = []; // Array to store the halation layer values

		for (var i = 0; i < total_levels; i++) {
			var red = Math.round(red_inner + (red_outer - red_inner) * (i / (total_levels - 1)));
			var green = Math.round(green_inner + (green_outer - green_inner) * (i / (total_levels - 1)));
			var blue = Math.round(blue_inner + (blue_outer - blue_inner) * (i / (total_levels - 1)));
		
			// Calculate bloom value
			//var bloomValue = bloom * (i / total_levels); // Increase
			var bloomValue = bloom - ((bloom * 0.67) * (i / (total_levels - 1))); //Decrease
			
			// Calculate threshold, start att brightestLevel - 8 and go down
			var levelValue = brightestLevel - 8 - (i * levels_span / total_levels);
		
			levels.push([levelValue, bloomValue, red, green, blue]);
		}
        
		// Save for later use
		var originalTopmostLayer = doc.layers[0];

		// Create a new layer set named "Halation"
		var halationFolder = doc.layerSets.add();
		halationFolder.name = "Halation";

		// Iterate over the levels array in reverse order
		for (var i = levels.length - 1; i >= 0; i--) {

			// Create and configure the halation layer
			var halationLayer = originalTopmostLayer.duplicate(halationFolder, ElementPlacement.PLACEATBEGINNING);
			halationLayer.name = "Halation"; // Naming the layer "Halation" followed by its order
			halationLayer.threshold(levels[i][0]); // Apply a threshold based on the current level
			doc.activeLayer = halationLayer; // Set the active layer to the halation layer
			colorOverlay(levels[i][2], levels[i][3], levels[i][4]); // Apply a color overlay based on the current level
			rasterizeLayer(); // Rasterize the halation layer
			halationLayer.applyGaussianBlur(Math.round(doc_scale*levels[i][1])); // Apply a Gaussian blur based on the current level
			halationLayer.blendMode = BlendMode.SCREEN; // Set the blend mode of the halation layer to Screen

			if (i != levels.length - 1) {
				var secondHalationLayer = originalTopmostLayer.duplicate(halationFolder, ElementPlacement.PLACEATBEGINNING);
				secondHalationLayer.name = "Halation"; // Naming the layer "Halation" followed by its order
				secondHalationLayer.threshold(levels[i][0]); // Apply a threshold based on the current level
				doc.activeLayer = secondHalationLayer; // Set the active layer to the halation layer
				colorOverlay(levels[levels.length - 1][2], levels[levels.length - 1][3], levels[levels.length - 1][4]); // Apply a color overlay based on the current level
				rasterizeLayer(); // Rasterize the halation layer
				secondHalationLayer.applyGaussianBlur(Math.round(1.33*doc_scale*levels[i][1])); // Apply a Gaussian blur based on the current level
				secondHalationLayer.blendMode = BlendMode.SCREEN; // Set the blend mode of the halation layer to Screen
			}

			// Create and configure the cutout layer
			var cutoutLayer = originalTopmostLayer.duplicate(halationFolder, ElementPlacement.PLACEATBEGINNING);
			cutoutLayer.name = "Cutout"; // Naming the layer "Cutout" followed by its order
			cutoutLayer.threshold(levels[i][0]); // Apply a threshold based on the current level
			cutoutLayer.invert(); // Invert the cutout layer
			doc.activeLayer = cutoutLayer; // Set the active layer to the cutout layer
			colorOverlay(levels[i][2], levels[i][3], levels[i][4]); // Apply a color overlay based on the current level
			rasterizeLayer(); // Rasterize the cutout layer
			cutoutLayer.applyGaussianBlur(Math.round(doc_scale)); // Apply a Gaussian blur based on the document scale
			cutoutLayer.blendMode = BlendMode.MULTIPLY; // Set the blend mode of the cutout layer to Multiply
			cutoutLayer.merge(); // Merge the cutout layer down

			// If it's the first iteration, store the halation layer in lastUnmergedLayer
			if (i == levels.length - 1) {
				var lastUnmergedLayer = halationLayer;
			}

			if (i != levels.length - 1) {
				secondHalationLayer.merge();
			}

			// If it's not the first iteration, merge halationLayer down
			if (i < levels.length - 1) {
				halationLayer.merge();
			}
			
		}

		// Move the "Halation" folder above the original layer
		halationFolder.move(originalTopmostLayer, ElementPlacement.PLACEBEFORE);

		

		// Remove low contrast areas
		selectLowContrastAreas(imagelayer, 50);
		doc.activeLayer = lastUnmergedLayer;
		doc.selection.fill(myColor_black);
		doc.selection.deselect();

		// Adjust curves
        if (boost > 0) {
			lastUnmergedLayer.adjustCurves([[0, 0], [40, Math.round(40+boost/5)], [85, 85+boost], [255, 255]]);
		}
        
        // Flatten document and save if needed
        doc.flatten();
        if (save == true ) { saveClose(); }
    }
    
} catch (e) { alert(e); }