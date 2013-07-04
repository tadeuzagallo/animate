# Animate.js

CSS3 animations - not a single line of CSS or JavaScript ! And no dependencies!

# Usage

Just include the script on your page

    <script type="text/javascript" src="js/animate.js" async="true"></script>

And you are good to go!
  
    <body id="animation-body">
      <div data-0="top: 0;" data-100="top: 100px;" data-duration="2s" data-easing="ease-out"></div>
    </body>

# Documentation

The `Animate.init()` method is automatically called when the dom is ready. It will search for an element with `id="animation-body"`. But you are not required to use that... How? The first execution of `Animate.init()` will stop when the element is not found, after that you can explicit call `Animation.init('your-animation-body-id')` with a custom id, even multiple times if you want (multiple calls with the same `id` will be ignored).

### Attributes format

`data-{0..100}="{styles}" ` - Allows you to set your animation state at any step of the animation, from 0% to 100%. Style must be any valid css.  
`data-{param}="{value}"` - Set a value to a given param. A value can also be a function, see below the list of available params and functions. A user defined function may also be used, since it's available trough `window`.

### Params

`callback*`
`delay`
`direction`
`duration`
`easing`
`fill-mode`
`iterations`
`name`
`repeat`
`state`
`waits*`

**to be implemented*

### Default functions

`random(from_value, to_value)`
`pa(initial_value, ratio)`
`pg(initial_value, ratio)`
`log(value[, base])`

All values should be integer + unit, like 100px, 50%, 2s or 1500ms  
For ratio and base any valid number is accepted  

### Crossbrowser shorthands

When defining a CSS inside a step a few functions might be used  

`calc(property, calculation)` `easing(value)`

**more to be defined*

### User defined functions

User defined functions will receive any params passed to it on the data attribute. The scope applied to the function will be the instance of `Animate.Element` related to the element it was bound.


### Classes

There are just two public classes `Animate` and `Animate.Element`

The `Animate` class just have the `Animate.init([id])` method and `Animate.Element` class.

The `Animate.Element` class that has a few properties:  
`id` - Unique id of element inside Animate  
`original_id` - Original element `id`, or its own `id` if it's not a `data-repeat`ed element  
`element` - The original HTMLElement

### More...

The `index.html` file has such a simple example, but shows basically how to use most of the functionalities and should be enough to get you understanding how each of them should be used.

# Contact

Feel free to contact me through Github or email at tadeuzagallo@gmail.com
