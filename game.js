const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
    x: 100,
    y: 200,
    width: 40,
    height: 40,
    speed: 5,
    health: 100
};

let bullets = [];
let enemies = [];

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function spawnEnemy() {
    enemies.push({
        x: 750,
        y: Math.random() * 460,
        width: 40,
        height: 40,
        speed: 2
    });
}

setInterval(spawnEnemy, 2000);

function shoot() {
    bullets.push({
        x: player.x + 40,
        y: player.y + 20,
        speed: 7
    });
}

setInterval(() => {
    if (document.getElementById("fastAttack").checked) {
        shoot();
    }
}, 100);

document.addEventListener("keydown", e => {
    if (e.key === " ") shoot();
});

function update() {

    let currentSpeed = document.getElementById("speedBoost").checked ? 10 : player.speed;

    if (keys["w"]) player.y -= currentSpeed;
    if (keys["s"]) player.y += currentSpeed;
    if (keys["a"]) player.x -= currentSpeed;
    if (keys["d"]) player.x += currentSpeed;

    bullets.forEach(b => b.x += b.speed);

    enemies.forEach(enemy => {
        enemy.x -= enemy.speed;

        if (
            enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y
        ) {
            if (!document.getElementById("godMode").checked) {
                player.health -= 1;
            }
        }
    });

    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y > enemy.y
            ) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "red";
    enemies.forEach(enemy =>
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
    );

    ctx.fillStyle = "yellow";
    bullets.forEach(bullet =>
        ctx.fillRect(bullet.x, bullet.y, 5, 5)
    );

    ctx.fillStyle = "white";
    ctx.fillText("HP: " + player.health, 10, 20);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
