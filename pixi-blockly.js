+(async function (window, webduino) {
  'use strict';

  window.createOrGetVideoEle = function (id, url, width, height) {
    var videlem = document.getElementById(id);
    if (videlem == null) {
      var videlem = document.createElement("video");
      videlem.id = id;
      document.body.appendChild(videlem);
    }
    var sourceMP4 = document.createElement("source");
    videlem.appendChild(sourceMP4);
    sourceMP4.type = "video/mp4";
    sourceMP4.src = url;
    videlem.width = width;
    videlem.height = height;
    return videlem;
  }

  window.createCamera = async function (camSource, width, height, rotate, flip, opacity) {
    function pageX(elem) {
      return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;
    }

    function pageY(elem) {
      return elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop;
    }
    var c1 = document.createElement('canvas');
    c1.width = width;
    c1.height = height;
    c1.style.opacity = opacity;
    document.body.appendChild(c1);
    var cam = new Camera(camSource);
    cam.setFlip(flip);
    cam.setCanvas(c1);
    if (rotate) {
      cam.setRotate(90);
    }
    await cam.start();
    c1.style.position = 'absolute';
    c1.style.top = '0';
    createPIXI(480, 360, true, true);
    return cam;
  }

  window.createPIXI = async function (width, height, flip, opacity) {
    var c2 = document.createElement('canvas');
    c2.width = width;
    c2.height = height;
    c2.style.position = 'absolute';
    c2.style.top = '0';
    document.body.appendChild(c2);

    var game = await new PIXI_Game(async function () {
      return new Promise((resolve, reject) => {
        console.log("123123");
        resolve("ready2go");
      });
    }, [
      { "name": "a1", "url": "media/demo-edu-a1.png" },
      { "name": "a2", "url": "media/demo-edu-a2.png" },
      { "name": "a3", "url": "media/demo-edu-a3.png" },
      { "name": "a4", "url": "media/demo-edu-a4.png" }
    ], c2);
    console.log("OKOKOK");
  }



}(window, window.webduino));

