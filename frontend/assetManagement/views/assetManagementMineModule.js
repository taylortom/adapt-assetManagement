// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var Origin = require('core/origin');
  var AssetManagementRefineModule = require('./assetManagementRefineModule');

  var AssetManagementMineModule = AssetManagementRefineModule.extend({
    className: 'mine',
    title: Origin.l10n.t('app.refineminetitle'),
    filterType: 'search',

    events: {
      'click input': 'onInputClicked'
    },

    resetFilter: function() {
      this.applyFilter({ createdBy: {} });
      this.$('input').attr('checked', false);
    },

    onInputClicked: function(e) {
      if(e.currentTarget.checked === true) {
        this.applyFilter({
          createdBy: { $in:[ Origin.sessionModel.attributes.id ] }
        });
      } else {
        this.resetFilter();
      }
    }
  }, {
    template: 'assetManagementMineModule'
  });

  return AssetManagementMineModule;
});
