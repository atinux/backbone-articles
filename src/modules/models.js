// MODELS
app.models.Article = Backbone.Model.extend();

// COLLECTIONS
app.collections.Articles = Backbone.Collection.extend({
  model:  app.models.Article,
  
  localStorage : new Store('articles')
});