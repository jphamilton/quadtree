/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	var Quadtree = (function () {
	    function Quadtree(bounds, maxObjects, maxLevels, level) {
	        if (maxObjects === void 0) { maxObjects = 10; }
	        if (maxLevels === void 0) { maxLevels = 4; }
	        if (level === void 0) { level = 0; }
	        this.bounds = bounds;
	        this.maxObjects = maxObjects;
	        this.maxLevels = maxLevels;
	        this.level = level;
	        this.objects = [];
	        this.nodes = [];
	        this.height2 = this.bounds.height / 2;
	        this.width2 = this.bounds.width / 2;
	    }
	    Quadtree.prototype.insert = function (rect) {
	        var i = 0;
	        var index;
	        if (this.nodes[0]) {
	            index = this.getIndex(rect);
	            if (index !== -1) {
	                this.nodes[index].insert(rect);
	                return;
	            }
	        }
	        this.objects.push(rect);
	        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
	            if (!this.nodes[0]) {
	                this.split();
	            }
	            while (i < this.objects.length) {
	                index = this.getIndex(this.objects[i]);
	                if (index !== -1) {
	                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
	                }
	                else {
	                    i = i + 1;
	                }
	            }
	        }
	    };
	    Quadtree.prototype.retrieve = function (rect) {
	        var index = this.getIndex(rect);
	        var result = this.objects;
	        if (this.nodes[0]) {
	            if (index !== -1) {
	                result = result.concat(this.nodes[index].retrieve(rect));
	            }
	            else {
	                for (var i = 0; i < this.nodes.length; i++) {
	                    result = result.concat(this.nodes[i].retrieve(rect));
	                }
	            }
	        }
	        return result;
	    };
	    ;
	    Quadtree.prototype.clear = function () {
	        this.objects = [];
	        for (var i = 0; i < this.nodes.length; i++) {
	            if (this.nodes[i]) {
	                this.nodes[i].clear();
	            }
	        }
	        this.nodes = [];
	    };
	    ;
	    Quadtree.prototype.getIndex = function (rect) {
	        var index = -1;
	        var xmid = this.bounds.x + this.width2;
	        var ymid = this.bounds.y + this.height2;
	        var top = (rect.y < ymid && rect.y + rect.height < ymid);
	        var bottom = (rect.y > ymid);
	        if (rect.x < xmid && rect.x + rect.width < xmid) {
	            if (top) {
	                index = 1;
	            }
	            else if (bottom) {
	                index = 2;
	            }
	        }
	        else if (rect.x > xmid) {
	            if (top) {
	                index = 0;
	            }
	            else if (bottom) {
	                index = 3;
	            }
	        }
	        return index;
	    };
	    ;
	    Quadtree.prototype.split = function () {
	        var _this = this;
	        var width = Math.round(this.width2);
	        var height = Math.round(this.height2);
	        var x = Math.round(this.bounds.x);
	        var y = Math.round(this.bounds.y);
	        var create = function (x, y) {
	            var bounds = {
	                x: x,
	                y: y,
	                width: width,
	                height: height
	            };
	            return new Quadtree(bounds, _this.maxObjects, _this.maxLevels, _this.level + 1);
	        };
	        this.nodes = [create(x + width, y), create(x, y), create(x, y + height), create(x + width, y + height)];
	    };
	    ;
	    return Quadtree;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Quadtree;


/***/ }
/******/ ]);