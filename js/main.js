$(function() {

	// MODEL
	var model = {
		// currentCat keeps track of selected current cat
		currentCat: null,
		// init will initialize array of cats and is called from octopus (controller)
		init: function() {
			this.catArr = [
				{
					"name": "Blackie",
					"count": 0,
					"url" : "images/blacky.jpg"
				},
				{
					"name": "Chewie",
					"count": 0,
					"url" : "images/chewie.jpg"
				},
				{
					"name": "Snow",
					"count": 0,
					"url" : "images/snow.jpg"
				},
				{
					"name": "Olive",
					"count": 0,
					"url" : "images/olive.jpg"
				},
				{
					"name": "Jetske",
					"count": 0,
					"url" : "images/jetske.jpg"
				}
			]
		},
		// returns array of cats
		getAllCats: function() {
			return this.catArr;
		}
	}


	// CONTROLLER
	var octopus = {
		// init executes other inits from views and model.
		// that takes care of event bindings as well.
		init: function() {
			model.init();
			viewList.init();
			viewPlay.init();
			viewAdmin.init();
		},

		// get the cats from model and forward/returns it to view
		getCats: function() {
			return model.getAllCats();
		},

		// displayCat gets the cats from model and pass the details
		// of user chosen cat to view to render.
		displayCat: function(catName) {
			var cats = model.getAllCats();
			var catFound = null;
			for(var i = 0 ; i <cats.length ; i++) {
				if(cats[i].name === catName) {
					catFound = cats[i];
					currentCat = catFound;
				}
			}
			// render selected cat
			viewPlay.render(catFound);
		},

		// clickCount calculates the clicks
		clickCount: function(catName) {
			var cats = model.getAllCats();
			var catFound = null;
			for(var i = 0 ; i <cats.length ; i++) {
				if(cats[i].name === catName) {
					cats[i].count++;
					return viewPlay.render(cats[i]);
				}
			}
		},

		// updateCat updates the cat's name, image and count passed by admin
		updateCat: function(name,url,count) {
			var cat = currentCat;
			cat.name = name;
			cat.url = url;
			cat.count = count;
			// render cat after update with new values
			viewPlay.render(cat);
		}
	}

	// VIEW-LIST takes care of displaying lists of cat in UI
	var viewList = {
		// initializes variables and attaches event listner
		init: function() {
			this.$catList = $('.cat-list');

			this.$catList.on("click",'.show-cat',function(){
				var catName = $(this).parent().attr("class");
				octopus.displayCat(catName);
			});

			// disable admin button and no cat is selected on page load
			// and user should not be allowed to modify cat.
			$('.admin-btn').attr("disabled", true);
			// render cat
			viewList.render();

		},
		// render displays list of cats in UI
		render: function() {
			var htmlStr ='';
			octopus.getCats().forEach(function(cat){
				htmlStr += '<li class="' + cat.name + '">' +
				'<a href="#" class="show-cat">' + cat.name +'</a></li>';
			});
			this.$catList.html(htmlStr);
		}
	}


	// VIEW-Play takes care of displaying cat's name, image and count
	// of cat selected by user from list
	var viewPlay = {
		init: function() {
			this.$list = $('.selected-cat');

			this.$list.on("click",'.count-click',function(){
				var obj = ($(this).data());
				octopus.clickCount(obj.id);
			});
		},
		render: function(cat) {
			//empty textbox values
			$('.text-name').val("");
			$('.text-url').val("");
			$('.text-count').val("");

			var htmlStr='';
			this.$list = $('.selected-cat');
			htmlStr = '<li><span>' + cat.name + '</span></br>' +
						'<img src="' + cat.url + '" class="count-click" data-id="' + cat.name + '"></br>' +
						'<span>' + cat.count + '</span></li>';

			this.$list.html(htmlStr);
			$('.admin-btn').attr("disabled", false);
		}
	}

	// VIEW-Admin takes care of displaying text boxes for new cat values in UI and
	// updating cat details.
	var viewAdmin = {
		init: function() {
			var adminBtn = $('.admin-btn');
			var cancelBtn = $('.cancel-btn');
			var saveBtn = $('.save-btn');
			var txtName = $('.text-name');
			var txtUrl = $('.text-url');
			var txtCount = $('.text-count');
			var $inputSection = $('.input-section');

			$inputSection.hide();

			adminBtn.click(function(){
				$inputSection.show();
				txtName.val("");
				txtUrl.val("");
				txtCount.val("");
			});

			cancelBtn.click(function(){
				$inputSection.hide();
			});

			saveBtn.click(function(){
				var newName = txtName.val();
				var newUrl = txtUrl.val();
				var newCount = txtCount.val();
				octopus.updateCat(newName,newUrl,newCount);
			});
		}

	}

	octopus.init();
}());