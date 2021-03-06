# Atom Bubble

A 3rd year University project for King's College London, inspired by the existing [Code Bubbles](http://cs.brown.edu/~spr/codebubbles/) on the Eclipse IDE. Atom Bubble is an Atom Package that tries to do what Code Bubbles does, but on Atom!

                                     _                    ____        _     _     _           
                                /\  | |                  |  _ \      | |   | |   | |          
                               /  \ | |_ ___  _ __ ___   | |_) |_   _| |__ | |__ | | ___ 
                              / /\ \| __/ _ \| '_ ` _ \  |  _ <| | | | '_ \| '_ \| |/ _ \
                             / ____ \ || (_) | | | | | | | |_) | |_| | |_) | |_) | |  __/
                            /_/    \_\__\___/|_| |_| |_| |____/ \__,_|_.__/|_.__/|_|\___|
                            
# Getting Started

Atom Bubble is an Atom Editor package. To download it, simply search for "atombubble" in your Atom Editor's settings

**Note:** Currently Atom Bubble only works on JavaScript projects.

# Usage
### Opening the Package
To open the package you can either select the atombubble "toggle" option on top of Atom(atombubble ==> Toggle), or right mouse click any opened text editor to open up the context menu and select atombubble, then Toggle.

![bubble_3](/img/atombubble_open.png)

### Creating a Bubble
To create a bubble, click on the **+** sign next to the function that needs to be created inside the Tree section on the right of the package pane. When a new bubble is created, it will have a random colour assigned to it.

### Adding and Deleting Working set
Working sets contains groups of bubbles and any other relationship lines. You can create new sets or delete sets using the "+" and "-" button on the top section. Click on the set you want to go to switch between them, as shown by the yellow bordered square on top. 

### Toggling Tree and Top section
The Top section containing working sets, and the Tree section containing functions and files can both be toggled by right mouse clicking them

![bubbles_2](/img/atombubble_plain.png)

### Drag and Resize Bubbles
The bubbles can be dragged around the board section by holding left mouse button on their file name(e.g subtest.js, test2.js etc in example below). They can also be resized into different shapes by dragging around its corners.
 
### Toggle Bubble Menu
To toggle the menu inside the Bubbles, right mouse click the Bubble title(subtest.js,test2.js etc in example below) inside the Bubble component, above the text editor.

### Bubble Menu
The Bubble menu has three options: 

***"Delete"*** option deletes the Bubble.

***"Save"*** saves the content inside the text editor the Bubble is referencing(Any change made inside the Bubble or the function its referencing in the source filie, will both update accordingly to changes made by the other). 

***"Link"*** allows a pair of Bubbles to link together, shown by a solid black line between them. To link two Bubbles, first click the Link option on one Bubble, then click on the other. When the link option is clicked twice consecutively on the same Bubble, a link won't be created.

![bubbles_1](/img/connectors.png)

### Saving current Session
The Bubbles can be saved by clicking "Save Bubble Project" in Tree section on the right, this will create a "bubblesave.json" file inside the current directory. When Atom is reopened, the file will load automatically when the package is toggled. 



