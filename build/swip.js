function Swip(e,t,n,i,r,a){this.conNode=e,this.background=null,this.backCtx=null,this.mask=null,this.maskCtx=null,this.lottery=null;this.lotteryType="image",this.cover=t||"#000",this.coverType=n,this.pixlesData=null,this.width=i,this.height=r;this.lastPosition=null,this.drawPercentCallback=a}Swip.prototype={createElement:function(e,t){var n=document.createElement(e);for(var i in t)n.setAttribute(i,t[i]);return n},getTransparentPercent:function(e,t,n){for(var i=e.getImageData(0,0,t,n),r=i.data,a=[],o=0,s=r.length;s>o;o+=4){var l=r[o+3];128>l&&a.push(o)}return(a.length/(r.length/4)*100).toFixed(2)},resizeCanvas:function(e,t,n){e.width=t,e.height=n,e.getContext("2d").clearRect(0,0,t,n)},resizeCanvas_w:function(e,t,n){e.width=t,e.height=n,e.getContext("2d").clearRect(0,0,t,n),this.drawMask()},drawPoint:function(e,t){this.maskCtx.beginPath();this.maskCtx.arc(e,t,15,0,2*Math.PI);this.maskCtx.fill();this.maskCtx.beginPath(),this.maskCtx.lineWidth=30,this.maskCtx.lineCap=this.maskCtx.lineJoin="round";this.lastPosition&&this.maskCtx.moveTo(this.lastPosition[0],this.lastPosition[1]),this.maskCtx.lineTo(e,t);this.maskCtx.stroke();this.lastPosition=[e,t],this.mask.style.zIndex=20==this.mask.style.zIndex?21:20},bindEvent:function(){var e=this,t=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()),n=t?"touchstart":"mousedown",i=t?"touchmove":"mousemove";if(t)e.conNode.addEventListener("touchmove",function(e){r&&e.preventDefault(),e.cancelable?e.preventDefault():window.event.returnValue=!1},!1),e.conNode.addEventListener("touchend",function(){r=!1;var t=e.getTransparentPercent(e.maskCtx,e.width,e.height);t>=50&&"function"==typeof e.drawPercentCallback&&e.drawPercentCallback()},!1);else{var r=!1;e.conNode.addEventListener("mouseup",function(t){t.preventDefault(),r=!1;var n=e.getTransparentPercent(e.maskCtx,e.width,e.height);n>=50&&"function"==typeof e.drawPercentCallback&&e.drawPercentCallback()},!1)}this.mask.addEventListener(n,function(n){n.preventDefault(),r=!0;var i=t?n.touches[0].pageX:n.pageX||n.x,a=t?n.touches[0].pageY:n.pageY||n.y;e.drawPoint(i,a,r)},!1),this.mask.addEventListener(i,function(n){if(n.preventDefault(),!r)return!1;n.preventDefault();var i=t?n.touches[0].pageX:n.pageX||n.x,a=t?n.touches[0].pageY:n.pageY||n.y;e.drawPoint(i,a,r)},!1)},drawMask:function(){if("color"==this.coverType)this.maskCtx.fillStyle=this.cover,this.maskCtx.fillRect(0,0,this.width,this.height),this.maskCtx.globalCompositeOperation="destination-out";else if("image"==this.coverType){var e=new Image,t=this;e.crossOrigin="";e.onload=function(){t.resizeCanvas(t.mask,t.width,t.height);t.maskCtx.globalAlpha=.98;t.maskCtx.drawImage(this,0,0,this.width,this.height,0,0,t.width,t.height);var e=25,n=$("#ca-tips").val(),i=t.maskCtx.createLinearGradient(0,0,t.width,0);i.addColorStop("0","rgba(229, 28, 35, .8)");i.addColorStop("1.0","rgba(0, 128, 0, .5)"),t.maskCtx.font="Bold "+e+"px Arial",t.maskCtx.textAlign="left",t.maskCtx.fillStyle=i;t.maskCtx.fillText(" "+n,t.width/2-t.maskCtx.measureText(n).width/2,75);t.maskCtx.globalAlpha=1;t.maskCtx.globalCompositeOperation="destination-out"};e.src=this.cover}},init:function(e,t){var n=document.documentElement.getBoundingClientRect();var i=n.width;var r=n.height;this.mask=this.mask||this.createElement("canvas",{style:"position:absolute;left:50%;top:0;width:"+i+"px;margin-left:-"+i/2+"px;height:100%;background-color:transparent;"});this.mask.style.zIndex=20,this.conNode.innerHTML.replace(/[\w\W]| /g,"");this.conNode.appendChild(this.mask),this.bindEvent();this.maskCtx=this.maskCtx||this.mask.getContext("2d");this.drawMask();var a=this;window.addEventListener("resize",function(){a.width=i,a.height=r,a.resizeCanvas_w(a.mask,a.width,a.height)},!1)}};