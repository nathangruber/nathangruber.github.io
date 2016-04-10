$(document).ready(function() {
	$("#bio-btn").click(function(){
		$("#bio").slideToggle(900, 'swing');
	});
	blogposter();
});

// JSON HANDLER
function blogposter(){
	var posts = [];
	$.getJSON('assets/js/blogging.json', function(data){
				$(data.entries).each(function(index, value){
					var p = '<small class="date">' + value.date + '</small> ';
					p += '<h3 class="blog-title">' + value.title + '</h3>';
					p += '<div class="blog-div">' +'<p class="blogPosts">' + value.text + '</p>' + '</div>' + '<hr class="blog-hr">';
			 
	    			posts.push(p);
				});
				request_page(posts, 1);
			});
	
	$('#search').keyup(function(){
		var searchField = $('#search').val();
		// console.log(searchField);



		if (searchField != -1){
			posts = [];
			var regex = new RegExp(searchField, "i");

			$.getJSON('assets/js/blogging.json', function(data){
				$(data.entries).each(function(index, value){
					if ((value.date.search(regex) != -1) || (value.title.search(regex) != -1) || (value.text.search(regex) != -1)){
						var p = '<small class="date">' + value.date + '</small> ';
						p += '<h3 class="blog-title">' + value.title + '</h3>';
						p += '<div class="blog-div">' +'<p class="blogPosts">' + value.text + '</p>' + '</div>' + '<hr class="blog-hr">';
			 
	        			posts.push(p);
	    			}//if statement
	    			request_page(posts, 1);
				});//each function
		    });//getJSON
		} 	
	});	  		
}
function request_page(page, pn){

	//POPULATING PAGE WITH BLOG POSTS

	var tp = page.length; //total posts
	var ipp = 3; //items per page
	var last = Math.ceil(tp/ipp); //number of pages
	var items = "";

		if (last < 1){
			last = 1;
		}
		if (pn < 1){
			pn = 1;
		}


		for (var i = (pn - 1) * ipp ; i < ipp * pn; i++){
			if ('undefined' === typeof page[i]){
				 
			}else{
				items += page[i]; 
			}	
		}

		$('.blog-post').html(items).show();

	
	//PAGINATION CONTROLS

	var paginationCtrls = ""; 
	
		if (last != 1){
			//previous button
			if (pn > 1){
				paginationCtrls += '<button id="previous" class="page-control" style="margin-right: 70px; margin-left:auto;">prev</button>';
			} else{
				paginationCtrls += '<button id="previous" class="page-control disbtn" style="margin-right: 70px; margin-left:auto;" type="button" disabled>prev</button>';
			}

			//page counter
			paginationCtrls += '<span class="pages">' + pn +' of '+ last + '</span>';

			//next button
			if (pn != last){
				paginationCtrls += '<button id="next" class="page-control" style="margin-left:70px; margin-right:auto;">next</button>';
			} else {
				paginationCtrls += '<button id="next" class="page-control disbtn" style="margin-left: 70px; margin-right:auto;" type="button" disabled>next</button>';
			}

		}	
		
	$('#pagination-controls').html(paginationCtrls);

	$('#previous').click(function(){
		pn = pn - 1;
		request_page(page, pn);
	});
	$('#next').click(function(){
		pn = pn + 1;
		request_page(page, pn);
	});

}