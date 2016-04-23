$(document).ready(function() { //gets page ready for JS to be executed
	$("#bio-btn").click(function() {
		$("#bio").slideToggle(900, 'swing');
	});
	blogOutput();
});
// JSON HANDLER

function blogOutput() {
	var posts = [];
	$.getJSON('assets/js/blogging.json', function(data) { //used to get JSON data using an AJAX HTTP GET request
		$(data.entries).each(function(index, value) { //for each loop looping through the key/values 
			var p = '<small class="date">' + value.date + '</small> '; //html output
			p += '<h3 class="blog-title">' + value.title + '</h3>';
			p += '<div class="blog-div">' + '<p class="blogPosts">' + value.text + '</p>' + '</div>' + '<hr class="blog-hr">';
			posts.push(p); //pushes data into post array
		});
		requestPage(posts, 1);
	});
	$('#search').keyup(function() { //.keyup triggers search box when keys are pressed in it
		var searchField = $('#search').val();
		// console.log(searchField);
		if (searchField != -1) {
			posts = [];
			var regExpress = new RegExp(searchField, "i");
			$.getJSON('assets/js/blogging.json', function(data) {
				$(data.entries).each(function(index, value) {
					if ((value.date.search(regExpress) != -1) || (value.title.search(regExpress) != -1) || (value.text.search(regExpress) != -1)) {
						var p = '<small class="date">' + value.date + '</small> ';
						p += '<h3 class="blog-title">' + value.title + '</h3>';
						p += '<div class="blog-div">' + '<p class="blogPosts">' + value.text + '</p>' + '</div>' + '<hr class="blog-hr">';
						posts.push(p);
					} //if statement
					requestPage(posts, 1);
				}); //each function
			}); //getJSON
		}
	});
}

