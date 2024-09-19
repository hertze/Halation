# HALATION

This is a script plugin for Photoshop that simulates film-like halation.

## How to install

1. Download and unzip the software, if the latter isn’t done automatically. The resulting folder contains the main script **Halation.jsx** and two action sets, **Halation.atn** and **Halation-mono.atn**.

2. Quit Photoshop.

3. Copy the script **Halation.jsx** to Photoshop’s scripts folder. On Mac it’s in /Applications/Photoshop 202x/Presets/Scripts and on Windows 10 it’s in C:\Program Files\Adobe\Adobe Photoshop 202x\Presets\Scripts. You may have to change the permissions of this folder to copy the script there.

4. Start Photoshop and make sure **Halation** shows up in the menu File/Automate.

5. Install the Photoshop actions by double-clicking on the files **Halation.atn** and **Halation-mono.atn**, or by loading it in the Actions palette.

## How to run

You run the script by running on of the supplied actions, or by making your own actions. If you expand an action and double-click on the settings you can edit the script recipe. 

## Making your own recipes

The script takes a number of settings, written as a semicolon-separated text string (recipe):

1. The highlight threshold, from `1` to `255`, or `auto`.

2. The minimum highlight threshold, from `1` to `255`.

3. The bloom (halo radius), from `1` to `100`.

4. How much the effect should be boosted, from `0`to `170`.

5. The red value of the inner halation, from `0` to `255`.

6. The green value of the inner halation, from `0` to `255`.

7. The blue value of the inner halation, from `0` to `255`.

8. The red value of the outer halation, from `0` to `255`.

9. The green value of the outer halation, from `0` to `255`.

10. The blue value of the outer halation, from `0` to `255`.


## Tips and tricks

1. If you want to change the color values in actions, darker colors results in a weaker effekt and brighter colors in a stronger effect. If you set the red, green and blue color to the same value you get a grayscale color, useful for monochrome halation.

2. Setting #1 `auto` means the script will determine the brightest level in your image and calculate where to place the halation range from there. #2 then puts a lower cap on that value.