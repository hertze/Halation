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

The script takes three settings, written as a semicolom-separated text string (recipe):

1. The highlight threshold, from `1` to `255`.

2. The halo radius.

3. The strength of the effect, from `1` to `30`.