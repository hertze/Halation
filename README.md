# HALATION

This is a script plugin for Photoshop that simulates film-like halation.

## How to install

1. Download and unzip the software, if the latter isn’t done automatically. The resulting folder contains the main script **Halation.jsx** and an action set, **Halation.atn**.

2. Quit Photoshop.

3. Copy the script **Halation.jsx** to Photoshop’s scripts folder. On Mac it’s in /Applications/Photoshop 202x/Presets/Scripts and on Windows 10 it’s in C:\Program Files\Adobe\Adobe Photoshop 202x\Presets\Scripts. You may have to change the permissions of this folder to copy the script there.

4. Start Photoshop and make sure **Halation** shows up in the menu File/Automate.

5. Install the Photoshop actions by double-clicking on the file **Halation.atn**, or by loading it in the Actions palette.

## How to run

You run the script by running on of the supplied actions, or by making your own actions. If you expand an action and double-click on the settings you can edit the script recipe. 

## Recipes

The script takes five settings, written as a semicolon-separated text string (recipe):

1. The highlight threshold, from `1` to `255`.

2. The bloom (halo radius), from `1` to `100`.

3. The amount of green added to the inner halation. `0` results in pure red and `255` in pure yellow.

4. The strength of the effect, from `1` to `3`.

5. The opacity of the effect, from `1` to `100`.

## Tips and tricks

If you want to remove the halation from some parts of the image (sunset skies, for instance), hit option + Z on a Mac, or ctrl + Z on a PC, to undo the last script step. You then get the halation as a separate layer, on which you can brush out halation with black color.