// H A L A T I O N
//
// Version 1
//
// by Joakim Hertze (www.hertze.se)
//
// ---------------------------------------------------------------------

#target photoshop


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
var negativelayer = app.activeDocument.activeLayer;
app.activeDocument.activeLayer.name = "original"; // Names background layer




//
// MAIN ROUTINE
//

//try {
	
	
//} catch (e) { alert(e); }