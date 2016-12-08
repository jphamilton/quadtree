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
	        var _this = this;
	        var i = 0;
	        var indices;
	        if (this.nodes[0]) {
	            indices = this.getIndex(rect);
	            if (indices.length) {
	                indices.forEach(function (i) {
	                    _this.nodes[i].insert(rect);
	                });
	                return;
	            }
	        }
	        this.objects.push(rect);
	        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
	            if (!this.nodes[0]) {
	                this.split();
	            }
	            while (i < this.objects.length) {
	                indices = this.getIndex(this.objects[i]);
	                if (indices.length) {
	                    indices.forEach(function (i) {
	                        _this.nodes[i].insert(_this.objects.splice(i, 1)[0]);
	                    });
	                }
	                else {
	                    i = i + 1;
	                }
	            }
	        }
	    };
	    Quadtree.prototype.retrieve = function (rect) {
	        var _this = this;
	        var indices = this.getIndex(rect);
	        var result = this.objects;
	        if (this.nodes[0]) {
	            if (indices.length) {
	                indices.forEach(function (i) {
	                    result = result.concat(_this.nodes[i].retrieve(rect));
	                });
	            }
	            else {
	                for (var i = 0; i < this.nodes.length; i++) {
	                    result = result.concat(this.nodes[i].retrieve(rect));
	                }
	            }
	        }
	        return result.filter(function (x, n, a) { return a.indexOf(x) === n; });
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
	        var results = [];
	        var top = (rect.y < ymid);
	        var bottom = (rect.y > ymid);
	        if (rect.x < xmid) {
	            if (top) {
	                results.push(1);
	                if (rect.x + rect.width > xmid) {
	                    results.push(0);
	                }
	                if (rect.y + rect.height > ymid) {
	                    results.push(2);
	                }
	                if (rect.y + rect.height + rect.x + rect.width > xmid) {
	                    results.push(3);
	                }
	            }
	            else if (bottom) {
	                results.push(2);
	                if (rect.x + rect.width > xmid) {
	                    results.push(3);
	                }
	            }
	        }
	        else if (rect.x > xmid) {
	            if (top) {
	                results.push(0);
	                if (rect.y + rect.height > ymid) {
	                    results.push(3);
	                }
	            }
	            else {
	                results.push(3);
	            }
	        }
	        return results;
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