function requestPage(page, pn) { //POPULATING PAGE WITH BLOG POSTS
	var tp = page.length; //total posts
	var ipp = 3; //items per page
	var last = Math.ceil(tp / ipp); //number of pages
	var items = "";
	if (last < 1) {
		last = 1;
	}
	if (pn < 1) {
		pn = 1;
	}
	for (var i = (pn - 1) * ipp; i < ipp * pn; i++) {
		if ('undefined' === typeof page[i]) {} else {
			items += page[i];
		}
	}
	$('.blog-post').html(items).show();
	//PAGINATION CONTROLS
	var paginationCtrls = "";
	if (last != 1) {
		//previous button
		if (pn > 1) {
			paginationCtrls += '<button id="previous" class="page-control" style="margin-right: 70px; margin-left:auto;">prev</button>';
		} else {
			paginationCtrls += '<button id="previous" class="page-control disbtn" style="margin-right: 70px; margin-left:auto;" type="button" disabled>prev</button>';
		}
		//page counter
		paginationCtrls += '<span class="pages">' + pn + ' of ' + last + '</span>';
		//next button
		if (pn != last) {
			paginationCtrls += '<button id="next" class="page-control" style="margin-left:70px; margin-right:auto;">next</button>';
		} else {
			paginationCtrls += '<button id="next" class="page-control disbtn" style="margin-left: 70px; margin-right:auto;" type="button" disabled>next</button>';
		}
	}
	$('#pagination-controls').html(paginationCtrls);
	$('#previous').click(function() {
		pn = pn - 1;
		requestPage(page, pn);
	});
	$('#next').click(function() {
		pn = pn + 1;
		requestPage(page, pn);
	});
}
//slideshow
var makeBSS = function(el, options) {
		var $slideshows = document.querySelectorAll(el),
			// a collection of all of the slideshow
			$slideshow = {},
			Slideshow = {
				init: function(el, options) {
					this.counter = 0; // to keep track of current slide
					this.el = el; // current slideshow container    
					this.$items = el.querySelectorAll('figure'); // a collection of all of the slides, caching for performance
					this.numItems = this.$items.length; // total number of slides
					options = options || {}; // if options object not passed in, then set to empty object 
					options.auto = options.auto || false; // if options.auto object not passed in, then set to false
					this.opts = {
						auto: (typeof options.auto === "undefined") ? false : options.auto,
						speed: (typeof options.auto.speed === "undefined") ? 1500 : options.auto.speed,
						pauseOnHover: (typeof options.auto.pauseOnHover === "undefined") ? false : options.auto.pauseOnHover,
						fullScreen: (typeof options.fullScreen === "undefined") ? false : options.fullScreen,
						swipe: (typeof options.swipe === "undefined") ? false : options.swipe
					};
					this.$items[0].classList.add('bss-show'); // add show class to first figure 
					this.injectControls(el);
					this.addEventListeners(el);
					if (this.opts.auto) {
						this.autoCycle(this.el, this.opts.speed, this.opts.pauseOnHover);
					}
					if (this.opts.fullScreen) {
						this.addFullScreen(this.el);
					}
					if (this.opts.swipe) {
						this.addSwipe(this.el);
					}
				},
				showCurrent: function(i) {
					// increment or decrement this.counter depending on whether i === 1 or i === -1
					if (i > 0) {
						this.counter = (this.counter + 1 === this.numItems) ? 0 : this.counter + 1;
					} else {
						this.counter = (this.counter - 1 < 0) ? this.numItems - 1 : this.counter - 1;
					}
					// remove .show from whichever element currently has it 
					// http://stackoverflow.com/a/16053538/2006057
					[].forEach.call(this.$items, function(el) {
						el.classList.remove('bss-show');
					});
					// add .show to the one item that's supposed to have it
					this.$items[this.counter].classList.add('bss-show');
				},
				injectControls: function(el) {
					// build and inject prev/next controls
					// first create all the new elements
					var spanPrev = document.createElement("span"),
						spanNext = document.createElement("span"),
						docFrag = document.createDocumentFragment();
					// add classes
					spanPrev.classList.add('bss-prev');
					spanNext.classList.add('bss-next');
					// add contents
					spanPrev.innerHTML = '&laquo;';
					spanNext.innerHTML = '&raquo;';
					// append elements to fragment, then append fragment to DOM
					docFrag.appendChild(spanPrev);
					docFrag.appendChild(spanNext);
					el.appendChild(docFrag);
				},
				addEventListeners: function(el) {
					var that = this;
					el.querySelector('.bss-next').addEventListener('click', function() {
						that.showCurrent(1); // increment & show
					}, false);
					el.querySelector('.bss-prev').addEventListener('click', function() {
						that.showCurrent(-1); // decrement & show
					}, false);
					el.onkeydown = function(e) {
						e = e || window.event;
						if (e.keyCode === 37) {
							that.showCurrent(-1); // decrement & show
						} else if (e.keyCode === 39) {
							that.showCurrent(1); // increment & show
						}
					};
				},
				autoCycle: function(el, speed, pauseOnHover) {
					var that = this,
						interval = window.setInterval(function() {
							that.showCurrent(1); // increment & show
						}, speed);
					if (pauseOnHover) {
						el.addEventListener('mouseover', function() {
							interval = clearInterval(interval);
						}, false);
						el.addEventListener('mouseout', function() {
							interval = window.setInterval(function() {
								that.showCurrent(1); // increment & show
							}, speed);
						}, false);
					} // end pauseonhover
				},
				addFullScreen: function(el) {
					var that = this,
						fsControl = document.createElement("span");
					fsControl.classList.add('bss-fullscreen');
					el.appendChild(fsControl);
					el.querySelector('.bss-fullscreen').addEventListener('click', function() {
						that.toggleFullScreen(el);
					}, false);
				},
				addSwipe: function(el) {
					var that = this,
						ht = new Hammer(el);
					ht.on('swiperight', function(e) {
						that.showCurrent(-1); // decrement & show
					});
					ht.on('swipeleft', function(e) {
						that.showCurrent(1); // increment & show
					});
				},
				toggleFullScreen: function(el) {
					// https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
					if (!document.fullscreenElement && // alternative standard method
					!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
						if (document.documentElement.requestFullscreen) {
							el.requestFullscreen();
						} else if (document.documentElement.msRequestFullscreen) {
							el.msRequestFullscreen();
						} else if (document.documentElement.mozRequestFullScreen) {
							el.mozRequestFullScreen();
						} else if (document.documentElement.webkitRequestFullscreen) {
							el.webkitRequestFullscreen(el.ALLOW_KEYBOARD_INPUT);
						}
					} else {
						if (document.exitFullscreen) {
							document.exitFullscreen();
						} else if (document.msExitFullscreen) {
							document.msExitFullscreen();
						} else if (document.mozCancelFullScreen) {
							document.mozCancelFullScreen();
						} else if (document.webkitExitFullscreen) {
							document.webkitExitFullscreen();
						}
					}
				} // end toggleFullScreen
			}; // end Slideshow object 
		// make instances of Slideshow as needed
		[].forEach.call($slideshows, function(el) {
			$slideshow = Object.create(Slideshow);
			$slideshow.init(el, options);
		});
	};
var opts = {
	auto: {
		speed: 5000,
		pauseOnHover: true
	},
	fullScreen: true,
	swipe: true
};
makeBSS('.demo1', opts);