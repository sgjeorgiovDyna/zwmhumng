/*global QUnit*/

sap.ui.define([
	"zmwhumng/controller/HUMainView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("HUMainView Controller");

	QUnit.test("I should test the HUMainView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
