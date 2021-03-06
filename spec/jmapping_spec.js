Screw.Unit(function(){
  
  describe("makeGLatLng", function(){
    before(function(){
      GLatLng = mock_function(function(lat, lng){}, 'GLatLng');
      GLatLng.should_be_invoked().exactly('once').with_arguments(70, 50);
    });
    
    it("should be invoked", function(){
      expect($.jMapping.makeGLatLng({lat: 70, lng: 50})).to(be_true);
    });
  });
  
  describe("jMapping", function(){
    before(function(){
      // mock out Marker
      var marker_mock = mock();
      $('#map-side-bar .map-location .info-box').each(function(){
        marker_mock.should_receive('bindInfoWindowHtml').exactly('once').with_arguments($(this).html(), {maxWidth: 425});
      });
      
      mockGMaps(marker_mock);
      mockMarkerManager();
      
      // mock out Icon
      MapIconMaker = mock();
      MapIconMaker.should_receive('createMarkerIcon').exactly(0, 'times');
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar .map-location a.map-link').die('click');
    });
    
    it("should have 2 GMarkers", function(){
      $('#map').jMapping();
      var jmapper = $('#map').data('jMapping');
      expect(jmapper.gmarkers[5]).to(be_true);
      expect(jmapper.gmarkers[8]).to(be_true);
    });
    
    it("should hide the info html elements", function(){
      $('#map').jMapping();
      expect($('#map-side-bar .map-location .info-box')).to(match_selector, ':hidden');
    });
    
    it("should set the links to the correct URL", function(){
      $('#map').jMapping();
      expect($('#map-side-bar .map-location a.map-link#location5').attr('href')).to(equal, '#5');
      expect($('#map-side-bar .map-location a.map-link#location8').attr('href')).to(equal, '#8');
    });
    
    it("should only create the jMapping object once", function(){
      $('#map').jMapping();
      $('#map').jMapping();
      expect($('#map').data('jMapping')).to(be_true);
    });
    
    describe("setting link_selector to false", function(){
      before(function(){
        $('#map').jMapping({link_selector: false});
      });
      after(function(){
        delete GEvent._expectations;
        GEvent = {};
      });
      
      it("should not change the links url", function(){
        expect($('#map-side-bar .map-location a.map-link#location5').attr('href')).to_not(equal, '#5');
        expect($('#map-side-bar .map-location a.map-link#location8').attr('href')).to_not(equal, '#8');
      });
      
      it("should not tigger the GEvent function", function(){
        GEvent = mock();
        GEvent.should_receive('trigger').exactly(0, 'times');
        
        $('#map-side-bar .map-location a.map-link#location5').trigger('click');
      });
    });
    
    describe("click events for links", function(){
      before(function(){
        $('#map').jMapping();
      });
      after(function(){
        delete GEvent._expectations;
        GEvent = {};
      });
      
      it("should trigger the GEvent function", function(){
        GEvent = mock();
        GEvent.should_receive('trigger').exactly('once');
        
        $('#map-side-bar .map-location a.map-link#location5').trigger('click');
      });
    });
  });
  
  describe('jMapping with update', function(){
    var update_html = '<div class="map-location" data="{id: 22, point: {lat: 72, lng: 75}, category: \'bogus\'}">'+
'      <a href="#" id="location22" class="map-link">Some New Place</a>'+
'      <div class="info-box"><p>Test Text.</p></div>'+
'    </div>'+
'    <div class="map-location" data="{id: 28, point: {lat: 78, lng: 73}, category: \'sample\'}">'+
'      <a href="#" id="location28" class="map-link">Another Cool New Place</a>'+
'      <div class="info-box"><p>New Text.</p></div>'+
'    </div>';
    var old_html;
    before(function(){
      // mock out Marker
      var marker_mock = mock();
      $('#map-side-bar .map-location .info-box').each(function(){
        marker_mock.should_receive('bindInfoWindowHtml').exactly('once').with_arguments($(this).html(), {maxWidth: 425});
      });
      marker_mock.should_receive('bindInfoWindowHtml').exactly('once').with_arguments('<p>Test Text.</p>', {maxWidth: 425});
      marker_mock.should_receive('bindInfoWindowHtml').exactly('once').with_arguments('<p>New Text.</p>', {maxWidth: 425});
      
      mockGMapsUpdate(marker_mock);
      mockMarkerManager(true);
      
      // mock out Icon
      MapIconMaker = mock();
      MapIconMaker.should_receive('createMarkerIcon').exactly(0, 'times');
      
      old_html = $('#map-side-bar').html();
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar .map-location a.map-link').die('click');
      $('#map-side-bar').html(old_html);
    });
    
    it("should have 2 GMarkers", function(){
      $('#map').jMapping();
      $('#map-side-bar').html(update_html);
      var jmapper = $('#map').data('jMapping');
      jmapper.update();
      expect(jmapper.gmarkers[22]).to(be_true);
      expect(jmapper.gmarkers[28]).to(be_true);
    });
    
    it("should hide the info html elements", function(){
      $('#map').jMapping();
      $('#map-side-bar').html(update_html);
      $('#map').data('jMapping').update();
      expect($('#map-side-bar .map-location .info-box')).to(match_selector, ':hidden');
    });
    
    it("should set the links to the correct URL", function(){
      $('#map').jMapping();
      $('#map-side-bar').html(update_html);
      $('#map').data('jMapping').update();
      expect($('#map-side-bar .map-location a.map-link#location22').attr('href')).to(equal, '#22');
      expect($('#map-side-bar .map-location a.map-link#location28').attr('href')).to(equal, '#28');
    });
    
    describe("click events for links", function(){
      before(function(){
        $('#map').jMapping();
        $('#map-side-bar').html(update_html);
        $('#map').data('jMapping').update();
      });
      after(function(){
        delete GEvent._expectations;
        GEvent = {};
      });
      
      it("should trigger the GEvent function", function(){
        GEvent = mock();
        GEvent.should_receive('trigger').exactly('once');
        
        $('#map-side-bar .map-location a.map-link#location22').trigger('click');
      });
    });
  });
  
  describe("jMapping with options", function(){
    before(function(){
      // mock out Marker
      var marker_mock = mock();
      $('ul#map-item-list li.location .info-html').each(function(){
        marker_mock.should_receive('bindInfoWindowHtml').exactly('once').with_arguments($(this).html(), {maxWidth: 380});
      });
      
      mockGMaps(marker_mock);
      mockMarkerManager();
      
      // mock out Icon
      MapIconMaker = mock();
      MapIconMaker.should_receive('createMarkerIcon').exactly('once').with_arguments({primaryColor: '#CC0000'});
      MapIconMaker.should_receive('createMarkerIcon').exactly('once').with_arguments({primaryColor: '#33FFFF'});
      
      $('#map').jMapping({
        side_bar_selector: 'ul#map-item-list', 
        location_selector: 'li.location', 
        link_selector: 'a.map-item',
        info_window_selector: '.info-html',
        info_window_max_width: 380,
        category_icon_options: {'fun': {primaryColor: '#33FFFF'}, 'default': {primaryColor: '#CC0000'}}
      });
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('ul#map-item-list li.location a.map-item').attr('href', '#');
      $('ul#map-item-list li.location a.map-item').die('click');
    });
    
    it("should have 2 GMarkers", function(){
      var jmapper = $('#map').data('jMapping');
      
      expect(jmapper.gmarkers[27]).to(be_true);
      expect(jmapper.gmarkers[23]).to(be_true);
    });
    
    it("should hide the info html elements", function(){
      expect($('ul#map-item-list li.location .info-html')).to(match_selector, ':hidden');
    });
    
    it("should set the links to the correct URL", function(){
      expect($('ul#map-item-list li.location a.map-item#location27').attr('href')).to(equal, '#27');
      expect($('ul#map-item-list li.location a.map-item#location23').attr('href')).to(equal, '#23');
    });
    
    describe("click events for links", function(){
      it("should trigger the GEvent function", function(){
        GEvent = mock();
        GEvent.should_receive('trigger').exactly('once');
        
        $('ul#map-item-list li.location a.map-item#location27').trigger('click');
      });
    });
  });
  
  describe("jMapping with an alternate metadata storage", function(){
    before(function(){
      // mock out Marker
      var marker_mock = mock();
      $('ul#map-list li.location .info-box').each(function(){
        marker_mock.should_receive('bindInfoWindowHtml').exactly('once').with_arguments($(this).html(), {maxWidth: 425});
      });
      
      mockGMaps(marker_mock);
      mockMarkerManager();
      
      // mock out Icon
      MapIconMaker = mock();
      MapIconMaker.should_receive('createMarkerIcon').exactly(0, 'times');
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar .map-location a.map-link').die('click');
    });
    
    it("should function correctly", function(){
      $('#map').jMapping({
        side_bar_selector: 'ul#map-list', 
        location_selector: 'li.location', 
        metadata_options: {type: 'html5'}
      });
      expect($('#map').data('jMapping')).to(be_true);
    });
  });
  
  describe("jMapping with no cateogies and 'category_icon_options'", function(){
    before(function(){
      // mock out Marker
      var marker_mock = mock();
      $('ul#map-list li.location .info-box').each(function(){
        marker_mock.should_receive('bindInfoWindowHtml').exactly('once').with_arguments($(this).html(), {maxWidth: 425});
      });
      
      mockGMaps(marker_mock);
      mockMarkerManager();
      
      // mock out Icon
      MapIconMaker = mock();
      MapIconMaker.should_receive('createMarkerIcon').exactly(2, 'times');
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar .map-location a.map-link').die('click');
    });
    
    it("should function correctly", function(){
      $('#map').jMapping({
        side_bar_selector: 'ul#map-list', 
        location_selector: 'li.location',
        category_icon_options: {'fun': {primaryColor: '#33FFFF'}, 'default': {primaryColor: '#CC0000'}},
        metadata_options: {type: 'html5'}
      });
      expect($('#map').data('jMapping')).to(be_true);
    });
  });
  
  describe("setting a function to category_icon_options", function(){
    var category_function;
    before(function(){
      // mock out Marker
      var marker_mock = mock();
      $('#map-side-bar .map-location .info-box').each(function(){
        marker_mock.should_receive('bindInfoWindowHtml').exactly('once').with_arguments($(this).html(), {maxWidth: 425});
      });
      
      mockGMaps(marker_mock);
      mockMarkerManager();
      
      // mock out Icon
      MapIconMaker = mock();
      MapIconMaker.should_receive('createMarkerIcon').exactly('once').with_arguments({primaryColor: '#CC0000'});
      MapIconMaker.should_receive('createMarkerIcon').exactly('once').with_arguments({primaryColor: '#33FFFF'});
      
      category_function = mock_function(function(category){
        if (category.charAt(0).match(/[a-m]/i)){
          return {primaryColor: '#CC0000'};
        } else if (category.charAt(0).match(/[n-z]/i)){
          return {primaryColor: '#33FFFF'};
        } else {
          return {primaryColor: '#00FFCC'};
        }
      }, 'category_icon_options_function');
      category_function.should_be_invoked().exactly('twice');
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar .map-location a.map-link').die('click');
    });
    
    it("should function correctly", function(){
      $('#map').jMapping({
        category_icon_options: category_function
      });
      expect($('#map').data('jMapping')).to(be_true);
    });
  });
  
  describe("using the map_config option to custom configure the map function", function(){
    var map_config_function;
    before(function(){
      // mock out Marker
      var marker_mock = mock();
      $('#map-side-bar .map-location .info-box').each(function(){
        marker_mock.should_receive('bindInfoWindowHtml').exactly('once').with_arguments($(this).html(), {maxWidth: 425});
      });
      
      mockGMaps(marker_mock, function(gmap_mock){
        gmap_mock.should_receive('setMapType').exactly('once').with_arguments(G_HYBRID_MAP);
        gmap_mock.should_receive('addControl').exactly('once').with_arguments(new GSmallZoomControl());
        gmap_mock.should_receive('addControl').exactly('once').with_arguments(new GMapTypeControl());
      });
      mockMarkerManager();
      
      // mock out Icon
      MapIconMaker = mock();
      MapIconMaker.should_receive('createMarkerIcon').exactly(0, 'times');
      
      map_config_function = mock_function(function(map){
        map.setMapType(G_HYBRID_MAP);
        map.addControl(new GSmallZoomControl());
        map.addControl(new GMapTypeControl());
      }, 'map_config_function');
      map_config_function.should_be_invoked().exactly('once');
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar .map-location a.map-link').die('click');
    });
    
    it("should function correctly", function(){
      $('#map').jMapping({
        map_config: map_config_function
      });
      expect($('#map').data('jMapping')).to(be_true);
    });
  });
  
});
