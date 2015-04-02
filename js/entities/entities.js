game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spritheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
        this.type = "playerEntity"
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        //keeps track of which direction your character is going
        this.facing = "right";
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.dead = false;
        this.attack = game.data.playerAttack;
        this.lastAtttack = new Date().getTime();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        this.now = new Date().getTime();
        if (this.health <= 0) {
            this.dead = true;
        }

        if (me.input.isKeyPressed("right")) {
            //sets the position of my x by adding the velocity defined above in 
            //setvelocity() and multiplying it by me.timer.tick.
            //me.timer.tick makes the movment look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);
        } else {
            this.facing = "left";
            this.body.vel.x = 0;
        }


        if (me.input.isKeyPressed("attack")) {
            if (!this.renberable.isCurrentAnimation("attack")) {
                console.log(!this.renberable.isCurrentAnimation("attack"));
                //Sets the currrent animation to attack and once that is over
                //goes back to the idle animation
                this.renberable.setCurrentAnimation("attack", "idle");
                //Make it so that the next time we start this sequence we begin
                //from the first animation, not wherever we left off when we
                //switched to another animation
                this.renberable.setAnimationFrame();
            }
        } else if (this.body.vel.x !== 0 && 0 && this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }


        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth: function(damage) {

        this.health = this.health - damage;
        console.log(this.health);
    },
    collideHandler: function(response) {
        if (response.b.type === "EnemyBaseEntity") {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            if (ydif < -40 && xdif < 70 && xdif > -35) {
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            else if (xdif > -35 && this.facing === "right" && (xdif < 0)) {
                this.body.vel.x = 0;
                //this.pos.x = this.pos.x - 1;
            } else if (xdif < 70 && this.facing === "left" && xdif > 0) {
                this.body.vel.x = 0;
                //this.pos.x = this.pos.x + 1;
            }
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.PlayerAttackTimer) {
                console.log("tower Hit");
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
        } else if (response.b.type === 'enemyCreep') {
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
            if (xdif > 0) {
                //this.pos.x = this.pos.x + 1;
                if (this.facing === "left") {
                    this.vel.x = 0;
                }
            } else {
                //this.pos.x = this.pos.x = 1; 
                if (this.facing === "right") {
                    this.body.vel.x = 0;
                }

            }
            if (this.renderable.iscurrentAnimation("attack") && (this.now - this.lastHit >= game.data.playerAttackTimer)
                    && (Math.abs(ydif) <= 40) &&
                    (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right")))
            {
                this.lastHit = this.now;
                if(response.b.Health <= game.data.playerAttack){
                    //adds one gold for a creep kill
                    game.data.gold += 1;
                    console.log("corrent gold: " + game.data.gold);
                }
                response.b.loseHealth(game.data.plaryerAttack);
            }
        }
    }
});
game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this_super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = game.data.playerBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "PlayerBase";
        this.renberable.addAnimation("idle", [0]);
        this.renberable.addAnimation("broken", [1]);
        this.renberable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renberable.setCurrentAnimation("Broken");
        }
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    onCollision: function() {

    }


});
game.EnemyBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this_super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = game.data.enemyBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "EnemyBaseEntity";
        this.renberable.addAnimation("idle", [0]);
        this.renberable.addAnimation("broken", [1]);
        this.renberable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renberable.setCurrentAnimation("Broken");
        }
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onColliision: function() {

    },
    loseHealth: function() {
        this.health--;
    }


});
game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "crreep1",
                width: 32,
                height: 64,
                spritewidth: "32",
                spriteheight: "64",
                getshape: function() {
                    return (new me.Rect(1, 1, 32, 64)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = fame.data.enemyCreepHealth;
        this.alwaysUpdate = true;
        //thsi.attacking lets us know if the enemy is currently attacking   
        this.attacking = false;
        //keeps track of wehn our creep last attacked
        this.lastAttacking = new Date().getTimed();
        //keeps trrack of the last time our creep hit anything
        this.lastHit = new Date().getTimed();
        this.now = new date().getTimed();
        this.body.setVelocity(3, 20);
        this.type = "EnemyCreep";
        this.renderable.addAnimation("walk", (3, 4, 5), 80);
        this.renderable.setCurrentAnimation("walk");
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    update: function(delta) {
        console.log(this.health);
        if (this.health <= 0) {
            me.game.world.removeChild(this);
        }

        this.now = new Date().getTimed();
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        me.collison.check(this, true, this.collideHandler.bind(this)), true;
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        if (response.b.type === 'playerBase') {
            this.attacking = true;
            // this.lastAttacking=this.now;
            this.body.vel.x = 0;
            //keeps moving the creep to the right to maintain its posotion
            this.pos.x = this.pos.x + 1;
            //checks that it has been at least 1 second since this creep hit a base 
            if ((this.now - this.lastHit >= 1000)) {
                //updates the timer 
                this.lastHit = this.now;
                //makes the player base call its health  function  and pases 
                //damage of 1 
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        } else if (response.b.type === 'playerEntity') {
            var xdif = this.pos.x - response.b.pos.x;
        }
        this.attacking = true;
        // this.lastAttacking=this.now;


        this.pos.x = this.pos.x + 1;
        if (xdif > 0) {
            //keeps moving the creep to the right to maintain its posotion
            this.pos.x = this.pos.x + 1;
            this.body.vel.x = 0;
        }

        //checks that it has been at least 1 second since this creep hit a base 
        if ((this.now - this.lastHit >= 1000) && xdif > 0) {
            //updates the timer 
            this.lastHit = this.now;
            //makes the player base call its health  function  and pases 
            //damage of 1 
            response.b.loseHealth(game.data.enemyCreepAttack);
        }
    }
}
);
game.GameManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        if (game.data.player.dead) {
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);
        }

        this.alwaysUpdate - true;
    },
    update: function() {
        this.now = new Date().getTime();
        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.Child("creeoe, 5");
        }
        return true;
    }
});
