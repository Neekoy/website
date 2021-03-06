console.log("Greetings from the main controller.");

var socket = io();

var app = angular.module('mainApp', ['ngCookies']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

app.controller('mainController', function($scope, $http, $cookies) {

	if (typeof $cookies.get("itemsInCart") === "undefined") {
		$cookies.put("itemsInCart", 0);
		this.itemsInCart = 0;
	} else {
		this.itemsInCart = $cookies.get("itemsInCart");
		this.products = $cookies.getObject("productsInCart");
	}
	this.itemsInCartFormatted = "(" + this.itemsInCart + ")";

	$scope.$watch('$viewContentLoaded', function() {
		console.log("The content has been fully loaded.");
	});

	this.tab = "main";
	this.gameActive = false;
	this.username = "";

	this.changeTab = function(tab) {
		this.tab = tab;
	};

	this.activeTab = function(tab) {
		return this.tab === tab;
	};

	this.addToCart = function(boughtStuff, size, timeFrame) {

		this.itemsInCart = $cookies.get("itemsInCart");
		this.itemsInCart = parseFloat(this.itemsInCart) + 1;
		$cookies.put("itemsInCart", this.itemsInCart);
		this.itemsInCartFormatted = "(" + this.itemsInCart + ")";

		id = guid();

		if (boughtStuff === "Cloud") {
			type = "hosting";
			if (size === "Basic") {
				if (timeFrame === "monthly") {
					price = 4.99;
				}
				else if (timeFrame === "yearly") {
					price = 49.99;
				}
			}
			if (size === "Standard") {
				if (timeFrame === "monthly") {
					price = 7.99;
				}
				else if (timeFrame === "yearly") {
					price = 79.99;
				}
			}
			if (size === "Pro") {
				if (timeFrame === "monthly") {
					price = 9.99;
				}
				else if (timeFrame === "yearly") {
					price = 99.99;
				}
			}
			if (size === "Ultimate") {
				if (timeFrame === "monthly") {
					price = 19.99;
				}
				else if (timeFrame === "yearly") {
					price = 199.99;
				}
			}			
		} else {
			type = "undefined";
		}

		if (typeof $cookies.get("productsInCart") === "undefined") {
			this.products = {};

			this.products[id] = {
				type: type,
				product: boughtStuff,
				size: size,
				timeframe: timeFrame,
				price: price,
				id: id
			};

			$cookies.putObject("productsInCart", this.products);
		} else {
			this.products = $cookies.getObject("productsInCart");
			this.products[id] = {
				type: type,
				product: boughtStuff,
				size: size,
				timeframe: timeFrame,
				price: price,
				id: id
			};
			$cookies.putObject("productsInCart", this.products);
		}
		console.log(this.products);
	}

	this.getNumberInCart = function(num) {
    	return new Array(num);
	}

	this.getProductDesc = function(prodName) {
		if (prodName === "Cloud") {
			return "Cloud Hosting";
		} else {
			return "Other service";
		}
	}

	this.getProductSize = function(prodName, prodSize) {
		if (prodName === "Cloud") {
			return prodSize + " Plan";
		}
		else {
			return "One size";
		}
	}

	this.calculateTotal = function(which) {
		if (typeof $cookies.get("productsInCart") === "undefined") {
			return 0;
		} else {
			products = $cookies.getObject("productsInCart");
			subtotal = 0;
			for (item in products) {
				subtotal = subtotal + products[item].price;
			}
			if (which === 'subtotal') {
				return subtotal.toFixed(2);
			} else if (which === 'vat') {
				result = subtotal/5;
				return result.toFixed(2);
			} else {
				vat = subtotal / 5;
				result = subtotal + vat;
				return result.toFixed(2);
			}
		}
	}

	this.toggleCart = function() {
		this.showCart = !this.showCart;
	}

	this.removeFromCart = function(key) {
		products = $cookies.getObject("productsInCart");
		for (product in products) {
			if (product === key.id) {
				delete products[product];
				this.products = products;
				$cookies.putObject("productsInCart", products);

				this.itemsInCart = $cookies.get("itemsInCart");
				this.itemsInCart = parseFloat(this.itemsInCart) - 1;
				$cookies.put("itemsInCart", this.itemsInCart);
				this.itemsInCartFormatted = "(" + this.itemsInCart + ")";
			}
		}
	}

	this.emptyCart = function() {
		$cookies.remove("productsInCart");
		$cookies.put("itemsInCart", 0);
		this.itemsInCart = 0;
		this.itemsInCartFormatted = "(" + this.itemsInCart + ")";
	}
});