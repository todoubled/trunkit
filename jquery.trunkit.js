$.fn.trunkit = function(options) {
	var options = $.extend({}, {
		recurse: true,
		postprocessed: true
	}, options);

	/* options note:
			preprocessed refers to cases where truncation must occur before text is placed in the DOM
			postprocessed refers to cases where text already exists in DOM and must be truncated
	*/

	// Tests height of content to check for multiple lines = needs truncation
	function testHeight(contents, CSS) {
		var myClass = "trunkit-test-height",
			$container;
		
		$('.'+myClass).remove();
		$('body').append('<p class='+myClass+'></p>');
		$container = $('.'+myClass);
		$container.css(CSS);
		$container.text(contents);
	
		return $container.height();
	}

	// Tests height of content to check for multiple lines = needs truncation
	function testWidth(contents, CSS) {
		var myClass = "trunkit-test-width",
			$container;
		
		$('.'+myClass).remove();
		$('body').append('<p class='+myClass+'></p>');
		$container = $('.'+myClass);
		$container.css(CSS);
		$container.text(contents);
	
		return $container.width();
	}

	// Check all table cell content and truncate if more than one line
	$(this).each(function() {
		var self = this,
			hasChildren = $(this).children(),
			hasTips = $(this).find("div.tip-content"),
			hasImg = $(this).find("img").hasClass("doc_icon"),
			hasAnchor = $(this).find("a"),
			CSS = {
			'visibility':'hidden',
			'display':'block',
			'font-size':$(this).css('font-size'),
			'width': $(this).width(),
			'line-height':$(this).css('line-height')
		};

		// Dig deeper for nested elements
		if (hasChildren.length) {
			// If there's just an icon
			hasImg ? self = $(this).find("span.display") : self = self;
			
			// If there's an anchor
			if (hasAnchor.length) {
				self = $(this).find("a");
				
				// If there's an anchor and an icon
				hasImg ? self = $(this).find("span.display") : self = self;
			}
			
			// If there's a tooltip
			hasTips.length ? self = $(this).find("span.display_desc") : self = self;
		}
		
		// Grab text from self
		var contents = $(self).text();
		
		// Test heights of all cells
		var testedHeight = testHeight(contents, CSS);
		
		// If contents breaks to two lines, truncate text
		if (testedHeight > 25) {	
			var textArray = contents.split(' ');
			textArray.splice(textArray.length - 1, 1);
			$(self).text(textArray.join(' ') + '…');
			
			// Repeat until fully truncated
			$(this).trunkit();
		} else {
			// Insert truncated text
			$(self).text(contents);
			return;
		}
	});
}
