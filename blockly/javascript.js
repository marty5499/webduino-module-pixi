Blockly.JavaScript['waspot_get_camera'] = function (block) {
  var variable_camera = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('camera'), Blockly.Variables.NAME_TYPE);
  var checkbox_rotate = block.getFieldValue('rotate') == 'TRUE' ? 90 : 0;
  var checkbox_flip = block.getFieldValue('flip') == 'TRUE';
  var screenSize = block.getFieldValue('screenSize');
  var opacity = block.getFieldValue('opacity');
  var text_src = block.getFieldValue('src');
  var code = variable_camera + ' = await createCamera("' + text_src + '",' + screenSize + ',' + checkbox_rotate + ',' + checkbox_flip + ',' + opacity + ');\n';
  return code;
};

Blockly.JavaScript['pixi_game'] = function (block) {
  var var_stage = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('stage'), Blockly.Variables.NAME_TYPE);
  var var_camera = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('camera'), Blockly.Variables.NAME_TYPE);
  //var game = new PIXI_Game(cam.getCanvas());
  var code = var_stage + ' = new PIXI_Game(' + var_camera + '.getCanvas());\n';
  return code;
};

Blockly.JavaScript['pixi_actor'] = function (block) {
  var value_actor = Blockly.JavaScript.valueToCode(block, 'actor', Blockly.JavaScript.ORDER_ATOMIC);
  var value_imgurl = Blockly.JavaScript.valueToCode(block, 'imgURL', Blockly.JavaScript.ORDER_ATOMIC);
  var variable_stage = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('stage'), Blockly.Variables.NAME_TYPE);
  var code = value_actor + ' = await new PIXI_Actor(' + variable_stage + ', ' + value_imgurl + ')\n';
  return code;
};


Blockly.JavaScript['pixi_actor_size'] = function (block) {
  var var_actor = Blockly.JavaScript.valueToCode(block, 'actor', Blockly.JavaScript.ORDER_ATOMIC);
  var val_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var val_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  // act.size(120, 120);
  var code = var_actor + '.size(' + val_width + ', ' + val_height + ');\n';
  return code;
};


Blockly.JavaScript['pixi_actor_pos'] = function (block) {
  var val_actor = Blockly.JavaScript.valueToCode(block, 'actor', Blockly.JavaScript.ORDER_ATOMIC);
  var val_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var val_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var code = val_actor + '.pos(' + val_x + ', ' + val_y + ');\n';
  return code;
};

Blockly.JavaScript['pixi_actor_move'] = function (block) {
  var val_actor = Blockly.JavaScript.valueToCode(block, 'actor', Blockly.JavaScript.ORDER_ATOMIC);
  var val_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var val_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var val_speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
  var chk_destroy = block.getFieldValue('destroy') == 'TRUE';
  var code = val_actor + '.moveTo(' + val_x + ', ' + val_y + ', ' + val_speed + ', function(){}, ' + chk_destroy + ');\n';
  return code;
};

Blockly.JavaScript['pixi_actor_move_cb'] = function (block) {
  var val_actor = Blockly.JavaScript.valueToCode(block, 'actor', Blockly.JavaScript.ORDER_ATOMIC);
  var val_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var val_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var val_speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
  var chk_destroy = block.getFieldValue('destroy') == 'TRUE';
  var statements_name = Blockly.JavaScript.statementToCode(block, 'moveDone');
  var code = val_actor + '.moveTo(' + val_x + ', ' + val_y + ', ' + val_speed + ',function(){\n';
  code += statements_name;
  code += '},' + chk_destroy + ');';
  return code;
};

Blockly.JavaScript['pixi_actor_collision'] = function (block) {
  var value_collision = Blockly.JavaScript.valueToCode(block, 'collision', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_run = Blockly.JavaScript.statementToCode(block, 'run');
  var code = value_collision + '.collision( function(self,other){ \n';
  code += statements_run;
  code += '});\n';
  return code;
};

Blockly.JavaScript['pixi_actor_collision_obj'] = function (block) {
  var value_actor = Blockly.JavaScript.valueToCode(block, 'actor', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_actor + '.collision_obj';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['pixi_actor_destroy'] = function (block) {
  var val_actor = Blockly.JavaScript.valueToCode(block, 'actor', Blockly.JavaScript.ORDER_ATOMIC);
  var code = val_actor + '.destroy();\n';
  return code;
};


Blockly.JavaScript['pixi_pipe_create'] = function (block) {
  var value_pipe = Blockly.JavaScript.valueToCode(block, 'pipe', Blockly.JavaScript.ORDER_ATOMIC);
  var colour_color = block.getFieldValue('color');
  var value_data = Blockly.JavaScript.valueToCode(block, 'data', Blockly.JavaScript.ORDER_ATOMIC);
  var value_stage = Blockly.JavaScript.valueToCode(block, 'stage', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_pipe + ' = new PIXI_Pipe(' + value_stage + ');\n';
  code += value_pipe + '.setColor(0x' + colour_color.substring(1) + ');\n';
  code += value_pipe + '.draw(JSON.parse(' + value_data + '));\n';
  return code;
};


Blockly.JavaScript['pixi_pipe_outofbound'] = function (block) {
  var value_pipe = Blockly.JavaScript.valueToCode(block, 'pipe', Blockly.JavaScript.ORDER_ATOMIC);
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_r = Blockly.JavaScript.valueToCode(block, 'r', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_pipe + '.outOfBound(' + value_x + ',' + value_y + ',' + value_r + ')\n';
  return [code, Blockly.JavaScript.ORDER_NONE];
};