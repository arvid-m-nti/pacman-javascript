// Canvas och context
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
// Klasser
class Wall
{   
    constructor({position})
    {
        this.position = position
        this.width = 20
        this.height = 20
    }
    draw()
    {
        ctx.fillStyle = 'darkblue'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
class Player
{
    constructor({position, speed})
    {
        this.position = position
        this.speed = speed
        this.radius = 10-1/1000000
    }
    draw()
    {
        // Skapar spelaren som en cirkel
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = 'yellow'
        ctx.fill()
        ctx.closePath()
    }
    update()
    {
        // Spelaren flyttar med dess hastighet
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}
class Ghost
{
    constructor({position, speed, color})
    {
        this.position = position
        this.speed = speed
        this.color = color
        this.radius = 10-1/1000000
    }
    draw()
    {
        // Skapar spöket som en cirkel
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }
    update()
    { 
        // Spöken flyttar med dess hastighet
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}
class Pellet
{
    constructor({position})
    {
        this.position = position
        this.width = 3
        this.height = 3
    }
    draw()
    {
        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
class Energizer
{
    constructor({position})
    {
        this.position = position
        this.radius = 5
    }
    draw()
    {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.closePath()
    }
}
// Skriver ut scoreboard, antal liv och game over
function drawScore() 
{
    ctx.font = '16px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText('Score: ' + score, canvas.width/2-160, canvas.height-50)
}
function drawLives()
{
    ctx.font = '16px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText('Lives: ' + lives, 50, canvas.height-50)
}
function drawWinLoss()
{
    ctx.font = '16 px Arial'
    ctx.fillStyle = 'red'
    ctx.fillText(gameOverText, canvas.width/2-150, 3/2*20+20*11+5)
}
// Konstanter och variabler
const playerSpeed = 2
const ghostSpeed = 2
const firstPlayerPosX = 3/2*20+20*10
const firstPlayerPosY = 3/2*20+20*15
var walls = []
var pellets = []
var energizers = []
var ghosts = []
var gameOverText
var score = 0
var lives = 3
var playerDirection
var ghostDirection
var isGameOver = true
// Karta
const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', 'e', '-', '-', '-', '.', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '.', '-', '-', '-', 'e', '-'],
    ['-', '.', '-', '-', '-', '.', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '.', '-', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '-'],
    ['-', '-', '-', '-', '-', '.', '-', '-', '-', '-', ' ', '-', ' ', '-', '-', '-', '-', '.', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '.', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', '.', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '.', '-', ' ', '-', '-', '-', ' ', '-', '-', '-', ' ', '-', '.', '-', '-', '-', '-', '-'],
    [' ', ' ', ' ', ' ', ' ', '.', ' ', ' ', '-', '-', ' ', ' ', ' ', '-', '-', ' ', ' ', '.', ' ', ' ', ' ', ' ', ' '],
    ['-', '-', '-', '-', '-', '.', '-', ' ', '-', '-', '-', '-', '-', '-', '-', ' ', '-', '.', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '.', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', '.', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '.', '-', ' ', '-', '-', '-', '-', '-', '-', '-', ' ', '-', '.', '-', '-', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '-', '.', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '.', '-', '-', '-', '.', '-'],
    ['-', 'e', '.', '.', '-', '.', '.', '.', '.', '.', 'a', ' ', 'a', '.', '.', '.', '.', '.', '-', '.', '.', 'e', '-'],
    ['-', '-', '-', '.', '-', '.', '-', '.', '-', '-', '-', '-', '-', '-', '-', '.', '-', '.', '-', '.', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '-', '-', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '-', '-', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
]
// Spelare: startposition och starthastighet
const player = new Player(
    {
        position: 
        {
            x: firstPlayerPosX,
            y: firstPlayerPosY
        },
        speed:
        {
            x: 0,
            y: 0
        }
})
// Funktion för när en cirkel kolliderar med rektangel
function rectCircleCollision({circle, rectangle})
{
    return (circle.position.y - circle.radius + circle.speed.y <= rectangle.position.y + rectangle.height &&
        circle.position.x + circle.radius + circle.speed.x >= rectangle.position.x &&
        circle.position.y + circle.radius + circle.speed.y >= rectangle.position.y &&
        circle.position.x - circle.radius + circle.speed.x <= rectangle.position.x + rectangle.width)
}
// Funktion för när två cirklar kolliderar
function circleCircleCollision({circle1, circle2})
{
    return(circle1.position.y - circle1.radius + circle1.speed.y <= circle2.position.y + circle2.radius &&
        circle1.position.x + circle1.radius + circle1.speed.x >= circle2.position.x - circle2.radius &&
        circle1.position.y + circle1.radius + circle1.speed.y >= circle2.position.y - circle2.radius &&
        circle1.position.x - circle1.radius + circle1.speed.x <= circle2.position.x + circle2.radius)
}
// Funktion för att vänta i X antal millisekunder
function wait(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms))
}
// Ställer om alla värden förutom poäng och liv
function resetGame()
{
    isGameOver = false
    gameOverText = ''
    walls = []
    pellets = []
    energizers = []
    player.speed.x = 0
    player.speed.y = 0
    player.position.x = firstPlayerPosX
    player.position.y = firstPlayerPosY
    playerDirection = ''
    ghostDirection = Math.floor(Math.random() * 4)
    // forEach funktion som flyttar in alla väggar, pellets och energizer i spelet
    map.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch(symbol)
            {
                case '-':
                    walls.push(
                        new Wall({
                        position: {  
                            x: j*20, 
                            y: i*20 }   
                        }))
                    break
                
                case '.':
                    pellets.push(
                        new Pellet({
                            position: {
                                x: j*20+8,
                                y: i*20+8
                            }
                        })
                    )
                    break

                case 'e':
                    energizers.push(
                        new Energizer({
                            position: {
                                x: j*20+10,
                                y: i*20+10
                            }    
                        })
                    )
                    break           
    }})})
    // Spöken (röd, rosa, orange och blå): startposition, starthastighet och färg
    ghosts = [
        new Ghost({
            position: 
            {
                x: 3/2*20+20*10,
                y: 3/2*20+20*7
            },
            speed:
            {   
                x: 0,
                y: 0
            } ,
            color: 'red'
        }),
        new Ghost({
            position: 
            {
                x: 3/2*20+20*9,
                y: 3/2*20+20*9
            },
            speed:
            {   
                x: 0,
                y: 0
            },
            color: 'lightblue'
        }),
        new Ghost({
            position: 
            {
                x: 3/2*20+20*10,
                y: 3/2*20+20*9
            },
            speed:
            {   
                x: 0,
                y: 0
            } ,
            color: 'pink'
        }),
        new Ghost({
            position: 
            {
                x: 3/2*20+20*11,
                y: 3/2*20+20*9
            },
            speed:
            {   
                x: 0,
                y: 0
            } ,
            color: 'orange'
    })]
}
// Animering
function animate()
{
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(isGameOver)
    {
        resetGame()
    }
    // Kontroller
    switch(playerDirection)
    {
        case 'up':
            player.speed.x = 0
            player.speed.y = -playerSpeed
            break
        case 'left':
            player.speed.x = -playerSpeed
            player.speed.y = 0
            break
        case 'down':
            player.speed.x = 0
            player.speed.y = playerSpeed
            break
        case 'right':
            player.speed.x = playerSpeed
            player.speed.y = 0
            break
    }
    // forEach funktion som ritar ut väggar
    walls.forEach((wall) => {
        wall.draw()
        // Spelarkollision med vägg
        if(rectCircleCollision({circle: player, rectangle: wall}))
        {
            player.speed.x = 0
            player.speed.y = 0
        }
        // Teleportation i tunneln vid sidorna
        if(player.position.x <= 0 &&
            player.position.y <= wall.width*11 &&
            player.position.y >= wall.width*10)
        {
            player.position.x = wall.width*23
        }
        else if(player.position.x >= wall.width*23 &&
            player.position.y <= wall.width*11 &&
            player.position.y >= wall.width*10)
        {
            player.position.x = 0
        }
    })
    // forEach funktion som ritar ut pellets
    pellets.forEach((pellet) => {
        pellet.draw()
        // Kollision mellan spelare och pellet 
        if(rectCircleCollision({circle: player, rectangle: pellet}))
        {
            // Tar bort pellet och lägger till 10 poäng
            const index = pellets.indexOf(pellet)
            pellets.splice(index,1)
            score += 10
        }
    })
    // forEach funktion som ritar ut energizers
    energizers.forEach((energizer) => {
        energizer.draw()
        // Kollision mellan spelare och energizer
        if(circleCircleCollision({circle1: player, circle2: energizer}))
        {
            const index = energizers.indexOf(energizer)
            energizers.splice(index,1)
            score += 50
            ghosts.forEach((ghost) => {
                ghost.color = 'blue'
            })
            wait(10000).then(() => {
                ghosts[0].color = 'red'
                ghosts[1].color = 'lightblue'
                ghosts[2].color = 'pink'
                ghosts[3].color = 'orange'
            })
        }
    })
    // forEach funktion som ritar ut och uppdaterar ghosts
    ghosts.forEach((ghost) => {
        ghost.update()
        switch(ghostDirection)
        {
            case 0: 
                for(let i = 0; i < walls.length; i++)
                {
                    const wall = walls[i]
                    if(rectCircleCollision({circle: {...ghost, speed: {x: 0, y: -ghostSpeed}}, rectangle: wall}) && ghostDirection == 0)
                    {
                        ghost.speed.y = 0
                        ghostDirection = Math.floor(Math.random() * 4)
                        break
                    }
                    else
                    {
                        ghost.speed.y = -ghostSpeed
                        ghost.speed.x = 0
                    }
                }
                break
            case 1:
                for(let i = 0; i < walls.length; i++)
                {
                    const wall = walls[i]
                    if(rectCircleCollision({circle: {...ghost, speed: {x: -ghostSpeed, y: 0}}, rectangle: wall}) && ghostDirection == 1)
                    {
                        ghost.speed.x = 0
                        ghostDirection = Math.floor(Math.random() * 4)
                        break
                    }
                    else
                    {
                        ghost.speed.x = -ghostSpeed
                        ghost.speed.y = 0
                    }
                }
                break
            case 2: 
                for(let i = 0; i < walls.length; i++)
                {
                    const wall = walls[i]
                    if(rectCircleCollision({circle: {...ghost, speed: {x: 0, y: ghostSpeed}}, rectangle: wall}) && ghostDirection == 2)
                    {
                        ghost.speed.y = 0
                        ghostDirection = Math.floor(Math.random() * 4)
                        break
                    }
                    else
                    {
                        ghost.speed.y = ghostSpeed
                        ghost.speed.x = 0
                    }
                }
                break
            case 3: 
                for(let i = 0; i < walls.length; i++)
                {
                    const wall = walls[i]
                    if(rectCircleCollision({circle: {...ghost, speed: {x: ghostSpeed, y: 0}}, rectangle: wall}) && ghostDirection == 3)
                    {
                        ghost.speed.x = 0
                        ghostDirection = Math.floor(Math.random() * 4)                        
                        break
                    }
                    else
                    {
                        ghost.speed.x = ghostSpeed
                        ghost.speed.y = 0
                    }
                }
                break
        }
        walls.forEach((wall) => {
            if(ghost.position.x <= 0 &&
                ghost.position.y <= wall.width*11 &&
                ghost.position.y >= wall.width*10)
            {
                ghost.position.x = wall.width*23
            }
            else if(ghost.position.x >= wall.width*23 &&
                ghost.position.y <= wall.width*11 &&
                ghost.position.y >= wall.width*10)
            {
                ghost.position.x = 0
            }
        })
        if(circleCircleCollision({circle1: player, circle2: ghost}))
        {
            if(ghost.color == 'blue')
            {
                score += 200

                ghost.position.x = 3/2*20+20*10
                ghost.position.y = 3/2*20+20*9
                ghost.color = 'transparent'
                wait(1000)
                
                if(ghost = ghosts[0]){ghost.color = 'red'}
                if(ghost = ghosts[1]){ghost.color = 'lightblue'}
                if(ghost = ghosts[2]){ghost.color = 'pink'}
                if(ghost = ghosts[3]){ghost.color = 'orange'}
            }
            else
            {
                player.position.x = firstPlayerPosX
                player.position.y = firstPlayerPosY        
                lives -= 1
            }
        }
    })  
    // När man inte har några liv kvar får man GAME OVER och spelet avslutas
    if(lives == 0)
    {   
        gameOverText = 'GAME OVER!'
        ghosts.foreach((ghost) => {
            ghost.speed.x = 0
            ghost.speed.y = 0
        })
        player.speed.x = 0
        player.speed.y = 0
        return
    }
    if(pellets.length == 0)
    {
        // Om det är slut på pellets så startas spelet om
        resetGame()
    }
    // Spelare, mm. uppdateras
    player.update()
    drawScore()
    drawLives()
    drawWinLoss()
}
// Animate funktionen körs
animate()
// Kontroller
addEventListener('keydown', ({key}) =>
{
    switch(key)
    {
        case 'w':
            playerDirection = 'up'
            break
        case 'a':
            playerDirection = 'left'
            break
        case 's':
            playerDirection = 'down'
            break
        case 'd': 
            playerDirection = 'right'
            break
    }
})