# scrollor
A simple [jQuery](http://jquery.com) plugin that adds classes to a set elements based on their position relative to the viewport.

Example: http://carlsen.github.io/scrollor/

## Description
The plugin automatically updates the class names of the elements every time a ```scroll``` or ```resize``` events fires. A throttle (default: 100ms) has been added to prevent excessive calls to the handler.

## Dependencies
* [jQuery](http://jquery.com) (Version 1.7+)

## Usage
	// Operate on every "section" within "body"
	$("body").scrollor({
		selector: "section",  // Element selector
		throttle: 100,        // Minimum time between updates
		prefix: "scrollor-",  // Class prefix
		mode: "quintary",     // "binary", "ternary", "quaternary" or "quintary"
		suffixes: [           // Suffixes overrides the default classnames
			"below-viewport", // Applied when the element is below the viewport
			"top-visible",    // Applied when the element bottom is visible
			"active",         // Applied when the element is in the viewport
			"bottom-visible", // Applied when the element top is visible
			"above-viewport"  // Applied when the element is above the viewport
		]
	});

## Known issues
* The calculations will [most likely] fail for elements that use the ```border-box``` box-model.
