<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://sirvelia.com
 * @since      1.0.0
 *
 * @package    Audio_Playlist_for_WooCommerce_
 * @subpackage Audio_Playlist_for_WooCommerce_/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Audio_Playlist_for_WooCommerce_
 * @subpackage Audio_Playlist_for_WooCommerce_/public
 * @author     Sirvelia <info@sirvelia.com>
 */
class Audio_Playlist_for_WooCommerce__Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Audio_Playlist_for_WooCommerce__Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Audio_Playlist_for_WooCommerce__Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		if ( !is_cart() && !is_checkout() ) {
			wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/audio-playlist-for-woocommerce-public.css', array(), $this->version, 'all' );
	    //wp_enqueue_style( 'sirvelia-playlist-css', plugin_dir_url( __FILE__ ) . 'css/playlist-style.css', $this->version );
	  }

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Audio_Playlist_for_WooCommerce__Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Audio_Playlist_for_WooCommerce__Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( 'sirvelia-cookies', plugin_dir_url( __FILE__ ) . 'js/cookies.js', array(), $this->version, true);

		if ( !is_cart() && !is_checkout() ) {
			wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/audio-playlist-for-woocommerce-public.js', array( 'jquery' ), $this->version, true );
	   // wp_enqueue_script( 'sirvelia-playlist', plugin_dir_url( __FILE__ ) . 'js/playlist.js', array('jquery'), $this->version, true);
	  }

	}

	function getPlaylistTime( $time ) {

		if ( is_string( $time ) ) {
			$minutes = floor($time / 60);
		  $minutes = ($minutes >= 10) ? $minutes : "0" . $minutes;
		  $seconds = floor($time % 60);
		  $seconds = ($seconds >= 10) ? $seconds : "0" . $seconds;
		  return $minutes . ':' . $seconds;
		} else {
			return false;
		}

	}


	function show_audio_playlist_woocommerce() {

	  if ( !is_cart() && !is_checkout() ) {
	    $playlist = '';

	    if( isset( $_COOKIE["sirvelia-player-playlist"] ))  {
	      $playlist_cookie = wp_kses_post( $_COOKIE["sirvelia-player-playlist"] );
	      $playlist = json_decode( html_entity_decode( stripslashes( $playlist_cookie ) ) );
	    }

	    $time_cookie = isset( $_COOKIE["sirvelia-player-time"] ) ? wp_kses_post( $_COOKIE["sirvelia-player-time"] ) : 0;

	    $active_song = '';

	    if( $playlist ) {
	      $key = array_search('true', array_column($playlist, 'isActive'));
	      $active_song = $playlist[$key];
	    }

	   ?>

	    <div id="sirvelia-player">
	      <audio class="player-audio" id="player-audio" src="<?php if( $active_song ) echo $active_song->url; ?>" preload="metadata"></audio>

	      <div class="playlist-wrapper" style="display: none">
	        <div class="playlist-wrapper-container">
	          <a class="remove-all" href="#"><?php _e('Remove all', 'audio-playlist-for-woocommerce'); ?></a>
	          <ul class="player-playlist">

	            <?php if($playlist): ?>

	              <?php foreach ($playlist as $song): ?>

		              <li class="playlist-item<?php if($song->isActive) echo ' active'; ?>">
		                <span class="song-info">
		                  <a class="song" href="<?php echo $song->url; ?>">
		                    <span class="song-title"><?php echo $song->title; ?></span>
		                  </a>
		                  <a href="<?php echo $song->productUrl; ?>" class="view-song"><?php _e('view', 'audio-playlist-for-woocommerce'); ?></a>
		                </span>
		                <a href="#" class="remove-song"><?php _e('remove', 'audio-playlist-for-woocommerce'); ?></a>
		              </li>

	              <?php endforeach; ?>

	            <?php endif; ?>

	          </ul>
	        </div>
	      </div>

	      <div class="flex line-container">
	        <div class="player-buttons">
	          <a class="previous-btn" href="#">
	            <span class="icon-previous2"></span>
	          </a>
	          <a class="playPause-btn" href="#">
	            <span class="icon-play3"></span>
	          </a>
	          <a class="next-btn" href="#">
	            <span class="icon-next2"></span>
	          </a>
	        </div>

	        <div class="player-info">
	          <div class="info1">
	            <span class="current-song">
	              <?php if($active_song) echo $active_song->title; else echo "&nbsp;"; ?>
	            </span>
	            <span class="current-time">
	              <?php if($time_cookie) echo $this->getPlaylistTime($time_cookie); ?>
	            </span>
	            <?php if($active_song): ?>
	              <a class="view-album" href="<?php echo $active_song->productUrl; ?>"><?php _e('view', 'audio-playlist-for-woocommerce'); ?></a>
	            <?php endif; ?>
	          </div>

	          <div class="flex">
	            <input id="playlist-time-range" type="range" value="0" />


	            <div class="volume">
	              <div class="flex">
	                <span class="icon-volume-low"></span>
	                <input id="playlist-volume-range" type="range" value="100" />
	                <span class="icon-volume-high"></span>
	              </div>
	            </div>
	          </div>


	        </div>


	        <a class="showHide-btn" href="#">
	          <?php _e( 'Open Playlist', 'audio-playlist-for-woocommerce' ); ?> ▲
	        </a>
	      </div>

	    </div>

	    <?php
	  }
	}

	public function show_product_playlist() {
		echo $this->product_playlist();
	}

	public function show_full_product_playlist() {
		echo $this->full_product_playlist();
	}

	public function product_playlist() {
	    global $product;
	    if ( $product ) {
	      $post_id = $product->get_id();
	      $playlist = carbon_get_post_meta( $post_id, 'crb_product_playlist' );

	      if ( $playlist ) {

	        $data = array();

	        foreach ($playlist as $song) {
	          $data[] = array(
	            'title'   => get_the_title($song),
	            'url'     => wp_get_attachment_url($song),
	            'productUrl' => get_permalink($post_id)
	          );
	        }
	        $json_data = json_encode( $data );
	        return '<a class="add-product-playlist play-all" href="#" title="' . __( 'Play All', 'audio-playlist-for-woocommerce' ) . '" data-json=\'' . $json_data . '\'>' . __( 'Play All', 'audio-playlist-for-woocommerce' ) . '</a>';
	      }
	    }
	    return false;
	}

	function full_product_playlist() {

	    global $product;
	    if ( $product ) {
	      $post_id = $product->get_id();
	      $playlist = carbon_get_post_meta( $post_id, 'crb_product_playlist' );

	      if ( $playlist ) {

	        $data = array();
	        $list_songs = '<ul id="sirvelia-songs-list">';

	        foreach ($playlist as $song) {

	          $song_title = get_the_title($song);
	          $song_url = wp_get_attachment_url($song);
	          $data_song = array(
	            'title'   => $song_title,
	            'url'     => $song_url,
	            'productUrl' => get_permalink($post_id)
	          );
	          $data[] = $data_song;

	          $json_song = json_encode( array($data_song) );
	          $list_songs .= '<li class="single-song"><a class="add-product-playlist" href="#" title="' . $song_title . '" data-json=\'' . $json_song . '\'><span class="icon-play3"></span> ' . $song_title . '</a></li>';
	        }

	        $list_songs .= '</ul>';

	        $json_data = json_encode( $data );
	        $btn = '<a class="add-product-playlist play-all" href="#" title="' . __( 'Play All', 'audio-playlist-for-woocommerce' ) . '" data-json=\'' . $json_data . '\'>' . __( 'Play All', 'audio-playlist-for-woocommerce' ) . '</a>';

	        if( is_product() ) return $btn . $list_songs;
	        else return $btn;
	      }
	    }
	}

	/**
	 * Registers all plugin shortcodes
	 *
	 * @since    1.0.0
	 */
	public function register_shortcodes(){

		add_shortcode('show-playlist', array($this, 'product_playlist'));
		add_shortcode('show-full-playlist', array($this, 'full_product_playlist'));

  }

}
