game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title-screen'))); // TODO
                
                me.input.bindKey(me.input.KEY.ENTER, "start");
	
                me.game.world.addChild(new (me.renderable.extend({
                    init: function(){
                   this._super(me.renderable, 'init', [510, 30, me.game.viewport.width, me.game.viewport.height]);                   
                   this.font = new me. font("arial", 46, "white");
                    
                    },
                    
                    draw: function(){
                        this.font.draw(renderer.getContext(), "awesomenauts!, 450,130");
                        this.font.draw(renderer.getContext(), "press ENTER to play!", 250,530);
                        
                    }
                })));
                this.handler = me.event.subscribe(me.event.KEYDOWN, function (action,keycode,edge){
                    if(action === "start"){
                        me.state.change(me.state.PLAY);
                    }
                });
        
        },
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ENTER);//todo
                me.event.unsubscribe(this.handler);
        }
});
