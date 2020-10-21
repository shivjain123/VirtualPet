var dog, dogImg, dogImg1;
var database;
var foodS, foodStock;
var foodObj;
var fedTime, lastFed;
var feed, addFood;
var bedRoomImg, washRoomImg, gardenImg, livingRoomImg;
var gameState = "hungry";
var readState;
var curretTime;

//Function to load the images before usage
function preload() {

  dogImg=loadImage("images/dog2.jpg");
  dogHappy=loadImage("images/dogHappy.jpg");
  bedRoom = loadImage("images/BedRoom.png");
  washRoom = loadImage("images/WashRoom.png");
  garden = loadImage("images/Garden.png");
  livingRoom = loadImage("images/LivingRoom.png");
  sadDog = loadImage("images/sadDog.png");

}

//Function to set initial environment
function setup() {
  database = firebase.database();

  createCanvas(1000, 400);

  foodObj = new Food();
  foodStock = database.ref('food');
  foodStock.on("value", readStock);

  dog = createSprite( 800,200,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  textSize(20);

  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });
}

//Function to display the User Interface
function draw() {
  background(0,0,205);

  currentTime = hour();
  if(currentTime == (lastFed + 1)){
     update("playing");
     foodObj.garden();
  }
  else if(currentTime = (lastFed + 2)){
          update("sleeping");
          foodObj.bedroom();
  }
  else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
          update("bathing");
          foodObj.washroom();
  }
  else if(curretTime = (lastFed + 3)){
          update("casual");
          foodObj.livingRoom();
  }
  else{
    update("hungry");
    foodObj.display();
  }

  /*
  if(keyWentDown(UP_ARROW)) {
  writeStock(foodS);
  dog.addImage(dogImg1);
}
*/

if(gameState != "hungry") {
   feed.hide();
   addFood.hide();
   dog.remove();
} else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}

fedTime = database.ref('FeedTime');
fedTime.on("value", function(data) {
  lastFed = data.val();
});

fill(255,255,254);
stroke("black");
textSize(20);

//text("Food remaining : "+ foodS, 140, 200); textSize(15);

if(lastFed >= 12) {
  text("Last Feed : "+ lastFed % 12 + " PM", 350,30);
}
else if(lastFed == 0) {
  text("Last Feed : 12 AM",350,30);
}
else { text("Last Feed : "+ lastFed + " AM", 350,30);
}
drawSprites();
}

//Function to read values from Database
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

/*
//Function to write values in Database
function writeStock(x) {
if(x <= 0) {
x=0;
}-+
else {
x=x-1;
}

database.ref('/').update({
Food:x
})

}
*/

//Function to update food stock and last fed time
function feedDog() {
  dog.addImage(dogHappy);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FoodTime : hour()
  });
}

//Function to add Food in Stock
function addFoods() {
  foodS++
  database.ref('/').update({
    Food : foodS
  });
}

//Function to update the Game State
function update(state){
  database.ref('/').update({
    gameState : state
  })
}