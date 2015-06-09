
(function() {

  setTimeout(function() {
    // If onload hasn't been called, stop all requests after 2 seconds
    if(typeof(_l) == 'undefined') {
      if(window.stop !== undefined) window.stop();
      else if(document.execCommand !== undefined) document.execCommand("Stop", false);
    }
  }, 2000, 'push');

  /*
   * Capture and kill CSS animations after X number of seconds
   */
  function pauseAnimations() {
    var body = document.getElementsByTagName('body')[0];

    if(body.addEventListener) {
      body.addEventListener("webkitAnimationStart", listener, false);
      body.addEventListener("webkitAnimationIteration", listener, false);
      body.addEventListener("animationstart", listener, false);
      body.addEventListener("animationiteration", listener, false);
    }
  }

  function listener(e) {
    if(e.type == "webkitAnimationStart" || e.type == "webkitAnimationIteration") {
      var targetEl = e.target;

      setTimeout(function() {
        targetEl.style.webkitAnimationPlayState = 'paused';
      }, __animationDuration, 'push');
    }
    else if(e.type == "animationstart" || e.type == "animationiteration") {
      var targetEl = e.target;

      setTimeout(function() {
        targetEl.style.MozAnimationPlayState = 'paused';
      }, __animationDuration, 'push');
    }
  }

  pauseAnimations();

  // Pause all audio elements, allow the audio/video
  // elements to render before stopping them
  function pauseElementTypes(type) {
    for (var i = 0, els = document.getElementsByTagName(type); i < els.length; i++) {
      els[i].pause();
    }
  }

  // Wait until the elements have been created to pause them
  setTimeout(function() {
    pauseElementTypes('audio');
    pauseElementTypes('video');
  }, 100);

}());
