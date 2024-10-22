sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageStrip"
],
    function (Controller, JSONModel, MessageToast, MessageStrip) {
        "use strict";

        return Controller.extend("zmwhumng.controller.HUMainView", {
            onInit: function () {
                this.setViewModel(new this.newSett(), 'mHUSett');
                this.getView().byId("inMVScan").focus();
            },
            onMVScan: function (oEvent) {
                let returnMsg = this.checkScannedHU();
                if (returnMsg) {
                    let vbox = this.getView().byId("vbMsgStrip");
                    this.newMsgStrip(returnMsg, vbox, "msgStrip");
                    return;
                }

                this.loadMockData("mockdata/huDoc.json", "mHUDoc");
                var navCon = this.getView().byId("navConMV");
                navCon.to(this.getView().byId("pageDocScan"));
                setTimeout(function () {
                    this.getView().byId("inDocScan").focus();
                }.bind(this), 500);

            },
            onDocScanScan: function (oEvent) {
                let returnMsg = this.checkScannedDoc();
                if (returnMsg) {
                    let vbox = this.getView().byId("vbScanDocMsgStrip");
                    this.newMsgStrip(returnMsg, vbox, "msgSDStrip");
                    return;
                }

                this.loadMockData("mockdata/matList.json", "mMatList");
                var navCon = this.getView().byId("navConMV");
                navCon.to(this.getView().byId("pageMatList"));
                setTimeout(function () {
                    this.getView().byId("inMatSearch").focus();
                }.bind(this), 500);
            },
            newSett: function () {
                this.EXIDV = '';
                this.DOCNO = '';
                this.LISTNO = '8104926';
                this.FROM = 'MAM1';
                this.DEST = 'CMA1';
                this.SELALL = false;
            },
            setViewModel: function (mData, mName) {
                let oModel = new JSONModel();
                oModel.setData(mData);
                this.getView().setModel(oModel, mName);
                this.getView().getModel(mName).refresh();
            },
            loadMockData: async function (fName, mName) {
                let oModel = new JSONModel();
                await oModel.loadData(fName);
                this.getView().setModel(oModel, mName);
                this.getView().getModel(mName).refresh();
            },
            onNavTo: function (oEvent, to) {
                var navCon = this.getView().byId("navConMV");
                navCon.to(this.getView().byId(to));

                let vbox = this.getView().byId("vbMsgStrip");
                this.destroyMsgStrip(vbox);
                vbox = this.getView().byId("vbScanDocMsgStrip");
                this.destroyMsgStrip(vbox);
            },
            checkScannedHU: function () {
                let msg = "";
                let oModel = this.getView().getModel("mHUSett");
                let oData = oModel.getData();

                if (!oData.EXIDV) {
                    msg = this.getView().getModel("i18n").getResourceBundle().getText("errScanHU");
                    return msg;
                }
                return msg;
            },
            checkScannedDoc: function () {
                let msg = "";
                let oModel = this.getView().getModel("mHUSett");
                let oData = oModel.getData();

                if (!oData.DOCNO) {
                    msg = this.getView().getModel("i18n").getResourceBundle().getText("errScanDoc");
                    return msg;
                }
                return msg;
            },
            onSelAll: function (oEvent) {
                let isSel = oEvent.getParameter("selected");
                let oModel = this.getView().getModel("mMatList");
                let oData = oModel.getData();

                oData.forEach(function (m) {
                    m.SEL = isSel;
                });
                oModel.refresh();
            },
            onItmSel: function (oEvent) {
                let itmSel = oEvent.getParameter("selected");
                let selAll = this.getView().byId("cbSelAll").getSelected();
                let oModel = this.getView().getModel("mHUSett");
                let oModelList = this.getView().getModel("mMatList");
                let oData = oModel.getData();
                let oDataList = oModelList.getData();

                if (!itmSel && selAll) {
                    oData.SELALL = false;
                }

                if (itmSel && !selAll) {
                    let isNoSel = oDataList.find(function (l) {
                        return l.SEL === false;
                    });

                    (isNoSel) ? oData.SELALL = false : oData.SELALL = true;
                }
                oModel.refresh();
            },
            newMsgStrip: function (txt, vbox, name) {
                //let vbox = this.getView().byId("vbMsgStrip")
                let vboxItm = vbox.getItems();

                if (vboxItm.length > 0) {
                    vboxItm[0].destroy();
                    vbox.removeAllItems();
                }


                let oMsgStrip = new MessageStrip(name, {
                    text: txt,
                    showCloseButton: false,
                    showIcon: true,
                    type: 'Information'
                });

                vbox.addItem(oMsgStrip);
            },
            destroyMsgStrip: function (vbox) {
                let vboxItm = vbox.getItems();
                if (vboxItm.length > 0) vboxItm[0].destroy();
            }
        });
    });
