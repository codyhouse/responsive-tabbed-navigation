(function(){
    // Responsive Tabbed Navigation - by CodyHouse.co
	function TabbedNavigation( element ) {
		this.element = element;
		this.navigation = this.element.getElementsByTagName("nav")[0];
		this.navigationElements = this.navigation.getElementsByClassName("js-cd-navigation")[0];
		this.content = this.element.getElementsByClassName("js-cd-content")[0];
		this.activeTab;
		this.activeContent;
		this.init();
	};

	TabbedNavigation.prototype.init = function() {
		var self = this;
		//listen for the click on the tabs navigation
		this.navigation.addEventListener("click", function(event){
			event.preventDefault();
			if(event.target.tagName.toLowerCase() == "a" && !hasClass(event.target, "cd-selected")) {
				self.activeTab = event.target;
				self.activeContent = self.content.querySelectorAll("[data-content="+self.activeTab.getAttribute("data-content")+"]")[0];
				self.updateContent();
			}
		});

		//listen for the scroll in the tabs navigation 
		this.navigation.addEventListener('scroll', function(event){
			self.toggleNavShadow();
		});
	};

	TabbedNavigation.prototype.updateContent = function() {
		var actualHeight = this.content.offsetHeight;
		//update navigation classes
		removeClass(this.navigation.querySelectorAll("a.cd-selected")[0], "cd-selected");
		addClass(this.activeTab, "cd-selected");
		//update content classes
		removeClass(this.content.querySelectorAll("li.cd-selected")[0], "cd-selected");
		addClass(this.activeContent, "cd-selected");
		//set new height for the content wrapper
		(!window.requestAnimationFrame) 
			? this.content.setAttribute("style", "height:"+this.activeContent.offsetHeight+"px;")
			: setHeight(actualHeight, this.activeContent.offsetHeight, this.content, 200);
	};

	TabbedNavigation.prototype.toggleNavShadow = function() {
		//show/hide tabs navigation gradient layer
		this.content.removeAttribute("style");
		var navigationWidth = Math.floor(this.navigationElements.getBoundingClientRect().width),
			navigationViewport = Math.ceil(this.navigation.getBoundingClientRect().width);
		( this.navigation.scrollLeft >= navigationWidth - navigationViewport )
			? addClass(this.element, "cd-tabs--scroll-ended")
			: removeClass(this.element, "cd-tabs--scroll-ended");
	};

	var tabs = document.getElementsByClassName("js-cd-tabs"),
		tabsArray = [],
		resizing = false;
	if( tabs.length > 0 ) {
		for( var i = 0; i < tabs.length; i++) {
			(function(i){
				tabsArray.push(new TabbedNavigation(tabs[i]));
			})(i);
		}

		window.addEventListener("resize", function(event) {
			if( !resizing ) {
				resizing = true;
				(!window.requestAnimationFrame) ? setTimeout(checkTabs, 250) : window.requestAnimationFrame(checkTabs);
			}
		});
	}

	function checkTabs() {
		tabsArray.forEach(function(tab){
			tab.toggleNavShadow();
		});
		resizing = false;
	};

	function setHeight(start, to, element, duration) {
		var change = to - start,
	        currentTime = null;
	        
	    var animateHeight = function(timestamp){  
	    	if (!currentTime) currentTime = timestamp;         
	        var progress = timestamp - currentTime;
	        var val = Math.easeInOutQuad(progress, start, change, duration);
	        element.setAttribute("style", "height:"+val+"px;");
	        if(progress < duration) {
	            window.requestAnimationFrame(animateHeight);
	        }
	    };
	    
	    window.requestAnimationFrame(animateHeight);
	}

	Math.easeInOutQuad = function (t, b, c, d) {
 		t /= d/2;
		if (t < 1) return c/2*t*t + b;
		t--;
		return -c/2 * (t*(t-2) - 1) + b;
	};
	
	//class manipulations - needed if classList is not supported
	function hasClass(el, className) {
	  	if (el.classList) return el.classList.contains(className);
	  	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}
	function addClass(el, className) {
		var classList = className.split(' ');
	 	if (el.classList) el.classList.add(classList[0]);
	 	else if (!hasClass(el, classList[0])) el.className += " " + classList[0];
	 	if (classList.length > 1) addClass(el, classList.slice(1).join(' '));
	}
	function removeClass(el, className) {
		var classList = className.split(' ');
	  	if (el.classList) el.classList.remove(classList[0]);	
	  	else if(hasClass(el, classList[0])) {
	  		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
	  		el.className=el.className.replace(reg, ' ');
	  	}
	  	if (classList.length > 1) removeClass(el, classList.slice(1).join(' '));
	}
})();