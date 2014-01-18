<?php
class TagTray extends Plugin
{
	private $theme;

	/**
	 * Add the tray to the publish form
	 * @params FormUI $form The publish form object instance
	 * @params Post $post The post that is being edited
	 **/
	public function action_form_publish($form, $post)
	{
		// Create the tags selector
		$tagselector = $form->publish_controls->append('fieldset', 'tagselector', _t('Tags'));

		$tags_buttons = $tagselector->append('wrapper', 'tags_buttons');
		$tags_buttons->class = 'container';
		$tags_buttons->append('static', 'clearbutton', '<p class="span-5"><input type="button" value="'._t('Clear').'" id="clear"></p>');

		$tags_list = $tagselector->append('wrapper', 'tags_list');
		$tags_list->class = 'container';
		$tags_list->append('static', 'tagsliststart', '<ul id="tag-list" class="span-19">');
		$tags = Tags::vocabulary()->get_tree( 'term_display ASC' );
		$tag_html = "";

		foreach ($tags as $tag) {
			$tag_html .= "\n<li class=\" tag_" . $tag->term;
			if(preg_match("/{$tag->term_display}/i", $post->content) || preg_match("/{$tag->term}/i", $post->content)) {
				$tag_html .= ' appearance';
			}
			$tag_html .= '">' . $tag->term_display . "</li>\n";
		}
		
		$tags_list_content = $tags_list->append('static', 'tagslistcontent', $tag_html);
		$tags_list->append('static', 'tagslistend', '</ul>');
	}

	/**
	 * Add the required javascript to the publish page
	 * @param Theme $theme The admin theme instance
	 **/
	public function action_admin_header($theme)
	{
		Stack::add('admin_header_javascript', $this->get_url(true) . 'tagtray.js', 'tagtray', 'jquery');
		Stack::add('admin_stylesheet', $this->get_url(true) . 'tagtray.css', 'tagtray');
	}

}
?>
