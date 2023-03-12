///<reference path='quadtree.d.ts' />

export class Quadtree {

    nodes: Quadtree[];
    objects: Box[];
    width2: number;
    height2: number;
    xmid: number;
    ymid: number;

    constructor(public bounds: Box, private maxObjects: number = 10, private maxLevels: number = 4, private level = 0) {
        this.objects = [];
        this.nodes = [];
        this.width2 = this.bounds.width / 2;
        this.height2 = this.bounds.height / 2;
        this.xmid = this.bounds.x + this.width2;
        this.ymid = this.bounds.y + this.height2;
    }

    insert(source: Box) {
        if (!source) {
            return;
        }
        
        let i = 0;
        let indices: number[];

        if (this.nodes.length) {
            indices = this.getIndex(source);

            if (indices.length) {
                indices.forEach(i => {
                    this.nodes[i].insert(source);
                });
                return;
            }
        }

        this.objects.push(source);

        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (!this.nodes.length) {
                this.split();
            }

            while (i < this.objects.length) {
                indices = this.getIndex(this.objects[i]);

                if (indices.length) {
                    let object = this.objects.splice(i, 1)[0];
                    indices.forEach(n => {
                        this.nodes[n].insert(object);
                    });
                } else {
                    i = i + 1;
                }
            }
        }
    }

    retrieve(target: Box) {
        if (!target) {
            return [];
        }
        
        let indices = this.getIndex(target);
        let result = this.objects;

        if (this.nodes.length) {
            if (indices.length) {
                indices.forEach(i => {
                    result = result.concat(this.nodes[i].retrieve(target));
                });
            } else {
                for (let i = 0; i < this.nodes.length; i++) {
                    result = result.concat(this.nodes[i].retrieve(target));
                }
            }
        }

        return result.filter((x, n, a) => a.indexOf(x) === n);
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

    private getIndex(box: Box): number[] {
        if (!box) {
            return [];
        }
        
        const results = [];
        const { xmid, ymid } = this;
        const top = (box.y <= ymid); 
        const bottom = (box.y > ymid);

        if (box.x <= xmid) {
            if (top) {
                results.push(1);
                let zero = false;

                if (box.x + box.width > xmid) {
                    results.push(0);
                    zero = true;
                }

                if (box.y + box.height > ymid) {
                    results.push(2);
                    if (zero) {
                        results.push(3);
                    }
                }
            } else if (bottom) {
                results.push(2);

                if (box.x + box.width > xmid) {
                    results.push(3);
                }
            }

        } else if (box.x > xmid) {
            if (top) {
                results.push(0);
                if (box.y + box.height > ymid) {
                    results.push(3);
                }
            } else {
                results.push(3)
            }
        }

        return results;
    };

    private split() {
        const width = Math.round(this.width2);
        const height = Math.round(this.height2);
        const x = Math.round(this.bounds.x);
        const y = Math.round(this.bounds.y);

        const create = (x: number, y: number) => {
            const bounds: Box = {
                x,
                y,
                width,
                height
            };
            return new Quadtree(bounds, this.maxObjects, this.maxLevels, this.level + 1);
        };

        // top right, top left, bottom left, bottom right
        this.nodes = [create(x + width, y), create(x, y), create(x, y + height), create(x + width, y + height)];
    };
}