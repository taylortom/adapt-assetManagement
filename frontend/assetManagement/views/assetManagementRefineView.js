// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var Backbone = require('backbone');
  var Origin = require('core/origin');

  var AssetManagementRefineView = Backbone.View.extend({
    className: 'assetManagement-refine',
    tagName: 'div',
    /*
    asset type
    ? license
    */
    modules: {
      assetManagementSummaryModule: require('./assetManagementSummaryModule'),
      assetManagementSearchModule: require('./assetManagementSearchModule'),
      assetManagementSortModule: require('./assetManagementSortModule'),
      assetManagementCourseModule: require('./assetManagementCourseModule'),
      assetManagementWorkspaceModule: require('./assetManagementWorkspaceModule'),
      assetManagementMineModule: require('./assetManagementMineModule'),
      assetManagementTagsModule: require('./assetManagementTagsModule')
    },
    modulesLoaded: {},

    initialize: function(options) {
      this.options = options;

      this.listenTo(Origin, {
        'remove:views modal:closed': this.remove,
        'modal:resize': this.onModalResize,
        'assetManagement:refine:hide': this.hide,
      });

      this.render();
    },

    remove: function() {
      Backbone.View.prototype.remove.apply(this, arguments);
      Origin.trigger('assetManagement:refine:remove');
    },

    render: function() {
      var data = this.options;
      var template = Handlebars.templates['assetManagementRefineView'];
      this.$el.html(template(data));

      this.renderToggle();
      this.renderSubViews();

      return this;
    },

    renderToggle: function() {
      var toggleTemplate = Handlebars.templates['assetManagementRefineToggle'];
      $('.modal-popup-toolbar-buttons').prepend(toggleTemplate());
      $('.modal-popup-toolbar-buttons button.refine').click(_.bind(this.toggle, this));
    },

    renderSubViews: function() {
      this.modulesLoaded = {};

      this.listenTo(Origin, 'assetManagement:refine:moduleReady', this.onModuleReady);
      this.renderNextModule();
    },

    // ensures same order as this.modules
    renderNextModule: function() {
      var next = Object.keys(this.modules)[Object.keys(this.modulesLoaded).length];
      var moduleView = new this.modules[next](this.options);

      this.$('.modules').append(moduleView.$el);
    },

    resetFilters: function() {
      var modulesReset = 0;
      var moduleKeys = Object.keys(this.modules);
      // HACK make sure all modules have been fetched and trigger event
      // again to make sure we get the final list of unfiltered assets
      this.listenTo(Origin, 'assetManagement:assetManagementCollection:fetched', function(collection){
        if(++modulesReset === moduleKeys.length) {
          this.stopListening(Origin, 'assetManagement:assetManagementCollection:fetched');
          Origin.trigger('assetManagement:sidebarFilter:add');
        }
      });

      for(var i = 0, count = moduleKeys.length; i < count; i++) {
        this.modulesLoaded[moduleKeys[i]].resetFilter();
      }
    },

    toggle: function() {
      this.$el.toggleClass('show');
      Origin.trigger('assetManagement:refine:' + (this.$el.hasClass('show') ? 'show' : 'hide'));
    },

    hide: function() {
      var width = this.$el.width();
      this.$el.removeClass('show');
    },

    onModuleReady: function(moduleName, moduleView) {
      if(Object.keys(this.modulesLoaded).indexOf(moduleName) < 0) {
        this.modulesLoaded[moduleName] = moduleView;
      }
      var allLoaded = Object.keys(this.modulesLoaded).length === Object.keys(this.modules).length;
      (allLoaded) ? this.onAllModulesReady() : this.renderNextModule();
    },

    onAllModulesReady: function() {
      this.stopListening(Origin, 'assetManagement:refine:moduleReady', this.onModuleReady);
      this.listenTo(Origin, 'assetManagement:refine:reset', this.resetFilters);

      Origin.trigger('assetManagement:refine:ready');
    },

    onModalResize: function(newSize) {
      this.$el.css('height', newSize.height);
    }
  });

  return AssetManagementRefineView;
});
