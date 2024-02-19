// H A L A T I O N
//
// Version 1
//
// by Joakim Hertze (www.hertze.se)
//
// ---------------------------------------------------------------------

#target photoshop


// Settings ------------------------------------------------------------

var threshold = 245;
var blur_radius = 40;
var effect_opacity = 100;

// ---------------------------------------------------------------------


function colorOverlay() {
	
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
					desc242.putDouble( idred, 255.000000 );
					var idgrain = stringIDToTypeID( "grain" );
					desc242.putDouble( idgrain, 12.003891 );
					var idblue = stringIDToTypeID( "blue" );
					desc242.putDouble( idblue, 0.003891 );
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
	
	var idrasterizeLayer = stringIDToTypeID( "rasterizeLayer" );
		var desc243 = new ActionDescriptor();
		var idnull = stringIDToTypeID( "null" );
			var ref3 = new ActionReference();
			var idlayer = stringIDToTypeID( "layer" );
			var idordinal = stringIDToTypeID( "ordinal" );
			var idtargetEnum = stringIDToTypeID( "targetEnum" );
			ref3.putEnumerated( idlayer, idordinal, idtargetEnum );
		desc243.putReference( idnull, ref3 );
		var idwhat = stringIDToTypeID( "what" );
		var idrasterizeItem = stringIDToTypeID( "rasterizeItem" );
		var idlayerStyle = stringIDToTypeID( "layerStyle" );
		desc243.putEnumerated( idwhat, idrasterizeItem, idlayerStyle );
	executeAction( idrasterizeLayer, desc243, DialogModes.NO );
	
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

try {
	
	var halationlayer = imagelayer.duplicate();
	halationlayer.name = "halation"; // Names halation layer.
	
	halationlayer.threshold(threshold);
	
	app.activeDocument.activeLayer = halationlayer;
	
	colorOverlay();
	
	rasterizeLayer();
	
	var halationcutoutlayer = halationlayer.duplicate();
	halationcutoutlayer.name = "halation cutout"; // Names halation cutout layer.
	halationcutoutlayer.blendMode = BlendMode.DIFFERENCE;
	
	halationlayer.applyGaussianBlur(Math.round(doc_scale*blur_radius));
	halationlayer.blendMode = BlendMode.SCREEN;
	
	halationcutoutlayer.merge();
	
	halationlayer.opacity = effect_opacity;
	
	halationlayer.merge();
	
} catch (e) { alert(e); }