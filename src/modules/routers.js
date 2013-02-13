app.routers.articles = Backbone.Router.extend({
  initialize: function () {
    this.el = $('#content');
    this.articlesCollection = new app.collections.Articles();
    this.articlesCollection.fetch();
    this.articlesView = new app.views.Articles({ el : this.el, collection: this.articlesCollection });
    this.articleView = new app.views.Article({ el : this.el });
    this.addOrEditArticleView = new app.views.AddOrEditArticle({ el : this.el, collection: this.articlesCollection });
  },
  routes: {
    '': 'viewArticles',
    'new': 'newArticle',
    ':cid': 'getArticle',
    'edit/:cid': 'editArticle',
  },
  viewArticles: function () {
    this.articlesView.render();
  },
  newArticle: function () {
    this.addOrEditArticleView.render();
  },
  getArticle: function (cid) {
    var model = this.articlesCollection.getByCid(cid);
    if (model) {
      this.articleView.render(model);
    }
    else {
      this.viewArticles();
    }
  },
  editArticle: function (cid) {
    var model = this.articlesCollection.getByCid(cid);
    if (model) {
      this.addOrEditArticleView.render(model);
    }
    else {
      this.viewArticles();
    }
  }  
});