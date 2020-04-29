(function( $ ) {
	'use strict';

	$(function() {

    let audio = $('#sirvelia-player audio')[0];
    audio.onloadedmetadata = function() {
      let currentTime = getCookie('sirvelia-player-time');
      if(currentTime) {
        audio.currentTime = currentTime;
        $('#playlist-time-range').val( getPlaylistPercent( currentTime, audio.duration ) );
      }

      let currentVolume = getCookie('sirvelia-player-volume');
      if(currentVolume) {
        audio.volume = currentVolume;
        $('#playlist-volume-range').val( currentVolume*100 );
      }

      let play = getCookie('sirvelia-player-play');
      if(play && play == 'true') {

        let audioPromise = audio.play();
        if (audioPromise !== undefined) {
            audioPromise.then(_ => {
                // Autoplay started!
                $('#sirvelia-player .playPause-btn span').removeClass("icon-play3");
                $('#sirvelia-player .playPause-btn span').addClass("icon-pause2");
            }).catch(error => {
                // Autoplay was prevented.
            });
        }
      }
    };

  });

  function getPlaylistTime(currentTime) {
		var minutes; var seconds;
    minutes = Math.floor(currentTime / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(currentTime % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ':' + seconds;
  }

  function getPlaylistPercent(currentTime, duration) {
    return Math.floor(currentTime*100 / duration);
  }

  function percentToTime(percent, duration) {
    return Math.floor(percent*duration / 100);
  }

  let mouseIsDown = false;

  /**********
  * ON TIME UPDATE
  **********/
  $('#sirvelia-player audio').on('timeupdate', function(e) {
    if(!mouseIsDown) {
      var audio = $(this)[0];

      if(audio.currentTime !== 0) {
        $('.current-time').html( getPlaylistTime( audio.currentTime )  );
        $('#playlist-time-range').val( getPlaylistPercent( audio.currentTime, audio.duration ) );
      }
      else {
        $('.current-time').html( '00:00'  );
        $('#playlist-time-range').val( 0 );
      }

      let playlist_array = [];
      $('#sirvelia-player .player-playlist').children().each(function() {
        let songTitle = $(this).find('.song-title').html();
        let songUrl = $(this).find('a.song').attr('href');
        let productUrl = $(this).find('a.view-song').attr('href');
        let isActive = $(this).hasClass('active');
        let song = {title: songTitle, url: songUrl, isActive: isActive, productUrl: productUrl};
        playlist_array.push(song);
      });

      var json_playlist = JSON.stringify(playlist_array);

      setCookie('sirvelia-player-time', audio.currentTime, 1); // CURRENT TIME
      setCookie('sirvelia-player-volume', audio.volume, 1); // CURRENT VOLUME
      setCookie('sirvelia-player-play', !audio.paused, 1); // PLAY/PAUSE
      setCookie('sirvelia-player-playlist', json_playlist, 1); // JSON ARRAY (Title, Url, isActive)
    }

  });

  /**********
  * ON RANGE CHANGE
  **********/
  $('#playlist-time-range').on('mousedown', function(e) {
    let audio = $('#sirvelia-player audio');
    if( audio.attr('src') ) audio[0].pause();
    mouseIsDown = true;
  });

  $('#playlist-time-range').on('mousemove', function(e) {
    let audio = $('#sirvelia-player audio');

    if(mouseIsDown) {
      if( audio.attr('src') ) {
        let currentTime = percentToTime( $(this).val(), audio[0].duration );
        if(currentTime !== 0)
          $('.current-time').html( getPlaylistTime( currentTime ) );
        else $('.current-time').html( '00:00' );
      }
    }

  });

  $('#playlist-time-range').on('mouseup', function(e) {
    var audio = $('#sirvelia-player audio');

    if( audio.attr('src') ) {
      audio = audio[0];
      audio.currentTime = percentToTime( $(this).val(), audio.duration );
      audio.play();

      $('#sirvelia-player .playPause-btn span').removeClass("icon-play3");
      $('#sirvelia-player .playPause-btn span').addClass("icon-pause2");
    }

    mouseIsDown = false;
  });

  $('#playlist-volume-range').on('mousemove', function(e) {
    var audio = $('#sirvelia-player audio');

    if( audio.attr('src') ) {
      audio = audio[0];
      audio.volume = $(this).val()/100;
    }
  });

  $('#playlist-volume-range').on('mouseup', function(e) {
    var audio = $('#sirvelia-player audio');
    setCookie('sirvelia-player-volume', audio[0].volume, 1); // CURRENT VOLUME1
  });

  /**********
  * SHOW/HIDE PLAYLIST
  **********/
  $('#sirvelia-player .showHide-btn').on('click', function(e) {
    var $this = $(this);
    e.preventDefault();

    $('#sirvelia-player .playlist-wrapper').toggle();
    $this.text($.trim($this.text()) === AudioPlaylistForWoocommerceStrings.open_playlist + " ▲" ? AudioPlaylistForWoocommerceStrings.close_playlist + " ▼" : AudioPlaylistForWoocommerceStrings.open_playlist+ " ▲");
  });


  /**********
  * PREVIOUS BUTTON
  **********/
  $('#sirvelia-player .previous-btn').on('click', function(e) {
    e.preventDefault();

    var myAudio = $('#sirvelia-player #player-audio');
    if( myAudio.attr('src') ) {

      var current_song = $('#sirvelia-player .playlist-item.active');
      var new_song = current_song.prev();
      if(new_song.length === 0) new_song = current_song.siblings(":last");
      var newsong_url = new_song.find('a.song').attr('href');

      // Canviar titol
      $('#sirvelia-player .current-song').html( new_song.find('.song-title').html() );

      // Canviar audio
      myAudio.attr('src', newsong_url);

      // Posar botó Play/Pause
      $('#sirvelia-player .playPause-btn span').removeClass("icon-play3");
      $('#sirvelia-player .playPause-btn span').addClass("icon-pause2");

      // Cançó actual active, la resta no
      current_song.removeClass("active");
      new_song.addClass("active");

      return myAudio[0].paused ? myAudio[0].play() : myAudio[0].currentTime = 0;
    }

  });


  /**********
  * NEXT BUTTON
  **********/
  $('#sirvelia-player .next-btn').on('click', function(e) {
    e.preventDefault();

    var myAudio = $('#sirvelia-player #player-audio');
    if( myAudio.attr('src') ) {

      var current_song = $('#sirvelia-player .playlist-item.active');
      var new_song = current_song.next();
      if(new_song.length === 0) new_song = current_song.siblings(":first");
      var newsong_url = new_song.find('a.song').attr('href');

      // Canviar titol
      $('#sirvelia-player .current-song').html( new_song.find('.song-title').html() );

      // Canviar audio
      myAudio.attr('src', newsong_url);

      // Posar botó Play/Pause
      $('#sirvelia-player .playPause-btn span').removeClass("icon-play3");
      $('#sirvelia-player .playPause-btn span').addClass("icon-pause2");

      // Cançó actual active, la resta no
      current_song.removeClass("active");
      new_song.addClass("active");

      return myAudio[0].paused ? myAudio[0].play() : myAudio[0].currentTime = 0;
    }
  });


  /**********
  * SONG ENDED
  **********/
  $('#sirvelia-player #player-audio').on('ended', function(e) {
    e.preventDefault();
    var $audio = $(this);

    var current_song = $('#sirvelia-player .playlist-item.active');
    var new_song = current_song.next();
    var playlist_ended = false;

    if(new_song.length === 0) {
      new_song = current_song.siblings(":first");
      if(new_song.length === 0) { //Només hi ha 1 element
        new_song = current_song;
      }
      playlist_ended = true;
    }
    var newsong_url = new_song.find('a.song').attr('href');

    // Canviar titol
    $('#sirvelia-player .current-song').html( new_song.find('.song-title').html() );

    // Canviar audio
    $audio.attr('src', newsong_url);

    // Cançó actual active, la resta no
    current_song.removeClass("active");
    new_song.addClass("active");

    if(playlist_ended) { // Posar botó Play/Pause, reiniciar temps i parar
      $('#sirvelia-player .playPause-btn span').removeClass("icon-pause2");
      $('#sirvelia-player .playPause-btn span').addClass("icon-play3");
      $('#playlist-time-range').val( 0 );
      setCookie('sirvelia-player-play', false, 1);
    }
    else { // Posar botó Play/Pause, play
      $('#sirvelia-player .playPause-btn span').removeClass("icon-play3");
      $('#sirvelia-player .playPause-btn span').addClass("icon-pause2");
      $audio[0].currentTime = 0;
      $audio[0].play();
      $('#playlist-time-range').val( 0 );
    }

  });


  /**********
  * REMOVE SONG
  **********/
  $('#sirvelia-player').on('click', '.playlist-item .remove-song', function(e) {
    e.preventDefault();
    let parent = $(this).parent();
    let isActive = parent.hasClass('active');
    if(isActive) {
      let first = parent.siblings(":first");
      let audio = $('#sirvelia-player #player-audio');
      audio[0].pause();
      $('#playlist-time-range').val( 0 );

      if(first.length !== 0) { //Hi ha Algun element abans
        let newsong_url = first.find('.song-info a.song').attr('href');
        audio.attr('src', newsong_url);
        first.addClass('active');
        $('#sirvelia-player .current-song').html( first.find('.song-title').html() );
        $('.current-time').html( '00:00' );
        $('.view-album').html( first.find('.view-song').html() );
      }
      else {
        audio.attr('src', '');
        $('#sirvelia-player .current-song').html('');
        $('.current-time').html('');
        $('.view-album').html('');
      }
      // Posar botó Play/Pause
      $('#sirvelia-player .playPause-btn span').removeClass("icon-pause2");
      $('#sirvelia-player .playPause-btn span').addClass("icon-play3");

      setCookie('sirvelia-player-time', 0, 1); // CURRENT TIME
      setCookie('sirvelia-player-volume', 0, 1); // CURRENT VOLUME
      setCookie('sirvelia-player-play', false, 1); // PLAY/PAUSE
    }
    parent.remove();

    let playlist_array = [];
    $('#sirvelia-player .player-playlist').children().each(function() {
      let songTitle = $(this).find('.song-title').html();
      let songUrl = $(this).find('a.song').attr('href');
      let productUrl = $(this).find('a.view-song').attr('href');
      let isActive = $(this).hasClass('active');
      let song = {title: songTitle, url: songUrl, isActive: isActive, productUrl: productUrl};
      playlist_array.push(song);
    });

    let json_playlist = JSON.stringify(playlist_array);
    setCookie('sirvelia-player-playlist', json_playlist, 1); // JSON ARRAY (Title, Url, isActive)
  });


  /**********
  * CLICK ON PLAYLIST SONG
  **********/
  $('#sirvelia-player').on('click', '.playlist-item .song', function(e) {
    var $this = $(this);
    e.preventDefault();

    // Canviar titol
    $('#sirvelia-player .current-song').html( $this.find('.song-title').html() );

    // Canviar audio
    var myAudio = $('#sirvelia-player #player-audio');
    var newsong_url = $this.attr('href');
    myAudio.attr('src', newsong_url);

    // Posar botó Play/Pause
    $('#sirvelia-player .playPause-btn span').removeClass("icon-play3");
    $('#sirvelia-player .playPause-btn span').addClass("icon-pause2");

    // Cançó actual active, la resta no
    $this.parents('.playlist-item').siblings().removeClass("active");
    $this.parents('.playlist-item').addClass("active");

    // Restart Player
    return myAudio[0].paused ? myAudio[0].play() : myAudio[0].currentTime = 0;

  });


  /**********
  * PLAY/PAUSE BUTTON
  **********/
  $('#sirvelia-player .playPause-btn').on('click', function(e) {
    e.preventDefault();

    var myAudio = $('#sirvelia-player #player-audio');

    if( myAudio.attr('src') ) {
      $(this).find('span').toggleClass("icon-play3 icon-pause2");
      return myAudio[0].paused ? myAudio[0].play() : myAudio[0].pause();
    }

  });

  /**********
  * REMOVE ALL
  **********/
  $('#sirvelia-player .remove-all').on('click', function(e) {
    e.preventDefault();

    var myAudio = $('#sirvelia-player #player-audio');
    myAudio[0].pause();
    myAudio.attr('src', '');

    $('#sirvelia-player .player-playlist').html('');
    $('#playlist-time-range').val(0);

    $('.player-info .current-song').html('');
    $('.player-info .current-time').html('00:00');
    $('.player-info .view-album').html('');

    $('#sirvelia-player .playPause-btn span').removeClass("icon-pause2");
    $('#sirvelia-player .playPause-btn span').addClass("icon-play3");

    setCookie('sirvelia-player-time', 0, 1); // CURRENT TIME
    setCookie('sirvelia-player-volume', 0, 1); // CURRENT VOLUME
    setCookie('sirvelia-player-play', false, 1); // PLAY/PAUSE
    setCookie('sirvelia-player-playlist', {}, 1); // JSON ARRAY (Title, Url, isActive)

  });



  /**********
  * ADD PLAYLIST TO PLAYER
  **********/
  $('.add-product-playlist').on('click', function(e) {
    e.preventDefault();
    // TODO: Add only if not exists

    let json = $(this).data('json');
    //let noSongs = $('#sirvelia-player #player-audio').attr('src') == '';
    let songList = $('#sirvelia-player .player-playlist a.song');
    let songsUrls = [];
    if(songList) {
      songsUrls = songList.map( function() {
        return jQuery(this).attr("href");
      } ).get();
    }
    //if(noSongs)
    $('#sirvelia-player .player-playlist .active').removeClass('active');

    for (let i = json.length - 1; i >= 0; i--) {
      let songUrl = json[i].url;
      if($.inArray(songUrl, songsUrls) === -1) { // SONG NOT IN QUEUE
        $('#sirvelia-player .player-playlist').prepend(`<li class="playlist-item">
          <span class="song-info">
            <a class="song" href="` + songUrl + `">
              <span class="song-title">` + json[i].title + `</span>
            </a>
            <a href="` + json[i].productUrl + `" class="view-song">` + AudioPlaylistForWoocommerceStrings.view + `</a>
          </span>
          <a href="#" class="remove-song">remove</a>
        </li>`);
      }

    }

    //if(noSongs) { //Si no hi ha cançons
      $('#sirvelia-player .player-playlist .playlist-item:first').addClass('active');

      // Titol inicial
      $('#sirvelia-player .current-song').html(json[0].title);
      let viewAlbum = $('#sirvelia-player .view-album');

      if(viewAlbum.length > 0) {
        viewAlbum.html('view');
        viewAlbum.attr('href', json[0].productUrl);
      }

      else {
        $('#sirvelia-player .player-info .info1').append('<a href="' + json[0].productUrl + '" class="view-album">' + AudioPlaylistForWoocommerceStrings.view + '</a>');
      }

      // Play pause
      $('#sirvelia-player .playPause-btn span').removeClass("icon-play3");
      $('#sirvelia-player .playPause-btn span').addClass("icon-pause2");

      // Play first song
      var myAudio = $('#sirvelia-player #player-audio');
      myAudio.attr('src', json[0].url);
      return myAudio[0].paused ? myAudio[0].play() : myAudio[0].currentTime = 0;
    //}

  });

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

})( jQuery );
