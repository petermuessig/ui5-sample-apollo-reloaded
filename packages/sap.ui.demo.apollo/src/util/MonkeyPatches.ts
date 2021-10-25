// #### START OF MONKEY PATCH: AVOID DOUBLE EVENTS OF WEB COMPONENTS WITH DATABINDING
import Control from "sap/ui/core/Control";
import WebComponent from "sap/ui/webc/common/WebComponent";

export default function applyMonkeyPatches() {

WebComponent.prototype.clone = function() {
	// @ts-ignore
	this.__detachCustomEventsListeners();
	// @ts-ignore
	const retVal = Control.prototype.clone.apply(this, arguments);
	// @ts-ignore
	this.__attachCustomEventsListeners();
	return retVal;
};
// #### END OF MONKEY PATCH

}