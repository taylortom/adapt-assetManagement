// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var Origin = require('core/origin');
  var AssetManagementRefineModule = require('./assetManagementRefineModule');

  var AssetManagementSortModule = AssetManagementRefineModule.extend({
    className: 'sort',
    title: Origin.l10n.t('app.refinesorttitle'),
    filterType: 'sort',

    events: {
      'click .radio input': 'onRadioClicked'
    },

    resetFilter: function() {
      this.$('input[id=title]').click();
    },

    onRadioClicked: function(e) {
      var sort = {};
      switch(e.currentTarget.id) {
        case "title":
          sort.title = 1;
          break;
        case "uploaded":
          sort.createdAt = -1;
          break;
        case "edited":
          sort.updatedAt = -1;
          break;
      }
      this.applyFilter(sort);
    }
  }, {
    template: 'assetManagementSortModule'
  });

  return AssetManagementSortModule;
});
