// added live time & date with emojis 🤖
`use strict`;
function refreshTime() {
	const timeDisplay = document.getElementById('time');
	const dateString = new Date().toLocaleString();
	const formattedString = dateString.replace(', ', ' - ');
	timeDisplay.textContent = formattedString;
}
// 1 second refresh time
setInterval(refreshTime, 1000);

var app = new Vue({
	el: '#app',
	mounted() {},
	data: function () {
		return {
			demoImageUrl: 'https://spoonacular.com/recipeImages/635350-240x150.jpg',
			uploadUrl:
				'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/images/analyze',
			uploadHeaders: {
				'x-rapidapi-host':
					'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
				'x-rapidapi-key': '384023f0acmsh476a5f560383b2ep1e263djsnddfe29a727bb',
			},
			foodImages: [],
			analyzed: false,
			analyzedImage: {
				nutrition: {
					recipesUsed: 0,
					calories: {
						value: 0,
						unit: 'calories',
					},
					fat: {
						value: 0,
						unit: 'g',
					},
					protein: {
						value: 0,
						unit: 'g',
					},
					carbs: {
						value: 0,
						unit: 'g',
					},
				},
				category: {
					name: '',
					probability: 0,
				},
				recipes: [],
			},
			nutrition: {
				animationMaxWidth: 630, // maximum length for nutrition bars
				calories100: 800, // number of calories to reach max length
				protein100: 30, // number of grams of protein to reach max length
				fat100: 30, // number of grams of fat to reach max length
				carbs100: 30, // number of grams of carbs to reach max length
				calories: 0,
				protein: 0,
				fat: 0,
				carbs: 0,
			},
		};
	},
	computed: {
		probabilityText() {
			if (this.analyzedImage.category.probability < 0.2) {
				return 'I am really unsure about that!';
			}
			if (this.analyzedImage.category.probability < 0.4) {
				return 'Maybe - maybe not though.';
			}
			if (this.analyzedImage.category.probability < 0.6) {
				return 'Not really sure but looks like it.';
			}
			if (this.analyzedImage.category.probability < 0.8) {
				return 'I am rather confident in that.';
			}
			if (this.analyzedImage.category.probability < 1) {
				return "I'm almost certain!";
			}
		},
	},
	methods: {
		animate() {
			let self = this;
			var nutritionTimeline = anime.timeline({
				duration: 800,
				easing: 'easeInOutQuad',
			});
			nutritionTimeline
				.add({
					targets: 'div#calories div',
					width:
						self.nutrition.animationMaxWidth *
						Math.min(
							1,
							self.analyzedImage.nutrition.calories.value /
								self.nutrition.calories100
						),
					update: function (anim) {
						self.nutrition.calories = Math.round(
							(self.analyzedImage.nutrition.calories.value * anim.progress) /
								100
						);
					},
				})
				.add({
					targets: 'div#fat div',
					width:
						self.nutrition.animationMaxWidth *
						Math.min(
							1,
							self.analyzedImage.nutrition.fat.value / self.nutrition.fat100
						),
					update: function (anim) {
						self.nutrition.fat = Math.round(
							(self.analyzedImage.nutrition.fat.value * anim.progress) / 100
						);
					},
				})
				.add({
					targets: 'div#protein div',
					width:
						self.nutrition.animationMaxWidth *
						Math.min(
							1,
							self.analyzedImage.nutrition.protein.value /
								self.nutrition.protein100
						),
					update: function (anim) {
						self.nutrition.protein = Math.round(
							(self.analyzedImage.nutrition.protein.value * anim.progress) / 100
						);
					},
				})
				.add({
					targets: 'div#carbs div',
					width:
						self.nutrition.animationMaxWidth *
						Math.min(
							1,
							self.analyzedImage.nutrition.carbs.value / self.nutrition.carbs100
						),
					update: function (anim) {
						self.nutrition.carbs = Math.round(
							(self.analyzedImage.nutrition.carbs.value * anim.progress) / 100
						);
					},
				});

			nutritionTimeline.add({
				targets: '#hungry',
				opacity: 1,
				duration: 150,
			});

			// recipes
			nutritionTimeline.add({
				targets: '.recipe',
				width: 240,
				opacity: 1,
				rotate: '1turn',
				delay: anime.stagger(150),
			});

			// logo
			nutritionTimeline.add({
				targets: '#spoonacular',
				opacity: 1,
				rotate: '1turn',
			});
		},
		// this will be called after the API responds with the image analysis
		successCallback(data) {
			this.analyzedImage = data;
			this.analyzed = true;
			let self = this;
			Vue.nextTick(function () {
				self.animate();
			});
		},
		onUpload(responses) {
			this.successCallback(responses[0].data);
		},
		// we upload a file directly after it has been added to the upload container
		onSelect(event) {
			this.analyzed = false;
			this.uploadFiles();
		},
		// using the default uploader, you may use another uploader instead
		uploadFiles: function () {
			this.$refs.vueFileAgent.upload(
				this.uploadUrl,
				this.uploadHeaders,
				this.foodImages
			);
		},
		// make a direct GET request with an image URL instead of a file
		analyzeWithDemo() {
			anime({
				targets: '#demoImg',
				scale: [1, 0.5],
				opacity: [1, 0.5],
				rotate: [0, 10, -10],
				loop: true,
				direction: 'alternate',
				easing: 'easeInOutSine',
				duration: 800,
			});

			let self = this;
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
					self.successCallback(JSON.parse(xmlHttp.responseText));
				}
			};
			var url =
				this.uploadUrl + '?imageUrl=' + encodeURIComponent(this.demoImageUrl);
			xmlHttp.open('GET', url, true);
			xmlHttp.setRequestHeader(
				'x-rapidapi-host',
				this.uploadHeaders['x-rapidapi-host']
			);
			xmlHttp.setRequestHeader(
				'x-rapidapi-key',
				this.uploadHeaders['x-rapidapi-key']
			);
			xmlHttp.send(null);
		},
	},
	components: {
		vuefileagent: VueFileAgent.VueFileAgent,
	},
});

// !============================ END OF FOOD APP ===================================

// ----------------------------------------------------------------ADD COMMENTS

$('#gif').on('click', function () {
	// Storing our giphy API URL for a random cat image
	var queryURL =
		'https://api.giphy.com/v1/gifs/random?api_key=SKLNraUhoUaUYGOBM5PcTbvhMuRCAmup';

	// Perfoming an AJAX GET request to our queryURL
	$.ajax({
		url: queryURL,
		method: 'GET',
	})

		// After the data from the AJAX request comes back
		.then(function (response) {
			$('#images').empty();
			// Saving the image_original_url property
			var imageUrl = response.data.images.original.url;

			// Creating and storing an image tag
			var randomGif = $('<img>');

			// Setting the randomGif src attribute to imageUrl
			randomGif.attr('src', imageUrl);
			randomGif.attr('alt', 'random gif');
			randomGif.attr('id', 'new');

			// Prepending the randomGif to the images div
			$('#images').prepend(randomGif);
		});
});
