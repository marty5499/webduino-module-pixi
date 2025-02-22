/*
  判斷指定的不規則四邊形區域，是否有否變化，如果有就將變化的中心的座標回傳

  //產生 Tracking 物件 (左上角)
  var block = new BlockDetect(canvas,true,0,0,100,0,100,100,0,100);
  
  //當有物件進入四邊形內部時觸發，提供該物件座標 (如果有多個物件，會循序被觸發)
  tracking.inside(function(pos) {
    ...
  });

  //當有物件離開四邊形內部時觸發，提供該物件座標最後座標 (如果有多個物件，可能會有問題！？)
  tracking.outside(function(pos) {
    ...
  });

  //掃描追蹤區域，此命令必須放在canvas更新時呼叫，才能持續掃瞄
  tracking.scan();

  //提供API判斷是否有物件在區域內
  var YesOrNo = tracking.isInside();

  //重新設定背景偵測
  tracking.reset();

  //設定區域內物件移動的最小異動量 (決定是否觸發 inside , outside callback)
  tracking.setTrackingStep(3); // 3 pixel

  //暫停偵測
  tracking.pause();

  //繼續偵測
  tracking.resume();

  //設定是否顯示偵測區域 (預設是true)
  tracking.setShowArea(true);

  //設定標示物件的線條和顏色
  setStroke(1, "#f0f0f0");

*/
class Hotspot {
  //預設顯示追蹤情況會繪製到 targetCanvas
  constructor(sourceCanvas, targetCanvas, showArea, x1, y1, x2, y2, x3, y3, x4, y4) {
    var canvas = document.createElement('canvas');
    this.canvas = canvas; //建立canvas元素，預處理畫布，此物件內部處理
    this.canvas.style.display = 'none';
    this.canvas.width = sourceCanvas.width;
    this.canvas.height = sourceCanvas.height;
    this.ctx = canvas.getContext("2d");

    this.sourceCanvas = sourceCanvas;
    this.targetCanvas = targetCanvas;
    this.sourceCtx = sourceCanvas.getContext("2d");

    //設定要顯示到哪個畫布上 (sourceCanvas (同來源影像) , targetCanvas (空白，適合投影))
    this.drawCanvas = targetCanvas; //顯示的畫布
    this.drawCtx = this.drawCanvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.setImgClip(x1, y1, x2, y2, x3, y3, x4, y4);
    this.detectCB = this.in = this.out = function (pos, canvas) {};
    this.startDetect = false;
    this.firstDetect = true;
    this.removed = false;
    this.pause = false;
    this._inside = false;
    this.lastPos = false;
    this.setTrackingStep(1); //異動量 1 pixel
    this.setShowArea(showArea);
    this.imgList = [];
    this.insideObjList = []; //目前區域內偵測到所有物件的座標
    this.res = {}; //儲存圖片、音效資源
  }

  start() {
    var self = this;
    if (this.startDetect) {
      this.reset();
    } else {
      this.history = this.jsonInfo['history'];
      this.varThreshold = this.jsonInfo['varThreshold'];
      this.detectShadows = this.jsonInfo['detectShadows'];
      this.objMinSize = this.jsonInfo['objMinSize'];
      this.filter = this.jsonInfo['filter'];
      this.learningRate = this.jsonInfo['learningRate'];
      if (typeof history == 'undefined') {
        this.history = 500;
      }
      if (typeof varThreshold == 'undefined') {
        this.varThreshold = 100;
      }
      if (typeof detectShadows == 'undefined') {
        this.detectShadows = false;
      }
      if (typeof this.jsonInfo['lineWidth'] != 'undefined') {
        this.lineWidth = this.jsonInfo['lineWidth'];
      }
      if (typeof this.jsonInfo['strokeStyle'] != 'undefined') {
        this.strokeStyle = this.jsonInfo['strokeStyle'];
      }
      if (typeof this.objMinSize == 'undefined') {
        this.objMinSize = 5;
      }
      if (typeof this.learningRate == 'undefined') {
        this.learningRate = 0;
      }
      if (typeof this.filter == 'undefined') {
        this.filter = ['e3', 'g7', 'd15'];
      }
      if (this.bs != null) {
        this.bs.delete();
      }
      this.bs = new cv.BackgroundSubtractorMOG2(this.history, this.varThreshold, this.detectShadows);
      self.startDetect = true;
    }
  }

  debug() {
    this.showDectectCanvas = true;
  }

  stop() {
    this.startDetect = false;
    this.canvas.remove();
    this.removed = true;
  }

  setFlip(flip) {
    this.isFlip = flip;
  }

  setShowArea(b) {
    this.showArea = b;
  }

  setTrackingStep(step) {
    this.posMinStep = step;
  }

