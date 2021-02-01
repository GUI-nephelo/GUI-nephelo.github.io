var main=()=>{
  var canvas, ctx, circ, nodes, mouse, SENSITIVITY, SIBLINGS_LIMIT, DENSITY, NODES_QTY, ANCHOR_LENGTH, MOUSE_RADIUS;

  // how close next node must be to activate connection (in px)
  // shorter distance == better connection (line width)
  SENSITIVITY = 85;
  // note that siblings limit is not 'accurate' as the node can actually have more connections than this value that's because the node accepts sibling nodes with no regard to their current connections this is acceptable because potential fix would not result in significant visual difference
  // more siblings == bigger node
  SIBLINGS_LIMIT = 100;
  // default node margin
  DENSITY = 40;
  // total number of nodes used (incremented after creation)
  NODES_QTY = 0;
  // avoid nodes spreading
  ANCHOR_LENGTH = 10;
  // highlight radius
  MOUSE_RADIUS = 65//80;

  circ = 2 * Math.PI;
  nodes = [];

  LIGHT_DENSITY =170;
  console.log(LIGHT_DENSITY)
  LIGHT_NODES_QTY = 0;
  lights = [];

  canvas = document.querySelector('canvas');
  resizeWindow();
  mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
  };
  ctx = canvas.getContext('2d');
  if (!ctx) {
    alert("Ooops! Your browser does not support canvas :'(");
  }

  function Node(x, y) {
    this.anchorX = x;
    this.anchorY = y;
    this.x = Math.random() * (x - (x - ANCHOR_LENGTH)) + (x - ANCHOR_LENGTH);
    this.y = Math.random() * (y - (y - ANCHOR_LENGTH)) + (y - ANCHOR_LENGTH);
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.energy = Math.random() * 100;
    this.radius = Math.random();
    this.siblings = [];
    this.brightness = 0;
  }

  Node.prototype.drawNode = function() {
    var color = "rgba(255, 255, 0, " + this.brightness + ")";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2 * this.radius + 2 * this.siblings.length / SIBLINGS_LIMIT, 0, circ);
    ctx.fillStyle = color;
    ctx.fill();
  };

  Node.prototype.drawConnections = function() {
    for (var i = 0; i < this.siblings.length; i++) {
      var color = "rgba(77, 131, 155, " + this.brightness + ")";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.siblings[i].x, this.siblings[i].y);
      ctx.lineWidth = 1 - calcDistance(this, this.siblings[i]) / SENSITIVITY;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  };

  Node.prototype.moveNode = function(ANCHOR_LENGTH) {
    this.energy -= 2;
    if (this.energy < 1) {
      this.energy = Math.random() * 100;
      if (this.x - this.anchorX < -ANCHOR_LENGTH) {
        this.vx = Math.random() * 2;
      } else if (this.x - this.anchorX > ANCHOR_LENGTH) {
        this.vx = Math.random() * -2;
      } else {
        this.vx = Math.random() * 4 - 2;
      }
      if (this.y - this.anchorY < -ANCHOR_LENGTH) {
        this.vy = Math.random() * 2;
      } else if (this.y - this.anchorY > ANCHOR_LENGTH) {
        this.vy = Math.random() * -2;
      } else {
        this.vy = Math.random() * 4 - 2;
      }
    }
    this.x += this.vx * this.energy / 100;
    this.y += this.vy * this.energy / 100;
  };

  function initNodes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes = [];
    for (var i = DENSITY; i < canvas.width; i += DENSITY) {
      for (var j = DENSITY; j < canvas.height; j += DENSITY) {
        nodes.push(new Node(i, j));
        NODES_QTY++;
      }
    }

    lights=[];
    for (var i = LIGHT_DENSITY; i < canvas.width; i += LIGHT_DENSITY) {
      for (var j = LIGHT_DENSITY; j < canvas.height; j += LIGHT_DENSITY) {
        lights.push(new Node(i, j));
        LIGHT_NODES_QTY++;
      }
    }
  }

  function calcDistance(node1, node2) {
    return Math.sqrt(Math.pow(node1.x - node2.x, 2) + (Math.pow(node1.y - node2.y, 2)));
  }

  function calcDistances(nodes1,node2){
    distances=nodes1.map((node)=>{
        d=calcDistance(node,node2)
        return d<MOUSE_RADIUS?d:0;
    });
    return eval((distances.join("+"))+"")/nodes1.length
  }

  function findSiblings() {
    var node1, node2, distance;
    for (var i = 0; i < NODES_QTY; i++) {
      node1 = nodes[i];
      node1.siblings = [];
      for (var j = 0; j < NODES_QTY; j++) {
        node2 = nodes[j];
        if (node1 !== node2) {
          distance = calcDistance(node1, node2);
          if (distance < SENSITIVITY) {
            if (node1.siblings.length < SIBLINGS_LIMIT) {
              node1.siblings.push(node2);
            } else {
              var node_sibling_distance = 0;
              var max_distance = 0;
              var s;
              for (var k = 0; k < SIBLINGS_LIMIT; k++) {
                node_sibling_distance = calcDistance(node1, node1.siblings[k]);
                if (node_sibling_distance > max_distance) {
                  max_distance = node_sibling_distance;
                  s = k;
                }
              }
              if (distance < max_distance) {
                node1.siblings.splice(s, 1);
                node1.siblings.push(node2);
              }
            }
          }
        }
      }
    }
  }

  function redrawScene() {
    resizeWindow();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    findSiblings();
    var i, node, distance,light;
    lights.map(l=>{l.brightness;l.drawNode()})
    for (i = 0; i < NODES_QTY; i++) {
      node = nodes[i];

      distance = 1/calcDistances(lights,node)
      /*
      distance = calcDistance({
        x: /*mouse.xcanvas.width*Math.random(),
        y: /*mouse.ycanvas.height*Math.random()
      }, node);
      console.log(distance,distancem)
      */
      //console.log(distance)
      node.brightness = 1 - distance //* MOUSE_RADIUS;
      if (node.brightness<=0){node.brightness=0}
      if (node.brightness>=1){node.brightness=1}
     }

    for (i = 0; i < NODES_QTY; i++) {
      node = nodes[i];
      if (node.brightness) {
        node.drawConnections();
        node.drawNode();
      }
      node.moveNode(0);
    }
    requestAnimationFrame(redrawScene);
  }

  function initHandlers() {

    document.addEventListener('resize', resizeWindow, false);
    document.querySelector('body').addEventListener('mousemove', mousemoveHandler, false);
  }

  function resizeWindow() {
    canvas.style.width = "100%"//window.innerWidth+400;
    canvas.style.height = "100%"//window.innerHeight+400;
    var dd = "50px"
    var nd = "-50px"
    canvas.style.top = dd;
    canvas.style.bottom = nd;
    canvas.style.right = nd;
    canvas.style.left = dd;
    //DENSITY = (canvas.height+canvas.width)/(2*7)
    console.log(DENSITY)
  }

  function mousemoveHandler(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  initHandlers();
  initNodes();
  redrawScene();

}
window.onresize=main