var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['jQuery', 'Underscore', 'Backbone', "text!templates/node.tmpl.html", "order!libs/jquery.tmpl.min", "order!libs/jquery.contextMenu", 'order!threenodes/core/NodeFieldRack', 'order!threenodes/utils/Utils'], function($, _, Backbone, _view_node_template) {
  "use strict";  ThreeNodes.nodes.types.Utils.Random = (function() {
    __extends(Random, ThreeNodes.NodeBase);
    function Random() {
      this.compute = __bind(this.compute, this);
      this.set_fields = __bind(this.set_fields, this);
      Random.__super__.constructor.apply(this, arguments);
    }
    Random.prototype.set_fields = function() {
      Random.__super__.set_fields.apply(this, arguments);
      this.auto_evaluate = true;
      this.rack.addFields({
        inputs: {
          "min": 0,
          "max": 1
        },
        outputs: {
          "out": 0
        }
      });
      return this.rack.add_center_textfield(this.rack.get("out", true));
    };
    Random.prototype.compute = function() {
      this.value = this.rack.get("min").get() + Math.random() * (this.rack.get("max").get() - this.rack.get("min").get());
      return this.rack.set("out", this.value);
    };
    return Random;
  })();
  ThreeNodes.nodes.types.Utils.LFO = (function() {
    __extends(LFO, ThreeNodes.NodeBase);
    function LFO() {
      this.compute = __bind(this.compute, this);
      this.set_fields = __bind(this.set_fields, this);
      LFO.__super__.constructor.apply(this, arguments);
    }
    LFO.prototype.set_fields = function() {
      LFO.__super__.set_fields.apply(this, arguments);
      this.auto_evaluate = true;
      this.rndB = Math.random();
      this.rndA = this.rndB;
      this.rndrange = 1;
      this.flip = 0;
      this.taskinterval = 1;
      this.taskintervalhold = 20;
      this.clock = 0;
      this.PI = 3.14159;
      this.rack.addFields({
        inputs: {
          "min": 0,
          "max": 1,
          "duration": 1000,
          "mode": {
            type: "Float",
            val: 0,
            values: {
              "sawtooth": 0,
              "sine": 1,
              "triangle": 2,
              "square waver": 3,
              "random": 4,
              "random triangle": 5
            }
          }
        },
        outputs: {
          "out": 0
        }
      });
      return this.rack.add_center_textfield(this.rack.get("out", true));
    };
    LFO.prototype.compute = function() {
      var duration, halfway, hi, lfoout, lfout, low, max, min, mode, range, src, srctmp, time;
      duration = this.rack.get("duration").get();
      min = this.rack.get("min").get();
      max = this.rack.get("max").get();
      mode = this.rack.get("mode").get();
      this.clock = Date.now();
      time = (this.taskinterval * this.clock) % duration;
      src = time / duration;
      range = max - min;
      lfoout = 0;
      lfout = (function() {
        switch (mode) {
          case 0:
            return (src * range) + min;
          case 1:
            return (range * Math.sin(src * this.PI)) + min;
          case 2:
            halfway = duration / 2;
            if (time < halfway) {
              return (2 * src * range) + min;
            } else {
              srctmp = (halfway - (time - halfway)) / duration;
              return (2 * srctmp * range) + min;
            }
            break;
          case 3:
            low = time < duration / 2;
            hi = time >= duration / 2;
            return low * min + hi * max;
          case 4:
            if (time >= duration - this.taskinterval) {
              this.rndA = Math.random();
            }
            return (this.rndA * range) + min;
          case 5:
            if (time < this.taskinterval) {
              this.rndA = this.rndB;
              this.rndB = range * Math.random() + min;
              this.rndrange = this.rndB - this.rndA;
            }
            return src * this.rndrange + this.rndA;
        }
      }).call(this);
      return this.rack.set("out", lfout);
    };
    return LFO;
  })();
  ThreeNodes.nodes.types.Utils.Merge = (function() {
    __extends(Merge, ThreeNodes.NodeBase);
    function Merge() {
      this.compute = __bind(this.compute, this);
      this.set_fields = __bind(this.set_fields, this);
      Merge.__super__.constructor.apply(this, arguments);
    }
    Merge.prototype.set_fields = function() {
      Merge.__super__.set_fields.apply(this, arguments);
      this.auto_evaluate = true;
      return this.rack.addFields({
        inputs: {
          "in0": {
            type: "Any",
            val: null
          },
          "in1": {
            type: "Any",
            val: null
          },
          "in2": {
            type: "Any",
            val: null
          },
          "in3": {
            type: "Any",
            val: null
          },
          "in4": {
            type: "Any",
            val: null
          },
          "in5": {
            type: "Any",
            val: null
          }
        },
        outputs: {
          "out": {
            type: "Array",
            val: []
          }
        }
      });
    };
    Merge.prototype.compute = function() {
      var f, k, old, subval;
      old = this.rack.get("out", true).get();
      this.value = [];
      for (f in this.rack.node_fields.inputs) {
        k = this.rack.node_fields.inputs[f];
        if (k.val !== null && k.connections.length > 0) {
          subval = k.val;
          if (jQuery.type(subval) === "array") {
            this.value = this.value.concat(subval);
          } else {
            this.value[this.value.length] = subval;
          }
        }
      }
      return this.rack.set("out", this.value);
    };
    return Merge;
  })();
  ThreeNodes.nodes.types.Utils.Get = (function() {
    __extends(Get, ThreeNodes.NodeBase);
    function Get() {
      this.compute = __bind(this.compute, this);
      this.set_fields = __bind(this.set_fields, this);
      Get.__super__.constructor.apply(this, arguments);
    }
    Get.prototype.set_fields = function() {
      Get.__super__.set_fields.apply(this, arguments);
      return this.rack.addFields({
        inputs: {
          "array": {
            type: "Array",
            val: null
          },
          "index": 0
        },
        outputs: {
          "out": {
            type: "Any",
            val: null
          }
        }
      });
    };
    Get.prototype.compute = function() {
      var arr, ind, old;
      old = this.rack.get("out", true).get();
      this.value = false;
      arr = this.rack.get("array").get();
      ind = parseInt(this.rack.get("index").get());
      if ($.type(arr) === "array") {
        this.value = arr[ind % arr.length];
      }
      if (this.value !== old) {
        return this.rack.set("out", this.value);
      }
    };
    return Get;
  })();
  ThreeNodes.nodes.types.Utils.SoundInput = (function() {
    __extends(SoundInput, ThreeNodes.NodeBase);
    function SoundInput() {
      this.compute = __bind(this.compute, this);
      this.set_fields = __bind(this.set_fields, this);
      SoundInput.__super__.constructor.apply(this, arguments);
    }
    SoundInput.prototype.set_fields = function() {
      SoundInput.__super__.set_fields.apply(this, arguments);
      this.auto_evaluate = true;
      this.counter = 0;
      return this.rack.addFields({
        inputs: {
          "gain": 1.0
        },
        outputs: {
          "low": 0,
          "medium": 0,
          "high": 0
        }
      });
    };
    SoundInput.prototype.compute = function() {
      this.rack.set("low", ThreeNodes.flash_sound_value.kick);
      this.rack.set("medium", ThreeNodes.flash_sound_value.snare);
      return this.rack.set("high", ThreeNodes.flash_sound_value.hat);
    };
    return SoundInput;
  })();
  ThreeNodes.nodes.types.Utils.Mouse = (function() {
    __extends(Mouse, ThreeNodes.NodeBase);
    function Mouse() {
      this.compute = __bind(this.compute, this);
      this.set_fields = __bind(this.set_fields, this);
      Mouse.__super__.constructor.apply(this, arguments);
    }
    Mouse.prototype.set_fields = function() {
      Mouse.__super__.set_fields.apply(this, arguments);
      this.auto_evaluate = true;
      return this.rack.addFields({
        outputs: {
          "xy": {
            type: "Vector2",
            val: new THREE.Vector2()
          },
          "x": 0,
          "y": 0
        }
      });
    };
    Mouse.prototype.compute = function() {
      this.rack.set("xy", new THREE.Vector2(ThreeNodes.mouseX, ThreeNodes.mouseY));
      this.rack.set("x", ThreeNodes.mouseX);
      return this.rack.set("y", ThreeNodes.mouseY);
    };
    return Mouse;
  })();
  return ThreeNodes.nodes.types.Utils.Timer = (function() {
    __extends(Timer, ThreeNodes.NodeBase);
    function Timer() {
      this.compute = __bind(this.compute, this);
      this.get_time = __bind(this.get_time, this);
      this.set_fields = __bind(this.set_fields, this);
      Timer.__super__.constructor.apply(this, arguments);
    }
    Timer.prototype.set_fields = function() {
      Timer.__super__.set_fields.apply(this, arguments);
      this.auto_evaluate = true;
      this.old = this.get_time();
      this.counter = 0;
      this.rack.addFields({
        inputs: {
          "reset": false,
          "pause": false,
          "max": 99999999999
        },
        outputs: {
          "out": 0
        }
      });
      return this.rack.add_center_textfield(this.rack.get("out", true));
    };
    Timer.prototype.get_time = function() {
      return new Date().getTime();
    };
    Timer.prototype.compute = function() {
      var diff, now, oldval;
      oldval = this.rack.get("out", true).get();
      now = this.get_time();
      if (this.rack.get("pause").get() === false) {
        this.counter += now - this.old;
      }
      if (this.rack.get("reset").get() === true) {
        this.counter = 0;
      }
      diff = this.rack.get("max").get() - this.counter;
      if (diff <= 0) {
        this.counter = 0;
      }
      this.old = now;
      return this.rack.set("out", this.counter);
    };
    return Timer;
  })();
});