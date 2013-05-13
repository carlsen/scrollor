;(function defineScrollor($, window) {

	'use strict';

	var
		classSuffixes = {
			'binary': [
				'inactive',
				'active',
				'active',
				'active',
				'inactive'
			],
			'ternary': [
				'below-viewport',
				'active',
				'active',
				'active',
				'above-viewport'
			],
			'quaternary': [
				'inactive',
				'top-visible',
				'active',
				'bottom-visible',
				'inactive'
			],
			'quintary': [
				'below-viewport',
				'top-visible',
				'active',
				'bottom-visible',
				'above-viewport'
			]
		},

		// Tests must be run in sequence;
		// each test relies on [all] its predecessors to yield false
		positionalTests = [
			function elementBelowViewport(o) { return o.vB < o.eT; },
			function elementTopVisible(o) { return o.vT < o.eT && o.vB < o.eB; },
			function elementActive(o) { return o.vB < o.eB || o.vT < o.eT; },
			function elementBottomVisible(o) { return o.vT < o.eB; }
		];

	
	var calculateElementPosition = function (offsets) {

		var
			pos = 0;

		while (pos < positionalTests.length) {
			if (positionalTests[pos](offsets)) {
				return pos;
			}
			pos = pos + 1;
		}

		return positionalTests.length;
	};


	// Returns a throttled version of fn
	// based on http://remysharp.com/2010/07/21/throttling-function-calls/
	var throttleFunction = function(fn, threshold) {

		var
			last,
			timer;

		return function () {

			var
				context = this,
				now = Number(new Date()),
				args = arguments;

			if (last && now < last + threshold) {
				window.clearTimeout(timer);
				timer = window.setTimeout(function () {
					last = now;
					fn.apply(context, args);
				}, threshold);
			} else {
				last = now;
				fn.apply(context, args);
			}
		};
	};


	$.fn.scrollor = function (options) {

		if (typeof options === 'string' && options === 'destroy') {
			return this.trigger('scrollor.destroy', this.selector);
		}

		if (this.data('scrollorInitialized') === true) {
			return this;
		}

		var
			$container = this,
			settings = $.extend({
				selector: '',
				throttle: 100,
				mode: 'binary',
				prefix: 'scrollor-'
			}, options),
			suffixes = settings.suffixes || classSuffixes[settings.mode].slice(0);

		(function initializeScrollor() {

			var
				$win = $(window),
				$elements = $(settings.selector, $container),
				replaceRegex = new RegExp(settings.prefix + '[^\\s$]*');

			var updateClasses = function () {

				var
					viewportHeight = $win.height(),
					viewportTop = $win.scrollTop(),
					viewportBottom = viewportTop + viewportHeight;

				$elements.each(function updateElementClass(idx, element) {
					var
						$element = $(element),
						elementTop = $element.offset().top,
						elementBottom = elementTop + $element.height(),
						offsets = {
							vT: viewportTop,
							vB: viewportBottom,
							eT: elementTop,
							eB: elementBottom
						},
						position = calculateElementPosition(offsets),
						newClass = settings.prefix + suffixes[position];
					
					element.className = element.className.replace(replaceRegex, newClass);
				});
			};

			// Throttled handler
			var throttledUpdate = throttleFunction(updateClasses, settings.throttle);

			// Messy teardown
			var destroy = function (event, sel) {
				// Check against selector since we end up here no matter
				// what container received the call for destruction
				if (sel !== $container.selector && sel !== 'all') {
					return;
				}
				$elements.each(function removeScrollorClass(idx, element) {
					element.className = element.className.replace(replaceRegex, '');
				});
				$win.off('resize', throttledUpdate);
				$win.off('scroll', throttledUpdate);
				$container.off('scrollor.destroy', destroy);
				$container.removedata('scrollorInitialized');
			};

			$win.on('resize', throttledUpdate);
			$win.on('scroll', throttledUpdate);
			$container.on('scrollor.destroy', destroy);

			$elements.addClass(settings.prefix + '-pending');
			throttledUpdate();
		})();

		$container.data('scrollorInitialized', true);

		return $container;
	};

})(jQuery, window);
