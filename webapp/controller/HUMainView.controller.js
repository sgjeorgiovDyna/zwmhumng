sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageStrip",
    'sap/m/Button',
    "sap/ui/core/Fragment"
],
    function (Controller, JSONModel, MessageToast, MessageStrip, Button, Fragment) {
        "use strict";

        return Controller.extend("zmwhumng.controller.HUMainView", {
            onInit: function () {
                this.loadMockData("mockdata/sett.json", "mHUSett");
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
            },
            onWithdrawnQty: function (oEvent) {
                let selMat = oEvent.getSource().getParent().getBindingContext("mMatList").getObject();
                this.setViewModel(selMat, "mWithDrawn");
                this.withdrawnQty(oEvent);
            },
            withdrawnQty: async function (oEvent) {
                let oView = this.getView();

                if (!this.oDialogWithdrawnQty) {
                    this.oDialogWithdrawnQty = await Fragment.load({
                        id: this.getView().getId(),
                        name: "zmwhumng.view.fragments.dialogs.diaWithdrawnQty",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }

                if (this.oDialogWithdrawnQty) {
                    let oButton = this.newBtnCancelDia(this.oDialogWithdrawnQty);
                    let oButtonSave = this.newBtnSaveDia(this.oDialogWithdrawnQty);
                    this.oDialogWithdrawnQty.setBeginButton(oButton);
                    this.oDialogWithdrawnQty.setEndButton(oButtonSave);
                    this.oDialogWithdrawnQty.open();
                }
            },
            newBtnCancelDia: function (dia) {
                let btn = new Button({
                    text: this.getView().getModel("i18n").getResourceBundle().getText("btnCancelDia"),
                    width: "47%",
                    icon: "sap-icon://action-settings",
                    press: function () {
                        this.handleCloseDia(dia);
                    }.bind(this)
                });

                btn.addStyleClass("btnFoo");
                return btn;
            },
            newBtnSaveDia: function (dia) {
                let btn = new Button({
                    text: this.getView().getModel("i18n").getResourceBundle().getText("btnSaveDia"),
                    width: "48%",
                    type: "Emphasized",
                    icon: "sap-icon://save",
                    press: function () {
                        this.handleCloseDia(dia);
                    }.bind(this)
                });

                btn.addStyleClass("btnSaveFoo")
                return btn;
            },
            handleCloseDia: function (diaObj) {
                if (diaObj) {
                    diaObj.close();
                }
            },
            onLiveSearchMatList: function (evt) {
                let val = evt.getParameter("newValue");
                let binding = this.getView().byId("listMat").getBinding("items");
                var filter = new sap.ui.model.Filter("SEARCH", "Contains", val);
                binding.filter([filter]);
            },
        });
    });
