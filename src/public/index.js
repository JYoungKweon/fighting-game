const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;
const jumpHeight = 17;
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "../public/images/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "../public/images/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 150,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "../public/images/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "../public/images/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "../public/images/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "../public/images/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "../public/images/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "../public/images/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "../public/images/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "../public/images/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 120,
      y: 20,
    },
    width: 138,
    height: 65,
  },
  power: 20,
  movingVelocity: 6,
});

const enemy = new Fighter({
  position: {
    x: 800,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "../public/images/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "../public/images/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "../public/images/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "../public/images/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "../public/images/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "../public/images/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "../public/images/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "../public/images/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -172,
      y: 20,
    },
    width: 138,
    height: 65,
  },
  power: 17,
  movingVelocity: 8,
});

//console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },

  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255,255,255,0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = player.movingVelocity * -1;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = player.movingVelocity;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  //jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = enemy.movingVelocity * -1;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = enemy.movingVelocity;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  //jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // detect for colision && gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    enemy.takeHit(player.power);
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
    console.log("player attack success");
  }

  // if player misses
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  //player get hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    player.takeHit(enemy.power);
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
    console.log("enemy attack success");
  }

  // if player misses
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = jumpHeight * -1;
        break;
      case "s":
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      //enemy keys
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = jumpHeight * -1;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
  //console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
  //enemy
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
  //console.log(event.key);
});
