export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Quadtree {
    readonly bounds: Box;
    private readonly maxObjects: number;
    private readonly maxLevels: number;
    private level = 0;
    private nodes: Quadtree[] = [];
    private objects: Box[] = [];
    private readonly width2: number;
    private readonly height2: number;
    private readonly xmid: number;
    private readonly ymid: number;

    constructor(bounds: Box, maxObjects = 10, maxLevels = 4) {
        this.bounds = bounds;
        this.maxObjects = maxObjects;
        this.maxLevels = maxLevels;
        this.width2 = bounds.width / 2;
        this.height2 = bounds.height / 2;
        this.xmid = bounds.x + this.width2;
        this.ymid = bounds.y + this.height2;
    }

    insert(source: Box): void {
        if (!Quadtree.isValid(source)) {
            return;
        }

        if (this.level === 0 && !Quadtree.intersects(this.bounds, source)) {
            return;
        }

        this.insertValid(source);
    }

    retrieve(target: Box): Box[] {
        if (!Quadtree.isValid(target)) {
            return [];
        }

        if (this.level === 0 && !Quadtree.intersects(this.bounds, target)) {
            return [];
        }

        return this.collect(target);
    }

    clear(): void {
        this.objects = [];

        for (const node of this.nodes) {
            node.clear();
        }

        this.nodes = [];
    }

    private insertValid(source: Box): void {
        if (this.nodes.length) {
            const indices = this.getIndex(source);
            if (indices.length === 1) {
                this.nodes[indices[0]].insertValid(source);
                return;
            }
        }

        this.objects.push(source);

        if (this.objects.length <= this.maxObjects || this.level >= this.maxLevels) {
            return;
        }

        if (!this.nodes.length) {
            this.split();
        }

        let i = 0;
        while (i < this.objects.length) {
            const indices = this.getIndex(this.objects[i]);
            if (indices.length !== 1) {
                i++;
                continue;
            }

            const object = this.objects.splice(i, 1)[0];
            this.nodes[indices[0]].insertValid(object);
        }
    }

    private collect(target: Box): Box[] {
        const result = this.objects.slice();

        if (!this.nodes.length) {
            return result;
        }

        for (const index of this.getIndex(target)) {
            result.push(...this.nodes[index].collect(target));
        }

        return result;
    }

    private getIndex(box: Box): number[] {
        const { xmid, ymid } = this;
        const startIsNorth = box.y < ymid;
        const startIsWest = box.x < xmid;
        const endIsEast = box.x + box.width > xmid;
        const endIsSouth = box.y + box.height > ymid;
        const indices: number[] = [];

        // 0 top-right, 1 top-left, 2 bottom-left, 3 bottom-right
        if (startIsNorth && endIsEast) {
            indices.push(0);
        }
        if (startIsWest && startIsNorth) {
            indices.push(1);
        }
        if (startIsWest && endIsSouth) {
            indices.push(2);
        }
        if (endIsEast && endIsSouth) {
            indices.push(3);
        }

        return indices;
    }

    private split(): void {
        const { x, y, width, height } = this.bounds;
        const { width2, height2 } = this;
        const right = x + width2;
        const bottom = y + height2;
        const rightWidth = width - width2;
        const bottomHeight = height - height2;
        const level = this.level + 1;

        const child = (cx: number, cy: number, cw: number, ch: number) => {
            const node = new Quadtree(
                { x: cx, y: cy, width: cw, height: ch },
                this.maxObjects,
                this.maxLevels,
            );
            node.level = level;
            return node;
        };

        // top right, top left, bottom left, bottom right
        this.nodes = [
            child(right, y, rightWidth, height2),
            child(x, y, width2, height2),
            child(x, bottom, width2, bottomHeight),
            child(right, bottom, rightWidth, bottomHeight),
        ];
    }

    private static isValid(box: Box): boolean {
        return !!box
            && Number.isFinite(box.x)
            && Number.isFinite(box.y)
            && Number.isFinite(box.width)
            && Number.isFinite(box.height)
            && box.width >= 0
            && box.height >= 0;
    }

    private static intersects(a: Box, b: Box): boolean {
        return a.x < b.x + b.width
            && a.x + a.width > b.x
            && a.y < b.y + b.height
            && a.y + a.height > b.y;
    }
}
