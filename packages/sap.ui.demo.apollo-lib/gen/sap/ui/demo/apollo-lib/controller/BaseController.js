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
    }
  });
  return BaseController;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zYXAvdWkvZGVtby9hcG9sbG8tbGliL2NvbnRyb2xsZXIvQmFzZUNvbnRyb2xsZXIudHMiXSwibmFtZXMiOlsiQXBvbGxvQ2xpZW50IiwiSW5NZW1vcnlDYWNoZSIsIkJhc2VDb250cm9sbGVyIiwiQ29udHJvbGxlciIsIm9uSW5pdCIsImRhdGFzb3VyY2VzIiwiZ2V0T3duZXJDb21wb25lbnQiLCJnZXRNYW5pZmVzdEVudHJ5IiwiZ3Fsc3ZjcyIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJkcyIsInR5cGUiLCJncWxzdmMiLCJzaGlmdCIsImNsaWVudCIsInVyaSIsImNhY2hlIl0sIm1hcHBpbmdzIjoiO1FBTUNBLFk7UUFDQUMsYTtBQUdEO0FBQ0E7QUFDQTs7UUFDcUJDLGMsR0FBdUJDLFU7QUFJcENDLElBQUFBLE0scUJBQWdCO0FBRXRCLFlBQU1DLFdBQVcsR0FBRyxLQUFLQyxpQkFBTCxHQUF5QkMsZ0JBQXpCLENBQTBDLHNCQUExQyxDQUFwQjtBQUNBLFlBQU1DLE9BQU8sR0FBR0MsTUFBTSxDQUFDQyxJQUFQLENBQVlMLFdBQVosRUFBeUJNLE1BQXpCLENBQWdDQyxFQUFFLElBQUk7QUFDckQsZUFBT1AsV0FBVyxDQUFDTyxFQUFELENBQVgsQ0FBZ0JDLElBQWhCLElBQXdCLFNBQS9CO0FBQ0EsT0FGZSxDQUFoQjtBQUdBLFlBQU1DLE1BQU0sR0FBR1QsV0FBVyxDQUFDRyxPQUFPLENBQUNPLEtBQVIsRUFBRCxDQUExQjtBQUVBLFdBQUtDLE1BQUwsR0FBYyxJQUFJaEIsWUFBSixDQUFnQztBQUM3Q2lCLFFBQUFBLEdBQUcsRUFBRUgsTUFBTSxDQUFDRyxHQURpQztBQUU3Q0MsUUFBQUEsS0FBSyxFQUFFLElBQUlqQixhQUFKO0FBRnNDLE9BQWhDLENBQWQ7QUFLQTs7U0FqQm1CQyxjIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1tZW1iZXItYWNjZXNzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWFzc2lnbm1lbnQgKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtY2FsbCAqL1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSBcInNhcC91aS9jb3JlL212Yy9Db250cm9sbGVyXCI7XG5cbmltcG9ydCB7XG5cdEFwb2xsb0NsaWVudCxcblx0SW5NZW1vcnlDYWNoZVxufSBmcm9tIFwiQGFwb2xsby9jbGllbnQvY29yZVwiO1xuXG4vKipcbiAqIEBuYW1lc3BhY2Ugc2FwLnVpLmRlbW8uYXBvbGxvLWxpYi5jb250cm9sbGVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VDb250cm9sbGVyIGV4dGVuZHMgQ29udHJvbGxlciB7XG5cblx0cHVibGljIGNsaWVudDogQXBvbGxvQ2xpZW50PEluTWVtb3J5Q2FjaGU+O1xuXG5cdHB1YmxpYyBvbkluaXQoKSA6IHZvaWQge1xuXG5cdFx0Y29uc3QgZGF0YXNvdXJjZXMgPSB0aGlzLmdldE93bmVyQ29tcG9uZW50KCkuZ2V0TWFuaWZlc3RFbnRyeShcIi9zYXAuYXBwL2RhdGFTb3VyY2VzXCIpO1xuXHRcdGNvbnN0IGdxbHN2Y3MgPSBPYmplY3Qua2V5cyhkYXRhc291cmNlcykuZmlsdGVyKGRzID0+IHtcblx0XHRcdHJldHVybiBkYXRhc291cmNlc1tkc10udHlwZSA9PSBcIkdyYXBoUUxcIjtcblx0XHR9KTtcblx0XHRjb25zdCBncWxzdmMgPSBkYXRhc291cmNlc1tncWxzdmNzLnNoaWZ0KCldO1xuXG5cdFx0dGhpcy5jbGllbnQgPSBuZXcgQXBvbGxvQ2xpZW50PEluTWVtb3J5Q2FjaGU+KHtcblx0XHRcdHVyaTogZ3Fsc3ZjLnVyaSxcblx0XHRcdGNhY2hlOiBuZXcgSW5NZW1vcnlDYWNoZSgpXG5cdFx0fSk7XG5cblx0fVxuXG59XG4iXX0=