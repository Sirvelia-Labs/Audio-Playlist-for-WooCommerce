<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://sirvelia.com
 * @since      1.0.0
 *
 * @package    Audio_Playlist_for_WooCommerce_
 * @subpackage Audio_Playlist_for_WooCommerce_/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Audio_Playlist_for_WooCommerce_
 * @subpackage Audio_Playlist_for_WooCommerce_/includes
 * @author     Sirvelia <info@sirvelia.com>
 */
class Audio_Playlist_for_WooCommerce__i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'audio-playlist-for-woocommerce',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
