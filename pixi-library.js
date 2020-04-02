class PIXI_Game {
    constructor(cbSetup, res, canvas) {
        this.actors = {};
        this.app = new PIXI.Application({
            width: canvas.width,
            height: canvas.height,
            antialiasing: true,
            transparent: true,
            resolution: 1,
            view: canvas
        }
        );
        this.loader = PIXI.loader;
        this.loader.add(res).load(cbSetup);
        this.app.ticker.add(delta => this.gameLoop(delta));
    }

    async start(cb) {
        var self = this;
        return new Promise((resolve, reject) => {
          self.onCanvas(function () {
            self.onCanvasCallbackList.pop();
            resolve("ready2go");
          });
        });
      }    

    join(actor) {
        this.actors[actor.name] = actor;
    }

    gameLoop(delta) {
        for (var key in this.actors) {
            var actor = this.actors[key];
            actor.run();
            actor.isCollision = false;
            for (var key2 in this.actors) {
                var actor2 = this.actors[key2];
                if (actor.name != actor2.name) {
                    if (this.hitTestRectangle(actor.sprite, actor2.sprite)) {
                        actor.isCollision = true;
                        actor2.isCollision = true;
                        actor.cbCollision(actor, actor2);
                        actor2.cbCollision(actor2, actor);
                    }
                }
            }
        }
    }

    hitTestRectangle(r1, r2) {
        //Define the variables we'll need to calculate
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        //hit will determine whether there's a collision
        hit = false;

        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {
            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {
                //There's definitely a collision happening
                hit = true;
            } else {
                //There's no collision on the y axis
                hit = false;
            }
        } else {
            //There's no collision on the x axis
            hit = false;
        }
        //`hit` will be either `true` or `false`
        return hit;
    };
}


class PIXI_Monster {
    constructor(name, game, key, width, height) {
        this.name = name;
        let texture = PIXI.TextureCache[key];
        texture.frame = new PIXI.Rectangle(0, 0/*type*/, 200, 200);
        this.sprite = new PIXI.Sprite(texture);
        this.game = game;
        this.type(0);
        var sprite = this.sprite;
        sprite.width = 50;
        sprite.height = 50;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.rotation = 0;
        sprite.interactive = true;
        sprite.cursor = 'normal';
        sprite.on('click', (event) => {
            console.log("tap");
        });
        this.cbCollision = function (actor) { };
        this.callback = function (sprite) { };
    }

    collision(cb) {
        this.cbCollision = cb;
    }

    type(n) {
        var mType = 0;
        switch (n) {
            case 0:
                mType = 200;
                break;
            case 1:
                mType = 400;
                break;
            case 2:
                mType = 600;
                break;
            case 3:
                mType = 800;
                break;

        }
        this.sprite.texture.frame = new PIXI.Rectangle(0, mType, 200, 200);
        return this;
    }

    join() {
        this.game.app.stage.addChild(this.sprite);
        this.game.join(this);
        return this;
    }

    pos(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
        return this;
    }
    start(cb) {
        this.callback = cb;
        return this;
    }

    rotate(rotate, anchorX, anchorY) {
        if (arguments.length == 1) {
            this.sprite.rotation = rotate;
            return;
        }
        this.sprite.anchor.x = anchorX;
        this.sprite.anchor.y = anchorY;
        return this;
    }

    run() {
        this.callback(this.sprite);
    }

}