  setImgClip(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.lineTo(x4, y4);
    this.ctx.lineTo(x1, y1);
    this.ctx.clip();
    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    this.x4 = x4;
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    this.y4 = y4;
    this.scanX = Math.min.apply(null, [x1, x2, x3, x4]);
    this.scanY = Math.min.apply(null, [y1, y2, y3, y4]);
    this.scanWidth = Math.max.apply(null, [x1, x2, x3, x4]) - this.scanX;
    this.scanHeight = Math.max.apply(null, [y1, y2, y3, y4]) - this.scanY;
  }

  moveTo(x, y) {
    if (this.isFlip) {
      //x = this.sourceCanvas.width - x - this.scanWidth;
    }
    this.scanX = x;
    this.scanY = y;
    this.x1 = this.scanX;
    this.y1 = this.scanY;
    this.x2 = this.scanX + this.scanWidth;
    this.y2 = this.scanY;
    this.x3 = this.scanX + this.scanWidth;
    this.y3 = this.scanY + this.scanHeight;
    this.x4 = this.scanX;
    this.y4 = this.scanY + this.scanHeight;
    this.setImgClip(
      this.x1, this.y1,
      this.x2, this.y2,
      this.x3, this.y3,
      this.x4, this.y4
    );
    let src = cv.matFromImageData(this.getImageData());
    let dstx = new this.cv.Mat();
      this.bs.apply(src, dstx, 1);
    src.delete();
    dstx.delete();
  }

  reset() {
    var self = this;
    if (this.bs != null) {
      this.bs.delete();
    }
    this.bs = new cv.BackgroundSubtractorMOG2(this.history, this.varThreshold, this.detectShadows);
    this.lastPos = false;
    self.firstDetect = true;
    self.resetImageCollision();
  }

  setCvProcess(imgFilter) {
    this.imgFilter = imgFilter;
    this.cv = imgFilter.getOpenCV();
  }

  drawTrackingArea() {
    var offsetY = 0;
    var offsetX = 0;
    if (this.showArea && this.lineWidth > 0) {
      var a = { x: this.x1, y: this.y1 };
      var b = { x: this.x2, y: this.y2 };
      var c = { x: this.x3, y: this.y3 };
      var d = { x: this.x4, y: this.y4 };
      //targetCanvas.width = targetCanvas.width;
      this.drawCtx.lineWidth = this.lineWidth;
      this.drawCtx.strokeStyle = this.strokeStyle
      this.drawCtx.beginPath();
      this.drawCtx.moveTo(a.x - this.lineWidth * 2 + offsetX, a.y - this.lineWidth * 2 + offsetY);
      this.drawCtx.lineTo(b.x + this.lineWidth * 2 + offsetX, b.y - this.lineWidth * 2 + offsetY);
      this.drawCtx.lineTo(c.x + this.lineWidth * 2 + offsetX, c.y + this.lineWidth * 2 + offsetY);
      this.drawCtx.lineTo(d.x - this.lineWidth * 2 + offsetX, d.y + this.lineWidth * 2 + offsetY);
      this.drawCtx.lineTo(a.x - this.lineWidth * 2 + offsetX, a.y - this.lineWidth * 2 + offsetY);
      this.drawCtx.stroke();
    }
  }

  getImageData() {
    this.drawTrackingArea();
    this.ctx.drawImage(this.drawCanvas, 0, 0);
    var x = this.scanX;
    if (this.isFlip) {
      x = this.sourceCanvas.width - x - this.scanWidth;
    }
    this.background = this.sourceCtx.getImageData(
      x, this.scanY, this.scanWidth, this.scanHeight);
    return this.background;
  }

  pause() {
    this.pause = true;
  }

  resume() {
    this.pause = false;
  }

