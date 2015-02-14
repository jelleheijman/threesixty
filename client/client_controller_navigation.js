if (Meteor.isClient) {
	Template.navigation.helpers({
		activeIfTemplateIs: function (template) {
			  var currentRoute = Router.current();
			  var currentTemplate = currentRoute.lookupTemplate();
			  if (template == currentTemplate){
				  return "active";
			  } else {
				  return "";
			  }
		}
	});
}


