/**
* AutoReloader.js
* auto reload browser if files were modified.
*/
(function() {
  var TARGET_FILES = [
    {path: location.href, lastModified: null}
  ];

  var INTERVAL = 1000;

  var counter = 0;
  var isBusy = false;

  /**
   * create XMLHTTPRequest object
   * @name createXMLHTTPRequest
   * @function
   * @return XMLHttpRequest object
   */
  var createXMLHTTPRequest = function() {
    //this code borrowed from
    //https://github.com/hirokidaichi/namespace-js/blob/master/src/namespace.js
    var xhr;
    try {xhr = new XMLHttpRequest()} catch(e) {
      try {xhr = new ActiveXObject("Msxml2.XMLHTTP.6.0")} catch(e) {
        try {xhr = new ActiveXObject("Msxml2.XMLHTTP.3.0")} catch(e) {
          try {xhr = new ActiveXObject("Msxml2.XMLHTTP")} catch(e) {
            try {xhr = new ActiveXObject("Microsoft.XMLHTTP")} catch(e) {
              throw new Error("This browser does not support XMLHttpRequest.")
            }
          }
        }
      }
    }
    return xhr;
  };

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
  * check initialized
  * @name isInitialied
  * @function
  * @return initialized then true
  */
  var isInitialied = function() {
    for (var i = 0; i < TARGET_FILES.length; i++) {
      if (TARGET_FILES[i].lastModified === null) {
        return false;
      }
    }
    return true;
  };

  /**
  * check update
  * @name checkUpdate
  * @function
  * @param index 
  */
  var checkUpdate = function(index) {
    isBusy = true;
    var fileName = TARGET_FILES[index].path;
    var lastModified = TARGET_FILES[index].lastModified;
    var xhr = createXMLHTTPRequest();
    xhr.open("HEAD", fileName, true);
    if (lastModified) {
      xhr.setRequestHeader("If-Modified-Since", lastModified + " ");
    }

    //event handler
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4){
        var fileLastModified = xhr.getResponseHeader("Last-Modified");
        //console.log(fileLastModified, xhr.status);
        //console.log(isInitialied());
        if (xhr.status === 200) {
          if (isInitialied()) {
            //maybe not need checking lastModified
            if (lastModified !== fileLastModified) {
              TARGET_FILES[index].lastModified = fileLastModified;
              reload();
            }
          } else {
            TARGET_FILES[index].lastModified = fileLastModified;
          }
        }
      }
      isBusy = false;
    };
    xhr.send("")
  };

  //define interface
  window.AutoReloader = {
    add: function() {
      for (var i = 0; i < arguments.length; i++) {
        TARGET_FILES.push({path: arguments[i], lastModified: null});
      }
    }
  };

  //entry point
  polling();
})();
