<?php

/**
 * Fired during plugin activation
 *
 * @link       https://sirvelia.com
 * @since      1.0.0
 *
 * @package    Audio_Playlist_for_WooCommerce_
 * @subpackage Audio_Playlist_for_WooCommerce_/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Audio_Playlist_for_WooCommerce_
 * @subpackage Audio_Playlist_for_WooCommerce_/includes
 * @author     Sirvelia <info@sirvelia.com>
 */
class Audio_Playlist_for_WooCommerce__Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {

		if ( !function_exists( 'is_plugin_active_for_network' ) ) {
			include_once( ABSPATH . '/wp-admin/includes/plugin.php' );
		}

		if ( current_user_can( 'activate_plugins' ) && !class_exists( 'WooCommerce' ) ) {
			deactivate_plugins( plugin_basename( __FILE__ ) );
			$error_message = '<p style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Oxygen-Sans,Ubuntu,Cantarell,\'Helvetica Neue\',sans-serif;font-size: 13px;line-height: 1.5;color:#444;">' . esc_html__( 'This plugin requires ', 'audio-playlist-for-woocommerce' ) . '<a target="_blank" href="' . esc_url( 'https://wordpress.org/plugins/woocommerce' ) . '">WooCommerce</a>' . esc_html__( ' plugin.', 'audio-playlist-for-woocommerce' ) . '</p>';
			die( $error_message );
		}

	}

}
