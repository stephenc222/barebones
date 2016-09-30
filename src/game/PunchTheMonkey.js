
export class PunchTheMonkey {
  constructor() {
    this._init();
    this._create();
  }
  

  _init() {
    document.title = 'Punch the Monkey';
    this.canvas = document.createElement('canvas');
    // the line below changes the cursor to a fist
    // this.canvas.style.cursor = 'url(./fist.png), auto';
    this.canvas.width = 640; // 640 originally
    this.canvas.height = 480; // 480 orig
    document.body.insertBefore(this.canvas, document.body.firstChild);
    this.ctx = this.canvas.getContext('2d');
    
  }

  _create() {
    const { ctx, canvas } = this;
    const chimp_base = new Image();
    chimp_base.src = './chimp_base.png';
    
    // adding player data here
    const player_data = {
      'score': 0,
      'lives': 3
    };


    const chimp = {
      speed: 150, // 300
      angle: 0,
      wasHit: false,
      wasMissed: false,
      x: canvas.width * 0.5,
      y: canvas.height * 0.5,
      vx: 1,
      vy: -1,
      // TODO color prop is temporary, just to help with sprite alignment
      color: 'yellow',
      image: chimp_base,
      radius: 45,
      TO_RADIANS: Math.PI / 180,// adjusted from 60 to better fit chimp base sprite
      
      reset() {
        // HACK added reset to chimp.angle to 0 radians
        chimp.angle = 0;
        chimp.vx = -1 + 0.5;// + Math.random() * 1;
        chimp.vy = -1 + 0.5;// + Math.random() * 1;
      },

      move() {
        if(!chimp.wasHit){
          if (chimp.x < chimp.radius || chimp.x + chimp.radius > canvas.width) {
            chimp.vx = -chimp.vx;
          }
          if (chimp.y < chimp.radius || chimp.y + chimp.radius > canvas.height) {
            chimp.vy = -chimp.vy;
          }
        }
      },
      
      spinOnHit() { // lose the param here too
        //TODO add 'spin' animation when player 'punches', (clicks) on monkey
        
        chimp.wasHit = true;
        // right is that a local variable in *this* function? ok!
        chimp.vx = 0;
        chimp.vy = 0;
        window.console.log(rate);
        const SPIN_TIME = 1000; // it won't change, make it const
        // if that's easier for you to understand
        // SPIN_TIME would be a var somewhere that is in milliseconds
        // so 1000 if you want to spin for a second 500 if you want to spin for half a second etc...
        // it can be, no harm in it
        setTimeout(function () { chimp.wasHit = false; }, SPIN_TIME);
      
      },
      
      jumpOnMiss() {
        // TODO add monkey jump 'anaimation' when player misses the monkey on click
        // also needs to watch for if y < radius, then different animation
        
        // just a start
        // NEED to use/better understand ctx.translate(x,y)
        // chimp.y = chimp.y - 100;
        chimp.wasMissed = true;
        // right is that a local variable in *this* function? ok!
        chimp.vx = 0;
        chimp.vy = 0;
        window.console.log(rate);
        const JUMP_TIME = 2000; // it won't change, make it const
        // if that's easier for you to understand
        // SPIN_TIME would be a var somewhere that is in milliseconds
        // so 1000 if you want to spin for a second 500 if you want to spin for half a second etc...
        // it can be, no harm in it
        setTimeout(function () { chimp.wasMissed = false; chimp.reset(); }, JUMP_TIME);
      },
      
      // TODO final code to write for this event handler --> go to 'lose' when lives === 0 and go to
      // 'win' when score === 10
      punched(){
        canvas.addEventListener('click', (event) => {
            // here is logic to determine if player has scored a hit, or if missed the chimp
          if(event){
            if ((chimp.x+chimp.radius) > event.x && (chimp.x - chimp.radius) < event.x) {
              if ((chimp.y+chimp.radius) > event.y && (chimp.y - chimp.radius) < event.y) {
                chimp.spinOnHit();
                window.console.log('ouch!');
                player_data.score += 1;
                // for testing of score change
                window.console.log('score: ' + player_data.score);
               // return;
              }
            } else {
              window.console.log('You lost a life, better be more careful!');
              player_data.lives -= 1;
              chimp.jumpOnMiss();
              // for testing of lives change
              window.console.log('lives: ' + player_data.lives);
             // return;
            }
              
          }
   
        });
      }
    };
    chimp.punched();
    //chimp.reset();

    const update = deltaTime => {
      
      const SPIN_SPEED = 360-360*deltaTime/4;// timing issue here, crudely hacked
      // haha it spins around, finally!
      //window.console.log('at start angle is: ' + chimp.angle);
      if (chimp.wasHit) {
        
        let d = new Date().getMilliseconds();
        chimp.angle += SPIN_SPEED*deltaTime;// * 1.01;
       // window.console.log('angle' +chimp.angle);
       // window.console.log('time is: '+ d);
        // we store the angle of the chimp in degrees, so 0 to 360 is a full circle
        // this ensures our angle value doesn't get out of hand
        if (chimp.angle > 360) {
          chimp.angle = 0;
         // window.console.log('the chimp angle is: ' + chimp.angle);
        }
      }
      
      if (chimp.wasMissed) {
        // TODO this is where the animation needs to jump up and down when miss monkey
       // let d = new Date().getMilliseconds();
       // window.console.log('vy before change: '+chimp.vy);
     
        // TODO 'test' function needs work to look more like a jumping motion
        let test = function () {chimp.y -= 20*deltaTime;
          chimp.vy -= -0.2;};
        //window.console.log('y is ' +chimp.y);
        //window.console.log('time is: '+ d);
        setTimeout(test(),1000);
        // we store the angle of the chimp in degrees, so 0 to 360 is a full circle
        // this ensures our angle value doesn't get out of hand
      }
   
     
      if (chimp.vx === 0 && chimp.vy === 0 && !chimp.wasHit && !chimp.wasMissed) {
        // TODO need to better figure out angle rotation timing
        chimp.reset();
      }
      chimp.x += chimp.vx * deltaTime * chimp.speed;
      chimp.y += chimp.vy * deltaTime * chimp.speed;
      chimp.move();
      
    };

    
    const render = () => {
      ctx.fillStyle = 'lightgreen';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      ctx.translate(chimp.x, chimp.y);
      ctx.rotate(chimp.angle * chimp.TO_RADIANS);
      // TODO need to resize chimp -much- smaller, better align it to the center of the chimp object
      ctx.fillStyle = chimp.color;

      ctx.beginPath();
      
      ctx.arc(0, 0, chimp.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.drawImage(chimp.image, -chimp.radius, -chimp.radius);
      ctx.restore();
    };

    const DESIRED_FPS = 30;//51; //30;
    const rate = 1000 / DESIRED_FPS;
    const dt = rate * 0.001;
    window.console.log('rate is: '+ rate);
    setInterval(() => { update(dt);

      render(); }, rate);
  }
}

