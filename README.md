# quadtree

A quadtree is very useful for speeding up collision detection in a 2D game. 

Games can potentially have dozens of objects on the screen at a time and checking each one for a collision (every single frame) is just not practical. Why check to see if a rock half away across the screen is going to hit your ship?

The quadtree acts as a first layer in a collision detection system. It takes an array of things your concerned about being hit (i.e your ship) and a list of things that can hit it (i.e. rocks) and returns a list of potential candidates. You can then check these candidates to see if an actual collision has occurred. This speeds things up dramatically.

## Note
Minimally quadtree expects inputs with these properties describing a bounding box

```
interface Box {
    x: number;      // origin
    y: number;      // origin
    width: number;
    height: number;
}
```

The code should be easy enough to change if you have, say:
```
 interface MyShip {
    origin: Point;
    width: number;
    height: number;
 }
```

## Usage

### Constructor
```
const tree = new Quadtree(bounds, maxObjects, maxLevels, level);
```
<code>bounds</code> - bounding box of your game screen

<code>maxObjects</code> - max number of objects allowed into a quadrant before it subdivides (default is 1)

<code>maxLevels</code> - max subvisions (default is 4)

<code>level</code> - depth of tree, always use default which is 1

### Methods
<code>insert(source: Box)</code>

Insert collision source into tree

<code>retrieve(target: Box)</code>

Retrieve collision candidates from the tree based on target

## A Contrived Example

```

// Create new tree at origin (center of the screen) using defaults
const tree = new Quadtree({
            x: 0, 
            y: 0, 
            width: window.innerWidth,   // dimensions of the game screen
            height: window.innerHeight
        });

// check to see if any rocks are about to collide with my ship
rocks.forEach(rock => {
    tree.insert(rock);
});

let candidates = tree.retrieve(ship);

candidates.forEach(x => {
    // *** perform AABB collision test here ***
});

// clear tree before doing next check and check for bullets hitting rocks
tree.clear(); 

rocks.forEach(rock => {
    tree.insert(rock);
});

bullets.forEach(bullet => {
    
    candidates = tree.retrieve(bullet);

    candidates.forEach(x => {
        // *** perform AABB collision test here ***
    });

});

```
## Example
This is a debug render from my Asteroids clone. The collision candidate regarding the ship is boxed in red. Since there are no other objects in the quadrant, it is the only candidate.

Note the area marked "A". As objects enter a quadrant, the quadtree further subdivide (up to <code>maxLevels</code>). If the ship were at position "A", there would still be only 1 candidate - the single rock inside the quadrant.  

![Example](https://raw.githubusercontent.com/jphamilton/quadtree/example.png)

