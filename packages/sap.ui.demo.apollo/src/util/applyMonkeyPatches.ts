/* eslint-disable prefer-rest-params */

/*
 * Monkey Patch will be unneccessary for UI5 > 1.97.0!
 */

import Control from "sap/ui/core/Control";
import WebComponent from "sap/ui/webc/common/WebComponent";

(function applyMonkeyPatches() {
  // #### START OF MONKEY PATCH: AVOID DOUBLE EVENTS OF WEB COMPONENTS WITH DATABINDING
  WebComponent.prototype.clone = function () {
    // @ts-ignore
    this.__detachCustomEventsListeners();
    // @ts-ignore
    const retVal = Control.prototype.clone.apply(this, arguments);
    // @ts-ignore
    this.__attachCustomEventsListeners();
    return retVal;
  };
  // #### END OF MONKEY PATCH
})();
