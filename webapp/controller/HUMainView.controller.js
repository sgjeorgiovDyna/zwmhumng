sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("zmwhumng.controller.HUMainView", {
            onInit: function () {

            },
            onMVScan: function (oEvent) {
                var navCon = this.getView().byId("navConMV");
                navCon.to(this.getView().byId("pageDocScan"));
            }
        });
    });
