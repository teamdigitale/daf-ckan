this.ckan.module('recline_view', function (jQuery, _) {
  return {
    options: {
      i18n: {
        errorLoadingPreview: "Could not load view",
        errorDataProxy: "DataProxy returned an error",
        errorDataStore: "DataStore returned an error",
        previewNotAvailableForDataType: "View not available for data type: "
      },
      site_url: "",
      controlsClassName: "controls"
    },

    initialize: function () {
      jQuery.proxyAll(this, /_on/);
      this.options.resource = JSON.parse(this.options.resource);
      this.options.resourceView = JSON.parse(this.options.resourceView);
      this.el.ready(this._onReady);
      // hack to make leaflet use a particular location to look for images
      L.Icon.Default.imagePath = this.options.site_url + 'vendor/leaflet/0.7.3/images';
    },

    _onReady: function() {
      var resourceData = this.options.resource,
          resourceView = this.options.resourceView;

      this.loadView(resourceData, resourceView);
    },

    loadView: function (resourceData, reclineView) {
      var self = this;

      function showError(msg){
        msg = msg || _('error loading view');
        window.parent.ckan.pubsub.publish('data-viewer-error', msg);
      }

      if (resourceData.formatNormalized === '') {
        var tmp = resourceData.url.split('/');
        tmp = tmp[tmp.length - 1];
        tmp = tmp.split('?'); // query strings
        tmp = tmp[0];
        var ext = tmp.split('.');
        if (ext.length > 1) {
          resourceData.formatNormalized = ext[ext.length-1];
        }
      }

      var errorMsg, dataset, map_config;

      if (!resourceData.datastore_active) {
          recline.Backend.DataProxy.timeout = 10000;
          resourceData.backend =  'dataproxy';
      } else {
          resourceData.backend =  'ckan';
          resourceData.endpoint = jQuery('body').data('site-root') + 'api';
      }

      dataset = new recline.Model.Dataset(resourceData);

      map_config = this.options.map_config;

      var query = new recline.Model.Query();
      query.set({ size: reclineView.limit || 100 });
      query.set({ from: reclineView.offset || 0 });

      try {
        if (window.parent.ckan.views && window.parent.ckan.views.filters) {
          var defaultFilters = reclineView.filters || {},
              urlFilters = window.parent.ckan.views.filters.get(),
              filters = $.extend({}, defaultFilters, urlFilters);
          $.each(filters, function (field,values) {
            query.addFilter({type: 'term', field: field, term: values});
          });
        }
      } catch(e) {}

      dataset.queryState.set(query.toJSON(), {silent: true});

      errorMsg = this.options.i18n.errorLoadingPreview + ': '
      if (resourceData.backend == 'ckan') {
        errorMsg += this.options.i18n.errorDataStore;
      } else if (resourceData.backend == 'dataproxy'){
        errorMsg += this.options.i18n.errorDataProxy;
      }
      dataset.fetch()
        .done(function(dataset){
            self.initializeView(dataset, reclineView);
        })
        .fail(function(error){
          if (error.message) errorMsg += ' (' + error.message + ')';
          showError(errorMsg);
        });
    },

    initializeView: function (dataset, reclineView) {
      var view,
          state,
          controls = [];

      if(reclineView.view_type === "recline_graph_view") {
        state = {
          "graphType": reclineView.graph_type,
          "group": reclineView.group,
          "series": [reclineView.series]
        };
        view = new recline.View.Graph({model: dataset, state: state});
      } else if(reclineView.view_type === "recline_map_view") {
        state = {
          geomField: null,
          latField: null,
          lonField: null,
          autoZoom: Boolean(reclineView.auto_zoom),
          cluster: Boolean(reclineView.cluster_markers)
        };

        if(reclineView.map_field_type === "geojson") {
          state.geomField = reclineView.geojson_field;
        } else {
          state.latField = reclineView.latitude_field;
          state.lonField = reclineView.longitude_field;
        }

        view = new recline.View.Map($.extend(this._reclineMapViewOptions(dataset, this.options.map_config), {state:state}));
      } else if(reclineView.view_type === "recline_view") {
        view = this._newDataExplorer(dataset, this.options.map_config);
      } else {
        // default to Grid
        view = new recline.View.SlickGrid({model: dataset});
        controls = [
          new recline.View.Pager({model: view.model}),
          new recline.View.RecordCount({model: dataset}),
          new recline.View.QueryEditor({model: view.model.queryState})
        ];
      }

      // recline_view automatically adds itself to the DOM, so we don't
      // need to bother with it.
      if(reclineView.view_type !== 'recline_view') {
        var newElements = $('<div />');
        this._renderControls(newElements, controls, this.options.controlsClassName);
        newElements.append(view.el);
        $(this.el).html(newElements);
        view.visible = true;
        view.render();
      }

      if(reclineView.view_type === "recline_graph_view") {
        view.redraw();
      }
    },

    _reclineMapViewOptions: function(dataset, map_config) {
      var tile_url, attribution, subdomains;
      tile_url = attribution = subdomains = '';

      if (map_config.type == 'mapbox') {
          // MapBox base map
          if (!map_config['mapbox.map_id'] || !map_config['mapbox.access_token']) {
            throw '[CKAN Map Widgets] You need to provide a map ID ([account].[handle]) and an access token when using a MapBox layer. ' +
                  'See http://www.mapbox.com/developers/api-overview/ for details';
          }

          tile_url = '//{s}.tiles.mapbox.com/v4/' + map_config['mapbox.map_id'] + '/{z}/{x}/{y}.png?access_token=' + map_config['mapbox.access_token'];
          handle = map_config['mapbox.map_id'];
          subdomains = map_config.subdomains || 'abcd';
          attribution = map_config.attribution || 'Data: <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a>, Design: <a href="http://mapbox.com/about/maps" target="_blank">MapBox</a>';

      } else if (map_config.type == 'custom') {
          // Custom XYZ layer
          tile_url = map_config['custom.url'] || '';
          attribution = map_config.attribution || '';
          subdomains = map_config.subdomains || '';

          if (map_config['custom.tms'])
            var tms = map_config['custom.tms'];
      }

      return {
        model: dataset,
        mapTilesURL: tile_url,
        mapTilesAttribution: attribution,
        mapTilesSubdomains: subdomains
      };
    },

    _newDataExplorer: function (dataset, map_config) {
      var views = [
        {
          id: 'grid',
          label: 'Grid',
          view: new recline.View.SlickGrid({
            model: dataset
          })
        },
        {
          id: 'graph',
          label: 'Graph',
          view: new recline.View.Graph({
            model: dataset
          })
        },
        {
          id: 'map',
          label: 'Map',
          view: new recline.View.Map(this._reclineMapViewOptions(dataset, map_config))
        }
      ];

      var sidebarViews = [
        {
          id: 'valueFilter',
          label: 'Filters',
          view: new recline.View.ValueFilter({
            model: dataset
          })
        }
      ];

      var dataExplorer = new recline.View.MultiView({
        el: this.el,
        model: dataset,
        views: views,
        sidebarViews: sidebarViews,
        config: {
          readOnly: true
        }
      });

      return dataExplorer;
    },

    _renderControls: function (el, controls, className) {
      var controlsEl = $("<div class=\"clearfix " + className + "\" />");
      for (var i = 0; i < controls.length; i++) {
        controlsEl.append(controls[i].el);
      }
      $(el).append(controlsEl);
    }
  };
});
