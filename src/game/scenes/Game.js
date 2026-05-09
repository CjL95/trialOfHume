import * as Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.image('rosemary', '/assets/rosemary.png'); //load rosemary image
    }

    collectHerb(player, herb){
            console.log(herb);
            const humorColor = herb.humorColor; // Get the humor color from the herb
            this.playerHumors[humorColor].current = Math.min(this.playerHumors[humorColor].current + 1, this.playerHumors[humorColor].max);
            herb.destroy(); //remove herb when collected
            console.log(this.playerHumors);
    }
    
    spawnHerb(x, y, key, humorColor){
        const herb = this.physics.add.sprite(x, y, key);
        herb.setDisplaySize(50, 50);
        herb.body.setSize(50, 50);
        this.herbs.add(herb);
        herb.humorColor = humorColor; // Store the humor color on the herb for later use
        return herb;
    }

    create ()
    {
        //Map. will set later
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background').setAlpha(0.5);

        EventBus.emit('current-scene-ready', this);

        //Player setup
        this.player = this.add.rectangle(400, 300, 50, 50, 0xff0000); //player character
        this.physics.add.existing(this.player); //add physics to player
        this.player.body.setCollideWorldBounds(true);
        this.playerHumors = {
            red: {
                current: 5,
                max: 10
            },
            yellow: {
                current: 5,
                max: 10
            },
            blue: {
                current: 5,
                max: 10
            },
            black: {
                current: 5,
                max: 10
            } 
        }

        //Herb setup
        this.herbs = this.physics.add.group();

        //Spawn herbs around the map. Will set later
        this.spawnHerb(300, 300, 'rosemary', 'black');

        //Set physics. Will include enemies and hazards later.
        this.physics.add.overlap(
            this.player,
            this.herbs,
            this.collectHerb,
            null,
            this
        );

        
        //Player movement
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        switch (true){
            case this.keys.left.isDown:
                this.player.setVelocityX(-200);
                break;
            case this.keys.right.isDown:
                this.player.setVelocityX(200);
                break;
            case this.keys.up.isDown:
                this.player.setVelocityY(-200);
                break;
            case this.keys.down.isDown:
                this.player.setVelocityY(200);
                break;
        }
        this.speed = 4;
    }

    update() {
        if (this.keys.left.isDown) {
            this.player.x -= this.speed;
        }

        if (this.keys.right.isDown) {
            this.player.x += this.speed;
        }

        if (this.keys.up.isDown) {
            this.player.y -= this.speed;
        }

        if (this.keys.down.isDown) {
            this.player.y += this.speed;
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
