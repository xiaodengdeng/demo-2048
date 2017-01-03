var board=new Array();
var score=0;
var hasConflicted=new Array();//判断是否是碰撞过的函数
//触摸坐标
var startx=0;
var starty=0;
var endx=0;
var endy=0;


$(function(){
	prepareForMobile();
	newgame();	
	
});
function prepareForMobile(){
	if(windowScreenWidth>500){
		gridContainerWidth=500;
		celSlideLength=100;
		celSpace=20;
	}	
	$("#grid-container").css("width",gridContainerWidth-2*celSpace);
	$("#grid-container").css('height',gridContainerWidth-2*celSpace);
	$("#grid-container").css('padding',celSpace);
	$("#grid-container").css('border-radius',0.02*gridContainerWidth);
	
	
	$('.grid-cell').css('width',celSlideLength);
	$('.grid-cell').css('height',celSlideLength);
	$('.grid-cell').css('border-radius',0.02*celSlideLength);
}

function newgame(){
	//初始化棋盘格
	init();
	//随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
};
function init(){
	/*遍历所有的棋盘格，给其定位*/
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
	};
	/*生成二维数组*/
	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasConflicted[i]=new Array();
		for(var j=0;j<4;j++){
			board[i][j]=0;/*对里面的元素初始化*/
			hasConflicted[i][j]=false;
		}		
	};
	updateBoardView();
	
	score=0;
};
function updateBoardView(){	
	$(".number-cell").remove();//在每次点击前都要移除
	/*遍历所有棋盘格，添加class*/
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell=$('#number-cell-'+i+'-'+j);
			
			if(board[i][j]==0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+celSlideLength/2);
				theNumberCell.css('left',getPosLeft(i,j)+celSlideLength/2);
			}else{
				theNumberCell.css('width',celSlideLength);
				/*alert(celSlideLength)*/
				theNumberCell.css('height',celSlideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j]=false;
		}
	}
	$('.number-cell').css("line-height",celSlideLength+"px");
	$('.number-cell').css("font-size",0.6*celSlideLength+"px");
};

function generateOneNumber(){
	if(nospace(board))
		return false;
		
	//随机一个位置
	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));
	while(true){
		if(board[randx][randy]==0){
			break;
		}else{
			var randx=parseInt(Math.floor(Math.random()*4));
			var randy=parseInt(Math.floor(Math.random()*4));
		}
	}
	//随机一个数字(2或者4)
	var randNumber=Math.random()<0.5 ? 2 : 4;
	//在随机位置显示随机数
	board[randx][randy]=randNumber;
	showNumberWithAnimation(randx,randy, randNumber)
	
	
	return true;
}

$(document).keydown(function(event){
	
	switch(event.keyCode){
		case 37://left
		event.preventDefault();//阻止默认效果
		if(moveLeft()){
			setTimeout("generateOneNumber()",210);//生成1个数字
			setTimeout("isgameover()",300);//判断游戏是否结束了
		}
		break;
		case 38://up
		event.preventDefault();//阻止默认效果
		if(moveUp()){
			setTimeout("generateOneNumber()",210) ;//生成1个数字
			setTimeout("isgameover()",300);//判断游戏是否结束了
		}
		break;
		case 39://right
		event.preventDefault();//阻止默认效果
		if(moveRight()){
			setTimeout("generateOneNumber()",210) ;//生成1个数字
			setTimeout("isgameover()",300);//判断游戏是否结束了
		}
		break;
		case 40://down
		event.preventDefault();//阻止默认效果
		if(moveDown()){
			setTimeout("generateOneNumber()",210) ;//生成1个数字
			setTimeout("isgameover()",300);//判断游戏是否结束了
		}
		break;
		default:
		break;		
	}
});

//监听事件
document.addEventListener('touchstart',function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
});
//解决触摸不好使的问题
document.addEventListener("touchmove",function(event){
	event.preventDefault();
});

document.addEventListener('touchend',function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;
	
	var deltax=endx-startx;
	var deltay=endy-starty;
	
	//修复点击的bug，不让其运行
	
	if(Math.abs(deltax)<0.3*windowScreenWidth && Math.abs(deltay)<0.3*windowScreenWidth){
		return;
	}

	if(Math.abs(deltax) >= Math.abs(deltay)){
		if(deltax>0){
			//moveright
			if(moveRight()){
				setTimeout("generateOneNumber()",210) ;//生成1个数字
				setTimeout("isgameover()",300);//判断游戏是否结束了
			}
		
		}else{
			//moveleft
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);//生成1个数字
				setTimeout("isgameover()",300);//判断游戏是否结束了
			}
		}
	}
	//y
	else{
		if(deltay>0){
			//movedown
			if(moveDown()){
				setTimeout("generateOneNumber()",210) ;//生成1个数字
				setTimeout("isgameover()",300);//判断游戏是否结束了
			}
		}else{
			//moveup
			if(moveUp()){
				setTimeout("generateOneNumber()",210) ;//生成1个数字
				setTimeout("isgameover()",300);//判断游戏是否结束了
			}
		}
		
	}
});

//结束游戏
function isgameover(){
	//没有空间和没有步骤走了
	if(nospace(board)&&nomove(board)){
		gameover();
	}
}


function gameover(){
	alert("gameover")
}

function moveLeft(){
	if(!canMoveLeft(board))
		return false;		
	//moveleft
	for(var i=0;i<4;i++){
		for (var j=1;j<4;j++) {
			if(board[i][j]!=0){
				for (var k=0;k<j;k++) {
					if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];					
						board[i][j]=0;
						/*alert(1);*/
						continue;
					}else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						
						//add产生叠加
						board[i][k]+=board[i][j];
						
						board[i][j]=0;
						//add score
						score+=board[i][k];
						updateScore(score);
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;	
}
function moveRight(){
	if(!canMoveRight(board))
		return false;		
	//moveright
	for(var i=0;i<4;i++){
		for (var j=2;j>=0;j--) {
			if(board[i][j]!=0){
				for (var k=3;k>j;k--) {
					if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];					
						board[i][j]=0;
						/*alert(1);*/
						continue;
					}else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board)&& !hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						
						//add产生叠加
						board[i][k]+=board[i][j];
						
						board[i][j]=0;
						//add score
						score+=board[i][k];
						updateScore(score);
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;	
}

function moveUp(){
	if(!canMoveUp(board))
		return false;		
	//moveup
	for(var j=0;j<4;j++){
		for (var i=1;i<4;i++) {
			if(board[i][j]!=0){
				for (var k=0;k<i;k++) {
					if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];					
						board[i][j]=0;
						/*alert(1)*/
						continue;
					}else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board)&& !hasConflicted[k][j]){
						//move
						showMoveAnimation(i,j,k,j);
						
						//add产生叠加
						board[k][j]+=board[i][j];						
						board[i][j]=0;
						//add score
						score+=board[k][j];
						updateScore(score);
						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;	
}
function moveDown(){
	if(!canMoveDown(board))
		return false;		
	//movedown
	for(var j=0;j<4;j++){
		for (var i=2;i>=0;i--) {
			if(board[i][j]!=0){
				for (var k=3;k>i;k--) {
					if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];					
						board[i][j]=0;
						//alert(1)
						continue;
					}else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board)&& !hasConflicted[k][j]){
						//move
						showMoveAnimation(i,j,k,j);
						
						//add产生叠加
						board[k][j]+=board[i][j];						
						board[i][j]=0;
						//add score
						score+=board[k][j];
						updateScore(score);
						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;	
}

