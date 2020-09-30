var trex

var trex_running

var trex_collided

var ground

var groundImage

var invisibleground

var obstacle1
var obstacle2
var obstacle3
var obstacle4
var obstacle5
var obstacle6

var gameOverImage,restartImage

var jump,die,checkpoint

var score

//create Obstacle and Cloud Groups
var ObstaclesGroup
var CloudsGroup

//initiate Game STATEs
var PLAY
var END
var gameState

localStorage["highestscore"] = 0

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png")
  trex_collided = loadAnimation("trex_collided.png")
  cloudImage = loadImage("cloud.png")
  groundImage = loadImage("ground2.png")
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  jump = loadSound("jump.mp3")
  die = loadSound("die.mp3")
  checkpoint = loadSound("checkPoint.mp3")
}

function setup(){
  createCanvas(600,200)
  trex = createSprite(50,160,40,40)
  trex.scale=0.5
  trex.addAnimation("running",trex_running)
  trex.addAnimation("collided",trex_collided)
  trex.setCollider("circle",0,0,40)
  //trex.debug = true;
  
  ground = createSprite(200,180,400,10)
  ground.addImage(groundImage)
  ground.velocityX = -7 
  ground.x = ground.width / 2 
  
  invisibleground = createSprite(200,185,600,5)
  invisibleground.visible=false;
  
  //create Obstacle and Cloud Groups
ObstaclesGroup = createGroup();
CloudsGroup = createGroup();
  
  //initiate Game STATEs
PLAY = 1;
END = 0;
gameState = PLAY;
  
score = 0;
  
gameOver = createSprite(300,100,10,10);
gameOver.addImage (gameOverImage)
gameOver.visible = false;  
gameOver.scale = 0.8;  
  
restart = createSprite(300,130,10,10);  
restart.addImage(restartImage);
restart.visible = false;  
restart.scale = 0.6;
}

function draw(){
  background("white")
  
  edges = createEdgeSprites();
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -6;
    
     //scoring
  score = score+Math.round(getFrameRate()/60);
  
  if (score > 0 && score % 100 === 0){
  checkpoint.play();
  }  
    
   if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
   //jump when the space key is pressed
  if(keyDown("space") && trex.y >= 155){
    trex.velocityY = -12 ;
    jump.play();
  }
  
  //add gravity
  trex.velocityY = trex.velocityY + 0.8;
    
  
    //spawn the clouds
  spawnClouds();
  
  //spawn obstacles
  spawnObstacles();
  
  if(ObstaclesGroup.isTouching(trex)){
  gameState = END;
  trex.changeAnimation("collided",trex_collided)
  die.play();
  }
  
  }
  
  else if(gameState === END) {
    ground.velocityX = 0;
    
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
     
    gameOver.visible = true;
    restart.visible = true;
    
   if (mousePressedOver(restart)) {
      gameState = PLAY;
      ObstaclesGroup.destroyEach();
      CloudsGroup.destroyEach();
      gameOver.visible = false;
      restart.visible = false;
      
      
      trex.changeAnimation("running",trex_running);
      trex.y = 180;
      
     if (localStorage["highestscore"] < score){
      localStorage["highestscore"]  = score 
      }
     
      score = 0;
    }
  }
  trex.collide(invisibleground);
  
  text("score: " + score,500,50);
  text("Highest Score: " + localStorage["highestscore"], 350,50)
  
  drawSprites();
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
  var clouds = createSprite(600,150,10,10);
  clouds.addImage(cloudImage);
  clouds.scale = 0.5;
  clouds.velocityX = -3;
  trex.depth = clouds.depth+1;
  
  clouds.y = random(80,120);
    clouds.lifetime = 200;

    CloudsGroup.add(clouds);
}
}

function spawnObstacles() {
  //write code here to spawn the clouds
  if (frameCount % 70 === 0) {
    var obstacles = createSprite(600,165,0,0);
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:obstacles.addImage(obstacle1);
        break;
        case 2:obstacles.addImage(obstacle2);
        break;
        case 3:obstacles.addImage(obstacle3);
        break;
        case 4:obstacles.addImage(obstacle4);
        break;
        case 5:obstacles.addImage(obstacle5);
        break;
        case 6:obstacles.addImage(obstacle6);
        break;
        default:break;
    }
    obstacles.scale = 0.5;
    obstacles.velocityX = -7;
    
     //assign lifetime to the variable
    obstacles.lifetime = 100;
  
    ObstaclesGroup.add(obstacles);
  }
  
}
