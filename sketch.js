//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var count = 0;
var cloudImage,obs1,obs2,obs3,obs4,obs5,obs6
localStorage["HI"]=0
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var ObstaclesGroup,CloudsGroup
var gameOver,restart,gameOverImage,restartImage
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  obs1 = loadImage("obstacle1.png")
  obs2 = loadImage("obstacle2.png")
  obs3 = loadImage("obstacle3.png")
  obs4 = loadImage("obstacle4.png")
  obs5 = loadImage("obstacle5.png")
  obs6 = loadImage("obstacle6.png")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  //set collision radius for the trex
trex.setCollider("circle",0,0,30);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
 ObstaclesGroup = createGroup();
 CloudsGroup = createGroup();
  
 gameOver = createSprite(300,80);
  gameOver.addImage(gameOverImage)
 restart = createSprite(300,120);
  restart.addImage(restartImage)
  gameOver.visible = false;
restart.visible = false;
gameOver.scale = 0.5;
  restart.scale = 0.7;
//set text
textSize(18);
textFont("Georgia");
textStyle(BOLD);

//score
 count = 0;
}

function draw() {
  background(180);
   text("Score: "+ count, 300, 50);
   text("HI:"+localStorage["HI"],100,50)
  if(gameState === PLAY){
    if(keyDown("space")&&trex.y>132) {
      trex.velocityY=-7
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count+ Math.round(World.frameRate/50);
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
    }
  }
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    if(count>localStorage["HI"]){
      localStorage["HI"]=count
    }
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)&& gameState === END) {
    reset();
  }
  
  
  trex.collide(invisibleGround);
  drawSprites();
}
function reset(){
  count = 0
  gameState = PLAY;
  ObstaclesGroup.destroyEach()
  CloudsGroup.destroyEach()
  gameOver.visible = false
  restart.visible = false
}
function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,175,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obs1)
        break;
      case 2:obstacle.addImage(obs2)
        break;
      case 3:obstacle.addImage(obs3)
        break;
      case 4:obstacle.addImage(obs4)
        break;
      case 5:obstacle.addImage(obs5)
        break;
      case 6:obstacle.addImage(obs6)
        break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    ObstaclesGroup.add(obstacle)
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    CloudsGroup.add(cloud)
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
  }
  
}
