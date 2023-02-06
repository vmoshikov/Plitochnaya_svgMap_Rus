/*! svgMap | https://github.com/StephanWagner/svgMap | MIT License | Copyright Stephan Wagner | https://stephanwagner.me */

// Wrapper function
function svgMapWrapper(svgPanZoom) {
  var svgMap = function(options) {
    this.init(options);
  };

  // Initialize SVG Worldmap
  svgMap.prototype.init = function(options) {
    // Default options, pass a custom options object to overwrite specific
    var defaultOptions = {
      // The element to render the map in
      targetElementID: 'targetElementID',

      // Minimum and maximum zoom
      minZoom: 1,
      maxZoom: 5,

      // Initial zoom
      initialZoom: 1,

      // Initial pan
      initialPan: {
        x: 0,
        y: 0
      },

      // Zoom sensitivity
      zoomScaleSensitivity: 0.2,

      // Zoom with mousewheel
      mouseWheelZoomEnabled: true,

      // Allow zooming only when one of the following keys is pressed: 'shift', 'control', 'alt' (Windows), 'command' (MacOS), 'option' (MacOS)
      mouseWheelZoomWithKey: false,

      // The message to show for non MacOS systems
      mouseWheelKeyMessage: 'Press the [ALT] key to zoom',

      // The message to show for MacOS
      mouseWheelKeyMessageMac: 'Press the [COMMAND] key to zoom',

      // Data colors
      colorMax: '#B80F22',
      colorMin: '#B80F22',
      colorNoData: '#546D65',

      // Color attribute for setting a manual color in the data object
      manualColorAttribute: 'color',

      // The flag type can be 'image' or 'emoji'
      flagType: 'image',

      // The URL to the flags when using flag type 'image', {0} will get replaced with the lowercase country id
      flagURL:
        'https://cdn.jsdelivr.net/gh/hjnilsson/country-flags@latest/svg/{0}.svg',

      // Decide whether to show the flag option or not
      hideFlag: false,

      // Whether attributes with no data should be displayed
      hideMissingData: false,

      // The default text to be shown when no data is present
      noDataText: 'Нет данных',

      // Set to true to open the link on mobile devices, set to false (default) to show the tooltip
      touchLink: false,

      // Set to true to show the to show a zoom reset button
      showZoomReset: false,

      // Called when a tooltip is created to custimize the tooltip content
      onGetTooltip: function(tooltipDiv, countryID, countryValues) {
        return null;
      },

      // Country specific options
      countries: {
        // Western Sahara: Set to false to combine Morocco (MA) and Western Sahara (EH)
        EH: true
      },

      // Set to true to show a drop down menu with the continents
      showContinentSelector: false
    };

    this.options = Object.assign({}, defaultOptions, options || {});

    // Abort if target element not found
    if (
      !this.options.targetElementID ||
      !document.getElementById(this.options.targetElementID)
    ) {
      this.error('Target element not found');
    }

    // Abort if no data
    if (!this.options.data) {
      this.error('No data');
    }

    // Global id
    this.id = this.options.targetElementID;

    // Wrapper element
    this.wrapper = document.getElementById(this.options.targetElementID);
    this.wrapper.classList.add('svgMap-wrapper');

    // Container element
    this.container = document.createElement('div');
    this.container.classList.add('svgMap-container');
    this.wrapper.appendChild(this.container);

    // Block scrolling when option is enabled
    if (
      this.options.mouseWheelZoomEnabled &&
      this.options.mouseWheelZoomWithKey
    ) {
      this.addMouseWheelZoomNotice();
      this.addMouseWheelZoomWithKeyEvents();
    }

    // Map container element
    this.mapContainer = document.createElement('div');
    this.mapContainer.classList.add('svgMap-map-container');
    this.container.appendChild(this.mapContainer);

    // Create the map
    this.createMap();

    // Apply map data
    this.applyData(this.options.data);
  };

  // Countries

  svgMap.prototype.countries = {
    Zaporozhye: 'Zaporozhye',
    Yaroslavskaya: 'Yaroslavskaya',
    Yamal: 'Yamal',
    Voronezh: 'Voronezh',
    Vologodskaya: 'Vologodskaya',
    Volgograd: 'Volgograd',
    Vladimir: 'Vladimir',
    Ulyanovsk: 'Ulyanovsk',
    Udmurtia: 'Udmurtia',
    Tver: 'Tver',
    Tuva: 'Tuva',
    Tumen: 'Tumen',
    Tula: 'Tula',
    Transbaikal: 'Transbaikal',
    Tomsk: 'Tomsk',
    Tatarstan: 'Tatarstan',
    Tambov: 'Tambov',
    Sverdlovsk: 'Sverdlovsk',
    StPetersburg: 'StPetersburg',
    Stavropol: 'Stavropol',
    Smolensk: 'Smolensk',
    Sevastopol: 'Sevastopol',
    Saratov: 'Saratov',
    Samara: 'Samara',
    Sakhalin: 'Sakhalin',
    Saha: 'Saha',
    Ryazan: 'Ryazan',
    Rostov: 'Rostov',
    Pskov: 'Pskov',
    Primorsky: 'Primorsky',
    Perm: 'Perm',
    Penza: 'Penza',
    Oryol: 'Oryol',
    Orenburg: 'Orenburg',
    Omsk: 'Omsk',
    Novosibirsk: 'Novosibirsk',
    Novgorod: 'Novgorod',
    North: 'North',
    NizhnyNovgorod: 'NizhnyNovgorod',
    Nenets: 'Nenets',
    Murmansk: 'Murmansk',
    Moscow: 'Moscow',
    MoscowR: 'MoscowR',
    Mordovia: 'Mordovia',
    Mariel: 'Mariel',
    Magadan: 'Magadan',
    Lugansk: 'Lugansk',
    Lipetsk: 'Lipetsk',
    Leningrad: 'Leningrad',
    Kursk: 'Kursk',
    Kurgan: 'Kurgan',
    Krasnoyarsk: 'Krasnoyarsk',
    Krasnodar: 'Krasnodar',
    Kostroma: 'Kostroma',
    Komi: 'Komi',
    Kirov: 'Kirov',
    KhMAO: 'KhMAO',
    Kherson: 'Kherson',
    Khabarovsk: 'Khabarovsk',
    Kemerovo: 'Kemerovo',
    Karelia: 'Karelia',
    Karachay: 'Karachay',
    Kamchatka: 'Kamchatka',
    Kaluga: 'Kaluga',
    Kalmykia: 'Kalmykia',
    Kaliningrad: 'Kaliningrad',
    Kabardino: 'Kabardino',
    Jewish: 'Jewish',
    Ivanovo: 'Ivanovo',
    Irkutsk: 'Irkutsk',
    Ingushetia: 'Ingushetia',
    Hakasia: 'Hakasia',
    Donetsk: 'Donetsk',
    Dagestan: 'Dagestan',
    Crimea: 'Crimea',
    Chuvashia: 'Chuvashia',
    Chukotka: 'Chukotka',
    Chelyabinsk: 'Chelyabinsk',
    Chechnya: 'Chechnya',
    Buryatia: 'Buryatia',
    Bryansk: 'Bryansk',
    Belgorod: 'Belgorod',
    Bashkortostan: 'Bashkortostan',
    Astrakhan: 'Astrakhan',
    Arkhangelsk: 'Arkhangelsk',
    Amur: 'Amur',
    Altay: 'Altay',
    Altai: 'Altai',
    Adigeya: 'Adigeya'
  };

  // Apply the data to the map

  svgMap.prototype.applyData = function(data) {
    var max = null;
    var min = null;

    // Get highest and lowest value
    Object.keys(data.values).forEach(function(countryID) {
      var value = parseInt(data.values[countryID][data.applyData], 10);
      max === null && (max = value);
      min === null && (min = value);
      value > max && (max = value);
      value < min && (min = value);
    });

    data.data[data.applyData].thresholdMax &&
    (max = Math.min(max, data.data[data.applyData].thresholdMax));
    data.data[data.applyData].thresholdMin &&
    (min = Math.max(min, data.data[data.applyData].thresholdMin));

    // Loop through countries and set colors
    Object.keys(this.countries).forEach(
      function(countryID) {
        var element = document.getElementById(
          this.id + '-map-country-' + countryID
        );
        if (!element) {
          return;
        }
        if (!data.values[countryID]) {
          element.setAttribute('fill', this.options.colorNoData);
          return;
        }
        if (typeof data.values[countryID].color != 'undefined') {
          element.setAttribute('fill', data.values[countryID].color);
          return;
        }
        var value = Math.max(
          min,
          parseInt(data.values[countryID][data.applyData], 10)
        );
        var ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
        var color = this.getColor(
          this.options.colorMax,
          this.options.colorMin,
          ratio || ratio === 0 ? ratio : 1
        );
        element.setAttribute('fill', color);
      }.bind(this)
    );
  };

  svgMap.prototype.continents = {
    'EA': {
      'iso': 'EA',
      'name': 'World'
    },
    'AF': {
      'iso': 'AF',
      'name': 'Africa',
      'pan': {
        x: 454, y: 250
      },
      'zoom': 1.90
    },
    'AS': {
      'iso': 'AS',
      'name': 'Asia',
      'pan': {
        x: 904, y: 80
      },
      'zoom': 1.8
    },
    'EU': {
      'iso': 'EU',
      'name': 'Europe',
      'pan': {
        x: 404, y: 80
      },
      'zoom': 5
    },
    'NA': {
      'iso': 'NA',
      'name': 'North America',
      'pan': {
        x: 104, y: 55
      },
      'zoom': 2.6
    },

    'MA': {
      'iso': 'MA',
      'name': 'Middle America',
      'pan': {
        x: 104, y: 200
      },
      'zoom': 2.6
    },
    'SA': {
      'iso': 'SA',
      'name': 'South America',
      'pan': {
        x: 104, y: 340
      },
      'zoom': 2.2
    },
    'OC': {
      'iso': 'OC',
      'name': 'Oceania',
      'pan': {
        x: 954, y: 350
      },
      'zoom': 1.90
    }
  };
  // Create the SVG map

  svgMap.prototype.createMap = function() {
    // Create the tooltip
    this.createTooltip();

    // Create map wrappers
    this.mapWrapper = this.createElement(
      'div',
      'svgMap-map-wrapper',
      this.mapContainer
    );
    this.mapImage = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    this.mapImage.setAttribute('viewBox', '0 0 1165 629');
    this.mapImage.classList.add('svgMap-map-image');
    this.mapWrapper.appendChild(this.mapImage);


    if (this.options.hasControls) {
      // Add controls
      var mapControlsWrapper = this.createElement(
        'div',
        'svgMap-map-controls-wrapper',
        this.mapWrapper
      );
      var zoomContainer = this.createElement(
        'div',
        'svgMap-map-controls-zoom',
        mapControlsWrapper
      );
      ['in', 'out', 'reset'].forEach(
        function(item) {
          if (item === 'reset' && this.options.showZoomReset || item !== 'reset') {
            var zoomControlName =
              'zoomControl' + item.charAt(0).toUpperCase() + item.slice(1);
            this[zoomControlName] = this.createElement(
              'button',
              'svgMap-control-button svgMap-zoom-button svgMap-zoom-' +
              item +
              '-button',
              zoomContainer
            );
            this[zoomControlName].type = 'button';
            this[zoomControlName].addEventListener(
              'click',
              function() {
                this.zoomMap(item);
              }.bind(this),
              { passive: true }
            );
          }
        }.bind(this)
      );

      // Add accessible names to zoom controls
      this.zoomControlIn.setAttribute('aria-label', 'Zoom in');
      this.zoomControlOut.setAttribute('aria-label', 'Zoom out');
    }

    if (this.options.showContinentSelector) {
      // Add continent controls
      var mapContinentControlsWrapper = this.createElement(
        'div',
        'svgMap-map-continent-controls-wrapper',
        this.mapWrapper
      );
      this['continentSelect'] = this.createElement(
        'select',
        'svgMap-continent-select',
        mapContinentControlsWrapper
      );
      var that = this;
      Object.keys(svgMap.prototype.continents).forEach(
        function(item) {
          let element = that.createElement(
            'option',
            'svgMap-continent-option svgMap-continent-iso-' + svgMap.prototype.continents[item].iso,
            that['continentSelect'],
            svgMap.prototype.continents[item].name
          );
          element.value = item;
        }
      );

      this.continentSelect.addEventListener(
        'change',
        function(e) {
          const continent = e.target.value;
          if (continent) this.zoomContinent(e.target.value);
        }.bind(that),
        { passive: true }
      );
      mapContinentControlsWrapper.setAttribute('aria-label', 'Select continent');
    }
    // Fix countries
    var mapPaths = Object.assign({}, this.mapPaths);

    if (!this.options.countries.EH) {
      mapPaths.MA.d = mapPaths['MA-EH'].d;
      delete mapPaths.EH;
    }
    delete mapPaths['MA-EH'];

    // Expose tooltipMove function

    this.tooltipMoveEvent = function(e) {
      console.log(e);
      this.moveTooltip(e);
    }.bind(this);

    // Add map elements
    Object.keys(mapPaths).forEach(
      function(countryID) {
        var countryData = this.mapPaths[countryID];
        if (!countryData.d) {
          return;
        }

        var countryElement = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );

        countryElement.setAttribute('d', countryData.d);
        countryElement.setAttribute(
          'id',
          this.id + '-map-country-' + countryID
        );
        countryElement.setAttribute('data-id', countryID);
        countryElement.classList.add('svgMap-country');

        this.mapImage.appendChild(countryElement);

        // Tooltip events
        // Add tooltip when touch is used
        countryElement.addEventListener(
          'touchstart',
          function(e) {
            countryElement.parentNode.appendChild(countryElement);
            countryElement.classList.add('svgMap-active');

            var countryID = countryElement.getAttribute('data-id');
            var countryLink = countryElement.getAttribute('data-link');
            if (this.options.touchLink) {
              if (countryLink) {
                window.location.href = countryLink;
                return;
              }
            }
            if (this.options.data.values[countryID]) {
              this.setTooltipContent(this.getTooltipContent(countryID));
              this.showTooltip(e);
              this.moveTooltip(e);
            }

            countryElement.addEventListener(
              'touchmove',
              this.tooltipMoveEvent,
              {
                passive: true
              }
            );
          }.bind(this),
          { passive: true }
        );

        countryElement.addEventListener(
          'mouseenter',
          function(e) {
            countryElement.parentNode.appendChild(countryElement);
            var countryID = countryElement.getAttribute('data-id');
            if (this.options.data.values[countryID]) {
              this.setTooltipContent(this.getTooltipContent(countryID));
              this.showTooltip(e);
            }
            countryElement.addEventListener(
              'mousemove',
              this.tooltipMoveEvent,
              {
                passive: true
              }
            );
          }.bind(this),
          { passive: true }
        );

        if (
          this.options.data.values &&
          this.options.data.values[countryID] &&
          this.options.data.values[countryID]['link']
        ) {
          countryElement.setAttribute(
            'data-link',
            this.options.data.values[countryID]['link']
          );
          if (this.options.data.values[countryID]['linkTarget']) {
            countryElement.setAttribute(
              'data-link-target',
              this.options.data.values[countryID]['linkTarget']
            );
          }

          let dragged = false;
          countryElement.addEventListener('mousedown', function() {
            dragged = false;
          });
          countryElement.addEventListener('touchstart', function() {
            dragged = false;
          });
          countryElement.addEventListener('mousemove', function() {
            dragged = false;
          });
          countryElement.addEventListener('touchmove', function() {
            dragged = false;
          });
          const clickHandler = function(e) {
            if (dragged) {
              return;
            }

            const link = countryElement.getAttribute('data-link');
            const target = countryElement.getAttribute('data-link-target');

            if (target) {
              window.open(link, target);
            } else {
              window.location.href = link;
            }
          };

          countryElement.addEventListener('click', clickHandler);
          countryElement.addEventListener('touchend', clickHandler);
        }

        // Hide tooltip when mouse leaves the country area
        countryElement.addEventListener(
          'mouseleave',
          function() {
            this.hideTooltip();
            countryElement.removeEventListener(
              'mousemove',
              this.tooltipMoveEvent,
              {
                passive: true
              }
            );
          }.bind(this),
          { passive: true }
        );

        // Hide tooltip when touch ends
        countryElement.addEventListener(
          'touchend',
          function() {
            this.hideTooltip();
            countryElement.classList.remove('svgMap-active');
            countryElement.removeEventListener(
              'touchmove',
              this.tooltipMoveEvent,
              { passive: false }
            );
          }.bind(this),
          { passive: false }
        );
      }.bind(this)
    );

    // Expose instance
    var me = this;

    // Init pan zoom
    this.mapPanZoom = svgPanZoom(this.mapImage, {
      zoomEnabled: false,
      fit: false,
      center: true,
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom,
      zoomScaleSensitivity: this.options.zoomScaleSensitivity,
      controlIconsEnabled: false,
      mouseWheelZoomEnabled: this.options.mouseWheelZoomEnabled,
      preventMouseEventsDefault: true,
      onZoom: function() {
        me.setControlStatuses();
      },
      beforePan: function(oldPan, newPan) {
        var gutterWidth = me.mapWrapper.offsetWidth;
        var gutterHeight = me.mapWrapper.offsetHeight;
        var sizes = this.getSizes();
        var leftLimit =
          -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) +
          gutterWidth;
        var rightLimit =
          sizes.width - gutterWidth - sizes.viewBox.x * sizes.realZoom;
        var topLimit =
          -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) +
          gutterHeight;
        var bottomLimit =
          sizes.height - gutterHeight - sizes.viewBox.y * sizes.realZoom;
        return {
          x: Math.max(leftLimit, Math.min(rightLimit, newPan.x)),
          y: Math.max(topLimit, Math.min(bottomLimit, newPan.y))
        };
      }
    });

    if (this.options.initialPan.x != 0 || this.options.initialPan.y != 0) {
      // Init zoom and pan
      this.mapPanZoom.zoomAtPointBy(this.options.initialZoom, {
        x: this.options.initialPan.x,
        y: this.options.initialPan.y
      });
    } else {
      // Init zoom
      this.mapPanZoom.zoom(this.options.initialZoom);
    }

    // Initial zoom statuses
    this.setControlStatuses();
  };

  // Create the tooltip content

  svgMap.prototype.getTooltipContent = function(countryID) {
    if (this.options.data.values[countryID]) {
    // Custom tooltip
    if (this.options.onGetTooltip) {
      var customDiv = this.options.onGetTooltip(
        this.tooltip,
        countryID,
        this.options.data.values[countryID]
      );

      if (customDiv) {
        return customDiv;
      }
    }

    var tooltipContentWrapper = this.createElement(
      'div',
      'svgMap-tooltip-content-container'
    );

    if (this.options.hideFlag === false) {
      // Flag
      var flagContainer = this.createElement(
        'div',
        'svgMap-tooltip-flag-container svgMap-tooltip-flag-container-' +
        this.options.flagType,
        tooltipContentWrapper
      );

      if (this.options.flagType === 'image') {
        this.createElement(
          'img',
          'svgMap-tooltip-flag',
          flagContainer
        ).setAttribute(
          'src',
          this.options.flagURL.replace('{0}', countryID.toLowerCase())
        );
      }
    }

    // Title

      this.createElement(
        'div',
        'svgMap-tooltip-title',
        tooltipContentWrapper
      ).innerHTML = this.getCountryName(countryID);

      // Content
      var tooltipContent = this.createElement(
        'div',
        'svgMap-tooltip-content',
        tooltipContentWrapper
      );
    }
    if (!this.options.data.values[countryID]) {
      this.createElement(
        'div',
        'svgMap-tooltip-no-data',
        tooltipContent
      ).innerHTML = this.options.noDataText;
    } else {
      var tooltipContentTable = '<table>';
      Object.keys(this.options.data.data).forEach(
        function(key) {
          var item = this.options.data.data[key];
          var value = this.options.data.values[countryID][key];
          if ((value !== undefined && this.options.hideMissingData === true) || this.options.hideMissingData === false) {
            item.floatingNumbers && (value = value.toFixed(1));
            item.thousandSeparator &&
            (value = this.numberWithCommas(value, item.thousandSeparator));
            value = item.format
              ? item.format.replace('{0}', '<span>' + value + '</span>')
              : '<span>' + value + '</span>';
            tooltipContentTable +=
              '<tr><td>' + (item.name || '') + '</td><td>' + value + '</td></tr>';
          }
        }.bind(this)
      );
      tooltipContentTable += '</table>';
      tooltipContent.innerHTML = tooltipContentTable;
    }
    return tooltipContentWrapper;
  };

  // Set the disabled statuses for buttons

  svgMap.prototype.setControlStatuses = function() {
    if (this.options.hasControls) {
      this.zoomControlIn.classList.remove('svgMap-disabled');
      this.zoomControlIn.setAttribute('aria-disabled', 'false');
      this.zoomControlOut.classList.remove('svgMap-disabled');
      this.zoomControlOut.setAttribute('aria-disabled', 'false');
      if (this.options.showZoomReset) {
        this.zoomControlReset.classList.remove('svgMap-disabled');
        this.zoomControlReset.setAttribute('aria-disabled', 'false');
      }

      if (this.mapPanZoom.getZoom().toFixed(3) <= this.options.minZoom) {
        this.zoomControlOut.classList.add('svgMap-disabled');
        this.zoomControlOut.setAttribute('aria-disabled', 'true');
      }
      if (this.mapPanZoom.getZoom().toFixed(3) >= this.options.maxZoom) {
        this.zoomControlIn.classList.add('svgMap-disabled');
        this.zoomControlIn.setAttribute('aria-disabled', 'true');
      }
      if (this.options.showZoomReset && this.mapPanZoom.getZoom().toFixed(3) == this.options.initialZoom) {
        this.zoomControlReset.classList.add('svgMap-disabled');
        this.zoomControlReset.setAttribute('aria-disabled', 'true');
      }
    }
  };

  // Zoom map

  svgMap.prototype.zoomMap = function(direction) {
    if (
      this[
      'zoomControl' + direction.charAt(0).toUpperCase() + direction.slice(1)
        ].classList.contains('svgMap-disabled')
    ) {
      return false;
    }
    if (direction === 'reset') {
      this.mapPanZoom.reset();
      if (this.options.initialPan.x != 0 || this.options.initialPan.y != 0) {
        // Init zoom and pan
        this.mapPanZoom.zoomAtPointBy(this.options.initialZoom, {
          x: this.options.initialPan.x,
          y: this.options.initialPan.y
        });
      } else {
        // Init zoom
        this.mapPanZoom.zoom(this.options.initialZoom);
      }
    } else {
      this.mapPanZoom[direction == 'in' ? 'zoomIn' : 'zoomOut']();
    }
  };

  // Zoom to Contient

  svgMap.prototype.zoomContinent = function(contientIso) {

    const continent = this.continents[contientIso];
    if (continent.iso == 'EA') this.mapPanZoom.reset();
    else if (continent.pan) {
      this.mapPanZoom.reset();
      this.mapPanZoom.zoomAtPoint(continent.zoom, continent.pan);
    }
  };

  // Add elements to show the zoom with keys notice

  svgMap.prototype.addMouseWheelZoomNotice = function() {
    var noticeWrapper = document.createElement('div');
    noticeWrapper.classList.add('svgMap-block-zoom-notice');

    var noticeContainer = document.createElement('div');
    noticeContainer.innerHTML =
      navigator.appVersion.indexOf('Mac') != -1
        ? this.options.mouseWheelKeyMessageMac
        : this.options.mouseWheelKeyMessage;

    noticeWrapper.append(noticeContainer);
    this.wrapper.append(noticeWrapper);
  };

  // Show the zoom with keys notice

  svgMap.prototype.showMouseWheelZoomNotice = function(duration) {
    if (this.mouseWheelNoticeJustHidden) {
      return;
    }

    this.autoHideMouseWheelNoticeTimeout &&
    clearTimeout(this.autoHideMouseWheelNoticeTimeout);
    this.autoHideMouseWheelNoticeTimeout = setTimeout(
      function() {
        this.hideMouseWheelZoomNotice();
      }.bind(this),
      duration || 2400
    );

    this.wrapper.classList.add('svgMap-block-zoom-notice-active');
  };

  // Hide the zoom with keys notice

  svgMap.prototype.hideMouseWheelZoomNotice = function() {
    this.wrapper.classList.remove('svgMap-block-zoom-notice-active');
    this.autoHideMouseWheelNoticeTimeout &&
    clearTimeout(this.autoHideMouseWheelNoticeTimeout);
  };

  // Block shing the zoom wheel notice for some time

  svgMap.prototype.blockMouseWheelZoomNotice = function(duration) {
    this.mouseWheelNoticeJustHidden = true;
    this.mouseWheelNoticeJustHiddenTimeout &&
    clearTimeout(this.mouseWheelNoticeJustHiddenTimeout);
    this.mouseWheelNoticeJustHiddenTimeout = setTimeout(
      function() {
        this.mouseWheelNoticeJustHidden = false;
      }.bind(this),
      duration || 600
    );
  };

  // Add the events when you are only allowed to scrool with a key pressed

  svgMap.prototype.addMouseWheelZoomWithKeyEvents = function() {
    // Add events to wrapper
    this.wrapper.addEventListener(
      'wheel',
      function(ev) {
        if (!document.body.classList.contains('svgMap-zoom-key-pressed')) {
          this.showMouseWheelZoomNotice();
        } else {
          this.hideMouseWheelZoomNotice();
          this.blockMouseWheelZoomNotice();
        }
      }.bind(this),
      {
        passive: true
      }
    );

    // Add with keydown
    document.addEventListener(
      'keydown',
      function(ev) {
        if (
          ev.key == 'Alt' ||
          ev.key == 'Control' ||
          ev.key == 'Meta' ||
          ev.key == 'Shift'
        ) {
          document.body.classList.add('svgMap-zoom-key-pressed');
          this.hideMouseWheelZoomNotice();
          this.blockMouseWheelZoomNotice();
        }
      }.bind(this)
    );

    // Fallback with wheel as sometimes it wont trigger when window is out of focus
    this.wrapper.addEventListener('wheel', function(ev) {
      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) {
        document.body.classList.add('svgMap-zoom-key-pressed');
        // TODO wont be removed when window out of focus
      }
    });

    // Only add following events to the document once
    if (document.body.classList.contains('svgMap-key-events-added')) {
      return false;
    }
    document.body.classList.add('svgMap-key-events-added');

    // Remove with keyup
    document.addEventListener('keyup', function(ev) {
      if (
        ev.key == 'Alt' ||
        ev.key == 'Control' ||
        ev.key == 'Meta' ||
        ev.key == 'Shift'
      ) {
        document.body.classList.remove('svgMap-zoom-key-pressed');
      }
    });
  };

  // Map paths

  svgMap.prototype.mapPaths = {
    'Zaporozhye': {
      d: 'M174.443 466.267C174.443 463.505 176.681 461.267 179.443 461.267H219.763C222.524 461.267 224.763 463.505 224.763 466.267V506.587C224.763 509.348 222.524 511.587 219.763 511.587H179.443C176.681 511.587 174.443 509.348 174.443 506.587V466.267Z'
    },
    'Yaroslavskaya': {
      d: 'M291.856 172.733C291.856 169.972 294.095 167.733 296.856 167.733H337.176C339.937 167.733 342.176 169.972 342.176 172.733V213.053C342.176 215.815 339.937 218.053 337.176 218.053H296.856C294.095 218.053 291.856 215.815 291.856 213.053V172.733Z'
    },
    'Yamal': {
      d: 'M644.096 114.027C644.096 111.265 646.335 109.027 649.096 109.027H689.416C692.177 109.027 694.416 111.265 694.416 114.027V154.347C694.416 157.108 692.177 159.347 689.416 159.347H649.096C646.335 159.347 644.096 157.108 644.096 154.347V114.027Z'
    },
    'Voronezh': {
      d: 'M350.563 407.56C350.563 404.799 352.801 402.56 355.563 402.56H395.883C398.644 402.56 400.883 404.799 400.883 407.56V447.88C400.883 450.641 398.644 452.88 395.883 452.88H355.563C352.801 452.88 350.563 450.641 350.563 447.88V407.56Z'
    },
    'Vologodskaya': {
      d: 'M291.856 114.027C291.856 111.265 294.095 109.027 296.856 109.027H337.176C339.937 109.027 342.176 111.265 342.176 114.027V154.347C342.176 157.108 339.937 159.347 337.176 159.347H296.856C294.095 159.347 291.856 157.108 291.856 154.347V114.027Z'
    },
    'Volgograd': {
      d: 'M409.269 407.56C409.269 404.799 411.508 402.56 414.269 402.56H454.589C457.351 402.56 459.589 404.799 459.589 407.56V447.88C459.589 450.641 457.351 452.88 454.589 452.88H414.269C411.508 452.88 409.269 450.641 409.269 447.88V407.56Z'
    },
    'Vladimir': {
      d: 'M350.563 231.44C350.563 228.679 352.801 226.44 355.563 226.44H395.883C398.644 226.44 400.883 228.679 400.883 231.44V271.76C400.883 274.521 398.644 276.76 395.883 276.76H355.563C352.801 276.76 350.563 274.521 350.563 271.76V231.44Z'
    },
    'Ulyanovsk': {
      d: 'M467.976 290.147C467.976 287.385 470.215 285.147 472.976 285.147H513.296C516.057 285.147 518.296 287.385 518.296 290.147V330.467C518.296 333.228 516.057 335.467 513.296 335.467H472.976C470.215 335.467 467.976 333.228 467.976 330.467V290.147Z'
    },
    'Udmurtia': {
      d: 'M585.389 231.44C585.389 228.679 587.628 226.44 590.389 226.44H630.709C633.471 226.44 635.709 228.679 635.709 231.44V271.76C635.709 274.521 633.471 276.76 630.709 276.76H590.389C587.628 276.76 585.389 274.521 585.389 271.76V231.44Z'
    },
    'Tver': {
      d: 'M233.149 172.733C233.149 169.972 235.388 167.733 238.149 167.733H278.469C281.231 167.733 283.469 169.972 283.469 172.733V213.053C283.469 215.815 281.231 218.053 278.469 218.053H238.149C235.388 218.053 233.149 215.815 233.149 213.053V172.733Z'
    },
    'Tuva': {
      d: 'M820.216 290.147C820.216 287.385 822.455 285.147 825.216 285.147H865.536C868.297 285.147 870.536 287.385 870.536 290.147V330.467C870.536 333.228 868.297 335.467 865.536 335.467H825.216C822.455 335.467 820.216 333.228 820.216 330.467V290.147Z'
    },
    'Tumen': {
      d: 'M702.803 172.733C702.803 169.972 705.041 167.733 707.803 167.733H748.123C750.884 167.733 753.123 169.972 753.123 172.733V213.053C753.123 215.815 750.884 218.053 748.123 218.053H707.803C705.041 218.053 702.803 215.815 702.803 213.053V172.733Z'
    },
    'Tula': {
      d: 'M291.856 290.147C291.856 287.385 294.095 285.147 296.856 285.147H337.176C339.937 285.147 342.176 287.385 342.176 290.147V330.467C342.176 333.228 339.937 335.467 337.176 335.467H296.856C294.095 335.467 291.856 333.228 291.856 330.467V290.147Z'
    },
    'Transbaikal': {
      d: 'M878.923 290.147C878.923 287.385 881.161 285.147 883.923 285.147H924.243C927.004 285.147 929.243 287.385 929.243 290.147V330.467C929.243 333.228 927.004 335.467 924.243 335.467H883.923C881.161 335.467 878.923 333.228 878.923 330.467V290.147Z'
    },
    'Tomsk': {
      d: 'M761.509 172.733C761.509 169.972 763.748 167.733 766.509 167.733H806.829C809.591 167.733 811.829 169.972 811.829 172.733V213.053C811.829 215.815 809.591 218.053 806.829 218.053H766.509C763.748 218.053 761.509 215.815 761.509 213.053V172.733Z'
    },
    'Tatarstan': {
      d: 'M526.683 231.44C526.683 228.679 528.921 226.44 531.683 226.44H572.003C574.764 226.44 577.003 228.679 577.003 231.44V271.76C577.003 274.521 574.764 276.76 572.003 276.76H531.683C528.921 276.76 526.683 274.521 526.683 271.76V231.44Z'
    },
    'Tambov': {
      d: 'M350.563 348.853C350.563 346.092 352.801 343.853 355.563 343.853H395.883C398.644 343.853 400.883 346.092 400.883 348.853V389.173C400.883 391.935 398.644 394.173 395.883 394.173H355.563C352.801 394.173 350.563 391.935 350.563 389.173V348.853Z'
    },
    'Sverdlovsk': {
      d: 'M644.096 231.44C644.096 228.679 646.335 226.44 649.096 226.44H689.416C692.177 226.44 694.416 228.679 694.416 231.44V271.76C694.416 274.521 692.177 276.76 689.416 276.76H649.096C646.335 276.76 644.096 274.521 644.096 271.76V231.44Z'
    },
    'StPetersburg': {
      d: 'M0 6.67737C0 3.91595 2.23858 1.67737 5 1.67737H45.32C48.0814 1.67737 50.32 3.91594 50.32 6.67737V46.9974C50.32 49.7588 48.0814 51.9974 45.32 51.9974H5C2.23858 51.9974 0 49.7588 0 46.9974V6.67737Z'
    },
    'Stavropol': {
      d: 'M350.563 524.973C350.563 522.212 352.801 519.973 355.563 519.973H395.883C398.644 519.973 400.883 522.212 400.883 524.973V565.293C400.883 568.055 398.644 570.293 395.883 570.293H355.563C352.801 570.293 350.563 568.055 350.563 565.293V524.973Z'
    },
    'Smolensk': {
      d: 'M174.443 231.44C174.443 228.679 176.681 226.44 179.443 226.44H219.763C222.524 226.44 224.763 228.679 224.763 231.44V271.76C224.763 274.521 222.524 276.76 219.763 276.76H179.443C176.681 276.76 174.443 274.521 174.443 271.76V231.44Z'
    },
    'Sevastopol': {
      d: 'M0 524.973C0 522.212 2.23858 519.973 5 519.973H45.32C48.0814 519.973 50.32 522.212 50.32 524.973V565.293C50.32 568.055 48.0814 570.293 45.32 570.293H5C2.23858 570.293 0 568.055 0 565.293V524.973Z'
    },
    'Saratov': {
      d: 'M467.976 348.853C467.976 346.092 470.215 343.853 472.976 343.853H513.296C516.057 343.853 518.296 346.092 518.296 348.853V389.173C518.296 391.935 516.057 394.173 513.296 394.173H472.976C470.215 394.173 467.976 391.935 467.976 389.173V348.853Z'
    },
    'Samara': {
      d: 'M526.683 290.147C526.683 287.385 528.921 285.147 531.683 285.147H572.003C574.764 285.147 577.003 287.385 577.003 290.147V330.467C577.003 333.228 574.764 335.467 572.003 335.467H531.683C528.921 335.467 526.683 333.228 526.683 330.467V290.147Z'
    },
    'Sakhalin': {
      d: 'M1113.75 172.733C1113.75 169.972 1115.99 167.733 1118.75 167.733H1159.07C1161.83 167.733 1164.07 169.972 1164.07 172.733V213.053C1164.07 215.815 1161.83 218.053 1159.07 218.053H1118.75C1115.99 218.053 1113.75 215.815 1113.75 213.053V172.733Z'
    },
    'Saha': {
      d: 'M937.629 114.027C937.629 111.265 939.868 109.027 942.629 109.027H982.949C985.711 109.027 987.949 111.265 987.949 114.027V154.347C987.949 157.108 985.711 159.347 982.949 159.347H942.629C939.868 159.347 937.629 157.108 937.629 154.347V114.027Z'
    },
    'Ryazan': {
      d: 'M350.563 290.147C350.563 287.385 352.801 285.147 355.563 285.147H395.883C398.644 285.147 400.883 287.385 400.883 290.147V330.467C400.883 333.228 398.644 335.467 395.883 335.467H355.563C352.801 335.467 350.563 333.228 350.563 330.467V290.147Z'
    },
    'Rostov': {
      d: 'M350.563 466.267C350.563 463.505 352.801 461.267 355.563 461.267H395.883C398.644 461.267 400.883 463.505 400.883 466.267V506.587C400.883 509.348 398.644 511.587 395.883 511.587H355.563C352.801 511.587 350.563 509.348 350.563 506.587V466.267Z'
    },
    'Pskov': {
      d: 'M174.443 172.733C174.443 169.972 176.681 167.733 179.443 167.733H219.763C222.524 167.733 224.763 169.972 224.763 172.733V213.053C224.763 215.815 222.524 218.053 219.763 218.053H179.443C176.681 218.053 174.443 215.815 174.443 213.053V172.733Z'
    },
    'Primorsky': {
      d: 'M996.336 290.147C996.336 287.385 998.575 285.147 1001.34 285.147H1041.66C1044.42 285.147 1046.66 287.385 1046.66 290.147V330.467C1046.66 333.228 1044.42 335.467 1041.66 335.467H1001.34C998.575 335.467 996.336 333.228 996.336 330.467V290.147Z'
    },
    'Perm': {
      d: 'M585.389 172.733C585.389 169.972 587.628 167.733 590.389 167.733H630.709C633.471 167.733 635.709 169.972 635.709 172.733V213.053C635.709 215.815 633.471 218.053 630.709 218.053H590.389C587.628 218.053 585.389 215.815 585.389 213.053V172.733Z'
    },
    'Penza': {
      d: 'M409.269 348.853C409.269 346.092 411.508 343.853 414.269 343.853H454.589C457.351 343.853 459.589 346.092 459.589 348.853V389.173C459.589 391.935 457.351 394.173 454.589 394.173H414.269C411.508 394.173 409.269 391.935 409.269 389.173V348.853Z'
    },
    'Oryol': {
      d: 'M233.149 290.147C233.149 287.385 235.388 285.147 238.149 285.147H278.469C281.231 285.147 283.469 287.385 283.469 290.147V330.467C283.469 333.228 281.231 335.467 278.469 335.467H238.149C235.388 335.467 233.149 333.228 233.149 330.467V290.147Z'
    },
    'Orenburg': {
      d: 'M526.683 348.853C526.683 346.092 528.921 343.853 531.683 343.853H572.003C574.764 343.853 577.003 346.092 577.003 348.853V389.173C577.003 391.935 574.764 394.173 572.003 394.173H531.683C528.921 394.173 526.683 391.935 526.683 389.173V348.853Z'
    },
    'Omsk': {
      d: 'M702.803 290.147C702.803 287.385 705.041 285.147 707.803 285.147H748.123C750.884 285.147 753.123 287.385 753.123 290.147V330.467C753.123 333.228 750.884 335.467 748.123 335.467H707.803C705.041 335.467 702.803 333.228 702.803 330.467V290.147Z'
    },
    'Novosibirsk': {
      d: 'M761.509 231.44C761.509 228.679 763.748 226.44 766.509 226.44H806.829C809.591 226.44 811.829 228.679 811.829 231.44V271.76C811.829 274.521 809.591 276.76 806.829 276.76H766.509C763.748 276.76 761.509 274.521 761.509 271.76V231.44Z'
    },
    'Novgorod': {
      d: 'M233.149 114.027C233.149 111.265 235.388 109.027 238.149 109.027H278.469C281.231 109.027 283.469 111.265 283.469 114.027V154.347C283.469 157.108 281.231 159.347 278.469 159.347H238.149C235.388 159.347 233.149 157.108 233.149 154.347V114.027Z'
    },
    'North': {
      d: 'M350.563 583.68C350.563 580.919 352.801 578.68 355.563 578.68H395.883C398.644 578.68 400.883 580.919 400.883 583.68V624C400.883 626.761 398.644 629 395.883 629H355.563C352.801 629 350.563 626.761 350.563 624V583.68Z'
    },
    'NizhnyNovgorod': {
      d: 'M409.269 231.44C409.269 228.679 411.508 226.44 414.269 226.44H454.589C457.351 226.44 459.589 228.679 459.589 231.44V271.76C459.589 274.521 457.351 276.76 454.589 276.76H414.269C411.508 276.76 409.269 274.521 409.269 271.76V231.44Z'
    },
    'Nenets': {
      d: 'M585.389 55.32C585.389 52.5585 587.628 50.3199 590.389 50.3199H630.709C633.471 50.3199 635.709 52.5585 635.709 55.3199V95.6399C635.709 98.4014 633.471 100.64 630.709 100.64H590.389C587.628 100.64 585.389 98.4014 585.389 95.6399V55.32Z'
    },
    'Murmansk': {
      d: 'M291.856 5C291.856 2.23858 294.095 0 296.856 0H337.176C339.937 0 342.176 2.23858 342.176 5V45.32C342.176 48.0814 339.937 50.32 337.176 50.32H296.856C294.095 50.32 291.856 48.0814 291.856 45.32V5Z'
    },
    'Moscow': {
      d: 'M0 65.384C0 62.6226 2.23858 60.384 5 60.384H45.32C48.0814 60.384 50.32 62.6226 50.32 65.384V105.704C50.32 108.465 48.0814 110.704 45.32 110.704H5C2.23858 110.704 0 108.465 0 105.704V65.384Z'
    },
    'MoscowR': {
      d: 'M291.856 231.44C291.856 228.679 294.095 226.44 296.856 226.44H337.176C339.937 226.44 342.176 228.679 342.176 231.44V271.76C342.176 274.521 339.937 276.76 337.176 276.76H296.856C294.095 276.76 291.856 274.521 291.856 271.76V231.44Z'
    },
    'Mordovia': {
      d: 'M409.269 290.147C409.269 287.385 411.508 285.147 414.269 285.147H454.589C457.351 285.147 459.589 287.385 459.589 290.147V330.467C459.589 333.228 457.351 335.467 454.589 335.467H414.269C411.508 335.467 409.269 333.228 409.269 330.467V290.147Z'
    },
    'Mariel': {
      d: 'M467.976 172.733C467.976 169.972 470.215 167.733 472.976 167.733H513.296C516.057 167.733 518.296 169.972 518.296 172.733V213.053C518.296 215.815 516.057 218.053 513.296 218.053H472.976C470.215 218.053 467.976 215.815 467.976 213.053V172.733Z'
    },
    'Magadan': {
      d: 'M996.336 114.027C996.336 111.265 998.575 109.027 1001.34 109.027H1041.66C1044.42 109.027 1046.66 111.265 1046.66 114.027V154.347C1046.66 157.108 1044.42 159.347 1041.66 159.347H1001.34C998.575 159.347 996.336 157.108 996.336 154.347V114.027Z'
    },
    'Lugansk': {
      d: 'M174.443 407.56C174.443 404.799 176.681 402.56 179.443 402.56H219.763C222.524 402.56 224.763 404.799 224.763 407.56V447.88C224.763 450.641 222.524 452.88 219.763 452.88H179.443C176.681 452.88 174.443 450.641 174.443 447.88V407.56Z'
    },
    'Lipetsk': {
      d: 'M291.856 348.853C291.856 346.092 294.095 343.853 296.856 343.853H337.176C339.937 343.853 342.176 346.092 342.176 348.853V389.173C342.176 391.935 339.937 394.173 337.176 394.173H296.856C294.095 394.173 291.856 391.935 291.856 389.173V348.853Z'
    },
    'Leningrad': {
      d: 'M174.443 114.027C174.443 111.265 176.681 109.027 179.443 109.027H219.763C222.524 109.027 224.763 111.265 224.763 114.027V154.347C224.763 157.108 222.524 159.347 219.763 159.347H179.443C176.681 159.347 174.443 157.108 174.443 154.347V114.027Z'
    },
    'Kursk': {
      d: 'M233.149 348.853C233.149 346.092 235.388 343.853 238.149 343.853H278.469C281.231 343.853 283.469 346.092 283.469 348.853V389.173C283.469 391.935 281.231 394.173 278.469 394.173H238.149C235.388 394.173 233.149 391.935 233.149 389.173V348.853Z'
    },
    'Kurgan': {
      d: 'M702.803 231.44C702.803 228.679 705.041 226.44 707.803 226.44H748.123C750.884 226.44 753.123 228.679 753.123 231.44V271.76C753.123 274.521 750.884 276.76 748.123 276.76H707.803C705.041 276.76 702.803 274.521 702.803 271.76V231.44Z'
    },
    'Krasnoyarsk': {
      d: 'M820.216 114.027C820.216 111.265 822.455 109.027 825.216 109.027H865.536C868.297 109.027 870.536 111.265 870.536 114.027V154.347C870.536 157.108 868.297 159.347 865.536 159.347H825.216C822.455 159.347 820.216 157.108 820.216 154.347V114.027Z'
    },
    'Krasnodar': {
      d: 'M233.149 466C233.149 463.239 235.388 461 238.149 461H278.469C281.231 461 283.469 463.239 283.469 466V506.32C283.469 509.081 281.231 511.32 278.469 511.32H238.149C235.388 511.32 233.149 509.081 233.149 506.32V466Z'
    },
    'Kostroma': {
      d: 'M409.269 172.733C409.269 169.972 411.508 167.733 414.269 167.733H454.589C457.351 167.733 459.589 169.972 459.589 172.733V213.053C459.589 215.815 457.351 218.053 454.589 218.053H414.269C411.508 218.053 409.269 215.815 409.269 213.053V172.733Z'
    },
    'Komi': {
      d: 'M585.389 114.027C585.389 111.265 587.628 109.027 590.389 109.027H630.709C633.471 109.027 635.709 111.265 635.709 114.027V154.347C635.709 157.108 633.471 159.347 630.709 159.347H590.389C587.628 159.347 585.389 157.108 585.389 154.347V114.027Z'
    },
    'Kirov': {
      d: 'M526.683 172.733C526.683 169.972 528.921 167.733 531.683 167.733H572.003C574.764 167.733 577.003 169.972 577.003 172.733V213.053C577.003 215.815 574.764 218.053 572.003 218.053H531.683C528.921 218.053 526.683 215.815 526.683 213.053V172.733Z'
    },
    'KhMAO': {
      d: 'M644.096 172.733C644.096 169.972 646.335 167.733 649.096 167.733H689.416C692.177 167.733 694.416 169.972 694.416 172.733V213.053C694.416 215.815 692.177 218.053 689.416 218.053H649.096C646.335 218.053 644.096 215.815 644.096 213.053V172.733Z'
    },
    'Kherson': {
      d: 'M115.736 466.267C115.736 463.505 117.975 461.267 120.736 461.267H161.056C163.818 461.267 166.056 463.505 166.056 466.267V506.587C166.056 509.348 163.818 511.587 161.056 511.587H120.736C117.975 511.587 115.736 509.348 115.736 506.587V466.267Z'
    },
    'Khabarovsk': {
      d: 'M996.336 172.733C996.336 169.972 998.575 167.733 1001.34 167.733H1041.66C1044.42 167.733 1046.66 169.972 1046.66 172.733V213.053C1046.66 215.815 1044.42 218.053 1041.66 218.053H1001.34C998.575 218.053 996.336 215.815 996.336 213.053V172.733Z'
    },
    'Kemerovo': {
      d: 'M820.216 172.733C820.216 169.972 822.455 167.733 825.216 167.733H865.536C868.297 167.733 870.536 169.972 870.536 172.733V213.053C870.536 215.815 868.297 218.053 865.536 218.053H825.216C822.455 218.053 820.216 215.815 820.216 213.053V172.733Z'
    },
    'Karelia': {
      d: 'M233.149 55.32C233.149 52.5585 235.388 50.3199 238.149 50.3199H278.469C281.231 50.3199 283.469 52.5585 283.469 55.3199V95.6399C283.469 98.4014 281.231 100.64 278.469 100.64H238.149C235.388 100.64 233.149 98.4014 233.149 95.6399V55.32Z'
    },
    'Karachay': {
      d: 'M291.856 524.973C291.856 522.212 294.095 519.973 296.856 519.973H337.176C339.937 519.973 342.176 522.212 342.176 524.973V565.293C342.176 568.055 339.937 570.293 337.176 570.293H296.856C294.095 570.293 291.856 568.055 291.856 565.293V524.973Z'
    },
    'Kamchatka': {
      d: 'M1055.04 55.32C1055.04 52.5585 1057.28 50.3199 1060.04 50.3199H1100.36C1103.12 50.3199 1105.36 52.5585 1105.36 55.3199V95.6399C1105.36 98.4014 1103.12 100.64 1100.36 100.64H1060.04C1057.28 100.64 1055.04 98.4014 1055.04 95.6399V55.32Z'
    },
    'Kaluga': {
      d: 'M233.149 231.44C233.149 228.679 235.388 226.44 238.149 226.44H278.469C281.231 226.44 283.469 228.679 283.469 231.44V271.76C283.469 274.521 281.231 276.76 278.469 276.76H238.149C235.388 276.76 233.149 274.521 233.149 271.76V231.44Z'
    },
    'Kalmykia': {
      d: 'M409.269 466.267C409.269 463.505 411.508 461.267 414.269 461.267H454.589C457.351 461.267 459.589 463.505 459.589 466.267V506.587C459.589 509.348 457.351 511.587 454.589 511.587H414.269C411.508 511.587 409.269 509.348 409.269 506.587V466.267Z'
    },
    'Kaliningrad': {
      d: 'M59.5454 172.733C59.5454 169.972 61.784 167.733 64.5454 167.733H104.865C107.627 167.733 109.865 169.972 109.865 172.733V213.053C109.865 215.815 107.627 218.053 104.865 218.053H64.5454C61.784 218.053 59.5454 215.815 59.5454 213.053V172.733Z'
    },
    'Kabardino': {
      d: 'M291.856 583.68C291.856 580.919 294.095 578.68 296.856 578.68H337.176C339.937 578.68 342.176 580.919 342.176 583.68V624C342.176 626.761 339.937 629 337.176 629H296.856C294.095 629 291.856 626.761 291.856 624V583.68Z'
    },
    'Jewish': {
      d: 'M937.629 231.44C937.629 228.679 939.868 226.44 942.629 226.44H982.949C985.711 226.44 987.949 228.679 987.949 231.44V271.76C987.949 274.521 985.711 276.76 982.949 276.76H942.629C939.868 276.76 937.629 274.521 937.629 271.76V231.44Z'
    },
    'Ivanovo': {
      d: 'M350.563 172.733C350.563 169.972 352.801 167.733 355.563 167.733H395.883C398.644 167.733 400.883 169.972 400.883 172.733V213.053C400.883 215.815 398.644 218.053 395.883 218.053H355.563C352.801 218.053 350.563 215.815 350.563 213.053V172.733Z'
    },
    'Irkutsk': {
      d: 'M878.923 172.733C878.923 169.972 881.161 167.733 883.923 167.733H924.243C927.004 167.733 929.243 169.972 929.243 172.733V213.053C929.243 215.815 927.004 218.053 924.243 218.053H883.923C881.161 218.053 878.923 215.815 878.923 213.053V172.733Z'
    },
    'Ingushetia': {
      d: 'M409.269 583.68C409.269 580.919 411.508 578.68 414.269 578.68H454.589C457.351 578.68 459.589 580.919 459.589 583.68V624C459.589 626.761 457.351 629 454.589 629H414.269C411.508 629 409.269 626.761 409.269 624V583.68Z'
    },
    'Hakasia': {
      d: 'M820.216 231.44C820.216 228.679 822.455 226.44 825.216 226.44H865.536C868.297 226.44 870.536 228.679 870.536 231.44V271.76C870.536 274.521 868.297 276.76 865.536 276.76H825.216C822.455 276.76 820.216 274.521 820.216 271.76V231.44Z'
    },
    'Donetsk': {
      d: 'M233.149 407.56C233.149 404.799 235.388 402.56 238.149 402.56H278.469C281.231 402.56 283.469 404.799 283.469 407.56V447.88C283.469 450.641 281.231 452.88 278.469 452.88H238.149C235.388 452.88 233.149 450.641 233.149 447.88V407.56Z'
    },
    'Dagestan': {
      d: 'M467.976 524.973C467.976 522.212 470.215 519.973 472.976 519.973H513.296C516.057 519.973 518.296 522.212 518.296 524.973V565.293C518.296 568.055 516.057 570.293 513.296 570.293H472.976C470.215 570.293 467.976 568.055 467.976 565.293V524.973Z'
    },
    'Crimea': {
      d: 'M174.443 524.973C174.443 522.212 176.681 519.973 179.443 519.973H219.763C222.524 519.973 224.763 522.212 224.763 524.973V565.293C224.763 568.055 222.524 570.293 219.763 570.293H179.443C176.681 570.293 174.443 568.055 174.443 565.293V524.973Z'
    },
    'Chuvashia': {
      d: 'M467.976 231.44C467.976 228.679 470.215 226.44 472.976 226.44H513.296C516.057 226.44 518.296 228.679 518.296 231.44V271.76C518.296 274.521 516.057 276.76 513.296 276.76H472.976C470.215 276.76 467.976 274.521 467.976 271.76V231.44Z'
    },
    'Chukotka': {
      d: 'M996.336 55.32C996.336 52.5585 998.575 50.3199 1001.34 50.3199H1041.66C1044.42 50.3199 1046.66 52.5585 1046.66 55.3199V95.6399C1046.66 98.4014 1044.42 100.64 1041.66 100.64H1001.34C998.575 100.64 996.336 98.4014 996.336 95.6399V55.32Z'
    },
    'Chelyabinsk': {
      d: 'M644.096 290.147C644.096 287.385 646.335 285.147 649.096 285.147H689.416C692.177 285.147 694.416 287.385 694.416 290.147V330.467C694.416 333.228 692.177 335.467 689.416 335.467H649.096C646.335 335.467 644.096 333.228 644.096 330.467V290.147Z'
    },
    'Chechnya': {
      d: 'M409.269 524.973C409.269 522.212 411.508 519.973 414.269 519.973H454.589C457.351 519.973 459.589 522.212 459.589 524.973V565.293C459.589 568.055 457.351 570.293 454.589 570.293H414.269C411.508 570.293 409.269 568.055 409.269 565.293V524.973Z'
    },
    'Buryatia': {
      d: 'M878.923 231.44C878.923 228.679 881.161 226.44 883.923 226.44H924.243C927.004 226.44 929.243 228.679 929.243 231.44V271.76C929.243 274.521 927.004 276.76 924.243 276.76H883.923C881.161 276.76 878.923 274.521 878.923 271.76V231.44Z'
    },
    'Bryansk': {
      d: 'M174.443 290.147C174.443 287.385 176.681 285.147 179.443 285.147H219.763C222.524 285.147 224.763 287.385 224.763 290.147V330.467C224.763 333.228 222.524 335.467 219.763 335.467H179.443C176.681 335.467 174.443 333.228 174.443 330.467V290.147Z'
    },
    'Belgorod': {
      d: 'M291.856 407.56C291.856 404.799 294.095 402.56 296.856 402.56H337.176C339.937 402.56 342.176 404.799 342.176 407.56V447.88C342.176 450.641 339.937 452.88 337.176 452.88H296.856C294.095 452.88 291.856 450.641 291.856 447.88V407.56Z'
    },
    'Bashkortostan': {
      d: 'M585.389 290.147C585.389 287.385 587.628 285.147 590.389 285.147H630.709C633.471 285.147 635.709 287.385 635.709 290.147V330.467C635.709 333.228 633.471 335.467 630.709 335.467H590.389C587.628 335.467 585.389 333.228 585.389 330.467V290.147Z'
    },
    'Astrakhan': {
      d: 'M467.976 466.267C467.976 463.505 470.215 461.267 472.976 461.267H513.296C516.057 461.267 518.296 463.505 518.296 466.267V506.587C518.296 509.348 516.057 511.587 513.296 511.587H472.976C470.215 511.587 467.976 509.348 467.976 506.587V466.267Z'
    },
    'Arkhangelsk': {
      d: 'M526.683 114.027C526.683 111.265 528.921 109.027 531.683 109.027H572.003C574.764 109.027 577.003 111.265 577.003 114.027V154.347C577.003 157.108 574.764 159.347 572.003 159.347H531.683C528.921 159.347 526.683 157.108 526.683 154.347V114.027Z'
    },
    'Amur': {
      d: 'M937.629 172.733C937.629 169.972 939.868 167.733 942.629 167.733H982.949C985.711 167.733 987.949 169.972 987.949 172.733V213.053C987.949 215.815 985.711 218.053 982.949 218.053H942.629C939.868 218.053 937.629 215.815 937.629 213.053V172.733Z'
    },
    'Altay': {
      d: 'M761.509 290.147C761.509 287.385 763.748 285.147 766.509 285.147H806.829C809.591 285.147 811.829 287.385 811.829 290.147V330.467C811.829 333.228 809.591 335.467 806.829 335.467H766.509C763.748 335.467 761.509 333.228 761.509 330.467V290.147Z'
    },
    'Altai': {
      d: 'M761.509 348.853C761.509 346.092 763.748 343.853 766.509 343.853H806.829C809.591 343.853 811.829 346.092 811.829 348.853V389.173C811.829 391.935 809.591 394.173 806.829 394.173H766.509C763.748 394.173 761.509 391.935 761.509 389.173V348.853Z'
    },
    'Adigeya': {
      d: 'M291.856 466.267C291.856 463.505 294.095 461.267 296.856 461.267H337.176C339.937 461.267 342.176 463.505 342.176 466.267V506.587C342.176 509.348 339.937 511.587 337.176 511.587H296.856C294.095 511.587 291.856 509.348 291.856 506.587V466.267Z'
    }
  };

  // Create the tooltip

  svgMap.prototype.createTooltip = function() {
    if (this.tooltip) {
      return false;
    }
    this.tooltip = this.createElement(
      'div',
      'svgMap-tooltip',
      document.getElementsByTagName('body')[0]
    );
    this.tooltipContent = this.createElement(
      'div',
      'svgMap-tooltip-content-wrapper',
      this.tooltip
    );
    this.tooltipPointer = this.createElement(
      'div',
      'svgMap-tooltip-pointer',
      this.tooltip
    );
  };

  // Set the tooltips content

  svgMap.prototype.setTooltipContent = function(content) {
    if (!this.tooltip) {
      return;
    }
    this.tooltipContent.innerHTML = '';
    this.tooltipContent.append(content);
  };

  // Show the tooltip

  svgMap.prototype.showTooltip = function(e) {
    this.tooltip.classList.add('svgMap-active');
    this.moveTooltip(e);
  };

  // Hide the tooltip

  svgMap.prototype.hideTooltip = function() {
    this.tooltip.classList.remove('svgMap-active');
  };

  // Move the tooltip

  svgMap.prototype.moveTooltip = function(e) {
    var x = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : null);
    var y = e.pageY || (e.touches && e.touches[0] ? e.touches[0].pageY : null);

    if (x === null || y === null) {
      return;
    }

    var offsetToWindow = 6;
    var offsetToPointer = 12;
    var offsetToPointerFlipped = 32;

    var wWidth = window.innerWidth;
    var tWidth = this.tooltip.offsetWidth;
    var tHeight = this.tooltip.offsetHeight;

    // Adjust pointer when reaching window sides
    var left = x - tWidth / 2;
    if (left <= offsetToWindow) {
      x = offsetToWindow + tWidth / 2;
      this.tooltipPointer.style.marginLeft = left - offsetToWindow + 'px';
    } else if (left + tWidth >= wWidth - offsetToWindow) {
      x = wWidth - offsetToWindow - tWidth / 2;
      this.tooltipPointer.style.marginLeft =
        (wWidth - offsetToWindow - e.pageX - tWidth / 2) * -1 + 'px';
    } else {
      this.tooltipPointer.style.marginLeft = '0px';
    }

    // Flip tooltip when reaching top window edge
    var top = y - offsetToPointer - tHeight;
    if (top <= offsetToWindow) {
      this.tooltip.classList.add('svgMap-tooltip-flipped');
      y += offsetToPointerFlipped;
    } else {
      this.tooltip.classList.remove('svgMap-tooltip-flipped');
      y -= offsetToPointer;
    }

    this.tooltip.style.left = x + 'px';
    this.tooltip.style.top = y + 'px';
  };

  // Log error to console

  svgMap.prototype.error = function(error) {
    (console.error || console.log)(
      'svgMap error: ' + (error || 'Unknown error')
    );
  };

  // Helper to create an element with a class name

  svgMap.prototype.createElement = function(
    type,
    className,
    appendTo,
    innerhtml
  ) {
    var element = document.createElement(type);
    if (className) {
      className = className.split(' ');
      className.forEach(function(item) {
        element.classList.add(item);
      });
    }
    innerhtml && (element.innerHTML = innerhtml);
    appendTo && appendTo.appendChild(element);
    return element;
  };

  // Print numbers with commas

  svgMap.prototype.numberWithCommas = function(nr, separator) {
    return nr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator || ',');
  };

  // Get a color between two other colors

  svgMap.prototype.getColor = function(color1, color2, ratio) {
    color1 = color1.slice(-6);
    color2 = color2.slice(-6);
    ratio = parseFloat(ratio).toFixed(1);
    var r = Math.ceil(
      parseInt(color1.substring(0, 2), 16) * ratio +
      parseInt(color2.substring(0, 2), 16) * (1 - ratio)
    );
    var g = Math.ceil(
      parseInt(color1.substring(2, 4), 16) * ratio +
      parseInt(color2.substring(2, 4), 16) * (1 - ratio)
    );
    var b = Math.ceil(
      parseInt(color1.substring(4, 6), 16) * ratio +
      parseInt(color2.substring(4, 6), 16) * (1 - ratio)
    );
    return '#' + this.getHex(r) + this.getHex(g) + this.getHex(b);
  };

  // Get a hex value

  svgMap.prototype.getHex = function(value) {
    value = value.toString(16);
    return ('0' + value).slice(-2);
  };

  // Get the name of a country by its ID

  svgMap.prototype.getCountryName = function(countryID) {
    return this.options.countryNames && this.options.countryNames[countryID]
      ? this.options.countryNames[countryID]
      : this.countries[countryID];
  };

  return svgMap;
}

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['svg-pan-zoom'], function(svgPanZoom) {
      return (root.svgMap = factory(svgPanZoom));
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = root.svgMap = factory(require('svg-pan-zoom'));
  } else {
    root.svgMap = factory(root.svgPanZoom);
  }
})(this, function(svgPanZoom) {
  var svgMap = svgMapWrapper(svgPanZoom);
  return svgMap;
});

//# sourceMappingURL=svgMap.js.map
