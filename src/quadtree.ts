/// <reference path="quadtree.d.ts" />

export default class Quadtree {

    nodes: Quadtree[];
    objects: Rect[];
    height2: number;
    width2: number;

    constructor(private bounds: Rect, private maxObjects: number = 10, private maxLevels: number = 4, private level = 0) {
        this.objects = [];
        this.nodes = [];
        this.height2 = this.bounds.height / 2;
        this.width2 = this.bounds.width / 2;
    }

    insert(rect: Rect) {
        let i = 0;
        let indices: number[];

        //if we have subnodes ...
        if (this.nodes[0]) {
            indices = this.getIndex(rect);

            if (indices.length) {
                indices.forEach(i => {
                    this.nodes[i].insert(rect);
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
                    indices.forEach(i => {
                        this.nodes[i].insert(this.objects.splice(i, 1)[0]);
                    });
                } else {
                    i = i + 1;
                }
            }
        }
    }

    retrieve(rect) {
        let indices = this.getIndex(rect);
        let result = this.objects;

        if (this.nodes[0]) {
            if (indices.length) {
                indices.forEach(i => {
                    result = result.concat(this.nodes[i].retrieve(rect));
                });
            } else {
                for (let i = 0; i < this.nodes.length; i++) {
                    result = result.concat(this.nodes[i].retrieve(rect));
                }
            }
        }

        // return unique objects only
        return result.filter((x,n,a) => a.indexOf(x) === n);
    };

    clear() {
        this.objects = [];

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i]) {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    };

    private getIndex(rect: Rect): number[] {
        let index = -1;
        let xmid = this.bounds.x + this.width2;
        let ymid = this.bounds.y + this.height2;
        
        let results = [];

        let top = (rect.y < ymid); // <= ???
        let bottom = (rect.y > ymid);

        if (rect.x < xmid) {
            if (top) {
                // 0 or 1
                results.push(1);
                
                if (rect.x + rect.width > xmid) {
                    results.push(0);
                }

                if (rect.y + rect.height > ymid) {
                    results.push(2);
                }

                // check for quadrant 3 here
                if (rect.y + rect.height + rect.x + rect.width > xmid) {
                    results.push(3);
                }
            } else if (bottom) {
                // 2 or 3
                results.push(2);

                if (rect.x + rect.width > xmid) {
                    results.push(3);
                }
            }

        } else if (rect.x > xmid) {
            if (top) {
                results.push(0);
                if (rect.y + rect.height > ymid) {
                    results.push(3);
                }
            } else {
                results.push(3)
            }
        }

        return results;
    };

    private split() {
        let width = Math.round(this.width2);
        let height = Math.round(this.height2);
        let x = Math.round(this.bounds.x);
        let y = Math.round(this.bounds.y);

        let create = (x, y) => {
            let bounds: Rect = {
                x: x,
                y: y,
                width: width,
                height: height
            };
            return new Quadtree(bounds, this.maxObjects, this.maxLevels, this.level + 1);
        };
        
        // top right, top left, bottom left, bottom right
        this.nodes = [create(x + width, y), create(x, y), create(x, y + height), create(x + width, y + height)];
    };
}