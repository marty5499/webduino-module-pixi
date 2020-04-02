class PIXI_Game {
    constructor(canvas) {
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
        this.app.ticker.add(delta => this.gameLoop(delta));
    }

    join(actor) {
        this.actors[actor.name] = actor;
    }

    gameLoop(delta) {
        for (var key in this.actors) {
            var actor = this.actors[key];
            actor.exec();
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
    constructor(game, name, url, imgX, imgY, width, height) {
        var self = this;
        return new Promise(async (resolve, reject) => {
            try {
                self.game = game;
                self.name = name;
                self.imgURL = url + '#' + name;
                self.imgX = imgX;
                self.imgY = imgY;
                self.width = width;
                self.height = height;
                self.actMoveTo = [];
                self.cbCollision = function (actor) { };
                self.callback = function (sprite) { };
                await self.join();
                //self.sprite.visible = false;
            } catch (ex) {
                return reject(ex);
            }
            resolve(this);
        });
    }

    show() {
        this.sprite.visible = true;
        return this;
    }

    hide() {
        this.sprite.visible = false;
        return this;
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
        this.sprite.texture.frame = new PIXI.Rectangle(0, mType, this.width, this.height);
        return this;
    }

    size(width, height) {
        this.sprite.width = width;
        this.sprite.height = height;
        return this;
    }

    async join() {
        var self = this;
        function createSprite() {
            var texture = PIXI.utils.TextureCache[self.imgURL];
            texture.frame = new PIXI.Rectangle(0, 0, self.width, self.height);
            self.sprite = new PIXI.Sprite(texture);
            var sprite = self.sprite;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.rotation = 0;
            sprite.interactive = true;
            sprite.cursor = 'normal';
            sprite.on('click', (event) => {
                console.log("tap");
            });
            self.game.join(self);
            self.game.app.stage.addChild(self.sprite);
        }

        return new Promise((resolve, reject) => {
            var texture = PIXI.TextureCache[self.imgURL];
            if (typeof texture == 'undefined') {
                PIXI.loader.add(self.imgURL).load(function () {
                    createSprite();
                    resolve(self);
                });
            } else {
                createSprite();
                resolve(self);
            }
        });
    }

    pos(x, y) {
        this.x = this.sprite.x = x;
        this.y = this.sprite.y = y;
        return this;
    }

    start(cb) {
        this.callback = cb;
        return this;
    }

    moveTo(desX, desY, speed) {
        this.actMoveTo.push([desX, desY, speed]);
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

    processMoveTo() {
        var actInfo = this.actMoveTo[0];
        var desX = actInfo[0];
        var desY = actInfo[1];
        var speed = actInfo[2];
        var stepX = 0;
        var stepY = 0;
        if (Math.abs(desX - this.x) < 1) {
            this.x = desX;
        }
        if (Math.abs(desY - this.y) < 1) {
            this.y = desY;
        }
        var xDistance = desX - this.x;
        var yDistance = desY - this.y;
        var stepX = xDistance == 0 ? 0 : Math.abs(xDistance / yDistance);
        var stepY = yDistance == 0 ? 0 : Math.abs(yDistance / xDistance);
        var xSign = xDistance > 0 ? 1 : -1;
        var ySign = yDistance > 0 ? 1 : -1;
        if (stepX > stepY) {
            var newX = this.x + xSign * speed;
            var newY = this.y + ySign * stepY * speed;
        } else {
            var newX = this.x + xSign * stepX * speed;
            var newY = this.y + ySign * speed;
        }
        if (xSign > 0) {
            this.x = newX > desX ? desX : newX;
        } else {
            this.x = newX < desX ? desX : newX;
        }
        if (ySign > 0) {
            this.y = newY > desY ? desY : newY;
        } else {
            this.y = newY < desY ? desY : newY;
        }
        if (Math.abs(this.x - this.sprite.x) > 1 || Math.abs(this.y - this.sprite.y) > 1) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
        }
        if (desX == parseInt(this.x) && desY == parseInt(this.y)) {
            this.actMoveTo.shift();
        }
    }

    exec() {
        if (this.actMoveTo.length > 0) {
            this.processMoveTo();
        }
        this.callback(this.sprite);
        return this;
    }

    run(cb) {
        this.callback = cb;
        return this;
    }

}


