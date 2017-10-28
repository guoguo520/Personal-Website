(function($){
	"use strict";

	/*说明:获取浏览器前缀*/
	/*实现：判断某个元素的css样式中是否存在transition属性*/
	/*参数：dom元素*/
	/*返回值：boolean，有则返回浏览器样式前缀，否则返回false*/
	var _prefix = (function(temp){
		var aPrefix = ["webkit", "Moz", "o", "ms"],
			props = "";
		for(var i in aPrefix){
			props = aPrefix[i] + "Transition";
			if(temp.style[ props ] !== undefined){
				return "-"+aPrefix[i].toLowerCase()+"-";
			}
		}
		return false;
	})(document.createElement(PageSwitch));

	var PageSwitch = (function(){
		function PageSwitch(element, options){
			this.settings = $.extend(true, $.fn.PageSwitch.defaults, options||{});
			this.element = element;
			this.init();
		}

		PageSwitch.prototype = {
			/*说明：初始化插件*/
			/*实现：初始化dom结构，布局，分页及绑定事件*/
			init : function(){
				var me = this;
				me.selectors = me.settings.selectors;
				me.sections = me.element.find(me.selectors.sections);
				me.section = me.sections.find(me.selectors.section);

				me.title_1 = me.sections.find(me.selectors.title_1);
				me.title_3 = me.sections.find(me.selectors.title_3);
				me.title_4 = me.sections.find(me.selectors.title_4);
				me.title_5 = me.sections.find(me.selectors.title_5);
				me.title_6 = me.sections.find(me.selectors.title_6);
				me.title_7 = me.sections.find(me.selectors.title_7);

				me.intro_1 = me.sections.find(me.selectors.intro_1);
				me.intro_2 = me.sections.find(me.selectors.intro_2);
				me.intro_3 = me.sections.find(me.selectors.intro_3);
				me.intro_4 = me.sections.find(me.selectors.intro_4);
				me.intro_5 = me.sections.find(me.selectors.intro_5);
				me.intro_6 = me.sections.find(me.selectors.intro_6);
				me.intro_7 = me.sections.find(me.selectors.intro_7);

				me.direction = me.settings.direction == "vertical" ? true : false;
				me.pagesCount = me.pagesCount();
				me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;

				me.canscroll = true;

				if(!me.direction || me.index){
					me._initLayout();
				}

				if(me.settings.pagination){
					me._initPaging();
				}

				me._initEvent();
			},
			// 获取滑动页面数量
			pagesCount : function(){
				return this.section.length;
			},

			//获取滑动的宽度（横屏滑动）或高度（竖屏滑动）
			switchLength : function(){
				return this.direction == 1 ? this.element.height() : this.element.width();
			},

			//网页内容特效
			sectionAnim:function(){
				var me=this;
				if(me.index){
					if(me.index==1) {
						me.title=me.title_1;
						me.intro=me.intro_1;
					}else if(me.index==2){
						me.intro1=me.intro_2;
					}else if(me.index==3){
						me.title=me.title_3;
						me.intro=me.intro_3;
					}else if(me.index==4){
						me.title=me.title_4;
						me.intro1=me.intro_4;
					}else if(me.index==5){
						me.title=me.title_5;
						me.intro=me.intro_5;
					}else if(me.index==6){
						me.title=me.title_6;
						me.intro1=me.intro_6;
					}else if(me.index==7){
						me.title7=me.title_7;
						me.intro=me.intro_7;
					}
					var translate ="scale(1,1)";
					me.title.css(_prefix+"transition", "all " + me.settings.duration + "ms " + me.settings.easing);
					me.title.css(_prefix+"transform" , translate);

					me.intro.css(_prefix+"transition", "all " + me.settings.duration + "ms " +me.settings.easing+" 400ms");
					me.intro.css(_prefix+"transform" , translate);

					var translate1="translate(0,0)";
					me.intro1.css(_prefix+"transition", "all " + me.settings.duration + "ms " +me.settings.easing+" 400ms");
					me.intro1.css(_prefix+"transform" , translate1);
					
					var translate2="rotateY(360deg)";
					me.title7.css(_prefix+"transition", "all " + me.settings.duration + "ms " +me.settings.easing+" 500ms");
					me.title7.css(_prefix+"transform" , translate2);
					
				}
			},

			//向前滑动即上一页
			prve : function(){
				var me = this;
				if(me.index > 0){
					me.index --;
				}else if(me.settings.loop){
					me.index = me.pagesCount - 1;
				}
				me._scrollPage();

				me.sectionAnim();	
			},
			
			//向后滑动即下一页
			next : function(){
				var me = this;
				if(me.index < me.pagesCount){
					me.index ++;
				}else if(me.settings.loop){
					me.index = 0;
				}
				me._scrollPage();

				me.sectionAnim();
			},

			//主要针对横屏情况进行页面布局(_代表私有方法)
			_initLayout : function(){
				var me = this;
				if(!me.direction){
					var width = (me.pagesCount * 100) + "%",
						cellWidth = (100 / me.pagesCount).toFixed(2) + "%";
					me.sections.width(width);
					me.section.width(cellWidth).css("float", "left");
				}
				if(me.index){
					me._scrollPage(true);
				}
			},

			//实现分页的dom结构及css样式
			_initPaging : function(){
				var me = this,
					pagesClass = me.selectors.page.substring(1);
				me.activeClass = me.selectors.active.substring(1);

				var pageHtml = "<ul class="+pagesClass+">";
				for(var i = 0 ; i < me.pagesCount; i++){
					pageHtml += "<li></li>";
				}
				me.element.append(pageHtml);
				var pages = me.element.find(me.selectors.page);
				me.pageItem = pages.find("li");
				me.pageItem.eq(me.index).addClass(me.activeClass);

				if(me.direction){
					pages.addClass("vertical");
				}else{
					pages.addClass("horizontal");
				}
			},

			//初始化插件事件
			_initEvent : function(){
				var me = this;
				/*绑定鼠标滚轮事件*/
				me.element.on("mousewheel DOMMouseScroll", function(e){
					e.preventDefault();
					var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
					if(me.canscroll){
						if(delta > 0 && (me.index && !me.settings.loop || me.settings.loop)){
							me.prve();
						}else if(delta < 0 && (me.index < (me.pagesCount-1) && !me.settings.loop || me.settings.loop)){
							me.next();
						}
					}
				});

				/*绑定分页click事件*/
				me.element.on("click", me.selectors.page + " li", function(){
					me.index = $(this).index();
					me._scrollPage();
				});

				if(me.settings.keyboard){
					$(window).keydown(function(e){
						var keyCode = e.keyCode;
						if(keyCode == 37 || keyCode == 38){
							me.prve();
						}else if(keyCode == 39 || keyCode == 40){
							me.next();
						}
					});
				}

				/*绑定窗口改变事件*/
				/*为了不频繁调用resize的回调方法，做了延迟*/
				var resizeId;
				$(window).resize(function(){
					clearTimeout(resizeId);
					resizeId = setTimeout(function(){
						var currentLength = me.switchLength();
						var offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
						if(Math.abs(offset) > currentLength/2 && me.index < (me.pagesCount - 1)){
							me.index ++;
						}
						if(me.index){
							me._scrollPage();
						}
					},500);
				});

				/*支持CSS3动画的浏览器，绑定transitionend事件(即在动画结束后调用起回调函数)*/
				if(_prefix){
					me.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function(){
						me.canscroll = true;
						if(me.settings.callback && $.type(me.settings.callback) === "function"){
							me.settings.callback();
						}
					})
				}
			},

			/*滑动动画*/
			_scrollPage : function(init){
				var me = this;
				var dest = me.section.eq(me.index).position();
				if(!dest) return;

				me.canscroll = false;
				if(_prefix){
					var translate = me.direction ? "translateY(-"+dest.top+"px)" : "translateX(-"+dest.left+"px)";
					me.sections.css(_prefix+"transition", "all " + me.settings.duration + "ms " + me.settings.easing);
					me.sections.css(_prefix+"transform" , translate);
				}else{
					var animateCss = me.direction ? {top : -dest.top} : {left : -dest.left};
					me.sections.animate(animateCss, me.settings.duration, function(){
						me.canscroll = true;
						if(me.settings.callback){
							me.settings.callback();
						}
					});
				}

				if(me.settings.pagination && !init){
					me.pageItem.eq(me.index).addClass(me.activeClass).siblings("li").removeClass(me.activeClass);
				}

				
			}
		};
		return PageSwitch;
	})();
	
	$.fn.PageSwitch = function(options){
		return this.each(function(){
			var me = $(this),
				instance = me.data("PageSwitch");

			if(!instance){
				me.data("PageSwitch", (instance = new PageSwitch(me, options)));
			}

			if($.type(options) === "string") return instance[options]();
		});
	};

	$.fn.PageSwitch.defaults = {
		selectors : {
			sections : ".sections",
			section : ".section",
			page : ".pages",
			active : ".active",

			title_1:".title-1",
			title_3:".title-3",
			title_4:".title-4",
			title_5:".title-5",
			title_6:".title-6",
			title_7:".title-7",
			intro_1:".intro_1",
			intro_2:".intro_2",
			intro_3:".intro_3",
			intro_4:".intro_4",
			intro_5:".intro_5",
			intro_6:".intro_6",
			intro_7:".intro_7",
		},
		index : 0,		//页面开始的索引
		easing : "ease",		//动画效果
		duration : 500,		//动画执行时间
		loop : false,		//是否循环切换
		pagination : true,		//是否进行分页
		keyboard : true,		//是否触发键盘事件
		direction : "vertical",		//滑动方向vertical,horizontal
		callback : ""		//回调函数
	};

	$(function(){
		$('[data-PageSwitch]').PageSwitch();
	});
})(jQuery);