  scan() {
    if (!this.startDetect) {
      return;
    }
    if (this.pause) {
      return;
    }
    if (this.cv == null) {
      return;
    }
    if (this.removed) {
      this.startDetect = false;
      this.bs.delete();
      return;
    }
    this.insideObjList = [];
    this._inside = false;
    let src = cv.matFromImageData(this.getImageData());
    let dstx = new this.cv.Mat();
    this.bs.apply(src, dstx, this.learningRate); //去背偵測物件
    for (var i in this.filter) {
      var key = this.filter[i];
      var value = parseInt(key.substring(1));
      key = key.substring(0, 1);
      switch (key) {
        case 'e':
          dstx = this.imgFilter.erosion(dstx, value);
          break;
        case 'g':
          if (value % 2 == 1) {
            dstx = this.imgFilter.gaussianBlur(dstx, value);
          }
          break;
        case 'd':
          dstx = this.imgFilter.dilation(dstx, value);
          break;
      }
    }
    src.delete();

    if (this.showDectectCanvas) {
      cv.imshow('c2', dstx);
    }

    if (!this.startDetect) {
      dstx.delete();
      return;
    }

    //skip firstDetect
    if (this.firstDetect) {
      this.firstDetect = false;
      dstx.delete();
      return;
    }
    var posList = this.imgFilter.enclosingCircleMaxOne(dstx, this.objMinSize);
    dstx.delete();
    //*
    if (posList.length == 0 && this.lastPos != false) {
      this.out(this.lastPos, this.targetCanvas);
      this.lastPos = false;
    }
    for (var i = 0; i < posList.length; i++) {
      //偵測區域裡面的座標 x:0 ,y:0
      var pos = posList[i];
      pos.x = pos.x + this.scanX;
      pos.y = pos.y + this.scanY;
      if (pos.radius > this.objMinSize) {
        this._inside = this.checkInside(pos);
        if (this._inside) {
          //console.log("inside , srcPos:", pos);
          this.detectCB(pos);
          this.insideObjList.push(pos);
          // 大於最小異動量才會觸發
          if (this.lastPos == false) {
            this.lastPos = { x: -1, y: -1 };
          }
          var minX = Math.abs(pos.x - this.lastPos.x);
          var minY = Math.abs(pos.y - this.lastPos.y);
          if (minX > this.posMinStep || minY > this.posMinStep) {
            this.lastPos = pos;
            this.in(pos, this.sourceCanvas);
          }
        }
      }
    }
    //*/
  }

  addResource(info) {
    var self = this;
    if (!(info.sndFile in this.res)) {
      this.res[info.sndFile] = new Audio(info.sndFile);
    }
    var p = info.imgPos;
    info.x = Math.min.apply(null, [p[0], p[2], p[4], p[6]]);
    info.y = Math.min.apply(null, [p[1], p[3], p[5], p[7]]);
    info.w = Math.max.apply(null, [p[0], p[2], p[4], p[6]]) - info.x;
    info.h = Math.max.apply(null, [p[1], p[3], p[5], p[7]]) - info.y;
    info.audio = this.res[info.sndFile];
    info.isCollision = false;
    self.imgList.push(info);
  }

  resetImageCollision() {
    for (var i = 0; i < this.imgList.length; i++) {
      this.imgList[i].isCollision = false;
    }
  }

  setStroke(lineWidth, strokeStyle) {
    this.lineWidth = lineWidth;
    this.strokeStyle = strokeStyle;
  }

  getStroke() {
    return [this.lineWidth, this.strokeStyle];
  }

  isInside() {
    return this._inside;
  }

  inside(ins) {
    this.in = ins;
  }

  detect(detectCB) {
    this.detectCB = detectCB;
  }

  getInsideObjList() {
    return this.insideObjList;
  }

  outside(out) {
    this.out = out;
  }

  crossMul(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
  }

  checkCross(p1, p2, p3, p4) {
    var v1 = { x: p1.x - p3.x, y: p1.y - p3.y },
      v2 = { x: p2.x - p3.x, y: p2.y - p3.y },
      v3 = { x: p4.x - p3.x, y: p4.y - p3.y },
      v = this.crossMul(v1, v3) * this.crossMul(v2, v3)
    v1 = { x: p3.x - p1.x, y: p3.y - p1.y }
    v2 = { x: p4.x - p1.x, y: p4.y - p1.y }
    v3 = { x: p2.x - p1.x, y: p2.y - p1.y }
    return (v <= 0 && this.crossMul(v1, v3) * this.crossMul(v2, v3) <= 0) ? true : false
  }

  checkInside(point) {
    var maxX = Math.max.apply(null, [this.x1, this.x2, this.x3, this.x4]);
    var minX = Math.min.apply(null, [this.x1, this.x2, this.x3, this.x4]);
    var maxY = Math.max.apply(null, [this.y1, this.y2, this.y3, this.y4]);
    var minY = Math.min.apply(null, [this.y1, this.y2, this.y3, this.y4]);
    if (point.x > maxX || point.x < minX || point.y > maxY || point.y < minY) {
      return false;
    }

    var polygon = [
      { x: this.x1, y: this.y1 },
      { x: this.x2, y: this.y2 },
      { x: this.x3, y: this.y3 },
      { x: this.x4, y: this.y4 }
    ];
    var p1, p2, p3, p4;
    p1 = point;
    p2 = { x: -100, y: point.y }
    var count = 0;
    for (var i = 0; i < polygon.length - 1; i++) {
      p3 = polygon[i];
      p4 = polygon[i + 1]
      if (this.checkCross(p1, p2, p3, p4) == true) {
        count++
      }
    }
    p3 = polygon[polygon.length - 1];
    p4 = polygon[0];
    if (this.checkCross(p1, p2, p3, p4) == true) {
      count++;
    }
    this._inside = (count % 2 == 0) ? false : true;
    return this._inside;
  }
}