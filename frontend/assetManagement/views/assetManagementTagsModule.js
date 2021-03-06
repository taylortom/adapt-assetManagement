// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var _ = require('underscore');
  var Origin = require('core/origin');
  var AssetManagementRefineModule = require('./assetManagementRefineModule');
  var TagsCollection = require('core/collections/tagsCollection');

  var AssetManagementTagsModule = AssetManagementRefineModule.extend({
    className: 'tags',
    title: Origin.l10n.t('app.refinetagstitle'),
    filterType: 'tags',
    autoRender: false,

    events: {
      'click .tag': 'onTagClicked',
      'click a.reset': 'onResetClicked'
    },

    initialize: function() {
      AssetManagementRefineModule.prototype.initialize.apply(this, arguments);
      this.options.tags = new TagsCollection();
      this.options.tags.fetch({
        success: _.bind(function() {
          this.render();
        }, this)
      });
    },

    resetFilter: function() {
      this.$('.tag.selected').removeClass('selected');
      this.applyFilter([]);
      this.showResetButton(false);
    },

    showResetButton: function(show) {
      var $btn = this.$('a.reset');
      (show) ? $btn.show() : $btn.hide();
    },

    onTagClicked: function(e) {
      e && e.preventDefault();

      $(e.currentTarget).toggleClass('selected');

      var selectedTags = _.pluck(this.$('.tag.selected'), 'id');
      this.applyFilter(selectedTags);

      this.showResetButton(selectedTags.length > 0);
    },

    onResetClicked: function(e) {
      e && e.preventDefault();
      this.resetFilter();
    }
  }, {
    template: 'assetManagementTagsModule'
  });

  return AssetManagementTagsModule;
});
