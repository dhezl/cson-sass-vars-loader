
# CSON to SASS variable loader for Webpack

Loads CSON as SASS variables for Webpack. This was forked from EdwardIrby's [jsontosass-loader](https://github.com/EdwardIrby/jsontosass-loader), which is no longer supported.

It, in turn, was inspired by [jsonToSassVars](https://gist.github.com/Kasu/ea4f4861a81e626ea308) and [prepend-loader](https://gist.github.com/Kasu/29452051023ff5337bd7)

**Update 0.1.3**
- Added support for breakpoints.

## Installation

`npm install cson-sass-vars-loader --save-dev`

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Two request parameters are allowed by this loader:


- `path`: A path to a CSON file containing SASS variable data.
- `data`: A JavaScript object containing SASS variable data.

If both of these parameters are passed into the loader, then `data` will be used as override values for any duplicate keys within the `path` data.

### Example config

``` javascript
var sassVars = 'path/to/your/vars.cson';
var webpackConfig = {
    module: {
        loaders:[
            {test: /.scss$/, loader: "style!css!sass!cson-sass-vars?path="+ sassVars}
        ]
    },
}

```
### Creating Breakpoints
You can create breakpoints with a breakpoints array. A default value is required and the array must contain objects with the following keys: direction ('min' or 'max'), size (#px), and value (value for the variable).

**Input [YourVars.cson file]**
``` cson
# Breakpoint settings
breakpoints:
    portraitS: "320px"
    portraitM: "360px"
    portraitL: "414px"

# Navigation
nav_height:"50px"

# Section Padding
vertical_padding:
	default: "10px"
	breakpoints: [
		{
			direction: "min"
			size: "map-get($breakpoints, $portraitM)"
			value: "20px"
		}
		{
			direction: "min"
			size: "map-get($breakpoints, $portraitL)"
			value: "40px"
		}
	]

```

**Output SCSS**
``` scss
$breakpoints:(portraitS:320px,portraitM:360px,portraitL:414px);
$localNavHeight:50px;
$vertical_padding:10px;
@media (min-width: 360px) {$vertical_padding: map-get($breakpoints, $portraitM);}
@media (min-width: 414px) {$vertical_padding: map-get($breakpoints, $portraitL);}
```


## License

MIT (http://www.opensource.org/licenses/mit-license.php)
