/*!

    Description: This file contains all the scripts associated with the single-page
    portfolio website.
*/

(function($) {

    // Remove no-js class
    $('html').removeClass('no-js');

    // Animate to section when nav is clicked
    $('header a').click(function(e) {

        // Treat as normal link if no-scroll class
        if ($(this).hasClass('no-scroll')) return;

        e.preventDefault();
        var heading = $(this).attr('href');
        var scrollDistance = $(heading).offset().top;

        $('html, body').animate({
            scrollTop: scrollDistance + 'px'
        }, Math.abs(window.pageYOffset - $(heading).offset().top) / 6);

        // Hide the menu once clicked if mobile
        if ($('header').hasClass('active')) {
            $('header, body').removeClass('active');
        }
    });

    // Scroll to top
    $('#to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });

    // Scroll to first element
    $('#lead-down span').click(function() {
        var scrollDistance = $('#lead').next().offset().top;
        $('html, body').animate({
            scrollTop: scrollDistance + 'px'
        }, 500);
    });

    // Create timeline
    $('#experience-timeline').each(function() {

        $this = $(this); // Store reference to this
        $userContent = $this.children('div'); // user content

        // Create each timeline block
        $userContent.each(function() {
            $(this).addClass('vtimeline-content').wrap('<div class="vtimeline-point"><div class="vtimeline-block"></div></div>');
        });

        // Add icons to each block
        $this.find('.vtimeline-point').each(function() {
            $(this).prepend('<div class="vtimeline-icon"><i class="fa fa-map-marker"></i></div>');
        });

        // Add dates to the timeline if exists
        $this.find('.vtimeline-content').each(function() {
            var date = $(this).data('date');
            if (date) { // Prepend if exists
                $(this).parent().prepend('<span class="vtimeline-date">'+date+'</span>');
            }
        });

    });

    // Open mobile menu
    $('#mobile-menu-open').click(function() {
        $('header, body').addClass('active');
    });

    // Close mobile menu
    $('#mobile-menu-close').click(function() {
        $('header, body').removeClass('active');
    });

    // Load additional projects
    $('#view-more-projects').click(function(e){
        e.preventDefault();
        $(this).fadeOut(300, function() {
            $('#more-projects').fadeIn(300);
        });
    });
    
})(jQuery);


(function (){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    
    function resize() {
        var box = c.getBoundingClientRect();
        c.width = box.width;
        c.height = box.height;
    }
    
    var light = {
        x: 160,
        y: 200
    }
    
    var colors = ["#f5c156", "#e6616b", "#5cd3ad"];
    
    function drawLight() {
        ctx.beginPath();
        ctx.arc(light.x, light.y, 1000, 0, 2 * Math.PI);
        var gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 1000);
        gradient.addColorStop(0, "#3b4654");
        gradient.addColorStop(1, "#2c343f");
        ctx.fillStyle = gradient;
        ctx.fill();
    
        ctx.beginPath();
        ctx.arc(light.x, light.y, 20, 0, 2 * Math.PI);
        gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 5);
        gradient.addColorStop(0, "#fff");
        gradient.addColorStop(1, "#3b4654");
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    function Box() {
        this.half_size = Math.floor((Math.random() * 50) + 1);
        this.x = Math.floor((Math.random() * c.width) + 1);
        this.y = Math.floor((Math.random() * c.height) + 1);
        this.r = Math.random() * Math.PI;
        this.shadow_length = 2000;
        this.color = colors[Math.floor((Math.random() * colors.length))];
      
        this.getDots = function() {
    
            var full = (Math.PI * 2) / 4;
    
    
            var p1 = {
                x: this.x + this.half_size * Math.sin(this.r),
                y: this.y + this.half_size * Math.cos(this.r)
            };
            var p2 = {
                x: this.x + this.half_size * Math.sin(this.r + full),
                y: this.y + this.half_size * Math.cos(this.r + full)
            };
            var p3 = {
                x: this.x + this.half_size * Math.sin(this.r + full * 2),
                y: this.y + this.half_size * Math.cos(this.r + full * 2)
            };
            var p4 = {
                x: this.x + this.half_size * Math.sin(this.r + full * 3),
                y: this.y + this.half_size * Math.cos(this.r + full * 3)
            };
    
            return {
                p1: p1,
                p2: p2,
                p3: p3,
                p4: p4
            };
        }
        this.rotate = function() {
            var speed = (60 - this.half_size) / 20;
            this.r += speed * 0.002;
            this.x += speed;
            this.y += speed;
        }
        this.draw = function() {
            var dots = this.getDots();
            ctx.beginPath();
            ctx.moveTo(dots.p1.x, dots.p1.y);
            ctx.lineTo(dots.p2.x, dots.p2.y);
            ctx.lineTo(dots.p3.x, dots.p3.y);
            ctx.lineTo(dots.p4.x, dots.p4.y);
            ctx.fillStyle = this.color;
            ctx.fill();
    
    
            if (this.y - this.half_size > c.height) {
                this.y -= c.height + 100;
            }
            if (this.x - this.half_size > c.width) {
                this.x -= c.width + 100;
            }
        }
        this.drawShadow = function() {
            var dots = this.getDots();
            var angles = [];
            var points = [];
    
            for (dot in dots) {
                var angle = Math.atan2(light.y - dots[dot].y, light.x - dots[dot].x);
                var endX = dots[dot].x + this.shadow_length * Math.sin(-angle - Math.PI / 2);
                var endY = dots[dot].y + this.shadow_length * Math.cos(-angle - Math.PI / 2);
                angles.push(angle);
                points.push({
                    endX: endX,
                    endY: endY,
                    startX: dots[dot].x,
                    startY: dots[dot].y
                });
            };
    
            for (var i = points.length - 1; i >= 0; i--) {
                var n = i == 3 ? 0 : i + 1;
                ctx.beginPath();
                ctx.moveTo(points[i].startX, points[i].startY);
                ctx.lineTo(points[n].startX, points[n].startY);
                ctx.lineTo(points[n].endX, points[n].endY);
                ctx.lineTo(points[i].endX, points[i].endY);
                ctx.fillStyle = "#2c343f";
                ctx.fill();
            };
        }
    }
    
    var boxes = [];
    
    function draw() {
        ctx.clearRect(0, 0, c.width, c.height);
        drawLight();
    
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].rotate();
            boxes[i].drawShadow();
        };
        for (var i = 0; i < boxes.length; i++) {
            collisionDetection(i)
            boxes[i].draw();
        };
        requestAnimationFrame(draw);
    }
    
    resize();
    draw();
    
    while (boxes.length < 14) {
        boxes.push(new Box());
    }
    
    window.onresize = resize;
    c.onmousemove = function(e) {
        light.x = e.offsetX == undefined ? e.layerX : e.offsetX;
        light.y = e.offsetY == undefined ? e.layerY : e.offsetY;
    }
    
    
    function collisionDetection(b){
        for (var i = boxes.length - 1; i >= 0; i--) {
            if(i != b){	
                var dx = (boxes[b].x + boxes[b].half_size) - (boxes[i].x + boxes[i].half_size);
                var dy = (boxes[b].y + boxes[b].half_size) - (boxes[i].y + boxes[i].half_size);
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < boxes[b].half_size + boxes[i].half_size) {
                    boxes[b].half_size = boxes[b].half_size > 1 ? boxes[b].half_size-=1 : 1;
                    boxes[i].half_size = boxes[i].half_size > 1 ? boxes[i].half_size-=1 : 1;
                }
            }
        }
    }
})();