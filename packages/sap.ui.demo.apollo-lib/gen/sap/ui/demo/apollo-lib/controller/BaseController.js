sap.ui.define(["sap/ui/core/mvc/Controller", "@apollo/client/core"], function (Controller, ___apollo_client_core) {
  const ApolloClient = ___apollo_client_core["ApolloClient"];
  const InMemoryCache = ___apollo_client_core["InMemoryCache"];
  /**
   * @namespace sap.ui.demo.apollo-lib.controller
   */

  const BaseController = Controller.extend("sap.ui.demo.apollo-lib.controller.BaseController", {
    onInit: function _onInit() {
      const datasources = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources");
      const gqlsvcs = Object.keys(datasources).filter(ds => {
        return datasources[ds].type == "GraphQL";
      });
      const gqlsvc = datasources[gqlsvcs.shift()];
      this.client = new ApolloClient({
        uri: gqlsvc.uri,
        cache: new InMemoryCache()
      });
      this.$query = this.client.query;
    }
  });
  return BaseController;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zYXAvdWkvZGVtby9hcG9sbG8tbGliL2NvbnRyb2xsZXIvQmFzZUNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsiQXBvbGxvQ2xpZW50IiwiSW5NZW1vcnlDYWNoZSIsIkJhc2VDb250cm9sbGVyIiwiQ29udHJvbGxlciIsIm9uSW5pdCIsImRhdGFzb3VyY2VzIiwiZ2V0T3duZXJDb21wb25lbnQiLCJnZXRNYW5pZmVzdEVudHJ5IiwiZ3Fsc3ZjcyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJkcyIsInR5cGUiLCJncWxzdmMiLCJzaGlmdCIsImNsaWVudCIsInVyaSIsImNhY2hlIiwiJHF1ZXJ5IiwicXVlcnkiXSwibWFwcGluZ3MiOiI7UUFNQ0EsWTtRQUNBQyxhO0FBT0Q7QUFDQTtBQUNBOztRQUNxQkMsYyxHQUF1QkMsVTtBQUlwQ0MsSUFBQUEsTSxxQkFBZ0I7QUFFdEIsWUFBTUMsV0FBVyxHQUFHLEtBQUtDLGlCQUFMLEdBQXlCQyxnQkFBekIsQ0FBMEMsc0JBQTFDLENBQXBCO0FBQ0EsWUFBTUMsT0FBTyxHQUFHQyxNQUFNLENBQUNDLElBQVAsQ0FBWUwsV0FBWixFQUF5Qk0sTUFBekIsQ0FBZ0NDLEVBQUUsSUFBSTtBQUNyRCxlQUFPUCxXQUFXLENBQUNPLEVBQUQsQ0FBWCxDQUFnQkMsSUFBaEIsSUFBd0IsU0FBL0I7QUFDQSxPQUZlLENBQWhCO0FBR0EsWUFBTUMsTUFBTSxHQUFHVCxXQUFXLENBQUNHLE9BQU8sQ0FBQ08sS0FBUixFQUFELENBQTFCO0FBRUEsV0FBS0MsTUFBTCxHQUFjLElBQUloQixZQUFKLENBQWdDO0FBQzdDaUIsUUFBQUEsR0FBRyxFQUFFSCxNQUFNLENBQUNHLEdBRGlDO0FBRTdDQyxRQUFBQSxLQUFLLEVBQUUsSUFBSWpCLGFBQUo7QUFGc0MsT0FBaEMsQ0FBZDtBQUtBLFdBQUtrQixNQUFMLEdBQWMsS0FBS0gsTUFBTCxDQUFZSSxLQUExQjtBQUVBOztTQW5CbUJsQixjIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1tZW1iZXItYWNjZXNzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWFzc2lnbm1lbnQgKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtY2FsbCAqL1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSBcInNhcC91aS9jb3JlL212Yy9Db250cm9sbGVyXCI7XG5cbmltcG9ydCB7XG5cdEFwb2xsb0NsaWVudCxcblx0SW5NZW1vcnlDYWNoZSxcblx0T3BlcmF0aW9uVmFyaWFibGVzLFxuXHRRdWVyeU9wdGlvbnMsXG5cdEFwb2xsb1F1ZXJ5UmVzdWx0LFxuXHRncWxcbn0gZnJvbSBcIkBhcG9sbG8vY2xpZW50L2NvcmVcIjtcblxuLyoqXG4gKiBAbmFtZXNwYWNlIHNhcC51aS5kZW1vLmFwb2xsby1saWIuY29udHJvbGxlclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXIge1xuXG5cdHB1YmxpYyBjbGllbnQ6IEFwb2xsb0NsaWVudDxJbk1lbW9yeUNhY2hlPjtcblxuXHRwdWJsaWMgb25Jbml0KCkgOiB2b2lkIHtcblxuXHRcdGNvbnN0IGRhdGFzb3VyY2VzID0gdGhpcy5nZXRPd25lckNvbXBvbmVudCgpLmdldE1hbmlmZXN0RW50cnkoXCIvc2FwLmFwcC9kYXRhU291cmNlc1wiKTtcblx0XHRjb25zdCBncWxzdmNzID0gT2JqZWN0LmtleXMoZGF0YXNvdXJjZXMpLmZpbHRlcihkcyA9PiB7XG5cdFx0XHRyZXR1cm4gZGF0YXNvdXJjZXNbZHNdLnR5cGUgPT0gXCJHcmFwaFFMXCI7XG5cdFx0fSk7XG5cdFx0Y29uc3QgZ3Fsc3ZjID0gZGF0YXNvdXJjZXNbZ3Fsc3Zjcy5zaGlmdCgpXTtcblxuXHRcdHRoaXMuY2xpZW50ID0gbmV3IEFwb2xsb0NsaWVudDxJbk1lbW9yeUNhY2hlPih7XG5cdFx0XHR1cmk6IGdxbHN2Yy51cmksXG5cdFx0XHRjYWNoZTogbmV3IEluTWVtb3J5Q2FjaGUoKVxuXHRcdH0pO1xuXG5cdFx0dGhpcy4kcXVlcnkgPSB0aGlzLmNsaWVudC5xdWVyeVxuXG5cdH1cblxufSJdfQ==