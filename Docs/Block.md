# Blocks
## Create Block
creates a block in you extension
### Arguments
* ID: the ID that the block goes by(make sure the id is __unique__ to other blocks)
* Text: the display name of the block, put any inputs in brackets
![image of block](./create-block.png)
* Show monitor: a boolean value representing weather to show the scrath monitor(wont work unless block is a reporter)
* type: the type of block you want to make
    * block: a block that doesn't
    * reporter: a block that returns a value
    * boolean: a block that returns a boolean
* Inputs: an area to put inputs for the block, accepts
    * __Create Input__
    * __Create Input Menu__
    * __Create Input From Menu__
* function: the input to run the function that the block will run
## Create Input
Creates an input of a specific type(other than menu's)
### Arguments
* ID: the ID of the Input(make sure the id is __unique__ to other inputs)
* type: the type of the value exepted
    * string
    * number
    * boolean
    * empty: a type that forces you to use a variable
    * color
    * costume
    * sound
    * angle
    * note
    * matrix
* default text: the default value of the input(if the type supports it)
## Create Input Menu
Creates a Menu
## Arguments
* ID: the ID of the input(make sure the id is __unique__ to other inputs)
* Accept Reporters: a boolean on weather the input allows Reporters
* Menu: An Array that represents the menu(Accepts a string or a menu item)
![image of block](./Create%20Input%20Menu.png)
