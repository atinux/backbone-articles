app.views.Articles = Backbone.View.extend({  
  render: function () {
    this.el.html(_.template($('#viewArticles').html(), { articles: this.collection.models }));
    var articles = this.collection.models,
    		model;
    if (articles && articles.length > 0) {
    	for (var i = articles.length - 1; i >= 0; i--) {
    		model = articles[i];
    		var div = $('<div>').appendTo($('#articles', this.el));
    		new app.views.ArticleEntry({ el : div, model: model, parentView: this }).render();
      }
    }
  }
});

app.views.ArticleEntry = Backbone.View.extend({
	initialize: function (hash) {
		this.lengthMaxContent = 120;
    this.lengthMaxTitle = 25;
    this.parentView = hash.parentView;
    // Create article hash
    this.article = this.model.toJSON();
    this.article.cid = this.model.cid;
    this.article.titre = (this.article.titre.length <= this.lengthMaxTitle ? this.article.titre : this.article.titre.substr(0, this.lengthMaxTitle).replace(/^(.*) (.*)$/, '$1')+'...');
    this.article.contenu = (this.article.contenu.length <= this.lengthMaxContent ? this.article.contenu : this.article.contenu.substr(0, this.lengthMaxContent).replace(/^(.*) (.*)$/, '$1')+'...');
	},
  events: {
    'click .btnSupp': 'affSupp',
    'click .closeAffSupp': 'closeSupp',
    'click .affSupp': 'closeSupp',
    'click .deleteEntry': 'deleteModel'
  },
	render: function () {
    this.el.append(_.template($('#viewArticleEntry').html(), { article: this.article }));
    this.h = $('.article', this.el).height();
	},
	affSupp: function (e, confirm) {
		var h = this.h;
		$('.article', this.el).css('height', h);
		$('.affSupp', this.el).css({ 'height': Math.floor(h - (h / 2 - 18)), 'margin-top': -h, 'padding-top': Math.ceil(h / 2 - 18) }).show().animate({ 'margin-top': 0 }, 300, 'swing');
  },
  closeSupp: function () {
	  var h = this.h;
  	$('.affSupp', this.el).animate({ 'margin-top': -h }, 300, 'swing');
  },
  deleteModel: function () {
    var that = this,
    		cid = this.model.cid;
    this.model.destroy();
    $('#article'+cid).slideUp(250, function () {
      if (that.parentView.collection.length === 0) {
        $('#articles').hide().html('<div style="margin-top:10px;">Il n\'y a pas d\'articles pour le moment.</div>').slideDown(200);
      }
    });
  }
});

app.views.Article = Backbone.View.extend({
  render: function (model) {
    this.el.html(_.template($('#viewArticle').html(), { model: model }));
  }
});

app.views.AddOrEditArticle = Backbone.View.extend({
  initialize: function () {
    this.canSendForm = false;
  },
  events: {
    'keyup .field': 'checkForm',
    'change .field': 'checkForm',
    'submit .form': 'addOrEdit'
  },
  render: function (model) {
    this.model = model || null;
    this.el.html(_.template($('#addOrEditArticle').html(), { article: (model ? model.toJSON() : null) }));
  },
  htmlspecialchars: function (string) {
    return $('<span>').text(string).html()
  },
  getFormHash: function () {
    var hash = $('.form', this.el).serializeObject(),
        that = this;
    _.each(hash, function(value, key) {
      hash[key] = that.htmlspecialchars($.trim(value));
    });
    return hash;
  },
  checkForm: function () {
    var hash = this.getFormHash(),
        that = this,
        btnForm = $('.form button[type="submit"]');
    this.canSendForm = true;
    _.each(hash, function(value, key) {
      if (value === '') {
        that.canSendForm = false;
      }
    });
    ( this.canSendForm ? btnForm.removeClass('disabled') :  btnForm.addClass('disabled') );
  },
  addOrEdit: function (e) {
    e.preventDefault();
    if (this.canSendForm) {
      var hash = this.getFormHash();
      // If we are editing an article, juste set the actual model
      if (this.model) {
        this.model.set(hash);
      }
      else {
        this.model = new app.models.Article(hash);
        this.collection.add(this.model);
      }
      // Add model
      // Save to localstorage
      this.model.save();
      // Go to / route (second argument is to specify that we trigger the route)
      app.articlesRouter.navigate('', true);
    }
  }
});
