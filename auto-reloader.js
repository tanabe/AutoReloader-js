//require jquery1.6
//i wish no-dependencies
/**
* AutoReloader.js
* auto reload browser if files were modified.
*/
(function() {
  var TARGET_FILES = [location.href];
  var INTERVAL = 500;

  var counter = 0;
  var initPollCount = 0;
  var isBusy = false;

  /**
  * reload browser
  * @name reload
  * @function
  */
  var reload = function() {
    location.reload();
  };

  /**
  * polling
  * @name polling
  * @function
  */
  var polling = function() {
    var id = setInterval(function() {
      if (!isBusy) {
        checkUpdate(counter);
        if (counter < TARGET_FILES.length - 1) {
          counter++;
        } else {
          counter = 0;
        }
      }
    }, INTERVAL);
  };

  /**
  * check update
  * @name checkUpdate
  * @function
  * @param index 
  */
  var checkUpdate = function(index) {
    isBusy = true;
    var fileName = TARGET_FILES[index];
    $.ajax({
      type: "GET",
      ifModified: true,
      url: fileName,
      success: function(data) {
        if (initPollCount > TARGET_FILES.length) {
          if (data) {
            reload();
          }
        } else {
          initPollCount++;
        }
        isBusy = false;
      },
      error: function() {
        isBusy = false;
      }
    });
  };

  //define interface
  window.AutoReloader = {
    add: function() {
      for (var i = 0; i < arguments.length; i++) {
        TARGET_FILES.push(arguments[i]);
      }
    }
  };

  //entry point
  polling();
})();
