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

The script takes 13 settings, written as a semicolon-separated text string (recipe):

1. The highlight threshold for local halation, from `1` to `255`.

2. The threshold for global halation, from `1` to `255`. 

2. The bloom (halo radius), from `1` to `100`.

3. The squaring (multiplication with itself) of the effect, from `1` to `3`.

4. How much to darken midtones as compensation for the global halation, from `1` to `100`.

5. The red value of the inner halation, from `0` to `255`.

6. The green value of the inner halation, from `0` to `255`.

7. The blue value of the inner halation, from `0` to `255`.

8. The red value of the outer halation, from `0` to `255`.

9. The green value of the outer halation, from `0` to `255`.

10. The blue value of the outer halation, from `0` to `255`.

11. The blue value of the global halation, from `0` to `255`.

12. The blue value of the global halation, from `0` to `255`.

13. The blue value of the global halation, from `0` to `255`.


## Tips and tricks

1. If you want to remove the halation from some parts of the image (sunset skies, for instance), hit option + Z on a Mac, or ctrl + Z on a PC, to undo the last script step. You then get a folder with three layers, **local** for local halation, **darken midtones** that compensates for the increase in brightness that the global halation adds, and **global** with the global halation. With black selected you can simply brush out local and global halation you don't want in their respective layer.

2. If you want to change the color values, darker colors results in a weaker effekt and brighter colors in a stronger effect. If you set the red, green and blue color to the same value you get a grayscale color, useful for monochrome halation.

3. If you don't want any global halation, set #4, #11, #12 and #13 above to `0`.