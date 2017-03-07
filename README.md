
# CSON to SASS variable loader for Webpack

Loads CSON as SASS variables for Webpack. This was forked from EdwardIrby's [jsontosass-loader](https://github.com/EdwardIrby/jsontosass-loader), which is no longer supported.

It, in turn, was inspired by [jsonToSassVars](https://gist.github.com/Kasu/ea4f4861a81e626ea308) and [prepend-loader](https://gist.github.com/Kasu/29452051023ff5337bd7)

**Update 0.1.5**
- Resolved an issue with loading using the `data` parameter.

## Installation

`npm install cson-sass-vars-loader --save-dev`

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Two request parameters are allowed by this loader:


- `path`: A path to a CSON file containing SASS variable data.
- `data`: A JSON object containing SASS variable data (must be URI encoded).

If both of these parameters are passed into the loader, then `data` will be used as override values for any duplicate keys within the `path` data.

### Example config

``` javascript
var sassVars = 'path/to/your/vars.cson';
var dataVars = encodeURIComponent(JSON.stringify(myObject));
var webpackConfig = {
    module: {
        loaders:[
            {test: /.scss$/, loader: `style!css!sass!cson-sass-vars?path=${sassVars}&data=${dataVars}`}
        ]
    },
}

```

**Input [YourVars.cson file]**
``` cson
# Navigation
nav_height:	"50px"

# Section Padding
vertical_padding: "10px"

```

**Output SCSS**
``` scss
$nav_height:50px;
$vertical_padding:10px;
```


## License

MIT (http://www.opensource.org/licenses/mit-license.php)
