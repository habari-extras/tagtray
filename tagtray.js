$(function(){
	// Tag Drawer: Add tag via click
	$('#tag-list li').click(function() {
		
		// here we set the current text of #tags to current for later examination
		var current = $('#tags').val();
		
		// create a regex that finds the clicked tag in the input field
		// The regex requires before the tag: whitespace, a comma, " or the beginning of the line
		// after the tag: whitespace, a comma, " or the end of the line
		// This is necessary to not match "foobar" when "foo" is selected.
		// Normal people would just use \b to set a word boundary but that would not work for tags with special chars
		// We also put everything in subexpressions so we can get the tag without the rest later
		var replstr = new RegExp('(^|[\\s,"])(' + $( this ).text() + ')([\\s,"]|$)', "gi");
		var hits = replstr.exec(current);
		
		// check to see if the tag item we clicked has been clicked before...
		if(hits != null) {
			// remove that tag from the input field. To make sure we don't accidentally hit other tags,
			// we do it by position and length. [2] is the position of the matched tag without the whitespace (see above)
			var newtags = current.substr( 0, hits.index + hits[1].length ) + current.substr( hits.index + hits[0].length );
			$( '#tags' ).val( newtags );
			// unhighlight that tag if necessary
			if( $( this ).hasClass('clicked') ) {
				$(this).removeClass( 'clicked' );
			}
		}
		else {
			// if it hasn't been clicked, go ahead and add the clicked class
			$(this).addClass( 'clicked' );
			// be sure that the option wasn't already in the input field
			if(hits == null) {
				// check to see if current is the default text
				if( $( '#tags').val().length == 0 ) {
					// and if it is, replace it with whatever we clicked
					$( '#tags' ).removeClass('islabeled').val( $( this ).text() );
					$('label[for=tags]').removeClass('overcontent').addClass('abovecontent').hide();
				} else {
					// else if we already have tag content, just append the new tag
					if( $('#tags' ).val() != '' ) {
						$( '#tags' ).val( current + "," + $( this ).text() );
					} else {
						$( '#tags' ).val( $( this ).text() );
					}
				}
			}
		}
	
		// replace unneccessary commas
		$( '#tags' ).val( $( '#tags' ).val().replace(new RegExp('^\\s*,\\s*|\\s*,\\s*$', "gi"), ''));
		$( '#tags' ).val( $( '#tags' ).val().replace(new RegExp('\\s*,(\\s*,)+\\s*', "gi"), ', '));
		
		resetTags();
	});
	
	$( '#tags' ).keyup(function(){
		clearTimeout(tagskeyup);
		tagskeyup = setTimeout(resetTags, 500);
	});
	
	$('#tags').focus(function() {
		$('#tags').addClass('focus');
		}).blur(function() {
			$('#tags').removeClass('focus');
		});
	
	// Tag Drawer: Remove all tags.
	$('#clear').click( function() {
		// so we nuke all the tags in the tag text field
		$(' #tags ').val( '' );
		$('label[for=tags]').removeClass('abovecontent').addClass('overcontent').show();
		// and remove the clicked class from the tags in the manager
		$( '#tag-list li' ).removeClass( 'clicked' );
	});
});

function resetTags() {
	var current = $('#tags').val();

	$('#tag-list li').each(function(){
		// Use a regex to see if this exact tag is in the tag text field
		// see above for a detailed description
		replstr = new RegExp('(^|[\\s,"])' + $( this ).text() + '([\\s,"]|$)', "gi");
		if (current.match(replstr)) {
			$(this).addClass('clicked');
		}
		else {
			$(this).removeClass('clicked');
		}
	});

	if (current.length === 0 && !$('#tags').hasClass('focus')) {
		$('label[for=tags]').addClass('overcontent').removeClass('abovecontent').show();
	}

}