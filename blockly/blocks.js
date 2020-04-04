Blockly.Blocks['waspot_get_camera'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("建立")
      .appendField(new Blockly.FieldVariable("camera"), "camera")
      .appendField("並啟動，影像來源：")
      .appendField(new Blockly.FieldTextInput("0"), "src")
      .appendField(" 影像大小：")
      .appendField(new Blockly.FieldDropdown([["320x240", "320,240"], ["480x360", "480,360"], ["640x480", "640,480"], ["800x600", "800,600"]]), "screenSize")
      .appendField(" 旋轉鏡頭：")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "rotate")
      .appendField(" 水平翻轉：")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "flip")
      .appendField(" 透明度：")
      .appendField(new Blockly.FieldDropdown([["10%", "0.1"], ["30%", "0.3"], ["70%", "0.5"], ["100%", "1"]]), "opacity");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('https://webduino.io/');
  }
};

//https://blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#pe5qu3
Blockly.Blocks['pixi_game'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("新增遊戲舞台")
        .appendField(new Blockly.FieldVariable("stage"), "stage")
        .appendField("，並使用相機")
        .appendField(new Blockly.FieldVariable("camera"), "camera");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

//https://blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#yyrwyb
Blockly.Blocks['pixi_actor'] = {
  init: function() {
    this.appendValueInput("actor")
        .setCheck(null)
        .appendField("新增角色");
    this.appendValueInput("imgURL")
        .setCheck(null)
        .appendField("，圖片來源");
    this.appendDummyInput()
        .appendField("，放入遊戲舞台")
        .appendField(new Blockly.FieldVariable("stage"), "stage");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};


//https://blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#qntmqe
Blockly.Blocks['pixi_actor_size'] = {
  init: function() {
    this.appendValueInput("actor")
        .setCheck(null)
        .appendField("設定角色");
    this.appendValueInput("width")
        .setCheck(null)
        .appendField("圖片的寬度");
    this.appendValueInput("height")
        .setCheck(null)
        .appendField("高度");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

//https://blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#stzi3i
Blockly.Blocks['pixi_actor_pos'] = {
  init: function() {
    this.appendValueInput("actor")
        .setCheck(null)
        .appendField("設定角色");
    this.appendValueInput("x")
        .setCheck(null)
        .appendField("圖片的座標")
        .appendField("x");
    this.appendValueInput("y")
        .setCheck(null)
        .appendField("y");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

//https://blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#agb2t3
Blockly.Blocks['pixi_actor_move'] = {
  init: function() {
    this.appendValueInput("actor")
        .setCheck(null)
        .appendField("移動角色");
    this.appendDummyInput()
        .appendField("到座標");
    this.appendValueInput("x")
        .setCheck(null)
        .appendField("x");
    this.appendValueInput("y")
        .setCheck(null)
        .appendField("y");
    this.appendValueInput("speed")
        .setCheck(null)
        .appendField("，速度");
    this.appendDummyInput()
        .appendField("，")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "destroy")
        .appendField("當移動完成後刪除");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

//https://blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#7bfm5d
Blockly.Blocks['pixi_actor_move_cb'] = {
  init: function() {
    this.appendValueInput("actor")
        .setCheck(null)
        .appendField("移動角色");
    this.appendDummyInput()
        .appendField("到座標");
    this.appendValueInput("x")
        .setCheck(null)
        .appendField("x");
    this.appendValueInput("y")
        .setCheck(null)
        .appendField("y");
    this.appendValueInput("speed")
        .setCheck(null)
        .appendField("，速度");
    this.appendDummyInput()
        .appendField("，")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "destroy")
        .appendField("當移動完成後刪除");
    this.appendStatementInput("moveDone")
        .setCheck(null)
        .appendField("完成後執行");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

//https://blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#fiur6b
Blockly.Blocks['pixi_actor_collision'] = {
  init: function() {
    this.appendValueInput("collision")
        .setCheck(null)
        .appendField("當角色");
    this.appendDummyInput()
        .appendField("被碰撞時");
    this.appendStatementInput("run")
        .setCheck(null)
        .appendField("執行");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

//https://blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#ynbvk3
Blockly.Blocks['pixi_actor_collision_obj'] = {
  init: function() {
    this.appendValueInput("actor")
        .setCheck(null)
        .appendField("從");
    this.appendDummyInput()
        .appendField("取得碰撞角色");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

//
Blockly.Blocks['pixi_actor_destroy'] = {
  init: function() {
    this.appendValueInput("actor")
        .setCheck(null)
        .appendField("移除角色");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

//https://blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#5anxuy
Blockly.Blocks['pixi_pipe_create'] = {
  init: function() {
    this.appendValueInput("pipe")
        .setCheck(null)
        .appendField("建立管線");
    this.appendDummyInput()
        .appendField("設定顏色")
        .appendField(new Blockly.FieldColour("#ffcc33"), "color");
    this.appendValueInput("data")
        .setCheck(null)
        .appendField("設定資料");
    this.appendValueInput("stage")
        .setCheck(null)
        .appendField("，放入遊戲舞台");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

//https://blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#gvzkci
Blockly.Blocks['pixi_pipe_outofbound'] = {
  init: function() {
    this.appendValueInput("pipe")
        .setCheck(null)
        .appendField("檢查管線");
    this.appendValueInput("x")
        .setCheck(null)
        .appendField("是否超出邊界，傳入座標")
        .appendField("X");
    this.appendValueInput("y")
        .setCheck(null)
        .appendField("Y");
    this.appendValueInput("r")
        .setCheck(null)
        .appendField("r");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};