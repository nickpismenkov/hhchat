(function( $ )
{
	$.fn.FloatLabel = function( options )
	{

		let defaults =
		{
			populatedClass : 'populated',
			focusedClass : 'focused'
		};
		let	settings = $.extend({}, defaults, options);

		return this.each(function()
		{
			let element = $(this);
			let	input = element.find('textarea, input');

			if( !input.val())
		  	{
                element.removeClass( settings.populatedClass );
				input.attr("placeholder", input.attr("placeholder") );
		  	}
      		else
	  		{
      		    element.addClass( settings.populatedClass );
      		}

			input.on( 'focus', () =>
			{
				element.addClass( settings.focusedClass );
				element.addClass( settings.populatedClass );
			});

			input.on( 'blur', () =>
			{
				element.removeClass( settings.focusedClass );
				if( !input.val() )
				{
                    input.attr("placeholder", input.attr("placeholder") );
					element.removeClass( settings.populatedClass );
				}
			});

			input.on( 'keyup', () =>
			{
				element.addClass( settings.populatedClass );
			});
		});
	};
})( jQuery );
