var app = {
  collections: {},
  models: {},
  views: {},
  routers: {},
  modals: {},
  init: function () {
    // Init modal !
    app.modals.supp = '#modal-supp';
    $('#suppNo').click(function () {
      $(app.modals.supp).modal('hide');
    });
    // Initialisation du route handler avec BB
    this.articlesRouter = new this.routers.articles();
    Backbone.history.start();
  }
};

jQuery(function () {
  // Init app !
  app.init();
});
