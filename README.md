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

You can also use any function on `style` attribute, but notice, **it will just be processed at animation time**.

### Params

`callback` - The callback function name. The function must be attached to window. The function will be called with the current element as scope and receive the event as unique parameter.  
`delay` - Numeric delay value to animation start. Any time unit or numeric function.  
`direction` - Shorthand to animation-direction. [Reference](http://dev.w3.org/csswg/css-animations/#animation-direction)  
`duration` - Numeric time value of animation duration or numeric function.  
`easing` - Shorthand to animation-timing-function. Defaults to `linear`. [Reference](http://dev.w3.org/csswg/css-animations/#animation-timing-function)  
`fill-mode` - Shorthand to animation-fill-mode. Default to `forwards`. [Reference](http://dev.w3.org/csswg/css-animations/#animation-fill-mode)  
`iterations` - Shorthand to animation-iterarion-count. Default to `1`. [Reference](http://dev.w3.org/csswg/css-animations/#animation-iteration-count)  
`repeat` - Numeric value to number of times the animation should be replicated. Animation repeats will occur simultaneously.  
`play` - Animation auto start - Default to `true`.  
`waits` - Id of an animated element. The animation will be executed after the other `callback` is finished (if it has one).
`bind` - Animations might be bound to click or hover. Default to `none`

### Default functions

`int[string unit] random(int from_value[string unit], int to_value[string unit])` - Return a random number, an its unit, if provided, within the range specified. If an unit is specified, both values must have the same unit.  
`int[string unit] ap(int initial_value[string unit], float ratio)` - Returns a Geometric Progression, incremented on each iteration. *To be used with `data-repeat`*  
`int[string unit] gp(int initial_value[string unit], ratio)` - Returns an Arithmetic Progression, incremented on each iteration. *To be used with `data-repeat`* 
`int[string unit] log(int value[string unit] [, float base])` - Return the `value * Math.log(iteration\_count) / Math.log(base)`. `base` default value is `Math.E`. *To be used with `data-repeat`*  

### Crossbrowser shorthands

When defining a CSS inside a step a few functions might be used  

`calc(property, calculation)` `easing(value)` `transform(value)` `transform-origin(x[, y[, z]])`

*\*more to be defined*

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

At this time I improved a bit the example, that now is inside experiments folder.  
The idea is to slowly add more experiments to help improving the library as well...  

# Contact

Feel free to contact me through Github or email at tadeuzagallo@gmail.com
