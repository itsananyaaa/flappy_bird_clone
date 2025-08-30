let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade:{
            gravity: {y:300},
        debug: false
    }
},
scene: {
    preload: preload,
    create: create,
    update: update
}
};

let game =new Phaser.Game(config);

function preload(){
    this.load.image('background', 'assets/background.png');
    this.load.image('road', 'assets/road.png');
    this.load.image('column', 'assets/column.png');
    this.load.spritesheet('bird', 'assets/bird.png', {frameWidth: 64, frameHeight: 96});
}


let bird;
let hasLanded = false;
let cursors;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;

let restartKey;
function create(){
    const background = this.add.image(0, 0, 'background').setOrigin(0,0);
    messageToPlayer = this.add.text(400, 580, `Instructions: Press space bar to start`, { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" }).setOrigin(0.5, 1).setDepth(1000);

   
    const topColumns = this.physics.add.staticGroup({
       key: 'column',
       repeat: 1,
       setXY: { x: 200, y: 0, stepX: 300 }
    });

    const bottomColumns = this.physics.add.staticGroup({
       key: 'column',
       repeat: 1,
       setXY: { x: 350, y: 568 - 200 - 10, stepX: 300 },
    });

    const roads = this.physics.add.staticGroup();
    const road = roads.create(400, 568, 'road').setScale(2).refreshBody();
    

    bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);
    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road);

    cursors = this.input.keyboard.createCursorKeys();
    
    this.physics.add.overlap(bird, topColumns, ()=>hasBumped=true,null, this);
    this.physics.add.overlap(bird, bottomColumns, ()=>hasBumped=true,null, this);
    this.physics.add.collider(bird, topColumns);
    this.physics.add.collider(bird, bottomColumns);

    restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
}


function update(){
   if (Phaser.Input.Keyboard.JustDown(restartKey)) {
        restartGame(this);
    }

   if (!isGameStarted && Phaser.Input.Keyboard.JustDown(cursors.space)) {
    isGameStarted = true;
    messageToPlayer.setText('Press UP to flap. Avoid columns and ground!');
}

   if (!isGameStarted) {
    bird.setVelocity(0, 0);
    return;
}
    if (!hasLanded && !hasBumped) {
    bird.setVelocityX(50);

    if (cursors.up.isDown) {
        bird.setVelocityY(-160);
    }
}
   if (hasLanded || hasBumped) {
    bird.setVelocityX(0);
    messageToPlayer.setText('Oh no! You crashed! Press R to restart.');
}

  
  if (bird.x > 750) {
    bird.setVelocityY(40);
    messageToPlayer.text = `Congrats! You won! Press R to play again.`;
  } 
  
}

function restartGame(scene) {
   
    bird.setPosition(0, 50);
    bird.setVelocity(0, 0);
 
    hasLanded = false;
    hasBumped = false;
    isGameStarted = false;

    messageToPlayer.setText('Instructions: Press space bar to start');

}


