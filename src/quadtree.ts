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
	 	let index;

	 	//if we have subnodes ...
		if (this.nodes[0]) {
			index = this.getIndex(rect);
	 
		  	if(index !== -1) {
				this.nodes[index].insert(rect);	 
			 	return;
			}
		}
	 
	 	this.objects.push(rect);
		
		if(this.objects.length > this.maxObjects && this.level < this.maxLevels) {
			
			//split if we don't already have subnodes
			if(!this.nodes[0]) {
				this.split();
			}
			
			//add all objects to there corresponding subnodes
			while(i < this.objects.length) {
				
				index = this.getIndex(this.objects[ i ]);
				
				if(index !== -1) {					
					this.nodes[index].insert(this.objects.splice(i, 1)[0]);
				} else {
					i = i + 1;
			 	}
		 	}
		}
	 }

     retrieve(rect) {
		let index = this.getIndex(rect);
		let	result = this.objects;
			
		//if we have subnodes ...
		if (this.nodes[0]) {
			//if rect fits into a subnode ..
			if (index !== -1) {
				result = [...result, ...this.nodes[index].retrieve(rect)];
			//if rect does not fit into a subnode, check it against all subnodes
			} else {
				for (let i=0; i < this.nodes.length; i++) {
					result = [...result, ...this.nodes[i].retrieve(rect)];
				}
			}
		}
	 
		return result;
	};

    clear() {
		this.objects = [];
	 
		for (let i = 0; i < this.nodes.length; i++) {
			if(this.nodes[i]) {
				this.nodes[i].clear();
		  	}
		}

		this.nodes = [];
	};

    private getIndex(rect: Rect) {
        let index = -1;
        let xmid = this.bounds.x + this.width2;
        let ymid = this.bounds.y + this.height2;
    
        // rect can completely fit within the top quadrants
        let top = (rect.y < ymid && rect.y + rect.height < ymid);
        
        // rect can completely fit within the bottom quadrants
        let bottom = (rect.y > ymid);
    
        // rect can completely fit within the left quadrants
        if (rect.x < xmid && rect.x + rect.width < xmid) {
            if(top) {
                index = 1;
            } else if (bottom) {
                index = 2;
            }
    
        // rect can completely fit within the right quadrants 
        } else if (rect.x > xmid) {
            if(top) {
                index = 0;
            } else if (bottom) {
                index = 3;
            }
        }
    
        return index;
    };

    private split() {
        let width = Math.round(this.width2);
        let height  = Math.round(this.height2);
        let x = Math.round(this.bounds.x);
        let y = Math.round(this.bounds.y);  

        let create = (x, y) => {
            let bounds: Rect = { x: x, y: y, width: width, height: height };
            return new Quadtree(bounds, this.maxObjects, this.maxLevels, this.level + 1);
        };

        // top right
        this.nodes[0] = create(x + width, y);
        
        //top left
        this.nodes[1] = create(x, y);

        //bottom left
        this.nodes[2] = create(x, y + height);
        
        //bottom right
        this.nodes[3] = create(x + width, y + height);
    };
}