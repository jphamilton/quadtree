import test from "node:test";
import assert from "node:assert/strict";
import { Quadtree } from "../dist/quadtree.js";

function overlaps(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x
        && a.y < b.y + b.height && a.y + a.height > b.y;
}

test("finds overlapping boxes and skips separated ones", () => {
    const tree = new Quadtree({ x: 0, y: 0, width: 100, height: 100 }, 1, 4);
    const left = { x: 10, y: 10, width: 10, height: 10 };
    const overlap = { x: 15, y: 15, width: 10, height: 10 };
    const right = { x: 80, y: 80, width: 5, height: 5 };
    tree.insert(left);
    tree.insert(overlap);
    tree.insert(right);

    const found = tree.retrieve(left);
    assert.ok(found.includes(left));
    assert.ok(found.includes(overlap));
    assert.equal(found.includes(right), false);
});

test("a box that starts on the midline is not a candidate for the other side", () => {
    const tree = new Quadtree({ x: 0, y: 0, width: 100, height: 100 }, 1, 4);
    const onLine = { x: 50, y: 10, width: 10, height: 10 };
    const left = { x: 10, y: 10, width: 10, height: 10 };
    tree.insert(onLine);
    tree.insert(left);

    const found = tree.retrieve({ x: 5, y: 5, width: 20, height: 20 });
    assert.ok(found.includes(left));
    assert.equal(found.includes(onLine), false);
    assert.ok(tree.retrieve(onLine).includes(onLine));
});

test("odd bounds still report a real overlap across the midline", () => {
    const tree = new Quadtree({ x: 0, y: 0, width: 5, height: 5 }, 1, 4);
    const left = { x: 2.2, y: 1, width: 0.5, height: 0.4 };
    const right = { x: 2.6, y: 1, width: 0.4, height: 0.4 };
    tree.insert(left);
    tree.insert(right);

    assert.ok(tree.retrieve(left).includes(right));
    assert.ok(tree.retrieve(right).includes(left));
});

test("ignores invalid boxes and boxes outside the root", () => {
    const tree = new Quadtree({ x: 0, y: 0, width: 100, height: 100 });
    const inside = { x: 10, y: 10, width: 10, height: 10 };
    tree.insert(inside);
    tree.insert(null);
    tree.insert({ x: -50, y: 10, width: 10, height: 10 });
    tree.insert({ x: 100, y: 10, width: 10, height: 10 });
    tree.insert({ x: NaN, y: 0, width: 1, height: 1 });
    tree.insert({ x: 40, y: 40, width: -10, height: 10 });

    assert.deepEqual(tree.retrieve(inside), [inside]);
    assert.deepEqual(tree.retrieve({ x: -10, y: 0, width: 5, height: 5 }), []);
});

test("a covering box stays visible to every quadrant", () => {
    const tree = new Quadtree({ x: 0, y: 0, width: 100, height: 100 }, 1, 4);
    const cover = { x: 0, y: 0, width: 100, height: 100 };
    const tiny = { x: 1, y: 1, width: 1, height: 1 };
    tree.insert(cover);
    tree.insert(tiny);

    assert.ok(tree.retrieve(tiny).includes(cover));
    const corner = tree.retrieve({ x: 90, y: 90, width: 5, height: 5 });
    assert.ok(corner.includes(cover));
    assert.equal(corner.includes(tiny), false);
});

test("clear drops previously inserted boxes", () => {
    const tree = new Quadtree({ x: 0, y: 0, width: 100, height: 100 });
    const box = { x: 10, y: 10, width: 10, height: 10 };
    tree.insert(box);
    tree.clear();
    assert.deepEqual(tree.retrieve(box), []);
});

test("reports every real overlap after subdivision", () => {
    const tree = new Quadtree({ x: 0, y: 0, width: 100, height: 100 }, 2, 6);
    const boxes = [];
    for (let i = 0; i < 80; i++) {
        const box = {
            x: (i * 17) % 90,
            y: (i * 13) % 90,
            width: 3 + (i % 5),
            height: 3 + (i % 4),
        };
        boxes.push(box);
        tree.insert(box);
    }

    for (const box of boxes) {
        const candidates = new Set(tree.retrieve(box));
        for (const other of boxes) {
            if (overlaps(box, other)) {
                assert.ok(candidates.has(other));
            }
        }
    }
});
