<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://sirvelia.com
 * @since             1.0.0
 * @package           Audio_Playlist_for_WooCommerce_
 *
 * @wordpress-plugin
 * Plugin Name:       Audio Playlist for WooCommerce
 * Plugin URI:        https://github.com/Sirvelia/Audio-Playlist-for-WooCommerce
 * Description:       Audio player with playlist for WooCommerce products.
 * Version:           1.0.0
 * Author:            Sirvelia
 * Author URI:        https://sirvelia.com/
 * License:           GPL-3.0+
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       audio-playlist-for-woocommerce
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'AUDIO_PLAYLIST_FOR_WOOCOMMERCE_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-audio-playlist-for-woocommerce-activator.php
 */
function activate_audio_playlist_for_woocommerce() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-audio-playlist-for-woocommerce-activator.php';
	Audio_Playlist_for_WooCommerce__Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-audio-playlist-for-woocommerce-deactivator.php
 */
function deactivate_audio_playlist_for_woocommerce() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-audio-playlist-for-woocommerce-deactivator.php';
	Audio_Playlist_for_WooCommerce__Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_audio_playlist_for_woocommerce' );
register_deactivation_hook( __FILE__, 'deactivate_audio_playlist_for_woocommerce' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-audio-playlist-for-woocommerce.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_audio_playlist_for_woocommerce() {

	$plugin = new Audio_Playlist_for_WooCommerce_();
	$plugin->run();

}
run_audio_playlist_for_woocommerce();
