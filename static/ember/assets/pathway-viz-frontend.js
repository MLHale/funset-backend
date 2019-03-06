"use strict";



define('pathway-viz-frontend/adapters/application', ['exports', 'ember-data', 'pathway-viz-frontend/config/environment'], function (exports, _emberData, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.JSONAPIAdapter.extend({
    host: _environment.default.host,
    namespace: 'api/v1'

  });
});
define('pathway-viz-frontend/app', ['exports', 'pathway-viz-frontend/resolver', 'ember-load-initializers', 'pathway-viz-frontend/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * @Author: Matthew Hale <mlhale>
   * @Date:   2018-02-14T23:03:42-06:00
   * @Email:  mlhale@unomaha.edu
   * @Filename: app.js
   * @Last modified by:   mlhale
   * @Last modified time: 2018-02-15T00:23:38-06:00
   * @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
   * @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa
   */

  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('pathway-viz-frontend/components/basic-dropdown', ['exports', 'ember-basic-dropdown/components/basic-dropdown'], function (exports, _basicDropdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _basicDropdown.default;
    }
  });
});
define('pathway-viz-frontend/components/basic-dropdown/content-element', ['exports', 'ember-basic-dropdown/components/basic-dropdown/content-element'], function (exports, _contentElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _contentElement.default;
    }
  });
});
define('pathway-viz-frontend/components/basic-dropdown/content', ['exports', 'ember-basic-dropdown/components/basic-dropdown/content'], function (exports, _content) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _content.default;
    }
  });
});
define('pathway-viz-frontend/components/basic-dropdown/trigger', ['exports', 'ember-basic-dropdown/components/basic-dropdown/trigger'], function (exports, _trigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _trigger.default;
    }
  });
});
define('pathway-viz-frontend/components/cluster-download', ['exports', 'ember-cli-file-saver/mixins/file-saver'], function (exports, _fileSaver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_fileSaver.default, {
    actions: {
      downloadCluster: function downloadCluster() {
        //save to file
        this.saveFileAs("cluster: " + this.get('cluster.name'), JSON.stringify(this.get('cluster')), "application/json");
      }
    }
  });
});
define('pathway-viz-frontend/components/download-options', ['exports', 'npm:d3', 'pathway-viz-frontend/config/environment', 'ember-cli-file-saver/mixins/file-saver'], function (exports, _npmD, _environment, _fileSaver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_fileSaver.default, {
    actions: {
      downloadSvg: function downloadSvg() {

        var svg = _npmD.default.select("svg").attr("title", _environment.default.host + "-svg").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg");

        var html = svg.node().parentNode.innerHTML;

        var domhtml = Ember.$.parseHTML(html);

        //remove zoom layer so it doesn't block the graph
        Ember.$('.zoom-layer', domhtml).remove();

        //save to file
        this.saveFileAs(_environment.default.host + "-svg-download.svg", domhtml[1].outerHTML, "image/svg+xml");
      },
      downloadJSON: function downloadJSON() {
        this.saveFileAs(_environment.default.host + "-json-download.json", JSON.stringify(this.get('navigation.clusterjson.content')), "application/json");
      },
      downloadCSV: function downloadCSV() {
        var data = [['Cluster', 'GO Term', 'GO Name', 'FDR', 'Enrichment Score', 'SSX', 'SSY', 'Genes...']];
        var json = this.get('navigation.clusterjson');
        json.forEach(function (cluster) {
          // Create a new line in the csv for each term node
          cluster.nodes.forEach(function (node) {
            var line = [cluster.id, node.term.get('termid'), node.term.get('name'), node.enrichment.get('pvalue'), node.enrichment.get('level'), node.enrichment.get('semanticdissimilarityx'), node.enrichment.get('semanticdissimilarityy')];
            // gather genes
            var genes = "";
            node.enrichment.get('genes').forEach(function (gene) {
              if (genes === "") {
                genes += gene.get('geneid');
              } else {
                genes += " " + gene.get('geneid');
              }
            });
            line.push(genes);
            data.push(line);
          });
        });
        var csvConfig = {
          fileName: "funset-csv-download.csv",
          separator: ',',
          withSeparator: false
        };
        this.get('csv').export(data, csvConfig);
      }
    }
  });
});
define('pathway-viz-frontend/components/export-selector-onselect', ['exports', 'ember-cli-data-export/components/export-selector-onselect'], function (exports, _exportSelectorOnselect) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _exportSelectorOnselect.default;
    }
  });
});
define('pathway-viz-frontend/components/export-selector', ['exports', 'ember-cli-data-export/components/export-selector'], function (exports, _exportSelector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _exportSelector.default;
    }
  });
});
define('pathway-viz-frontend/components/from-elsewhere', ['exports', 'ember-elsewhere/components/from-elsewhere'], function (exports, _fromElsewhere) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _fromElsewhere.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-ajax-error-page', ['exports', 'ember-frost-core/components/frost-ajax-error-page'], function (exports, _frostAjaxErrorPage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostAjaxErrorPage.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-autocomplete-dropdown', ['exports', 'ember-frost-core/components/frost-autocomplete-dropdown'], function (exports, _frostAutocompleteDropdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostAutocompleteDropdown.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-autocomplete-outlet', ['exports', 'ember-frost-core/components/frost-autocomplete-outlet'], function (exports, _frostAutocompleteOutlet) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostAutocompleteOutlet.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-autocomplete', ['exports', 'ember-frost-core/components/frost-autocomplete'], function (exports, _frostAutocomplete) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostAutocomplete.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-bookends', ['exports', 'ember-frost-core/components/frost-bookends'], function (exports, _frostBookends) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostBookends.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-button', ['exports', 'ember-frost-core/components/frost-button'], function (exports, _frostButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostButton.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-checkbox', ['exports', 'ember-frost-core/components/frost-checkbox'], function (exports, _frostCheckbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostCheckbox.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-combobox', ['exports', 'ember-frost-core/components/frost-combobox'], function (exports, _frostCombobox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostCombobox.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-expand', ['exports', 'ember-frost-core/components/frost-expand'], function (exports, _frostExpand) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostExpand.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-file-picker', ['exports', 'ember-frost-file-picker/components/frost-file-picker'], function (exports, _frostFilePicker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostFilePicker.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-icon', ['exports', 'ember-frost-core/components/frost-icon'], function (exports, _frostIcon) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostIcon.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-link', ['exports', 'ember-frost-core/components/frost-link'], function (exports, _frostLink) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostLink.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-loading', ['exports', 'ember-frost-core/components/frost-loading'], function (exports, _frostLoading) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostLoading.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-multi-select', ['exports', 'ember-frost-core/components/frost-multi-select'], function (exports, _frostMultiSelect) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostMultiSelect.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-password', ['exports', 'ember-frost-core/components/frost-password'], function (exports, _frostPassword) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostPassword.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-radio-button', ['exports', 'ember-frost-core/components/frost-radio-button'], function (exports, _frostRadioButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostRadioButton.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-radio-group', ['exports', 'ember-frost-core/components/frost-radio-group'], function (exports, _frostRadioGroup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostRadioGroup.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-scroll', ['exports', 'ember-frost-core/components/frost-scroll'], function (exports, _frostScroll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostScroll.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-select-dropdown', ['exports', 'ember-frost-core/components/frost-select-dropdown'], function (exports, _frostSelectDropdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostSelectDropdown.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-select-outlet', ['exports', 'ember-frost-core/components/frost-select-outlet'], function (exports, _frostSelectOutlet) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostSelectOutlet.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-select', ['exports', 'ember-frost-core/components/frost-select'], function (exports, _frostSelect) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostSelect.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-text', ['exports', 'ember-frost-core/components/frost-text'], function (exports, _frostText) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostText.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-textarea', ['exports', 'ember-frost-core/components/frost-textarea'], function (exports, _frostTextarea) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostTextarea.default;
    }
  });
});
define('pathway-viz-frontend/components/frost-toggle', ['exports', 'ember-frost-core/components/frost-toggle'], function (exports, _frostToggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _frostToggle.default;
    }
  });
});
define('pathway-viz-frontend/components/hookable-input', ['exports', 'ember-frost-core/components/hookable-input'], function (exports, _hookableInput) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _hookableInput.default;
    }
  });
});
define('pathway-viz-frontend/components/hookable-textarea', ['exports', 'ember-frost-core/components/hookable-textarea'], function (exports, _hookableTextarea) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _hookableTextarea.default;
    }
  });
});
define('pathway-viz-frontend/components/multiple-from-elsewhere', ['exports', 'ember-elsewhere/components/multiple-from-elsewhere'], function (exports, _multipleFromElsewhere) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _multipleFromElsewhere.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-autocomplete-content', ['exports', 'ember-paper/components/paper-autocomplete-content'], function (exports, _paperAutocompleteContent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperAutocompleteContent.default;
});
define('pathway-viz-frontend/components/paper-autocomplete-dropdown', ['exports', 'ember-paper/components/paper-autocomplete-dropdown'], function (exports, _paperAutocompleteDropdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperAutocompleteDropdown.default;
});
define('pathway-viz-frontend/components/paper-autocomplete-highlight', ['exports', 'ember-paper/components/paper-autocomplete-highlight'], function (exports, _paperAutocompleteHighlight) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperAutocompleteHighlight.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-autocomplete-options', ['exports', 'ember-paper/components/paper-autocomplete-options'], function (exports, _paperAutocompleteOptions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperAutocompleteOptions.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-autocomplete-trigger-container', ['exports', 'ember-paper/components/paper-autocomplete-trigger-container'], function (exports, _paperAutocompleteTriggerContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperAutocompleteTriggerContainer.default;
});
define('pathway-viz-frontend/components/paper-autocomplete-trigger', ['exports', 'ember-paper/components/paper-autocomplete-trigger'], function (exports, _paperAutocompleteTrigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperAutocompleteTrigger.default;
});
define('pathway-viz-frontend/components/paper-autocomplete', ['exports', 'ember-paper/components/paper-autocomplete'], function (exports, _paperAutocomplete) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperAutocomplete.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-backdrop', ['exports', 'ember-paper/components/paper-backdrop'], function (exports, _paperBackdrop) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperBackdrop.default;
});
define('pathway-viz-frontend/components/paper-button', ['exports', 'ember-paper/components/paper-button'], function (exports, _paperButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperButton.default;
});
define('pathway-viz-frontend/components/paper-card-actions', ['exports', 'ember-paper/components/paper-card-actions'], function (exports, _paperCardActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardActions.default;
});
define('pathway-viz-frontend/components/paper-card-avatar', ['exports', 'ember-paper/components/paper-card-avatar'], function (exports, _paperCardAvatar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardAvatar.default;
});
define('pathway-viz-frontend/components/paper-card-content', ['exports', 'ember-paper/components/paper-card-content'], function (exports, _paperCardContent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardContent.default;
});
define('pathway-viz-frontend/components/paper-card-header-headline', ['exports', 'ember-paper/components/paper-card-header-headline'], function (exports, _paperCardHeaderHeadline) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardHeaderHeadline.default;
});
define('pathway-viz-frontend/components/paper-card-header-subhead', ['exports', 'ember-paper/components/paper-card-header-subhead'], function (exports, _paperCardHeaderSubhead) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardHeaderSubhead.default;
});
define('pathway-viz-frontend/components/paper-card-header-text', ['exports', 'ember-paper/components/paper-card-header-text'], function (exports, _paperCardHeaderText) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardHeaderText.default;
});
define('pathway-viz-frontend/components/paper-card-header-title', ['exports', 'ember-paper/components/paper-card-header-title'], function (exports, _paperCardHeaderTitle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardHeaderTitle.default;
});
define('pathway-viz-frontend/components/paper-card-header', ['exports', 'ember-paper/components/paper-card-header'], function (exports, _paperCardHeader) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardHeader.default;
});
define('pathway-viz-frontend/components/paper-card-icon-actions', ['exports', 'ember-paper/components/paper-card-icon-actions'], function (exports, _paperCardIconActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardIconActions.default;
});
define('pathway-viz-frontend/components/paper-card-image', ['exports', 'ember-paper/components/paper-card-image'], function (exports, _paperCardImage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardImage.default;
});
define('pathway-viz-frontend/components/paper-card-media', ['exports', 'ember-paper/components/paper-card-media'], function (exports, _paperCardMedia) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardMedia.default;
});
define('pathway-viz-frontend/components/paper-card-title-media', ['exports', 'ember-paper/components/paper-card-title-media'], function (exports, _paperCardTitleMedia) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardTitleMedia.default;
});
define('pathway-viz-frontend/components/paper-card-title-text', ['exports', 'ember-paper/components/paper-card-title-text'], function (exports, _paperCardTitleText) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardTitleText.default;
});
define('pathway-viz-frontend/components/paper-card-title', ['exports', 'ember-paper/components/paper-card-title'], function (exports, _paperCardTitle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCardTitle.default;
});
define('pathway-viz-frontend/components/paper-card', ['exports', 'ember-paper/components/paper-card'], function (exports, _paperCard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCard.default;
});
define('pathway-viz-frontend/components/paper-checkbox', ['exports', 'ember-paper/components/paper-checkbox'], function (exports, _paperCheckbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperCheckbox.default;
});
define('pathway-viz-frontend/components/paper-chips', ['exports', 'ember-paper/components/paper-chips'], function (exports, _paperChips) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperChips.default;
});
define('pathway-viz-frontend/components/paper-contact-chips', ['exports', 'ember-paper/components/paper-contact-chips'], function (exports, _paperContactChips) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperContactChips.default;
});
define('pathway-viz-frontend/components/paper-content', ['exports', 'ember-paper/components/paper-content'], function (exports, _paperContent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperContent.default;
});
define('pathway-viz-frontend/components/paper-dialog-actions', ['exports', 'ember-paper/components/paper-dialog-actions'], function (exports, _paperDialogActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperDialogActions.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-dialog-container', ['exports', 'ember-paper/components/paper-dialog-container'], function (exports, _paperDialogContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperDialogContainer.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-dialog-content', ['exports', 'ember-paper/components/paper-dialog-content'], function (exports, _paperDialogContent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperDialogContent.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-dialog-inner', ['exports', 'ember-paper/components/paper-dialog-inner'], function (exports, _paperDialogInner) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperDialogInner.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-dialog', ['exports', 'ember-paper/components/paper-dialog'], function (exports, _paperDialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperDialog.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-divider', ['exports', 'ember-paper/components/paper-divider'], function (exports, _paperDivider) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperDivider.default;
});
define('pathway-viz-frontend/components/paper-expansion-panel', ['exports', 'ember-paper-expansion-panel/components/paper-expansion-panel'], function (exports, _paperExpansionPanel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperExpansionPanel.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-expansion-panel/collapsed', ['exports', 'ember-paper-expansion-panel/components/paper-expansion-panel/collapsed'], function (exports, _collapsed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _collapsed.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-expansion-panel/expanded', ['exports', 'ember-paper-expansion-panel/components/paper-expansion-panel/expanded'], function (exports, _expanded) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _expanded.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-expansion-panel/expanded/content', ['exports', 'ember-paper-expansion-panel/components/paper-expansion-panel/expanded/content'], function (exports, _content) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _content.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-expansion-panel/expanded/footer', ['exports', 'ember-paper-expansion-panel/components/paper-expansion-panel/expanded/footer'], function (exports, _footer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _footer.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-expansion-panel/expanded/header', ['exports', 'ember-paper-expansion-panel/components/paper-expansion-panel/expanded/header'], function (exports, _header) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _header.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-form', ['exports', 'ember-paper/components/paper-form'], function (exports, _paperForm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperForm.default;
});
define('pathway-viz-frontend/components/paper-grid-list', ['exports', 'ember-paper/components/paper-grid-list'], function (exports, _paperGridList) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperGridList.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-grid-tile-footer', ['exports', 'ember-paper/components/paper-grid-tile-footer'], function (exports, _paperGridTileFooter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperGridTileFooter.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-grid-tile', ['exports', 'ember-paper/components/paper-grid-tile'], function (exports, _paperGridTile) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperGridTile.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-icon', ['exports', 'ember-paper/components/paper-icon'], function (exports, _paperIcon) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperIcon.default;
});
define('pathway-viz-frontend/components/paper-ink-bar', ['exports', 'ember-paper/components/paper-ink-bar'], function (exports, _paperInkBar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperInkBar.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-input', ['exports', 'ember-paper/components/paper-input'], function (exports, _paperInput) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperInput.default;
});
define('pathway-viz-frontend/components/paper-item', ['exports', 'ember-paper/components/paper-item'], function (exports, _paperItem) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperItem.default;
});
define('pathway-viz-frontend/components/paper-list', ['exports', 'ember-paper/components/paper-list'], function (exports, _paperList) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperList.default;
});
define('pathway-viz-frontend/components/paper-menu-content-inner', ['exports', 'ember-paper/components/paper-menu-content-inner'], function (exports, _paperMenuContentInner) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperMenuContentInner.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-menu-content', ['exports', 'ember-paper/components/paper-menu-content'], function (exports, _paperMenuContent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperMenuContent.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-menu-item', ['exports', 'ember-paper/components/paper-menu-item'], function (exports, _paperMenuItem) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperMenuItem.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-menu', ['exports', 'ember-paper/components/paper-menu'], function (exports, _paperMenu) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperMenu.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-optgroup', ['exports', 'ember-paper/components/paper-optgroup'], function (exports, _paperOptgroup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperOptgroup.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-option', ['exports', 'ember-paper/components/paper-option'], function (exports, _paperOption) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperOption.default;
});
define('pathway-viz-frontend/components/paper-progress-circular', ['exports', 'ember-paper/components/paper-progress-circular'], function (exports, _paperProgressCircular) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperProgressCircular.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-progress-linear', ['exports', 'ember-paper/components/paper-progress-linear'], function (exports, _paperProgressLinear) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperProgressLinear.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-radio-group-label', ['exports', 'ember-paper/components/paper-radio-group-label'], function (exports, _paperRadioGroupLabel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperRadioGroupLabel.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-radio-group', ['exports', 'ember-paper/components/paper-radio-group'], function (exports, _paperRadioGroup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperRadioGroup.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-radio-proxiable', ['exports', 'ember-paper/components/paper-radio-proxiable'], function (exports, _paperRadioProxiable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperRadioProxiable.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-radio', ['exports', 'ember-paper/components/paper-radio'], function (exports, _paperRadio) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperRadio.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-reset-button', ['exports', 'ember-paper/components/paper-reset-button'], function (exports, _paperResetButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperResetButton.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-select-content', ['exports', 'ember-paper/components/paper-select-content'], function (exports, _paperSelectContent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSelectContent.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-select-header', ['exports', 'ember-paper/components/paper-select-header'], function (exports, _paperSelectHeader) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSelectHeader.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-select-menu-inner', ['exports', 'ember-paper/components/paper-select-menu-inner'], function (exports, _paperSelectMenuInner) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSelectMenuInner.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-select-menu-trigger', ['exports', 'ember-paper/components/paper-select-menu-trigger'], function (exports, _paperSelectMenuTrigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperSelectMenuTrigger.default;
});
define('pathway-viz-frontend/components/paper-select-menu', ['exports', 'ember-paper/components/paper-select-menu'], function (exports, _paperSelectMenu) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSelectMenu.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-select-options', ['exports', 'ember-paper/components/paper-select-options'], function (exports, _paperSelectOptions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSelectOptions.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-select-search', ['exports', 'ember-paper/components/paper-select-search'], function (exports, _paperSelectSearch) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSelectSearch.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-select-trigger', ['exports', 'ember-paper/components/paper-select-trigger'], function (exports, _paperSelectTrigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSelectTrigger.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-select', ['exports', 'ember-paper/components/paper-select'], function (exports, _paperSelect) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperSelect.default;
});
define('pathway-viz-frontend/components/paper-sidenav-container', ['exports', 'ember-paper/components/paper-sidenav-container'], function (exports, _paperSidenavContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSidenavContainer.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-sidenav-inner', ['exports', 'ember-paper/components/paper-sidenav-inner'], function (exports, _paperSidenavInner) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperSidenavInner.default;
});
define('pathway-viz-frontend/components/paper-sidenav-toggle', ['exports', 'ember-paper/components/paper-sidenav-toggle'], function (exports, _paperSidenavToggle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperSidenavToggle.default;
});
define('pathway-viz-frontend/components/paper-sidenav', ['exports', 'ember-paper/components/paper-sidenav'], function (exports, _paperSidenav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperSidenav.default;
});
define('pathway-viz-frontend/components/paper-slider', ['exports', 'ember-paper/components/paper-slider'], function (exports, _paperSlider) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperSlider.default;
});
define('pathway-viz-frontend/components/paper-snackbar-text', ['exports', 'ember-paper/components/paper-snackbar-text'], function (exports, _paperSnackbarText) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSnackbarText.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-speed-dial-actions-action', ['exports', 'ember-paper/components/paper-speed-dial-actions-action'], function (exports, _paperSpeedDialActionsAction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSpeedDialActionsAction.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-speed-dial-actions', ['exports', 'ember-paper/components/paper-speed-dial-actions'], function (exports, _paperSpeedDialActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSpeedDialActions.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-speed-dial-trigger', ['exports', 'ember-paper/components/paper-speed-dial-trigger'], function (exports, _paperSpeedDialTrigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSpeedDialTrigger.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-speed-dial', ['exports', 'ember-paper/components/paper-speed-dial'], function (exports, _paperSpeedDial) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSpeedDial.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-subheader', ['exports', 'ember-paper/components/paper-subheader'], function (exports, _paperSubheader) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperSubheader.default;
});
define('pathway-viz-frontend/components/paper-switch', ['exports', 'ember-paper/components/paper-switch'], function (exports, _paperSwitch) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperSwitch.default;
});
define('pathway-viz-frontend/components/paper-tab', ['exports', 'ember-paper/components/paper-tab'], function (exports, _paperTab) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperTab.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-tabs', ['exports', 'ember-paper/components/paper-tabs'], function (exports, _paperTabs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperTabs.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-toast-inner', ['exports', 'ember-paper/components/paper-toast-inner'], function (exports, _paperToastInner) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperToastInner.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-toast-text', ['exports', 'ember-paper/components/paper-toast-text'], function (exports, _paperToastText) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperToastText.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-toast', ['exports', 'ember-paper/components/paper-toast'], function (exports, _paperToast) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperToast.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-toaster', ['exports', 'ember-paper/components/paper-toaster'], function (exports, _paperToaster) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperToaster.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-toolbar-tools', ['exports', 'ember-paper/components/paper-toolbar-tools'], function (exports, _paperToolbarTools) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperToolbarTools.default;
});
define('pathway-viz-frontend/components/paper-toolbar', ['exports', 'ember-paper/components/paper-toolbar'], function (exports, _paperToolbar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperToolbar.default;
});
define('pathway-viz-frontend/components/paper-tooltip-inner', ['exports', 'ember-paper/components/paper-tooltip-inner'], function (exports, _paperTooltipInner) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperTooltipInner.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-tooltip', ['exports', 'ember-paper/components/paper-tooltip'], function (exports, _paperTooltip) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperTooltip.default;
    }
  });
});
define('pathway-viz-frontend/components/paper-virtual-repeat-scroller', ['exports', 'ember-paper/components/paper-virtual-repeat-scroller'], function (exports, _paperVirtualRepeatScroller) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperVirtualRepeatScroller.default;
});
define('pathway-viz-frontend/components/paper-virtual-repeat', ['exports', 'ember-paper/components/paper-virtual-repeat'], function (exports, _paperVirtualRepeat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _paperVirtualRepeat.default;
});
define('pathway-viz-frontend/components/power-select-multiple', ['exports', 'ember-power-select/components/power-select-multiple'], function (exports, _powerSelectMultiple) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _powerSelectMultiple.default;
    }
  });
});
define('pathway-viz-frontend/components/power-select-multiple/trigger', ['exports', 'ember-power-select/components/power-select-multiple/trigger'], function (exports, _trigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _trigger.default;
    }
  });
});
define('pathway-viz-frontend/components/power-select', ['exports', 'ember-power-select/components/power-select'], function (exports, _powerSelect) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _powerSelect.default;
    }
  });
});
define('pathway-viz-frontend/components/power-select/before-options', ['exports', 'ember-power-select/components/power-select/before-options'], function (exports, _beforeOptions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _beforeOptions.default;
    }
  });
});
define('pathway-viz-frontend/components/power-select/options', ['exports', 'ember-power-select/components/power-select/options'], function (exports, _options) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _options.default;
    }
  });
});
define('pathway-viz-frontend/components/power-select/placeholder', ['exports', 'ember-power-select/components/power-select/placeholder'], function (exports, _placeholder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _placeholder.default;
    }
  });
});
define('pathway-viz-frontend/components/power-select/power-select-group', ['exports', 'ember-power-select/components/power-select/power-select-group'], function (exports, _powerSelectGroup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _powerSelectGroup.default;
    }
  });
});
define('pathway-viz-frontend/components/power-select/search-message', ['exports', 'ember-power-select/components/power-select/search-message'], function (exports, _searchMessage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _searchMessage.default;
    }
  });
});
define('pathway-viz-frontend/components/power-select/trigger', ['exports', 'ember-power-select/components/power-select/trigger'], function (exports, _trigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _trigger.default;
    }
  });
});
define("pathway-viz-frontend/components/scroll-to", ["exports", "ember-scroll-to-target/components/scroll-to"], function (exports, _scrollTo) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _scrollTo.default;
});
define('pathway-viz-frontend/components/select-list', ['exports', 'ember-select-list/components/select-list'], function (exports, _selectList) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _selectList.default;
});
define('pathway-viz-frontend/components/term-ontology', ['exports', 'npm:d3', 'ember-resize/mixins/resize-aware'], function (exports, _npmD, _resizeAware) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_resizeAware.default, {

    tagName: 'svg',
    classNames: ['term-ontology-graph'],
    clusterColorOptions: ["#dfc27d", "#c7eae5", "#543005", "#003c30", "#80cdc1", "#35978f", "#01665e", "#f6e8c3", "#f5f5f5", "#bf812d", "#8c510a", '#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061', "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"],
    width: 1000,
    height: 1000,
    noderadius: 8,
    simulationdistance: 100,
    simulationstrength: 0.5,
    simulationrepulsiveforce: -40,

    attributeBindings: ['width', 'height'],
    showTermLabels: false,
    linkForcesOn: false,

    nodes: Ember.ArrayProxy.create({ content: Ember.A() }),
    _nodes: Ember.computed.alias('nodes.content'),
    links: Ember.ArrayProxy.create({ content: Ember.A() }),
    _links: Ember.computed.alias('links.content'),

    renderEventQueue: Ember.ArrayProxy.create({ content: Ember.A() }),
    currentScaleFactorX: 1,
    currentScaleFactorY: 1,

    updating: false,
    renderEventProcessor: Ember.observer('renderEventQueue', 'renderEventQueue.@each', function () {

      var renderEventQueue = this.get('renderEventQueue');
      var event = renderEventQueue.get('firstObject');
      // console.log('renderQueue invoked',event);
      if (event) {
        if (renderEventQueue.get('length') > 0 && event.type !== null) {
          var node_objects = this.get('nodelayer').selectAll("circle").data(this.get('_nodes'), function (d) {
            return d.id;
          });
          var link_objects = this.get('linklayer').selectAll("path");
          var text_objects = this.get('textlayer').selectAll("text");
          var cluster_text_objects = this.get('clusterlayer').selectAll("text");
          if (event.type === 'selectednode') {
            // console.log('selectednode');
            event.node.selected = true;
            event.node.enrichment.set('selected', true);

            if (event.origin != "menu") {
              //expand the cluster panel and term panel for this item and then scroll to the item on the right hand side menu
              var clusterpanelstate = this.get('expandedclusterpanels.content')[event.node.enrichment.get('cluster')];
              clusterpanelstate.set('expanded', true);
              clusterpanelstate.set('termsexpanded', true);
              Ember.run.scheduleOnce("afterRender", function () {
                var target = ".term-" + event.node.term.id;
                var menuHeight = 310;
                var scrolltopos = $(target).offset().top - menuHeight;
                var duration = 500; //ms
                $('.scrollabletermlist').stop().animate({ scrollTop: scrolltopos }, duration);
              });
            }

            //update all selected items
            node_objects.filter(function (d) {
              return d.selected;
            }).attr("class", function (d) {
              return d.group + ' selected';
            }).style("stroke", "red").style("stroke-width", "6px");

            //add text labels for selected, non-medioid nodes
            text_objects = text_objects.data(this.get('_nodes').filterBy('selected').filterBy('enrichment.medoid', false), function (d) {
              return d.id;
            });
            var transform = _npmD.default.zoomTransform(_npmD.default.select(".zoom-layer").node());
            text_objects.enter().append("svg:text").attr("x", function (d) {
              return d.x + (d.enrichment != null ? d.enrichment.get('level') + 5 : 13);
            }).attr("y", function (d) {
              return d.y + (d.enrichment != null ? d.enrichment.get('level') / 2 : 4);
            }).attr("transform", transform).text(function (d) {
              return d.id + ' (' + d.term.get('shortname') + ')';
            });
          } else if (event.type === 'deselectednode') {
            //console.log('deselectednode');
            event.node.selected = false;
            event.node.enrichment.set('selected', false);
            //update all deselected items
            node_objects.filter(function (d) {
              return !d.selected;
            }).attr("class", function (d) {
              return d.group;
            }).style("stroke", "black").style("stroke-width", "3px");

            text_objects = text_objects.data(this.get('_nodes').filterBy('selected'), function (d) {
              return d.id;
            });
            var transform = _npmD.default.zoomTransform(_npmD.default.select(".zoom-layer").node());
            text_objects.exit().remove();
          } else if (event.type === 'hidecluster') {
            //console.log('hidecluster');

            //dimish unselected items
            node_objects.filter(function (d) {
              return !d.clusterselected;
            }).style("opacity", "0.1");

            link_objects.filter(function (d) {
              return !d.source.clusterselected;
            }).style("opacity", "0.1");

            text_objects.filter(function (d) {
              return !d.clusterselected;
            }).style("opacity", "0.1");

            cluster_text_objects.filter(function (d) {
              return !d.clusterselected;
            }).style("opacity", "0.1");
          } else if (event.type === 'showcluster') {
            //console.log('showcluster');

            //emphasize all selected items
            node_objects.filter(function (d) {
              return d.clusterselected;
            }).style("opacity", "1");

            link_objects.filter(function (d) {
              return d.source.clusterselected;
            }).style("opacity", "1");

            text_objects.filter(function (d) {
              return d.clusterselected;
            }).style("opacity", "1");

            cluster_text_objects.filter(function (d) {
              return d.clusterselected;
            }).style("opacity", "1");
          } else if (event.type === 'showallclusters') {
            //console.log('showallclusters');
            node_objects.style("opacity", "1");
            link_objects.style("opacity", "1");
            text_objects.style("opacity", "1");
            cluster_text_objects.style("opacity", "1");
          } else if (event.type === 'resetGraph') {
            node_objects.filter(function (d) {
              return d.dragged;
            }).each(function (d) {
              d.x = d.originx;d.y = d.originy;
            });
            // // this.get('simulation').alpha(.01).restart();
            // // this.simulationticked(this);
          } else if (event.type === 'hideallclusters') {
            //console.log('hideallclusters');
            node_objects.style("opacity", "0.1");
            link_objects.style("opacity", "0.1");
            text_objects.style("opacity", "0.1");
            cluster_text_objects.style("opacity", "0.1");
          } else if (event.type === 'refreshClusters') {
            // Update the simulation to refresh its data
            var context = this;
            //console.log('refreshing clusters');
            var transform = _npmD.default.zoomTransform(_npmD.default.select(".zoom-layer").node());
            var node_objects = this.get('nodelayer').selectAll("circle").data(this.get('_nodes'), function (d) {
              return d.id;
            });
            node_objects.style("fill", function (d) {
              return context.get('clusterColorOptions')[d.enrichment.get('cluster')];
            });
            node_objects.exit().remove();

            this.updateClusterLabels();
            this.get('simulation').alpha(.01).restart();
          }
        }
      }
      renderEventQueue.popObject();
    }),
    toggleLabels: Ember.observer('showTermLabels', function () {
      if (!this.get('updating')) {
        this.updateTextLabels(this);
        // this.simulationticked(this);
      }
    }),
    toggleLinkforce: Ember.observer('linkForcesOn', function () {
      if (!this.get('updating')) {
        this.updateLinkForces(this);
        this.get('simulation').alpha(.3).restart();
        this.simulationticked(this);
      }
    }),
    /*
     Turns text labels on or off and re-renders them depending on the toggle parameter `showTermLabels`
    */
    updateTextLabels: function updateTextLabels() {
      var graph = { nodes: this.get('_nodes'), links: this.get('_links') };
      var textlayer = this.get('textlayer');
      var text_objects;
      if (this.get('showTermLabels')) {
        text_objects = textlayer.selectAll("text").data(graph.nodes, function (d) {
          return d.id;
        });
        var transform = _npmD.default.zoomTransform(_npmD.default.select(".zoom-layer").node());
        text_objects.enter().append("svg:text").attr("x", function (d) {
          return d.x + (d.enrichment != null ? d.enrichment.get('level') + 5 : 13);
        }).attr("y", function (d) {
          return d.y + (d.enrichment != null ? d.enrichment.get('level') / 2 : 4);
        }).attr("transform", transform).text(function (d) {
          return d.id + ' (' + d.term.get('name') + ')';
        });
      } else {
        text_objects = textlayer.selectAll("text").data({}, function (d) {
          return d.id;
        });
        text_objects.exit().remove();
      }
    },

    /*
     Renders Clusterlabels
    */
    updateClusterLabels: function updateClusterLabels() {
      var graph = { nodes: this.get('_nodes'), links: this.get('_links') };
      var clusterlayer = this.get('clusterlayer');
      var cluster_metoid_nodes = graph.nodes.filter(function (node) {
        return node.enrichment.get('medoid') === true;
      });
      var cluster_text_objects = clusterlayer.selectAll("text").data(cluster_metoid_nodes);
      var transform = _npmD.default.zoomTransform(_npmD.default.select(".zoom-layer").node());
      cluster_text_objects.enter().append("svg:text").attr("x", function (d) {
        return d.x + (d.enrichment != null ? d.enrichment.get('level') + 5 : 13);
      }).attr("y", function (d) {
        return d.y + (d.enrichment != null ? d.enrichment.get('level') / 2 : 4);
      }).attr("transform", transform).text(function (d) {
        return "#" + d.enrichment.get('cluster') + " - " + d.id + ' (' + d.term.get('shortname') + ')';
      }).attr("style", "font-size:200%;");
      cluster_text_objects.exit().remove();
      cluster_text_objects.text(function (d) {
        return "#" + d.enrichment.get('cluster') + " - " + d.id + ' (' + d.term.get('shortname') + ')';
      }).attr("style", "font-size:200%;");
    },

    /*
      Turns link forces on or off and re-renders them depending on the toggle parameter `linkForcesOn`
    */
    updateLinkForces: function updateLinkForces() {
      var context = this;
      var graph = { nodes: this.get('_nodes'), links: this.get('_links') };
      var simulation = this.get('simulation');
      if (this.get('linkForcesOn')) {
        simulation.alpha(.5);
        simulation.force("link", _npmD.default.forceLink().links(graph.links).id(function (d) {
          return d.id;
        }).distance(context.get('simulationdistance')).strength(context.get('simulationstrength')));
      } else {
        simulation.force("link", _npmD.default.forceLink().links(graph.links).id(function (d) {
          return d.id;
        }).distance(function (d) {
          return Math.pow(Math.pow(d.source.x - d.target.x, 2) + Math.pow(d.source.y - d.target.y, 2), 1 / 2);
        }).strength(context.get('simulationstrength')));
      }
    },

    /*
      Resizes the component (and svg) when the window size changes
    */
    didResize: function didResize() /*event*/{
      var svg = _npmD.default.select("svg");
      var width = this.set('width', this.$().parents('md-card-content').width());
      var height = this.set('height', this.$().parents('md-card-content').height());

      // Update svg size
      svg.attr("width", width);
      svg.attr("height", height);

      // Update axis scale to reflect the changes
      var xAxisScale = this.set('xAxisScale', _npmD.default.scaleLinear().domain([-width / 2, width / 2]).range([0, width]));

      var yAxisScale = this.set('yAxisScale', _npmD.default.scaleLinear().domain([-height / 2, height / 2]).range([height, 0]));

      this.get('xaxislayer').call(this.get('xAxis').scale(xAxisScale));
      this.get('yaxislayer').call(this.get('yAxis').scale(yAxisScale));

      // Re-center the axis labels
      this.updateAxisLabels();
    },

    /*
      Places centered axis labels with an occluding text box on each axis
    */
    updateAxisLabels: function updateAxisLabels() {
      var axislabellayer = this.get('axislabellayer');
      axislabellayer.selectAll('*').remove();
      //x-axis label
      axislabellayer.append("rect").attr("width", this.$().parents('md-card-content').width()).attr("height", 20).style("fill", "#FFF");

      axislabellayer.append('text').attr("transform", "translate(" + (this.get('width') + 62) / 2 + " ," + 14 + ")").style("text-anchor", "middle").text("Multi-dimensional Scaling (pixels)");

      //y-axis label
      axislabellayer.append("rect").attr("width", 62).attr("height", this.$().parents('md-card-content').height()).style("fill", "#FFF");

      axislabellayer.append('text').attr("transform", "translate(" + 15 + " ," + this.get('height') / 2 + ") rotate(-90) ").style("text-anchor", "middle").text("Multi-dimensional Scaling (pixels)");
    },

    /*
      Updates the position of each object in each layer as the simulation runs.
    */
    simulationticked: function simulationticked() {
      this.get('linklayer').selectAll('path').attr("d", function (d) {
        // console.log(d)
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy) / 4,
            mx = d.source.x + dx,
            my = d.source.y + dy;
        return ["M", d.source.x, d.source.y, "A", dr, dr, 0, 0, 1, mx, my, "A", dr, dr, 0, 0, 1, d.target.x, d.target.y].join(" ");
      });
      this.get('nodelayer').selectAll("circle").attr("cx", function (d) {
        return d.x;
      }).attr("cy", function (d) {
        return d.y;
      });

      this.get('textlayer').selectAll("text").attr("x", function (d) {
        return d.x + (d.enrichment != null ? d.enrichment.get('level') + 5 : 13);
      }).attr("y", function (d) {
        return d.y + (d.enrichment != null ? d.enrichment.get('level') / 2 : 4);
      });

      this.get('clusterlayer').selectAll("text").attr("x", function (d) {
        return d.x + (d.enrichment != null ? d.enrichment.get('level') + 5 : 13);
      }).attr("y", function (d) {
        return d.y + (d.enrichment != null ? d.enrichment.get('level') / 2 : 4);
      });
    },

    /*
      Setup the component by initializing graph layers and initially rendering. This method is called when the component is first inserted in the DOM.
    */
    didInsertElement: function didInsertElement() {
      var context = this;

      // register component resize event handler
      this.get('resizeService').on('debouncedDidResize', function (event) {
        return context.didResize(event, context);
      });

      // prepare svg for setup
      var width = this.set('width', this.$().parents('md-card-content').width());
      var height = this.set('height', this.$().parents('md-card-content').height());
      var svg = _npmD.default.select("svg");
      svg.attr("width", this.get('width'));
      svg.attr("height", this.get('height'));

      // setup zoom handler
      var zoom = _npmD.default.zoom().on("zoom", function () {
        return context.zoom(context);
      });

      // setup simulation forces (how the graph moves)
      var simulation = _npmD.default.forceSimulation().alphaMin(0.00001)
      // .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(context.get('simulationdistance')).strength(context.get('simulationstrength')))
      .force("charge", _npmD.default.forceManyBody().strength(context.get('simulationrepulsiveforce')))
      // .force("center", d3.forceCenter(width / 2, height / 2))
      .velocityDecay(.45).on("tick", function () {
        return Ember.run.scheduleOnce('render', context, context.simulationticked);
      });

      this.set('simulation', simulation);

      /*
        -----------------------------------------
        Prepare layers in SVG for later rendering.
        -> Layers are rendered in order.
        -----------------------------------------
      */

      // Layer for arrow heads on edges (markers)
      var markerlayer = this.set('markerlayer', svg.append("g").attr("class", "marker-layer"));
      //setup the marker layer (arrowheads)
      // var marker_objects = markerlayer.selectAll("marker").data(["dotted", "solid"]);
      // marker_objects.enter().append("marker")
      //     .attr("id", String)
      //     .attr("viewBox", "0 -5 10 10")
      //     .attr("refX", 12)
      //     .attr("markerWidth", 10)
      //     .attr("markerHeight", 10)
      //     .attr("orient", "auto")
      //   .append("svg:path")
      //     .attr("d", "M0,-5L10,0L0,5");
      // 

      svg.append("svg:defs").selectAll("marker").data(["dotted", "solid"]).enter().append("svg:marker").attr("id", String).attr("viewBox", "0 -5 10 10").attr("refX", 5).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("svg:path").attr("d", "M0,-5L10,0L0,5");

      // Axes setup
      var xAxisScale = this.set('xAxisScale', _npmD.default.scaleLinear().domain([-width / 2, width / 2]).range([0, width]));

      var yAxisScale = this.set('yAxisScale', _npmD.default.scaleLinear().domain([-height / 2, height / 2]).range([height, 0]));

      // create axis objects
      var xAxis = this.set('xAxis', _npmD.default.axisBottom(xAxisScale));
      var yAxis = this.set('yAxis', _npmD.default.axisLeft(yAxisScale));

      // Layer for zoom bounding box
      this.set('zoomlayer', svg.append("rect").attr("class", "zoom-layer").style("cursor", "move").style("fill", "none").style("pointer-events", "all").attr("width", width).attr("height", height).call(zoom));

      // Layer for edges in the graph
      this.set('linklayer', svg.append("g").attr("class", "link-layer"));

      // Layer for nodes in the graph
      this.set('nodelayer', svg.append("g").attr("class", "node-layer"));

      // Layer for nodes in the graph
      this.set('genenodelayer', svg.append("g").attr("class", "gene-node-layer"));

      // Layer for node labels in the graph
      this.set('textlayer', svg.append("g").attr("class", "text-layer"));
      this.set('clusterlayer', svg.append("g").attr("class", "cluster-layer"));

      // Layer for axis labels
      this.set('axislabellayer', svg.append("g").attr("class", "axislabel-layer"));
      this.updateAxisLabels();
      // Setup and Draw Axis layers
      this.set('xaxislayer', svg.append("g").attr("class", "axis xaxis-layer").attr("transform", "translate(62," + 20 + ")").call(xAxis));

      this.set('yaxislayer', svg.append("g").attr("class", "axis yaxis-layer").attr("transform", "translate(62," + 0 + ")").call(yAxis));

      this.didResize();

      // Schedule a call to render the graph
      Ember.run.scheduleOnce('render', this, this.renderGraph);
    },

    /*
      Render the graph by updating each layer to reflect changes in the underlying bound data
    */
    renderGraph: function renderGraph() {
      var context = this;

      // Retrieve SVG Layers
      var linklayer = this.get('linklayer');
      var nodelayer = this.get('nodelayer');
      // var clusterlayer = this.get('clusterlayer');
      var simulation = this.get('simulation');
      simulation.stop();
      var graph = { nodes: this.get('_nodes'), links: this.get('_links') };

      // Setup nodes in the graph, entering a new svg circle of radius enrichment.level for each node. Each node also has a handler for drag events
      var node_objects = nodelayer.selectAll("circle").data(graph.nodes, function (d) {
        return d.id;
      });
      node_objects.enter().append("circle").attr("r", function (d) {
        return d.enrichment ? d.enrichment.get('level') : context.get('noderadius');
      }).on('click', function (d, i) {
        return context.clicked(d, i, context);
      }).call(_npmD.default.drag().on("start", function (d, i) {
        return context.dragstarted(d, i, context);
      }).on("drag", function (d, i) {
        return context.dragged(d, i, context);
      }).on("end", function (d, i) {
        return context.dragended(d, i, context);
      })).attr("class", function (d) {
        return d.selected ? d.group + ' selected' : d.group;
      }).style("fill", function (d) {
        return context.get('clusterColorOptions')[d.enrichment.get('cluster')];
      }).style("stroke", "black").style("stroke-width", "3px");

      // Setup edges and draw them on the graph - attaching a new svg line for each edge
      var link_objects = linklayer.selectAll("path").data(graph.links);
      link_objects.enter().append("svg:path").attr("class", function (d) {
        return "link " + d.type;
      }).style("stroke-dasharray", 5).style("stroke", "aaa").style("stroke-width", "1.5px").attr("marker-mid", function (d) {
        return "url(#" + d.type + ")";
      });

      link_objects.exit().remove();

      //setup cluster labels
      this.updateClusterLabels();

      // Setup text showTermLabels. If enabled each node should have a label corresponding to its id
      this.updateTextLabels();

      // Update the simulation to refresh its data
      simulation.nodes(graph.nodes);

      // Turn on link forces if link forces are enabled
      this.updateLinkForces();
      this.set('updating', false);

      // Force the graph to update using tick function
      simulation.alpha(1).restart();

      // Force the graph to stop updating and then stop circles from acting gravitationally after initial easing
      Ember.run.later(context, function () {
        simulation.velocityDecay(1);
      }, 2000);

      // Set initial zoom to be fairly zoomed out
      var transform = _npmD.default.zoomTransform(_npmD.default.select(".zoom-layer").node());
      transform.k = 0.3; //transform.k is the magic zoom number!
      transform.x = this.get('width') / 3; //transform.x is the magic translation in x space
      transform.y = this.get('height') / 3;
      var new_xScale = transform.rescaleX(this.get('xAxisScale'));
      var new_yScale = transform.rescaleY(this.get('yAxisScale'));
      this.set('currentScaleFactorX', transform.k);
      this.set('currentScaleFactorY', transform.k);

      // Update axes to reflect the new scale
      this.get('xaxislayer').call(this.get('xAxis').scale(new_xScale));
      this.get('yaxislayer').call(this.get('yAxis').scale(new_yScale));

      // Transform each object in each layer to be zoomed according to the new scale
      this.get('nodelayer').selectAll('circle').attr("transform", transform);
      this.get('linklayer').selectAll('path').attr("transform", transform);
      this.get('textlayer').selectAll('text').attr("transform", transform);
      this.get('clusterlayer').selectAll('text').attr("transform", transform);
    },

    /*
      Teardown component
    */
    willDestroyElement: function willDestroyElement() {
      //clear bound node data before destroying
      this.get('nodes').clear();
      this.get('links').clear();
      this.get('renderEventQueue').clear();
      this._super.apply(this, arguments);
    },

    /*
      Handles Zoom events by resizing all content in all affected layers
    */
    zoom: function zoom() {
      // create new scale ojects based on event
      var new_xScale = _npmD.default.event.transform.rescaleX(this.get('xAxisScale'));
      var new_yScale = _npmD.default.event.transform.rescaleY(this.get('yAxisScale'));

      this.set('currentScaleFactorX', _npmD.default.event.transform.k);
      this.set('currentScaleFactorY', _npmD.default.event.transform.k);

      // Update axes to reflect the new scale
      this.get('xaxislayer').call(this.get('xAxis').scale(new_xScale));
      this.get('yaxislayer').call(this.get('yAxis').scale(new_yScale));

      // Transform each object in each layer to be zoomed according to the new scale
      this.get('nodelayer').selectAll('circle').attr("transform", _npmD.default.event.transform);
      this.get('linklayer').selectAll('path').attr("transform", _npmD.default.event.transform);
      this.get('textlayer').selectAll('text').attr("transform", _npmD.default.event.transform);
      this.get('clusterlayer').selectAll('text').attr("transform", _npmD.default.event.transform);
    },

    /*
      Handles 'click' events on nodes by toggling the selected flag on the data item and the css class. Should mirror the controller functionality.
    */
    clicked: function clicked(d) /*i*/{
      var event = { type: '', node: d };
      if (d.selected) {
        event.type = 'deselectednode';
      } else {
        event.type = 'selectednode';
      }

      // Update state to reflect that the node is currently selected

      this.get('renderEventQueue').addObject(event);
    },

    /*
      Handles drag `start` events on nodes by logging starting position of the node d being acted upon by a d3 event.
      see https://github.com/d3/d3-force#simulation_nodes and https://github.com/d3/d3-drag#drag_on
    */
    dragstarted: function dragstarted(d) /*i*/{
      if (!_npmD.default.event.active) this.get('simulation').alphaTarget(0.3).restart();

      //setup dragged flag on first move
      if (!d.dragged) {
        d.dragged = true;
        d.originx = d.x;
        d.originy = d.y;
      }
      // console.log(d);
      d.fx = d.x;
      d.fy = d.y;
    },

    /*
      Handles `drag` events on nodes by updating the position of the node d being acted upon by a d3 event.
      see https://github.com/d3/d3-force#simulation_nodes and https://github.com/d3/d3-drag#drag_on
    */
    dragged: function dragged(d) /*i*/{
      d.fx = _npmD.default.event.x;
      d.fy = _npmD.default.event.y;
    },

    /*
      Handles drag `end` events on nodes by nullifying the temporary position of the node d being acted upon by a d3 event.
      see https://github.com/d3/d3-force#simulation_nodes and https://github.com/d3/d3-drag#drag_on
    */
    dragended: function dragended(d) /*i*/{
      //clear effect (fx) params when the event ends
      if (!_npmD.default.event.active) this.get('simulation').alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  });
});
define('pathway-viz-frontend/components/to-elsewhere', ['exports', 'ember-elsewhere/components/to-elsewhere'], function (exports, _toElsewhere) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toElsewhere.default;
    }
  });
});
define('pathway-viz-frontend/components/transition-group', ['exports', 'ember-css-transitions/components/transition-group'], function (exports, _transitionGroup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _transitionGroup.default;
    }
  });
});
define('pathway-viz-frontend/components/usage-instructions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define('pathway-viz-frontend/components/virtual-each', ['exports', 'virtual-each/components/virtual-each/component'], function (exports, _component) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _component.default;
    }
  });
});
define('pathway-viz-frontend/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('pathway-viz-frontend/controllers/application', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    actions: {
      // login(){
      //   this.get('auth').login();
      // },
      externalLink: function externalLink(item) {
        window.open(item.link);
      },
      openDialog: function openDialog(event) {
        this.set('dialogOrigin', event.currentTarget);
        this.set('showDialog', true);
      },
      closeDialog: function closeDialog(result) {
        this.set('result', result);
        this.set('showDialog', false);
      }
    }
  });
});
define('pathway-viz-frontend/controllers/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    pvaluethreshold: 0.05,
    pvalueslider: 5,
    numclusters: 1,
    organismselected: { code: 'hsa', name: 'Homo sapiens (human)' },
    organismoptions: [{ code: 'hsa', name: 'Homo sapiens (human)' }, { code: 'gga', name: 'Gallus gallus (chicken)' }, { code: 'bta', name: 'Bos taurus (cow)' }, { code: 'cfa', name: 'Canis familiaris (dog)' }, { code: 'mmu', name: 'Mus musculus (mouse)' }, { code: 'rno', name: 'Rat norvegicus (rat)' }, { code: 'cel', name: 'Caenorhabditis elegans (nematode)' }, { code: 'ath', name: 'Arabidopsis thaliana (thale cress)' }, { code: 'dme', name: 'Drosophila melanogaster (fruit fly)' }, { code: 'sce', name: 'Saccharomyces cerevisiae (budding yeast)' }, { code: 'eco', name: 'Escherichia coli' }, { code: 'dre', name: 'Danio rerio (zebrafish)' }],
    background: '',
    namespaceselected: { code: 'bp', name: 'Biological Process' },
    namespaceOptions: [{ code: 'bp', name: 'Biological Process' }, { code: 'mf', name: 'Molecular Function' }, { code: 'cc', name: 'Cellular Component' }],
    genelist: '',
    genelistValidation: [{
      message: 'Genes must be listed in a comma seperated value format with no white spaces or line feed characters. e.g. gene1,gene2,...',
      validate: function validate(inputValue) {
        // let csvPattern = /^([A-Za-z0-9])+(,[A-Za-z0-9]+)*$/;
        var csvPattern = /^([^;,\<\>\s],?)+$/;

        return csvPattern.test(inputValue);
      }
    }],
    ontologyselected: Ember.computed('model', function () {
      return this.get('model').objectAt(0);
    }),
    actions: {
      populateExample: function populateExample() {
        // this.set('genelist', 'KLRC3,KLRC2,LYN,PMCH,GCNT1,AKAP5,KLRD1,KLRB1,CD109,TNFRSF9,CFH,GEM,IKZF2,STAP1,CRIM1,IL18RAP,IGF1,PON2,TNIP3,MYO1E,PLCB1,FCGR3A,KIR2DL4,PDGFA,GFPT2,TRGV3,CHN2,ABCB1,DYNC2H1,PIK3AP1,PTPRM,NDFIP2,KLRC1,TNFSF4,SPOCK1,MPP1,VAV3,PRR5L,TTLL7,PLS3,ATP9A,APOBEC3B,CDC42BPA,SERPINE2,ST8SIA6,ELOVL6,ATP8B4,CCL3,WNT11,SYCP2,CCR1,PAM,FAM3C,SLC4A4,ARHGEF12,NCR3LG1,CD244,CDH17,PIP5K1B,NRIP1,PTCH1,RAB38,SETD7,FASLG,AFAP1L2,HIST1H2BB,CD86,ATP10D,RHOC,FBN1,APBB2,SLC41A2,RASGRF2,SMOX,DTL,ATP1B1,KIF18A,XCL2,IVNS1ABP,P2RY14,SH3BP5,CD200R1,PECAM1,AKR1C3,HLADOA,FCER1G,GCNT4,LEF1,ICAM2,IL7R,LDLRAP1,KLF3,RHOU,CSGALNACT1,SLC7A11,S1PR1,AQP3,CCR8,ITGA6,NCF2,CCR7,EPHA4,MSC,KLF7,CCR4')
        this.set('genelist', 'HLA-DMA,HLA-DMB,HLA-DOA,HLA-DOB,HLA-DPA1,HLA-DPB1,HLA-DQA1,HLA-DQA2,HLA-DQB1,HLA-DRA,CD40LG,CD40,IL10,IL9,FCER1A,MS4A2,FCER1G,IL4,IL13,RNASE3,PRG2,IGH,EPX,CCL11,IL5,IL3,TNF,ALDOA,ALDOB,ALDOC,ALDH2,ALDH1B1,ALDH9A1,ALDH3A2,ALDH7A1,ALDH3A1,ALDH1A3,ALDH3B1,ALDH3B2,AKR1A1,ADH1A,ADH1B,ADH1C,ADH4,ADH5,ADH6,ADH7,PDHA1,PDHA2,PDHB,DLAT,LDHAL6A,LDHA,LDHB,LDHC,LDHAL6B,PKLR,PKM,ENO1,ENO2,ENO3,ENO4,PGAM4,PGAM1,PGAM2,BPGM,GAPDH,GAPDHS,TPI1,PFKL,PFKM,PFKP,FBP1,FBP2,GPI,PGM1,PGM2,HK1,HK2,HK3,HKDC1,GCK,GALM,G6PC,G6PC2,G6PC3,DLD,PGK1,PGK2,PCK1,PCK2,ACSS2,ACSS1,ADPGK,MINPP1');
      },
      geneformSubmit: function geneformSubmit() {
        this.transitionToRoute('visualization', { queryParams: { geneids: this.get('genelist'), pvalue: this.get('pvaluethreshold'), clusters: this.get('numclusters'), organism: this.get('organismselected.code'), background: this.get('background'), namespace: this.get('namespaceselected.code'), goontology: this.get('ontologyselected.id') } });
      },
      updatePValueSlider: function updatePValueSlider(value) {
        this.set('pvalueslider', value);
        this.set('pvaluethreshold', value / 100);
      },
      updatePValue: function updatePValue(value) {
        this.set('pvalueslider', value * 100);
        this.set('pvaluethreshold', value);
      },
      inputgenesFileChanged: function inputgenesFileChanged(file) {
        var reader = new FileReader();
        var _this = this;
        reader.onload = function (event) {
          var result = event.target.result;
          _this.set('genelist', result.replace(new RegExp('\n', 'g'), ','));
        };
        reader.readAsText(file.value);
      },
      backgroundFileChanged: function backgroundFileChanged(file) {
        var reader = new FileReader();
        var _this = this;
        reader.onload = function (event) {
          var result = event.target.result;
          _this.set('background', result);
        };
        reader.readAsText(file.value);
      }
    }
  });
});
define('pathway-viz-frontend/controllers/visualization', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    //toggles for graph options
    linkForcesOn: false,
    showTermLabels: false,

    renderEventQueue: Ember.ArrayProxy.create({ content: Ember.A() }), // Used to dispatch render events to the graph component
    /*
      Returns a sorted ArrayProxy based on the underlying model (nodes).
    */
    sortedNodes: Ember.computed('model.{@each,@each.selected}', function () {
      return this.get('model').filterBy('enrichment').sortBy('enrichment.level').reverse();
    }),
    refreshClusters: false,

    sortedNodeClusters: Ember.ArrayProxy.create({ content: Ember.A([]) }),
    sortedNodeClustersUpdater: Ember.observer('refreshClusters', function () {
      // console.log('setting up clusters')
      if (this.get('refreshClusters')) {
        var clusters = this.get('sortedNodeClusters');
        // var clusterui = this.get('clusterui');
        clusters.clear();

        for (var i = 0; i < this.get("route.clusters"); i++) {
          var genes = Ember.ArrayProxy.create({ content: Ember.A([]) });
          this.get('model').filterBy('enrichment.cluster', i).forEach(function (node) {
            node.enrichment.get('genes').forEach(function (gene) {
              return genes.addObject(gene);
            });
          });
          clusters.addObject(Ember.Object.create({ id: i, name: i, selected: true, nodes: this.get('model').filterBy('enrichment.cluster', i).sortBy('enrichment.level').reverse(), genes: genes }));
        }
        this.set('navigation.clusterjson', clusters);
      }

      //update all panel status to track expansion of expansion panels
      var panelstatus = this.get('expandedclusterpanels');
      panelstatus.clear();
      // console.log(panelstatus)
      // console.log(this.get('sortedNodeClusters.length'))
      for (var i = 0; i < this.get('sortedNodeClusters.length'); i++) {
        // console.log(i)
        panelstatus.addObject(Ember.Object.create({ "i": i, "expanded": false, "termsexpanded": false, "genesexpanded": false })); //initialize panel expansion to collapsed
      }
      this.set('expandedclusterpanels', panelstatus);
      // console.log(panelstatus)
      // console.log(this.get('expandedclusterpanels.length'))
      this.set('refreshClusters', false);
    }),
    expandedclusterpanels: Ember.ArrayProxy.create({ content: Ember.A() }),

    links: Ember.ArrayProxy.create({ content: Ember.A([]) }), //links maintained by d3 term-ontology component

    /*
      Returns the percentage of terms that have been loaded. Used to determine when loading is done
    */
    percenttermsloaded: Ember.computed('route.{termstoload,loadingqueue.@each}', function () {
      var loaded = 1;
      if (this.get('route.loadingqueue.length') >= 1 && this.get('route.termstoload') >= 1) {
        loaded = Math.floor(this.get('route.loadingqueue.length') / this.get('route.termstoload') * 100);
      }
      return loaded;
    }),

    /*
      Coalesces term and enrichment data to form nodes. Adds the nodes to the model to be used by the graph.
    */
    prepareNodes: Ember.observer('percenttermsloaded', function () {
      if (this.get('percenttermsloaded') === 100) {
        //all terms have loaded
        var loadingqueue = this.get('route.loadingqueue');
        var width = Ember.$('.term-ontology-card').width();
        var scalefactor = width;
        var center = scalefactor / 2;
        var _this = this;
        loadingqueue.forEach(function (enrichmentterm) {
          var term = enrichmentterm.term;
          var enrichment = enrichmentterm.enrichment;
          _this.get('model').addObject({
            id: term.get('termid'),
            group: 'enrichment',
            term: _this.store.peekRecord('term', term.get('id')),
            enrichment: _this.store.peekRecord('enrichment', enrichment.get('id')),
            x: enrichment.get('semanticdissimilarityx') ? enrichment.get('semanticdissimilarityx') * scalefactor + center : center,
            y: enrichment.get('semanticdissimilarityy') ? enrichment.get('semanticdissimilarityy') * scalefactor + center : center,
            clusterselected: true
          });
        });
        this.set('refreshClusters', true);
        // this.get('renderEventQueue').addObject({type: 'starting'});
        this.get('model').forEach(function (node) {
          node.term.get('parents').forEach(function (parent) {
            var target = _this.store.peekRecord('term', parent.id);
            if (_this.get('model').findBy('id', target.get('termid'))) {
              _this.get('links').addObject({
                source: node.id,
                target: parent.get('termid'),
                type: 'dotted',
                value: 1
              });
            }
          });
        });
      }
    }),
    getPanel: function getPanel(index) {
      return this.get('expandedclusterpanels')[index];
    },

    parentNodes: Ember.ArrayProxy.create({ content: Ember.A() }),
    clusterdragging: false,
    clusterslideractive: false,
    clusterfieldsubmitted: false,
    allclustersselected: true,
    actions: {
      updateClusters: function updateClusters() {
        // console.log('updating clusters observer');
        this.set('clustersloading', true);
        var num_clusters = this.get('route.clusters');
        var _this = this;
        //reset all de-selected nodes
        var clusters = this.get('sortedNodeClusters');
        clusters.forEach(function (cluster) {
          cluster.set('selected', true);
          cluster.nodes.forEach(function (node) {
            node.clusterselected = true;
          });
        });
        var event = { type: 'showallclusters' };
        this.get('renderEventQueue').addObject(event);

        //retrieve new clusters
        var request_url = _this.get('route.host') + '/api/v1/runs/' + _this.get('route.run.id') + '/recluster?' + 'clusters=' + encodeURIComponent(num_clusters);

        Ember.$.getJSON(request_url).then(function (run) {
          // console.log(run);
          run.data.type = 'run'; //ember data expects raw JSONAPI data to be typed singular for push
          // console.log('updating clusters ');
          _this.store.pushPayload(run); //loaded run data
          // console.log('updated clusters ');
          _this.get('renderEventQueue').addObject({ type: 'refreshClusters' });
          _this.set('refreshClusters', true);
          _this.set('clustersloading', false);
        });
      },

      /*
       This function dispatches an event to the graph component to reset all items that have been dragged to their origin positions 
      */
      resetGraph: function resetGraph() {
        var event = { type: 'resetGraph' };
        this.get('renderEventQueue').addObject(event);
      },
      clusterFieldSubmitted: function clusterFieldSubmitted() {
        this.set('clusterfieldsubmitted', !this.get('clusterfieldsubmitted'));
      },
      toggleAllClustersSelected: function toggleAllClustersSelected() {
        var clusters = this.get('sortedNodeClusters');
        if (this.get('allclustersselected')) {
          this.set('allclustersselected', false);
          clusters.forEach(function (cluster) {
            cluster.set('selected', false);
            cluster.nodes.forEach(function (node) {
              node.clusterselected = false;
            });
          });
          var event = { type: 'hideallclusters' };
          this.get('renderEventQueue').addObject(event);
        } else {
          this.set('allclustersselected', true);
          clusters.forEach(function (cluster) {
            cluster.set('selected', true);
            cluster.nodes.forEach(function (node) {
              node.clusterselected = true;
            });
          });
          var event = { type: 'showallclusters' };
          this.get('renderEventQueue').addObject(event);
        }
      },
      toggleSelectedCluster: function toggleSelectedCluster(cluster) {
        var event = { type: '' };
        if (cluster.selected) {
          cluster.set('selected', false);
          cluster.nodes.forEach(function (node) {
            node.clusterselected = false;
          });
          event.type = 'hidecluster';
          event.nodes = cluster.nodes;
          this.get('renderEventQueue').addObject(event);
        } else {
          // console.log(cluster);
          cluster.set('selected', true);
          cluster.nodes.forEach(function (node) {
            node.clusterselected = true;
          });
          event.type = 'showcluster';
          this.get('renderEventQueue').addObject(event);
        }
        //check to see if allclustersselected should be true
        this.set('allclustersselected', this.get('sortedNodeClusters').filter(function (cluster) {
          return !cluster.get('selected');
        }).length === 0);
      },

      /*
        Handle term selections by dispatching an event of a particular type to the underlying graph component
      */
      toggleSelectedTerm: function toggleSelectedTerm(node) {
        var event = { type: '' };
        if (node.selected) {
          event.type = 'deselectednode';
        } else {
          event.type = 'selectednode';
          console.log(node);
          // this.set('expandedclusterpanels.')
          // scheduleOnce('actions', this, function(){
          //   $('')
          // })
        }
        event.node = node;
        event.origin = "menu";
        this.get('renderEventQueue').addObject(event);
      }
    }
  });
});
define('pathway-viz-frontend/helpers/-paper-underscore', ['exports', 'ember-paper/helpers/underscore'], function (exports, _underscore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _underscore.default;
    }
  });
  Object.defineProperty(exports, 'underscore', {
    enumerable: true,
    get: function () {
      return _underscore.underscore;
    }
  });
});
define('pathway-viz-frontend/helpers/abs', ['exports', 'ember-math-helpers/helpers/abs'], function (exports, _abs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _abs.default;
    }
  });
  Object.defineProperty(exports, 'abs', {
    enumerable: true,
    get: function () {
      return _abs.abs;
    }
  });
});
define('pathway-viz-frontend/helpers/acos', ['exports', 'ember-math-helpers/helpers/acos'], function (exports, _acos) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _acos.default;
    }
  });
  Object.defineProperty(exports, 'acos', {
    enumerable: true,
    get: function () {
      return _acos.acos;
    }
  });
});
define('pathway-viz-frontend/helpers/acosh', ['exports', 'ember-math-helpers/helpers/acosh'], function (exports, _acosh) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _acosh.default;
    }
  });
  Object.defineProperty(exports, 'acosh', {
    enumerable: true,
    get: function () {
      return _acosh.acosh;
    }
  });
});
define('pathway-viz-frontend/helpers/add', ['exports', 'ember-math-helpers/helpers/add'], function (exports, _add) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _add.default;
    }
  });
  Object.defineProperty(exports, 'add', {
    enumerable: true,
    get: function () {
      return _add.add;
    }
  });
});
define('pathway-viz-frontend/helpers/and', ['exports', 'ember-truth-helpers/helpers/and'], function (exports, _and) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_and.andHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_and.andHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/helpers/app-version', ['exports', 'pathway-viz-frontend/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('pathway-viz-frontend/helpers/array', ['exports', 'ember-frost-core/helpers/array'], function (exports, _array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _array.default;
    }
  });
  Object.defineProperty(exports, 'array', {
    enumerable: true,
    get: function () {
      return _array.array;
    }
  });
});
define('pathway-viz-frontend/helpers/asin', ['exports', 'ember-math-helpers/helpers/asin'], function (exports, _asin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _asin.default;
    }
  });
  Object.defineProperty(exports, 'asin', {
    enumerable: true,
    get: function () {
      return _asin.asin;
    }
  });
});
define('pathway-viz-frontend/helpers/asinh', ['exports', 'ember-math-helpers/helpers/asinh'], function (exports, _asinh) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _asinh.default;
    }
  });
  Object.defineProperty(exports, 'asinh', {
    enumerable: true,
    get: function () {
      return _asinh.asinh;
    }
  });
});
define('pathway-viz-frontend/helpers/atan', ['exports', 'ember-math-helpers/helpers/atan'], function (exports, _atan) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _atan.default;
    }
  });
  Object.defineProperty(exports, 'atan', {
    enumerable: true,
    get: function () {
      return _atan.atan;
    }
  });
});
define('pathway-viz-frontend/helpers/atan2', ['exports', 'ember-math-helpers/helpers/atan2'], function (exports, _atan) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _atan.default;
    }
  });
  Object.defineProperty(exports, 'atan2', {
    enumerable: true,
    get: function () {
      return _atan.atan2;
    }
  });
});
define('pathway-viz-frontend/helpers/atanh', ['exports', 'ember-math-helpers/helpers/atanh'], function (exports, _atanh) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _atanh.default;
    }
  });
  Object.defineProperty(exports, 'atanh', {
    enumerable: true,
    get: function () {
      return _atanh.atanh;
    }
  });
});
define('pathway-viz-frontend/helpers/cancel-all', ['exports', 'ember-concurrency/-helpers'], function (exports, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.cancelHelper = cancelHelper;
  function cancelHelper(args) {
    var cancelable = args[0];
    if (!cancelable || typeof cancelable.cancelAll !== 'function') {
      Ember.assert('The first argument passed to the `cancel-all` helper should be a Task or TaskGroup (without quotes); you passed ' + cancelable, false);
    }

    return (0, _helpers.taskHelperClosure)('cancelAll', args);
  }

  exports.default = Ember.Helper.helper(cancelHelper);
});
define('pathway-viz-frontend/helpers/cbrt', ['exports', 'ember-math-helpers/helpers/cbrt'], function (exports, _cbrt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _cbrt.default;
    }
  });
  Object.defineProperty(exports, 'cbrt', {
    enumerable: true,
    get: function () {
      return _cbrt.cbrt;
    }
  });
});
define('pathway-viz-frontend/helpers/ceil', ['exports', 'ember-math-helpers/helpers/ceil'], function (exports, _ceil) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ceil.default;
    }
  });
  Object.defineProperty(exports, 'ceil', {
    enumerable: true,
    get: function () {
      return _ceil.ceil;
    }
  });
});
define('pathway-viz-frontend/helpers/clz32', ['exports', 'ember-math-helpers/helpers/clz32'], function (exports, _clz) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _clz.default;
    }
  });
  Object.defineProperty(exports, 'clz32', {
    enumerable: true,
    get: function () {
      return _clz.clz32;
    }
  });
});
define('pathway-viz-frontend/helpers/cos', ['exports', 'ember-math-helpers/helpers/cos'], function (exports, _cos) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _cos.default;
    }
  });
  Object.defineProperty(exports, 'cos', {
    enumerable: true,
    get: function () {
      return _cos.cos;
    }
  });
});
define('pathway-viz-frontend/helpers/cosh', ['exports', 'ember-math-helpers/helpers/cosh'], function (exports, _cosh) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _cosh.default;
    }
  });
  Object.defineProperty(exports, 'cosh', {
    enumerable: true,
    get: function () {
      return _cosh.cosh;
    }
  });
});
define('pathway-viz-frontend/helpers/div', ['exports', 'ember-math-helpers/helpers/div'], function (exports, _div) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _div.default;
    }
  });
  Object.defineProperty(exports, 'div', {
    enumerable: true,
    get: function () {
      return _div.div;
    }
  });
});
define('pathway-viz-frontend/helpers/ember-power-select-is-group', ['exports', 'ember-power-select/helpers/ember-power-select-is-group'], function (exports, _emberPowerSelectIsGroup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPowerSelectIsGroup.default;
    }
  });
  Object.defineProperty(exports, 'emberPowerSelectIsGroup', {
    enumerable: true,
    get: function () {
      return _emberPowerSelectIsGroup.emberPowerSelectIsGroup;
    }
  });
});
define('pathway-viz-frontend/helpers/ember-power-select-is-selected', ['exports', 'ember-power-select/helpers/ember-power-select-is-selected'], function (exports, _emberPowerSelectIsSelected) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPowerSelectIsSelected.default;
    }
  });
  Object.defineProperty(exports, 'emberPowerSelectIsSelected', {
    enumerable: true,
    get: function () {
      return _emberPowerSelectIsSelected.emberPowerSelectIsSelected;
    }
  });
});
define('pathway-viz-frontend/helpers/ember-power-select-true-string-if-present', ['exports', 'ember-power-select/helpers/ember-power-select-true-string-if-present'], function (exports, _emberPowerSelectTrueStringIfPresent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberPowerSelectTrueStringIfPresent.default;
    }
  });
  Object.defineProperty(exports, 'emberPowerSelectTrueStringIfPresent', {
    enumerable: true,
    get: function () {
      return _emberPowerSelectTrueStringIfPresent.emberPowerSelectTrueStringIfPresent;
    }
  });
});
define('pathway-viz-frontend/helpers/eq', ['exports', 'ember-truth-helpers/helpers/equal'], function (exports, _equal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_equal.equalHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_equal.equalHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/helpers/exp', ['exports', 'ember-math-helpers/helpers/exp'], function (exports, _exp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _exp.default;
    }
  });
  Object.defineProperty(exports, 'exp', {
    enumerable: true,
    get: function () {
      return _exp.exp;
    }
  });
});
define('pathway-viz-frontend/helpers/expm1', ['exports', 'ember-math-helpers/helpers/expm1'], function (exports, _expm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _expm.default;
    }
  });
  Object.defineProperty(exports, 'expm1', {
    enumerable: true,
    get: function () {
      return _expm.expm1;
    }
  });
});
define('pathway-viz-frontend/helpers/exponential-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.exponentialForm = exponentialForm;
  function exponentialForm(number) {
    return Number(number).toExponential(6);
  } /**
     * @Author: Matthew Hale <matthale>
     * @Date:   2018-02-24T01:04:27-06:00
     * @Email:  mlhale@unomaha.edu
     * @Filename: exponential-form.js
     * @Last modified by:   matthale
     * @Last modified time: 2018-02-24T01:12:03-06:00
     * @Copyright: Copyright (C) 2018 Matthew L. Hale
     */

  exports.default = Ember.Helper.helper(exponentialForm);
});
define('pathway-viz-frontend/helpers/extend', ['exports', 'ember-frost-core/helpers/extend'], function (exports, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _extend.default;
    }
  });
  Object.defineProperty(exports, 'extend', {
    enumerable: true,
    get: function () {
      return _extend.extend;
    }
  });
});
define('pathway-viz-frontend/helpers/floor', ['exports', 'ember-math-helpers/helpers/floor'], function (exports, _floor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _floor.default;
    }
  });
  Object.defineProperty(exports, 'floor', {
    enumerable: true,
    get: function () {
      return _floor.floor;
    }
  });
});
define('pathway-viz-frontend/helpers/fround', ['exports', 'ember-math-helpers/helpers/fround'], function (exports, _fround) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _fround.default;
    }
  });
  Object.defineProperty(exports, 'fround', {
    enumerable: true,
    get: function () {
      return _fround.fround;
    }
  });
});
define('pathway-viz-frontend/helpers/gcd', ['exports', 'ember-math-helpers/helpers/gcd'], function (exports, _gcd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _gcd.default;
    }
  });
  Object.defineProperty(exports, 'gcd', {
    enumerable: true,
    get: function () {
      return _gcd.gcd;
    }
  });
});
define('pathway-viz-frontend/helpers/gt', ['exports', 'ember-truth-helpers/helpers/gt'], function (exports, _gt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_gt.gtHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_gt.gtHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/helpers/gte', ['exports', 'ember-truth-helpers/helpers/gte'], function (exports, _gte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_gte.gteHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_gte.gteHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/helpers/hook', ['exports', 'ember-hook/helpers/hook'], function (exports, _hook) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _hook.default;
    }
  });
  Object.defineProperty(exports, 'hook', {
    enumerable: true,
    get: function () {
      return _hook.hook;
    }
  });
});
define('pathway-viz-frontend/helpers/hypot', ['exports', 'ember-math-helpers/helpers/hypot'], function (exports, _hypot) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _hypot.default;
    }
  });
  Object.defineProperty(exports, 'hypot', {
    enumerable: true,
    get: function () {
      return _hypot.hypot;
    }
  });
});
define('pathway-viz-frontend/helpers/imul', ['exports', 'ember-math-helpers/helpers/imul'], function (exports, _imul) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _imul.default;
    }
  });
  Object.defineProperty(exports, 'imul', {
    enumerable: true,
    get: function () {
      return _imul.imul;
    }
  });
});
define('pathway-viz-frontend/helpers/is-array', ['exports', 'ember-truth-helpers/helpers/is-array'], function (exports, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_isArray.isArrayHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_isArray.isArrayHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/helpers/is-empty', ['exports', 'ember-truth-helpers/helpers/is-empty'], function (exports, _isEmpty) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isEmpty.default;
    }
  });
});
define('pathway-viz-frontend/helpers/is-equal-by-path', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  exports.default = Ember.Helper.helper(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        leftSide = _ref2[0],
        rightSide = _ref2[1],
        path = _ref2[2];

    if (path) {
      return Ember.get(leftSide, path) === rightSide;
    } else {
      return leftSide === rightSide;
    }
  });
});
define('pathway-viz-frontend/helpers/is-equal', ['exports', 'ember-truth-helpers/helpers/is-equal'], function (exports, _isEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isEqual.default;
    }
  });
  Object.defineProperty(exports, 'isEqual', {
    enumerable: true,
    get: function () {
      return _isEqual.isEqual;
    }
  });
});
define('pathway-viz-frontend/helpers/is-not', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  exports.default = Ember.Helper.helper(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        value = _ref2[0];

    return !value;
  });
});
define('pathway-viz-frontend/helpers/lcm', ['exports', 'ember-math-helpers/helpers/lcm'], function (exports, _lcm) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _lcm.default;
    }
  });
  Object.defineProperty(exports, 'lcm', {
    enumerable: true,
    get: function () {
      return _lcm.lcm;
    }
  });
});
define('pathway-viz-frontend/helpers/log-e', ['exports', 'ember-math-helpers/helpers/log-e'], function (exports, _logE) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _logE.default;
    }
  });
  Object.defineProperty(exports, 'logE', {
    enumerable: true,
    get: function () {
      return _logE.logE;
    }
  });
});
define('pathway-viz-frontend/helpers/log10', ['exports', 'ember-math-helpers/helpers/log10'], function (exports, _log) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _log.default;
    }
  });
  Object.defineProperty(exports, 'log10', {
    enumerable: true,
    get: function () {
      return _log.log10;
    }
  });
});
define('pathway-viz-frontend/helpers/log1p', ['exports', 'ember-math-helpers/helpers/log1p'], function (exports, _log1p) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _log1p.default;
    }
  });
  Object.defineProperty(exports, 'log1p', {
    enumerable: true,
    get: function () {
      return _log1p.log1p;
    }
  });
});
define('pathway-viz-frontend/helpers/log2', ['exports', 'ember-math-helpers/helpers/log2'], function (exports, _log) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _log.default;
    }
  });
  Object.defineProperty(exports, 'log2', {
    enumerable: true,
    get: function () {
      return _log.log2;
    }
  });
});
define('pathway-viz-frontend/helpers/lt', ['exports', 'ember-truth-helpers/helpers/lt'], function (exports, _lt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_lt.ltHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_lt.ltHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/helpers/lte', ['exports', 'ember-truth-helpers/helpers/lte'], function (exports, _lte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_lte.lteHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_lte.lteHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/helpers/max', ['exports', 'ember-math-helpers/helpers/max'], function (exports, _max) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _max.default;
    }
  });
  Object.defineProperty(exports, 'max', {
    enumerable: true,
    get: function () {
      return _max.max;
    }
  });
});
define('pathway-viz-frontend/helpers/min', ['exports', 'ember-math-helpers/helpers/min'], function (exports, _min) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _min.default;
    }
  });
  Object.defineProperty(exports, 'min', {
    enumerable: true,
    get: function () {
      return _min.min;
    }
  });
});
define('pathway-viz-frontend/helpers/mod', ['exports', 'ember-math-helpers/helpers/mod'], function (exports, _mod) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _mod.default;
    }
  });
  Object.defineProperty(exports, 'mod', {
    enumerable: true,
    get: function () {
      return _mod.mod;
    }
  });
});
define('pathway-viz-frontend/helpers/mult', ['exports', 'ember-math-helpers/helpers/mult'], function (exports, _mult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _mult.default;
    }
  });
  Object.defineProperty(exports, 'mult', {
    enumerable: true,
    get: function () {
      return _mult.mult;
    }
  });
});
define('pathway-viz-frontend/helpers/not-eq', ['exports', 'ember-truth-helpers/helpers/not-equal'], function (exports, _notEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_notEqual.notEqualHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_notEqual.notEqualHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/helpers/not', ['exports', 'ember-truth-helpers/helpers/not'], function (exports, _not) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_not.notHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_not.notHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/helpers/object', ['exports', 'ember-frost-core/helpers/object'], function (exports, _object) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _object.default;
    }
  });
  Object.defineProperty(exports, 'object', {
    enumerable: true,
    get: function () {
      return _object.object;
    }
  });
});
define('pathway-viz-frontend/helpers/or', ['exports', 'ember-truth-helpers/helpers/or'], function (exports, _or) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_or.orHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_or.orHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/helpers/perform', ['exports', 'ember-concurrency/-helpers'], function (exports, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.performHelper = performHelper;
  function performHelper(args, hash) {
    return (0, _helpers.taskHelperClosure)('perform', args, hash);
  }

  exports.default = Ember.Helper.helper(performHelper);
});
define('pathway-viz-frontend/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('pathway-viz-frontend/helpers/pow', ['exports', 'ember-math-helpers/helpers/pow'], function (exports, _pow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pow.default;
    }
  });
  Object.defineProperty(exports, 'pow', {
    enumerable: true,
    get: function () {
      return _pow.pow;
    }
  });
});
define('pathway-viz-frontend/helpers/random', ['exports', 'ember-math-helpers/helpers/random'], function (exports, _random) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _random.default;
    }
  });
  Object.defineProperty(exports, 'random', {
    enumerable: true,
    get: function () {
      return _random.random;
    }
  });
});
define('pathway-viz-frontend/helpers/read-path', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  exports.default = Ember.Helper.helper(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        object = _ref2[0],
        path = _ref2[1];

    if (path) {
      return Ember.get(object, path);
    } else {
      return object;
    }
  });
});
define('pathway-viz-frontend/helpers/round', ['exports', 'ember-math-helpers/helpers/round'], function (exports, _round) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _round.default;
    }
  });
  Object.defineProperty(exports, 'round', {
    enumerable: true,
    get: function () {
      return _round.round;
    }
  });
});
define('pathway-viz-frontend/helpers/sign', ['exports', 'ember-math-helpers/helpers/sign'], function (exports, _sign) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _sign.default;
    }
  });
  Object.defineProperty(exports, 'sign', {
    enumerable: true,
    get: function () {
      return _sign.sign;
    }
  });
});
define('pathway-viz-frontend/helpers/sin', ['exports', 'ember-math-helpers/helpers/sin'], function (exports, _sin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _sin.default;
    }
  });
  Object.defineProperty(exports, 'sin', {
    enumerable: true,
    get: function () {
      return _sin.sin;
    }
  });
});
define('pathway-viz-frontend/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('pathway-viz-frontend/helpers/sqrt', ['exports', 'ember-math-helpers/helpers/sqrt'], function (exports, _sqrt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _sqrt.default;
    }
  });
  Object.defineProperty(exports, 'sqrt', {
    enumerable: true,
    get: function () {
      return _sqrt.sqrt;
    }
  });
});
define('pathway-viz-frontend/helpers/sub', ['exports', 'ember-math-helpers/helpers/sub'], function (exports, _sub) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _sub.default;
    }
  });
  Object.defineProperty(exports, 'sub', {
    enumerable: true,
    get: function () {
      return _sub.sub;
    }
  });
});
define('pathway-viz-frontend/helpers/tan', ['exports', 'ember-math-helpers/helpers/tan'], function (exports, _tan) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tan.default;
    }
  });
  Object.defineProperty(exports, 'tan', {
    enumerable: true,
    get: function () {
      return _tan.tan;
    }
  });
});
define('pathway-viz-frontend/helpers/tanh', ['exports', 'ember-math-helpers/helpers/tanh'], function (exports, _tanh) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _tanh.default;
    }
  });
  Object.defineProperty(exports, 'tanh', {
    enumerable: true,
    get: function () {
      return _tanh.tanh;
    }
  });
});
define('pathway-viz-frontend/helpers/task', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  function taskHelper(_ref) {
    var _ref2 = _toArray(_ref),
        task = _ref2[0],
        args = _ref2.slice(1);

    return task._curry.apply(task, _toConsumableArray(args));
  }

  exports.default = Ember.Helper.helper(taskHelper);
});
define('pathway-viz-frontend/helpers/trunc', ['exports', 'ember-math-helpers/helpers/trunc'], function (exports, _trunc) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _trunc.default;
    }
  });
  Object.defineProperty(exports, 'trunc', {
    enumerable: true,
    get: function () {
      return _trunc.trunc;
    }
  });
});
define('pathway-viz-frontend/helpers/xor', ['exports', 'ember-truth-helpers/helpers/xor'], function (exports, _xor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_xor.xorHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_xor.xorHelper);
  }

  exports.default = forExport;
});
define('pathway-viz-frontend/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'pathway-viz-frontend/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('pathway-viz-frontend/initializers/component-prop-types', ['exports', 'ember-prop-types/initializers/component-prop-types'], function (exports, _componentPropTypes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _componentPropTypes.default;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _componentPropTypes.initialize;
    }
  });
});
define('pathway-viz-frontend/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('pathway-viz-frontend/initializers/csv', ['exports', 'ember-cli-data-export/initializers/csv'], function (exports, _csv) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _csv.default;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _csv.initialize;
    }
  });
});
define('pathway-viz-frontend/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('pathway-viz-frontend/initializers/ember-concurrency', ['exports', 'ember-concurrency'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-concurrency',
    initialize: function initialize() {}
  };
});
define('pathway-viz-frontend/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('pathway-viz-frontend/initializers/ember-hook/initialize', ['exports', 'ember-hook/initializers/ember-hook/initialize'], function (exports, _initialize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _initialize.default;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _initialize.initialize;
    }
  });
});
define('pathway-viz-frontend/initializers/excel', ['exports', 'ember-cli-data-export/initializers/excel'], function (exports, _excel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _excel.default;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _excel.initialize;
    }
  });
});
define('pathway-viz-frontend/initializers/export-application-global', ['exports', 'pathway-viz-frontend/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('pathway-viz-frontend/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('pathway-viz-frontend/initializers/navigation', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  /**
   * @Author: Matthew Hale <mlhale>
   * @Date:   2018-02-14T23:03:42-06:00
   * @Email:  mlhale@unomaha.edu
   * @Filename: navigation.js
   * @Last modified by:   mlhale
   * @Last modified time: 2018-02-15T00:22:57-06:00
   * @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
   * @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa
   */

  function initialize(application) {
    application.inject('component', 'navigation', 'service:navigation');
    application.inject('controller', 'navigation', 'service:navigation');
    application.inject('route', 'navigation', 'service:navigation');
  }

  exports.default = {
    initialize: initialize
  };
});
define('pathway-viz-frontend/initializers/resize', ['exports', 'ember-resize/services/resize', 'pathway-viz-frontend/config/environment'], function (exports, _resize, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.initialize = initialize;
    function initialize(application) {
        var resizeServiceDefaults = Ember.getWithDefault(_environment.default, 'resizeServiceDefaults', {
            debounceTimeout: 200,
            heightSensitive: true,
            widthSensitive: true
        });
        var injectionFactories = Ember.getWithDefault(resizeServiceDefaults, 'injectionFactories', ['view', 'component']) || [];
        application.unregister('config:resize-service');
        application.register('config:resize-service', resizeServiceDefaults, { instantiate: false });
        application.register('service:resize', _resize.default);
        var resizeService = application.resolveRegistration('service:resize');
        resizeService.prototype.resizeServiceDefaults = resizeServiceDefaults;
        injectionFactories.forEach(function (factory) {
            application.inject(factory, 'resizeService', 'service:resize');
        });
    }
    exports.default = {
        initialize: initialize,
        name: 'resize'
    };
});
define('pathway-viz-frontend/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  /**
   * @Author: Matthew Hale <mlhale>
   * @Date:   2018-02-14T23:03:42-06:00
   * @Email:  mlhale@unomaha.edu
   * @Filename: store.js
   * @Last modified by:   mlhale
   * @Last modified time: 2018-02-15T00:23:00-06:00
   * @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
   * @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa
   */

  function initialize(application) {
    application.inject('component', 'store', 'service:store');
  }

  exports.default = {
    initialize: initialize
  };
});
define('pathway-viz-frontend/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('pathway-viz-frontend/initializers/truth-helpers', ['exports', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _registerHelper, _and, _or, _equal, _not, _isArray, _notEqual, _gt, _gte, _lt, _lte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (Ember.Helper) {
      return;
    }

    (0, _registerHelper.registerHelper)('and', _and.andHelper);
    (0, _registerHelper.registerHelper)('or', _or.orHelper);
    (0, _registerHelper.registerHelper)('eq', _equal.equalHelper);
    (0, _registerHelper.registerHelper)('not', _not.notHelper);
    (0, _registerHelper.registerHelper)('is-array', _isArray.isArrayHelper);
    (0, _registerHelper.registerHelper)('not-eq', _notEqual.notEqualHelper);
    (0, _registerHelper.registerHelper)('gt', _gt.gtHelper);
    (0, _registerHelper.registerHelper)('gte', _gte.gteHelper);
    (0, _registerHelper.registerHelper)('lt', _lt.ltHelper);
    (0, _registerHelper.registerHelper)('lte', _lte.lteHelper);
  }

  exports.default = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define("pathway-viz-frontend/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('pathway-viz-frontend/instance-initializers/svg-use-polyfill', ['exports', 'ember-frost-core/instance-initializers/svg-use-polyfill'], function (exports, _svgUsePolyfill) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _svgUsePolyfill.default;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _svgUsePolyfill.initialize;
    }
  });
});
define('pathway-viz-frontend/mirage-models/link', ['exports', 'ember-frost-core/mirage-models/link'], function (exports, _link) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _link.default;
    }
  });
});
define('pathway-viz-frontend/mixins/default-attrs', ['exports', 'virtual-each/mixins/default-attrs'], function (exports, _defaultAttrs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _defaultAttrs.default;
    }
  });
});
define('pathway-viz-frontend/mixins/resize-aware', ['exports', 'ember-resize/mixins/resize-aware'], function (exports, _resizeAware) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _resizeAware.default;
    }
  });
});
define('pathway-viz-frontend/mixins/transition-mixin', ['exports', 'ember-css-transitions/mixins/transition-mixin'], function (exports, _transitionMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _transitionMixin.default;
    }
  });
});
define('pathway-viz-frontend/models/enrichment', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    term: _emberData.default.belongsTo('term'),
    pvalue: _emberData.default.attr('number'),
    level: _emberData.default.attr('number'),
    semanticdissimilarityx: _emberData.default.attr('number'),
    semanticdissimilarityy: _emberData.default.attr('number'),
    cluster: _emberData.default.attr('number'),
    medoid: _emberData.default.attr('boolean'),
    genes: _emberData.default.hasMany('gene')
  });
});
define('pathway-viz-frontend/models/gene', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    geneid: _emberData.default.attr('string'),
    name: _emberData.default.attr('string')
  });
});
define('pathway-viz-frontend/models/ontology', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    name: _emberData.default.attr('string'),
    description: _emberData.default.attr('string')
  });
});
define('pathway-viz-frontend/models/run', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    name: _emberData.default.attr('string'),
    ip: _emberData.default.attr('string'),
    created: _emberData.default.attr('date'),
    enrichments: _emberData.default.hasMany('enrichment')
  });
});
define('pathway-viz-frontend/models/term', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    termid: _emberData.default.attr('string'),
    name: _emberData.default.attr('string'),
    namespace: _emberData.default.attr('string'),
    description: _emberData.default.attr('string'),
    synonym: _emberData.default.attr('string'),
    parents: _emberData.default.hasMany('term', { inverse: 'children' }),
    children: _emberData.default.hasMany('term', { inverse: 'parents' }),
    enrichments: _emberData.default.belongsTo('enrichment'),
    ontology: _emberData.default.belongsTo('ontology'),
    shortname: Ember.computed('name', function () {
      var name = this.get('name');
      var maxLength = 40;
      if (name.length <= maxLength) return name;
      return name.substr(0, name.lastIndexOf(' ', maxLength)).concat('...');
    })
  });
});
define('pathway-viz-frontend/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('pathway-viz-frontend/router', ['exports', 'pathway-viz-frontend/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * @Author: Matthew Hale <mlhale>
   * @Date:   2018-02-14T23:03:42-06:00
   * @Email:  mlhale@unomaha.edu
   * @Filename: router.js
   * @Last modified by:   mlhale
   * @Last modified time: 2018-02-15T00:23:35-06:00
   * @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
   * @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa
   */

  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.bURL
  });

  Router.map(function () {
    this.route('visualization');
  });

  exports.default = Router;
});
define('pathway-viz-frontend/routes/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    beforeModel: function beforeModel() /* transition */{
      // console.log('redirecting to visualization');
      // this.transitionTo('visualization');
    },
    model: function model() {
      return this.store.findAll('ontology').then(function (result) {
        return result.sortBy('created').reverse();
      });
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
    }
  });
});
define('pathway-viz-frontend/routes/visualization', ['exports', 'pathway-viz-frontend/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    queryParams: {
      geneids: {
        refreshModel: true
      },
      pvalue: {
        refreshModel: true
      },
      clusters: {
        refreshModel: true
      },
      organism: {
        refreshModel: true
      },
      background: {
        refreshModel: true
      },
      namespace: {
        refreshModel: true
      },
      goontology: {
        refreshModel: true
      }
    },
    termstoload: 0,
    termcount: 0,
    clusters: 0,
    error: '',
    loadingqueue: Ember.ArrayProxy.create({ content: Ember.A() }),
    host: _environment.default.host,
    activate: function activate() {
      var buttons = this.get('navigation').get('dynamicbuttons');
      buttons.clear();
      buttons.addObject('download-options');
    },
    deactivate: function deactivate() {
      var buttons = this.get('navigation').get('dynamicbuttons');
      buttons.clear();
    },
    beforeModel: function beforeModel() {
      //reset loading variables that control the interface
      this.get('loadingqueue').clear();
      this.set('termstoload', 0);
      this.set('termcount', 0);
      this.set('clusters', -1);
      this.set('error', '');
    },
    model: function model(params) {
      var _this = this;

      // Invoke the GOUtil function and wait to receive a 'run' model with the enrichment data
      this.set('clusters', params.clusters);
      var request_url = _environment.default.host + '/api/v1/runs/invoke';
      // var request_url = config.host+'/api/v1/runs/invoke?'
      //   + 'genes='    +  encodeURIComponent(params.geneids)
      //   + '&pvalue='  +  encodeURIComponent(params.pvalue)
      //   + '&clusters='+  encodeURIComponent(params.clusters)
      //   + '&organism='+  encodeURIComponent(params.organism)
      var data = { background: params.background, genes: params.geneids, pvalue: params.pvalue, clusters: params.clusters, organism: params.organism, namespace: params.namespace, goontology: params.goontology };
      Ember.$.post(request_url, data).then(
      //success, received run
      function (response) {
        // console.log(response);
        // Total terms that will need to be loaded
        _this.set('termstoload', response.data.relationships.enrichments.data.length);

        response.data.type = 'run'; //ember data expects raw JSONAPI data to be typed singular for push
        _this.store.push(response); //loaded run
        _this.set('run', _this.store.peekRecord('run', response.data.id));

        // Load related enrichment and term records connected to the run
        response.data.relationships.enrichments.data.forEach(function (enrichment) {
          _this.store.findRecord('enrichment', enrichment.id, { include: 'term,term.parents,genes' }).then(function (enrichment) {
            // Enrichment model loaded, now load the term
            var term = enrichment.get('term');
            if (enrichment.get('cluster') + 1 > _this.get('clusters')) {
              _this.set('clusters', enrichment.get('cluster') + 1);
            }
            // Term model loaded, hash both together and send to the loading queue
            _this.get('loadingqueue').pushObject({ 'enrichment': enrichment, 'term': term });
          });
        });
        // Load meta data about the full Gene Ontology
        Ember.$.getJSON(_environment.default.host + '/api/v1/terms/get_pages', { namespace: params.namespace, goontology: params.goontology }).then(function (result) {
          _this.set('termcount', result.data.count);
        });
      },
      //error handling
      function (response) {
        _this.set('error', response.responseJSON.errors.error);
        // console.log(_this.get('error'));
      });

      // Prepare an empty array for the controller to use
      return Ember.ArrayProxy.create({ content: Ember.A([]) });
    },
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.set('model', model);
      controller.set('route', this);
    }
  });
});
define('pathway-viz-frontend/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('pathway-viz-frontend/services/constants', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({

    sniffer: Ember.inject.service('sniffer'),

    webkit: Ember.computed(function () {
      return (/webkit/i.test(this.get('sniffer.vendorPrefix'))
      );
    }),

    vendorProperty: function vendorProperty(name) {
      return this.get('webkit') ? '-webkit-' + name.charAt(0) + name.substring(1) : name;
    },


    CSS: Ember.computed('webkit', function () {
      var webkit = this.get('webkit');
      return {
        /* Constants */
        TRANSITIONEND: 'transitionend' + (webkit ? ' webkitTransitionEnd' : ''),
        ANIMATIONEND: 'animationend' + (webkit ? ' webkitAnimationEnd' : ''),

        TRANSFORM: this.vendorProperty('transform'),
        TRANSFORM_ORIGIN: this.vendorProperty('transformOrigin'),
        TRANSITION: this.vendorProperty('transition'),
        TRANSITION_DURATION: this.vendorProperty('transitionDuration'),
        ANIMATION_PLAY_STATE: this.vendorProperty('animationPlayState'),
        ANIMATION_DURATION: this.vendorProperty('animationDuration'),
        ANIMATION_NAME: this.vendorProperty('animationName'),
        ANIMATION_TIMING: this.vendorProperty('animationTimingFunction'),
        ANIMATION_DIRECTION: this.vendorProperty('animationDirection')
      };
    }),

    KEYCODE: Ember.Object.create({
      ENTER: 13,
      ESCAPE: 27,
      SPACE: 32,
      LEFT_ARROW: 37,
      UP_ARROW: 38,
      RIGHT_ARROW: 39,
      DOWN_ARROW: 40,
      TAB: 9
    }),

    // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
    MEDIA: {
      'xs': '(max-width: 599px)',
      'gt-xs': '(min-width: 600px)',
      'sm': '(min-width: 600px) and (max-width: 959px)',
      'gt-sm': '(min-width: 960px)',
      'md': '(min-width: 960px) and (max-width: 1279px)',
      'gt-md': '(min-width: 1280px)',
      'lg': '(min-width: 1280px) and (max-width: 1919px)',
      'gt-lg': '(min-width: 1920px)',
      'xl': '(min-width: 1920px)',
      'print': 'print'
    },

    // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
    MEDIA_PRIORITY: ['xl', 'gt-lg', 'lg', 'gt-md', 'md', 'gt-sm', 'sm', 'gt-xs', 'xs', 'print']
  });
});
define('pathway-viz-frontend/services/csv', ['exports', 'ember-cli-data-export/services/csv'], function (exports, _csv) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _csv.default;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _csv.initialize;
    }
  });
});
define('pathway-viz-frontend/services/ember-elsewhere', ['exports', 'ember-elsewhere/services/ember-elsewhere'], function (exports, _emberElsewhere) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberElsewhere.default;
    }
  });
});
define('pathway-viz-frontend/services/excel', ['exports', 'ember-cli-data-export/services/excel'], function (exports, _excel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _excel.default;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _excel.initialize;
    }
  });
});
define('pathway-viz-frontend/services/navigation', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    menuitems: Ember.ArrayProxy.create({ content: Ember.A([
        // {
        //   title: 'Some title',
        //   icon: 'material icon name',
        //   link: 'http://somelink.com',
        // },
      ]) }),
    clusterjson: null, //this will be set to allow for exporting cluster data
    dynamicbuttons: Ember.ArrayProxy.create({ content: Ember.A() })
  });
});
define('pathway-viz-frontend/services/paper-sidenav', ['exports', 'ember-paper/services/paper-sidenav'], function (exports, _paperSidenav) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperSidenav.default;
    }
  });
});
define('pathway-viz-frontend/services/paper-theme', ['exports', 'ember-paper/services/paper-theme'], function (exports, _paperTheme) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperTheme.default;
    }
  });
});
define('pathway-viz-frontend/services/paper-toaster', ['exports', 'ember-paper/services/paper-toaster'], function (exports, _paperToaster) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _paperToaster.default;
    }
  });
});
define('pathway-viz-frontend/services/resize', ['exports', 'ember-resize/services/resize'], function (exports, _resize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _resize.default;
    }
  });
});
define('pathway-viz-frontend/services/sniffer', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /* globals FastBoot */
  var isString = function isString(value) {
    return typeof value === 'string';
  };

  var lowercase = function lowercase(string) {
    return isString(string) ? string.toLowerCase() : string;
  };

  var toInt = function toInt(str) {
    return parseInt(str, 10);
  };

  exports.default = Ember.Service.extend({
    vendorPrefix: '',
    transitions: false,
    animations: false,
    _document: null,
    _window: null,

    android: Ember.computed('', function () {
      return toInt((/android (\d+)/.exec(lowercase((this.get('_window').navigator || {}).userAgent)) || [])[1]);
    }),

    init: function init() {
      this._super.apply(this, arguments);
      if (typeof FastBoot !== 'undefined') {
        return;
      }

      var _document = document;
      var _window = window;

      this.setProperties({
        _document: _document,
        _window: _window
      });

      var bodyStyle = _document.body && _document.body.style;
      var vendorPrefix = void 0,
          match = void 0;
      var vendorRegex = /^(Moz|webkit|ms)(?=[A-Z])/;

      var transitions = false;
      var animations = false;

      if (bodyStyle) {
        for (var prop in bodyStyle) {
          match = vendorRegex.exec(prop);
          if (match) {
            vendorPrefix = match[0];
            vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
            break;
          }
        }

        if (!vendorPrefix) {
          vendorPrefix = 'WebkitOpacity' in bodyStyle && 'webkit';
        }

        transitions = !!('transition' in bodyStyle || vendorPrefix + 'Transition' in bodyStyle);
        animations = !!('animation' in bodyStyle || vendorPrefix + 'Animation' in bodyStyle);

        if (this.get('android') && (!transitions || !animations)) {
          transitions = isString(bodyStyle.webkitTransition);
          animations = isString(bodyStyle.webkitAnimation);
        }
      }

      this.set('transitions', transitions);
      this.set('animations', animations);

      this.set('vendorPrefix', vendorPrefix);
    }
  });
});
define('pathway-viz-frontend/services/text-measurer', ['exports', 'ember-text-measurer/services/text-measurer'], function (exports, _textMeasurer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _textMeasurer.default;
    }
  });
});
define("pathway-viz-frontend/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "GDqQeuCc", "block": "{\"symbols\":[\"dynamicbutton\",\"menu\",\"content\",\"item\"],\"statements\":[[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n\"],[4,\"paper-toolbar\",null,null,{\"statements\":[[4,\"paper-toolbar-tools\",null,null,{\"statements\":[[4,\"paper-menu\",null,null,{\"statements\":[[4,\"component\",[[19,2,[\"trigger\"]]],null,{\"statements\":[[4,\"paper-button\",null,[[\"iconButton\"],[true]],{\"statements\":[[0,\"            \"],[1,[25,\"paper-icon\",[\"menu\"],null],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"component\",[[19,2,[\"content\"]]],[[\"width\",\"class\"],[4,\"main-app-menu\"]],{\"statements\":[[4,\"component\",[[19,3,[\"menu-item\"]]],[[\"onClick\"],[\"openDialog\"]],{\"statements\":[[0,\"            \"],[1,[25,\"paper-icon\",[\"help\"],null],false],[0,\"\\n            \"],[6,\"span\"],[7],[0,\"Instructions for using this app\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},null],[4,\"each\",[[20,[\"menuitems\"]]],null,{\"statements\":[[4,\"component\",[[19,3,[\"menu-item\"]]],[[\"onClick\"],[[25,\"action\",[[19,0,[]],\"externalLink\",[19,4,[]]],null]]],{\"statements\":[[0,\"              \"],[1,[25,\"paper-icon\",[[19,4,[\"icon\"]]],null],false],[0,\"\\n                \"],[6,\"span\"],[7],[1,[19,4,[\"title\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[4]},null]],\"parameters\":[3]},null]],\"parameters\":[2]},null],[0,\"      \"],[6,\"h2\"],[7],[0,\"\\n        \"],[4,\"link-to\",[\"index\"],null,{\"statements\":[[0,\"FunSet Enrichment Visualization\"]],\"parameters\":[]},null],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"span\"],[9,\"class\",\"flex\"],[7],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"navigation\",\"dynamicbuttons\"]]],null,{\"statements\":[[0,\"        \"],[1,[25,\"component\",[[19,1,[]]],null],false],[0,\"\\n\"]],\"parameters\":[1]},null]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"if\",[[20,[\"showDialog\"]]],null,{\"statements\":[[4,\"paper-dialog\",null,[[\"class\",\"onClose\",\"origin\",\"clickOutsideToClose\"],[\"flex-77\",[25,\"action\",[[19,0,[]],\"closeDialog\",\"cancel\"],null],[20,[\"dialogOrigin\"]],true]],{\"statements\":[[4,\"paper-toolbar\",null,null,{\"statements\":[[4,\"paper-toolbar-tools\",null,null,{\"statements\":[[0,\"          \"],[6,\"h2\"],[7],[0,\"Instructions for use (help menu)\"],[8],[0,\"\\n          \"],[6,\"span\"],[9,\"class\",\"flex\"],[7],[8],[0,\"\\n          \"],[4,\"paper-button\",null,[[\"iconButton\",\"onClick\"],[true,[25,\"action\",[[19,0,[]],\"closeDialog\",\"cancel\"],null]]],{\"statements\":[[1,[25,\"paper-icon\",null,[[\"icon\"],[\"close\"]]],false]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"paper-dialog-content\",null,null,{\"statements\":[[0,\"        \"],[1,[18,\"usage-instructions\"],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"  \"],[1,[18,\"paper-toaster\"],false],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"layout-row flex\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"flex\"],[7],[1,[18,\"outlet\"],false],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"footer layout-row layout-align-space-between-end\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"left-footer\"],[7],[0,\"\\n      \"],[6,\"p\"],[9,\"class\",\"credit\"],[7],[0,\"\\n        © 2017 \"],[6,\"a\"],[9,\"href\",\"http://faculty.ist.unomaha.edu/mhale/\"],[9,\"target\",\"_blank\"],[9,\"style\",\"color: inherit;\"],[7],[0,\" Matthew L. Hale\"],[8],[0,\", \"],[6,\"a\"],[9,\"href\",\"http://faculty.ist.unomaha.edu/dghersi/\"],[9,\"target\",\"_blank\"],[9,\"style\",\"color: inherit;\"],[7],[0,\"Dario Ghersi\"],[8],[0,\", & Ishwor Thapa\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"center-footer\"],[7],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"right-footer\"],[7],[0,\"\\n      \"],[6,\"iframe\"],[9,\"src\",\"https://ghbtns.com/github-btn.html?user=mlhale&repo=funset-enrichment-visualization&type=star&count=true&size=large\"],[9,\"frameborder\",\"0\"],[9,\"scrolling\",\"0\"],[9,\"width\",\"115px\"],[9,\"height\",\"30px\"],[7],[8],[0,\"\\n      \"],[6,\"a\"],[9,\"href\",\"https://twitter.com/mlhale_?ref_src=twsrc%5Etfw\"],[9,\"class\",\"twitter-follow-button\"],[9,\"data-size\",\"large\"],[9,\"data-show-screen-name\",\"false\"],[9,\"data-show-count\",\"false\"],[7],[0,\"Follow @mlhale_\"],[8],[6,\"script\"],[9,\"async\",\"\"],[9,\"src\",\"https://platform.twitter.com/widgets.js\"],[9,\"charset\",\"utf-8\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "pathway-viz-frontend/templates/application.hbs" } });
});
define("pathway-viz-frontend/templates/components/cluster-download", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "faRk+idJ", "block": "{\"symbols\":[],\"statements\":[[4,\"paper-button\",null,[[\"onClick\"],[[25,\"action\",[[19,0,[]],\"downloadCluster\"],null]]],{\"statements\":[[0,\"  \"],[1,[25,\"paper-icon\",[\"file_download\"],null],false],[0,\" JSON\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "pathway-viz-frontend/templates/components/cluster-download.hbs" } });
});
define("pathway-viz-frontend/templates/components/download-options", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "IM1QE9+N", "block": "{\"symbols\":[],\"statements\":[[4,\"paper-button\",null,[[\"raised\",\"onClick\"],[true,[25,\"action\",[[19,0,[]],\"downloadSvg\"],null]]],{\"statements\":[[0,\"  \"],[1,[25,\"paper-icon\",[\"file_download\"],null],false],[0,\" SVG\\n\"]],\"parameters\":[]},null],[4,\"paper-button\",null,[[\"raised\",\"onClick\"],[true,[25,\"action\",[[19,0,[]],\"downloadJSON\"],null]]],{\"statements\":[[0,\"  \"],[1,[25,\"paper-icon\",[\"file_download\"],null],false],[0,\" JSON\\n\"]],\"parameters\":[]},null],[4,\"paper-button\",null,[[\"raised\",\"onClick\"],[true,[25,\"action\",[[19,0,[]],\"downloadCSV\"],null]]],{\"statements\":[[0,\"  \"],[1,[25,\"paper-icon\",[\"file_download\"],null],false],[0,\" CSV\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "pathway-viz-frontend/templates/components/download-options.hbs" } });
});
define("pathway-viz-frontend/templates/components/scroll-to", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "l+MNUztG", "block": "{\"symbols\":[\"&default\"],\"statements\":[[4,\"unless\",[[22,1]],null,{\"statements\":[[0,\"  \"],[1,[18,\"label\"],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"  \"],[11,1],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "pathway-viz-frontend/templates/components/scroll-to.hbs" } });
});
define("pathway-viz-frontend/templates/components/select-list", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "AXumwpfR", "block": "{\"symbols\":[\"item\"],\"statements\":[[4,\"if\",[[20,[\"prompt\"]]],null,{\"statements\":[[0,\"  \"],[6,\"option\"],[9,\"value\",\"\"],[9,\"disabled\",\"\"],[10,\"selected\",[25,\"is-not\",[[20,[\"selection\"]]],null],null],[7],[0,\"\\n    \"],[1,[18,\"prompt\"],false],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"each\",[[20,[\"content\"]]],[[\"key\"],[\"@identity\"]],{\"statements\":[[0,\"  \"],[6,\"option\"],[10,\"value\",[26,[[25,\"read-path\",[[19,1,[]],[20,[\"optionValuePath\"]]],null]]]],[10,\"selected\",[25,\"is-equal-by-path\",[[19,1,[]],[20,[\"value\"]],[20,[\"optionValuePath\"]]],null],null],[7],[0,\"\\n    \"],[1,[25,\"read-path\",[[19,1,[]],[20,[\"optionLabelPath\"]]],null],false],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "pathway-viz-frontend/templates/components/select-list.hbs" } });
});
define("pathway-viz-frontend/templates/components/term-ontology", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "/FrZW+xB", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "pathway-viz-frontend/templates/components/term-ontology.hbs" } });
});
define("pathway-viz-frontend/templates/components/usage-instructions", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "GiSs6w8E", "block": "{\"symbols\":[],\"statements\":[[6,\"h3\"],[7],[0,\" 1. PURPOSE:\"],[8],[0,\"\\n\\n\"],[6,\"p\"],[7],[0,\" The FunSet webserver performs Gene Ontology (GO) enrichment analysis, identifying GO terms that are statistically overrepresented in a target set\\nwith respect to a background set. The enriched terms are displayed in a 2D plot that captures the semantic\\nsimilarity between terms, with the option to cluster the terms and identify a representative term for each cluster.\\nFunSet can be used interactively or programmatically, and allows users to download the enrichment results both in tabular form and in graphical form as SVG files or in data format as JSON. \"],[8],[0,\"\\n\\n\"],[6,\"h3\"],[7],[0,\"2. INTERACTIVE USE:\"],[8],[0,\"\\n\\n\"],[6,\"h4\"],[7],[0,\"2a. Input:\"],[8],[0,\"\\n\\nFunSet has a few required and optional parameters:\\n\"],[6,\"ul\"],[7],[0,\"\\n  \"],[6,\"li\"],[7],[0,\" Organism a choice, one of: 'Homo sapiens (human)', 'Gallus gallus (chicken)', 'Canis familiaris (dog)', 'Mus musculus (mouse)', 'Rattus norvegicus (rat)', 'Caenohabditis elegans (nematode)', 'Arabidopsis thaliana (thale cress)', 'Drosophila melanogaster (fruit fly)', 'Saccharomyces cerevisiae (budding yeast)', and 'Danio rerio (zebrafish)'. (Required) \"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"A set of target genes. This may be added a comma separated list or uploaded as a file. (Required)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"A set of background genes, uploaded as a file. (Optional) If no background set is provided, FunSet will use the whole set of annotated genes for the chosen organism. Both target and background set should be submitted either as a comma-separated list in the text boxes, or as a text file (one gene per line). The accepted format is HGNC symbol. \"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"A False Discovery Rate threshold. (Optional). By default, FunSet sets the FDR\\n  threshold to 0.05.\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"h4\"],[7],[0,\"2b. Output:\"],[8],[0,\"\\n\\n\"],[6,\"p\"],[7],[0,\"The server performs the hypergeometric test to identify statistically enriched terms that pass the chosen FDR threshold. If the result set is not empty, FunSet displays the enriched terms as colored circles in 2D space, with a size that is proportional to the enrichment factor. The enrichment factor is calculated as the ratio between the observed number of genes annotated with a given term and the expected number of genes annotated with that term, assuming a uniform probability of annotation.\\n\\nThe enriched terms are laid out in a 2D space according to their semantic similarity, with semantically related terms in close proximity to each other. This is accomplished by computing the semantic similarity between pairs of terms using the Lin index, and embedding the terms in 2D with Multidimensional Scaling (MDS).\\n\\nOnce the results are loaded, users have the option to cluster terms using spectral clustering, and selecting the desidered number of clusters. The terms are colored by clusters, and labels for the representative terms (the cluster medoids) are displayed in the 2D plot.\\n\\nThe plots can be downloaded as SVG files, and the enriched terms and the corresponding genes can be downloaded in tabular form.\\n\"],[8],[0,\"\\n\\n\"],[6,\"h4\"],[7],[0,\" 2c. API-level Access\"],[8],[0,\"\\n\"],[6,\"p\"],[7],[0,\"The FunSet server is, at its core, a RESTful web service API. It allows users to not only interact with the data using the visualization interface discussed in 2b, but it also provides the raw enrichment and clustering data as JSON. The API is designed to the \"],[6,\"a\"],[9,\"href\",\"http://jsonapi.org/\"],[9,\"target\",\"_blank\"],[7],[0,\"http://jsonapi.org/\"],[8],[0,\" standard to facilitate ease of interaction.\"],[8],[0,\"\\n\\n\"],[6,\"h5\"],[7],[0,\"API endpoints\"],[8],[0,\"\\n\"],[6,\"p\"],[7],[0,\"The API is organized around a set of endpoints that can be invoked programmatically using a REST client, such as \"],[6,\"a\"],[9,\"href\",\"http://getpostman.com\"],[7],[0,\"POSTMAN\"],[8],[0,\", or using any http command line tool, such as \"],[6,\"a\"],[9,\"href\",\"https://curl.haxx.se/\"],[7],[0,\"CURL\"],[8],[0,\".\\n\\nThe endpoints it provides are documented below. All are accessible without login.\\n\"],[8],[0,\"\\n\"],[6,\"ul\"],[7],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"\\n    \"],[6,\"strong\"],[7],[0,\"GET \"],[6,\"em\"],[7],[0,\"/runs/<primary key>\"],[8],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\" Returns the data from a previous run.\"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"\\n    \"],[6,\"p\"],[7],[6,\"strong\"],[7],[0,\"POST \"],[6,\"em\"],[7],[0,\"/runs/invoke\"],[8],[0,\" \"],[8],[0,\"\\n      Required POST Parameters (must be in submitted using \"],[6,\"strong\"],[7],[0,\"application/x-www-form-urlencoded\"],[8],[0,\" encoding)\\n      genes=<comma-seperated-list-of-target-genes>\\n      background=<comma-seperated-list-of-background-genes>\\n      p-value=<false detection rate [0-1]>\\n      clusters=<desired number of clusters>\\n      organism=<3-letter organism code ['hsa','gga','bta','cfa','mmu','rno','cel','ath','dme','sce','eco',or 'dre']>\\n    \"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"This will run the enrichment analysis algorithms and return JSONAPI compatible JSON data that lists all of the enriched terms. To retrieve the data for each of the terms, you must request each enriched term as given below. \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"\\n    \"],[6,\"strong\"],[7],[0,\"GET \"],[6,\"em\"],[7],[0,\"/runs/<primary key>/recluster?clusters=<desired number of clusters>\"],[8],[0,\" \"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Returns the same data as /runs/invoke, but only re-runs the clustering algorithm for an existing run.\"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"\\n    \"],[6,\"strong\"],[7],[0,\"GET \"],[6,\"em\"],[7],[0,\"/enrichments/<enrichment primary key>?include=term,term.parents,genes\"],[8],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\" Returns the enrichment term data and all submodels\"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"\\n    \"],[6,\"strong\"],[7],[0,\"GET \"],[6,\"em\"],[7],[0,\"/terms/<term primary key>\"],[8],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\" Returns the GO term data for the term matching the primary key\"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"\\n    \"],[6,\"strong\"],[7],[0,\"GET \"],[6,\"em\"],[7],[0,\"/genes/<gene primary key>\"],[8],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\" Returns the gene name for the gene matching the primary key\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"h5\"],[7],[0,\" API Data Schema\"],[8],[0,\"\\n\"],[6,\"strong\"],[7],[0,\"Gene\"],[8],[0,\"\\n\"],[6,\"ul\"],[7],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"id (int)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"name (string)\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"strong\"],[7],[0,\"Term\"],[8],[0,\"\\n\"],[6,\"ul\"],[7],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"id (int)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"name (string)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"termid (string, official GO id)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"namespace (string)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"description (string)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"synonym (string)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"parents (many-to-many)\"],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\"],[6,\"strong\"],[7],[0,\"Run\"],[8],[0,\"\\n\"],[6,\"ul\"],[7],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"id (int)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"created (date)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"ip (string, requestor's IP)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"enrichements (one-to-many)\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"strong\"],[7],[0,\"Enrichment\"],[8],[0,\"\\n\"],[6,\"ul\"],[7],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"id (int)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"term (ForeignKey to associated GO Term)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"pvalue (float - detection rate in sample)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"level (float - enrichment level in sample)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"semanticdissimilarityx (float - x position of term in graph scaled to [0-1])\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"semanticdissimilarityy (float - y position of term in graph scaled to [0-1])\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"cluster (int - the cluster to which the enriched term is assigned)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"medoid (boolean - true if this term is the metoid of its cluster)\"],[8],[0,\"\\n  \"],[6,\"li\"],[7],[0,\"genes (one-to-many - all genes enriched in the sample)\"],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\\n\"],[6,\"h4\"],[7],[0,\"3. CREDITS:\"],[8],[0,\"\\n\\n\"],[6,\"p\"],[7],[0,\"Matt Hale, Ishwor Thapa, and Dario Ghersi.\"],[6,\"br\"],[7],[8],[0,\"\\nSchool of Interdisciplinary Informatics, University of Nebraska at Omaha, USA.\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "pathway-viz-frontend/templates/components/usage-instructions.hbs" } });
});
define("pathway-viz-frontend/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "BMaMzKye", "block": "{\"symbols\":[\"card\",\"title\",\"text\",\"form\",\"card\",\"namespace\",\"organism\",\"ontology\",\"title\",\"text\"],\"statements\":[[6,\"div\"],[9,\"class\",\"layout-row landing-page-container\"],[7],[0,\"\\n\"],[4,\"paper-form\",null,[[\"class\",\"onSubmit\"],[\"layout-column flex\",[25,\"action\",[[19,0,[]],\"geneformSubmit\"],null]]],{\"statements\":[[4,\"paper-card\",null,[[\"class\"],[\"landing-page-card\"]],{\"statements\":[[4,\"component\",[[19,5,[\"title\"]]],null,{\"statements\":[[4,\"component\",[[19,9,[\"text\"]]],null,{\"statements\":[[0,\"          \"],[4,\"component\",[[19,10,[\"headline\"]]],null,{\"statements\":[[0,\"FunSet Enrichment Visualization Parameters\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[10]},null]],\"parameters\":[9]},null],[4,\"component\",[[19,5,[\"content\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"layout-row\"],[7],[0,\"\\n          \"],[4,\"paper-button\",null,[[\"raised\",\"warn\",\"class\",\"onClick\"],[true,true,\"flex-100\",[25,\"action\",[[19,0,[]],\"populateExample\"],null]]],{\"statements\":[[0,\"New to FunSet? Click here to prepopulate the fields with our example data. \"],[1,[25,\"paper-icon\",[\"arrow_forward\"],null],false]],\"parameters\":[]},null],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"layout-row\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"layout-column flex\"],[7],[0,\"\\n            \"],[1,[25,\"paper-input\",null,[[\"textarea\",\"passThru\",\"block\",\"label\",\"value\",\"required\",\"onChange\",\"customValidations\"],[true,[25,\"hash\",null,[[\"rows\",\"maxRows\"],[5,15]]],true,\"Genes\",[20,[\"genelist\"]],true,[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"genelist\"]]],null]],null],[20,[\"genelistValidation\"]]]]],false],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[1,[25,\"frost-file-picker\",null,[[\"accept\",\"placeholderText\",\"onChange\"],[\".txt,.text\",\"(optional) select genes from file (one gene per line .txt)\",[25,\"action\",[[19,0,[]],\"inputgenesFileChanged\"],null]]]],false],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"layout layout-align-center-center\"],[7],[0,\"\\n\"],[4,\"paper-select\",null,[[\"class\",\"label\",\"options\",\"selected\",\"onChange\"],[\"flex\",\"Ontology Version\",[20,[\"model\"]],[20,[\"ontologyselected\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"ontologyselected\"]]],null]],null]]],{\"statements\":[[0,\"            \"],[1,[19,8,[\"description\"]],false],[0,\"\\n\"]],\"parameters\":[8]},null],[0,\"        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"layout layout-align-center-center\"],[7],[0,\"\\n\"],[4,\"paper-select\",null,[[\"class\",\"label\",\"options\",\"selected\",\"onChange\"],[\"flex\",\"Organism\",[20,[\"organismoptions\"]],[20,[\"organismselected\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"organismselected\"]]],null]],null]]],{\"statements\":[[0,\"            \"],[1,[19,7,[\"name\"]],false],[0,\"\\n\"]],\"parameters\":[7]},null],[0,\"        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"layout layout-align-center-center\"],[7],[0,\"\\n\"],[4,\"paper-select\",null,[[\"class\",\"label\",\"options\",\"selected\",\"onChange\"],[\"flex\",\"Namespace\",[20,[\"namespaceOptions\"]],[20,[\"namespaceselected\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"namespaceselected\"]]],null]],null]]],{\"statements\":[[0,\"            \"],[1,[19,6,[\"name\"]],false],[0,\"\\n\"]],\"parameters\":[6]},null],[0,\"        \"],[8],[0,\"\\n        \"],[1,[25,\"frost-file-picker\",null,[[\"accept\",\"placeholderText\",\"onChange\"],[\".txt,.text\",\"(optional) Add background genes - (one gene per line .txt)\",[25,\"action\",[[19,0,[]],\"backgroundFileChanged\"],null]]]],false],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"layout layout-align-center-center slider-container\"],[7],[0,\"\\n          \"],[6,\"span\"],[9,\"style\",\"margin-right: 16px; margin-left: 5px;\"],[7],[0,\"p-value threshold\"],[8],[0,\"\\n          \"],[1,[25,\"paper-slider\",null,[[\"class\",\"min\",\"max\",\"discrete\",\"steps\",\"value\",\"onChange\"],[\"flex\",0,100,true,2,[20,[\"pvalueslider\"]],[25,\"action\",[[19,0,[]],\"updatePValueSlider\"],null]]]],false],[0,\"\\n          \"],[1,[25,\"paper-input\",null,[[\"value\",\"onChange\"],[[20,[\"pvaluethreshold\"]],[25,\"action\",[[19,0,[]],\"updatePValue\"],null]]]],false],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"layout-row\"],[7],[0,\"\\n          \"],[4,\"component\",[[19,4,[\"submit-button\"]]],[[\"raised\",\"primary\",\"disabled\"],[true,true,[19,4,[\"isInvalid\"]]]],{\"statements\":[[0,\"Submit\"]],\"parameters\":[]},null],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[5]},null]],\"parameters\":[4]},null],[0,\"  \"],[6,\"div\"],[9,\"class\",\"layout-column layout-align-start-center flex-30\"],[7],[0,\"\\n\"],[4,\"paper-card\",null,[[\"class\"],[\"landing-page-card\"]],{\"statements\":[[4,\"component\",[[19,1,[\"title\"]]],null,{\"statements\":[[4,\"component\",[[19,2,[\"text\"]]],null,{\"statements\":[[0,\"          \"],[4,\"component\",[[19,3,[\"headline\"]]],null,{\"statements\":[[0,\"Welcome to the FunSet Enrichment Visualization App\"]],\"parameters\":[]},null],[0,\"\\n          \"],[4,\"component\",[[19,3,[\"subhead\"]]],null,{\"statements\":[[0,\"By Matt Hale, Dario Ghersi, and Ishwor Thapa\"]],\"parameters\":[]},null],[0,\"\\n          \"],[6,\"br\"],[7],[8],[0,\"\\n          The FunSet webserver performs Gene Ontology (GO) enrichment analysis, identifying GO terms that are statistically overrepresented in a target set with respect to a background set. The enriched terms are displayed in a 2D plot that captures the semantic similarity between terms, with the option to cluster the terms and identify a representative term for each cluster. FunSet can be used interactively or programmatically, and allows users to download the enrichment results both in tabular form and in graphical form as SVG files or in data format as JSON or csv.\\n\"]],\"parameters\":[3]},null],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"\\n\\n\"]],\"parameters\":[1]},null],[0,\"  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "pathway-viz-frontend/templates/index.hbs" } });
});
define("pathway-viz-frontend/templates/visualization", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "mn2/92Ff", "block": "{\"symbols\":[\"cluster\",\"index\",\"panel\",\"expanded\",\"genepanel\",\"genesexpanded\",\"gene\",\"controls\",\"termpanel\",\"termsexpanded\",\"node\",\"gene\",\"controls\",\"controls\",\"card\"],\"statements\":[[2,\"\\n@Author: Matthew Hale <mlhale>\\n@Date:   2018-02-14T18:06:24-06:00\\n@Email:  mlhale@unomaha.edu\\n@Filename: visualization.hbs\\n@Last modified by:   mlhale\\n@Last modified time: 2018-02-15T15:34:29-06:00\\n@License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.\\n@Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa\\n\"],[0,\"\\n\\n\\n\\n\"],[6,\"div\"],[9,\"class\",\"layout-row layout-sm-column\"],[7],[0,\"\\n\"],[4,\"paper-card\",null,[[\"class\"],[\"flex term-ontology-card\"]],{\"statements\":[[4,\"component\",[[19,15,[\"content\"]]],[[\"class\"],[\"layout-row layout-align-space-between flex-100 term-ontology-graph-container\"]],{\"statements\":[[4,\"unless\",[[25,\"eq\",[[20,[\"percenttermsloaded\"]],100],null]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"layout-row flex layout-align-center-center\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[25,\"gte\",[[20,[\"percenttermsloaded\"]],2],null]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"loading-text\"],[7],[0,\"Loading terms...\"],[8],[0,\"\\n            \"],[1,[25,\"paper-progress-circular\",null,[[\"warn\",\"value\",\"diameter\"],[true,[20,[\"percenttermsloaded\"]],180]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"route\",\"error\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"loading-text\"],[7],[0,\"\\n              \"],[1,[20,[\"route\",\"error\"]],false],[0,\"\\n              \"],[4,\"link-to\",[\"index\"],null,{\"statements\":[[0,\"Return home to try other parameters.\"]],\"parameters\":[]},null],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"loading-text\"],[7],[0,\"Calculating Enrichments and Clustering (this may take a few minutes) ...\"],[8],[0,\"\\n            \"],[1,[25,\"paper-progress-circular\",null,[[\"warn\",\"diameter\"],[true,180]]],false],[0,\"\\n          \"]],\"parameters\":[]}]],\"parameters\":[]}],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"        \"],[1,[25,\"term-ontology\",null,[[\"nodes\",\"links\",\"parentNodes\",\"showTermLabels\",\"linkForcesOn\",\"renderEventQueue\",\"expandedclusterpanels\"],[[20,[\"model\"]],[20,[\"links\"]],[20,[\"parentNodes\"]],[20,[\"showTermLabels\"]],[20,[\"linkForcesOn\"]],[20,[\"renderEventQueue\"]],[20,[\"expandedclusterpanels\"]]]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"clustersloading\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"reclustering-text layout-row layout-align-center-center\"],[7],[0,\"\\n\\n            \"],[6,\"div\"],[9,\"class\",\"loading-text\"],[7],[0,\"Re-clustering ...\"],[8],[0,\"\\n            \"],[1,[25,\"paper-progress-circular\",null,[[\"warn\",\"diameter\"],[true,180]]],false],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}]],\"parameters\":[]},null]],\"parameters\":[15]},null],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"layout-column flex-gt-sm-50 flex-gt-md-40 flex-gt-lg-30 termlist\"],[7],[0,\"\\n\"],[4,\"paper-card\",null,null,{\"statements\":[[4,\"paper-toolbar\",null,[[\"accent\"],[true]],{\"statements\":[[4,\"paper-toolbar-tools\",null,null,{\"statements\":[[0,\"          \"],[6,\"h5\"],[7],[0,\"\\n            Exploring \"],[1,[20,[\"route\",\"termstoload\"]],false],[0,\" terms in \"],[1,[20,[\"sortedNodeClusters\",\"length\"]],false],[0,\" Clusters \"],[6,\"br\"],[7],[8],[0,\"\\n            Total Terms in Ontology: \"],[1,[20,[\"route\",\"termcount\"]],false],[0,\" \"],[6,\"br\"],[7],[8],[0,\"\\n            Run created: \"],[1,[20,[\"route\",\"run\",\"created\"]],false],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"paper-list\",null,[[\"class\"],[\"paperlist\"]],{\"statements\":[[0,\"        \"],[4,\"paper-subheader\",null,null,{\"statements\":[[0,\"Graph options\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[25,\"eq\",[[20,[\"percenttermsloaded\"]],100],null]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"layout graph-options-slider\"],[7],[0,\"\\n\"],[4,\"paper-button\",null,[[\"class\",\"raised\",\"warn\",\"onClick\"],[\"reset-graph-button\",true,true,[25,\"action\",[[19,0,[]],\"resetGraph\"],null]]],{\"statements\":[[0,\"                \"],[6,\"p\"],[7],[0,\"Reset graph to its starting configuration.\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"          \"],[6,\"div\"],[9,\"class\",\"layout layout-align-center-center slider-container graph-options-slider\"],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"style\",\"margin-right: 16px;\"],[7],[0,\"Number of Clusters\"],[8],[0,\"\\n            \"],[1,[25,\"paper-slider\",null,[[\"class\",\"discrete\",\"step\",\"active\",\"min\",\"max\",\"value\",\"onChange\"],[\"flex\",true,1,[20,[\"clusterslideractive\"]],1,[20,[\"route\",\"termstoload\"]],[20,[\"route\",\"clusters\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"route\",\"clusters\"]]],null]],null]]]],false],[0,\"\\n            \"],[1,[25,\"paper-input\",null,[[\"value\",\"class\",\"focused\",\"onChange\"],[[20,[\"route\",\"clusters\"]],\"flex-10 cluster-input-field\",[20,[\"clustersfieldactive\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"route\",\"clusters\"]]],null]],null]]]],false],[0,\"\\n            \"],[4,\"paper-button\",null,[[\"raised\",\"warn\",\"class\",\"onClick\"],[true,true,\"cluster-update-button\",[25,\"action\",[[19,0,[]],\"updateClusters\"],null]]],{\"statements\":[[0,\"Update Clusters\"]],\"parameters\":[]},null],[0,\"\\n          \"],[8],[0,\"\\n\"],[4,\"paper-item\",null,null,{\"statements\":[[0,\"          \"],[6,\"p\"],[7],[0,\"Show Term Labels?\"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"md-secondary-container\"],[7],[0,\"\\n            \"],[1,[25,\"component\",[[19,14,[\"checkbox\"]]],[[\"value\",\"secondary\",\"onChange\"],[[20,[\"showTermLabels\"]],true,[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"showTermLabels\"]]],null]],null]]]],false],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[14]},null],[0,\"        \"],[2,\" {{#paper-item as |controls|}}\\n          <p>Apply forces on links?</p>\\n          <div class=\\\"md-secondary-container\\\">\\n            {{controls.checkbox\\n              value=linkForce\\n              secondary=true\\n              onChange=(action (mut linkForce))}}\\n          </div>\\n        {{/paper-item}} \"],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"      \"],[1,[18,\"paper-divider\"],false],[0,\"\\n\"],[4,\"if\",[[25,\"eq\",[[20,[\"percenttermsloaded\"]],100],null]],null,{\"statements\":[[4,\"paper-list\",null,[[\"class\"],[\"scrollabletermlist\"]],{\"statements\":[[4,\"paper-subheader\",null,null,{\"statements\":[[4,\"paper-checkbox\",null,[[\"value\",\"class\",\"onChange\"],[[20,[\"allclustersselected\"]],\"flex\",[25,\"action\",[[19,0,[]],\"toggleAllClustersSelected\"],null]]],{\"statements\":[[0,\"             Show All (\"],[1,[20,[\"sortedNodeClusters\",\"length\"]],false],[0,\") Clusters\\n\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"each\",[[20,[\"sortedNodeClusters\"]]],null,{\"statements\":[[4,\"paper-expansion-panel\",null,[[\"expanded\"],[[25,\"get\",[[25,\"get\",[[20,[\"expandedclusterpanels\",\"content\"]],[25,\"concat\",[[19,2,[]],\"\"],null]],null],\"expanded\"],null]]],{\"statements\":[[4,\"component\",[[19,3,[\"collapsed\"]]],null,{\"statements\":[[4,\"paper-checkbox\",null,[[\"value\",\"onChange\"],[[19,1,[\"selected\"]],[25,\"action\",[[19,0,[]],\"toggleSelectedCluster\",[19,1,[]]],null]]],{\"statements\":[],\"parameters\":[]},null],[0,\"                  \"],[6,\"div\"],[9,\"class\",\"md-panel-title\"],[7],[0,\"Cluster #\"],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                  \"],[6,\"div\"],[9,\"class\",\"md-panel-summary\"],[7],[1,[19,1,[\"nodes\",\"length\"]],false],[0,\" Terms / \"],[1,[19,1,[\"genes\",\"length\"]],false],[0,\" Genes\"],[8],[0,\"\\n                  \"],[1,[25,\"paper-icon\",[\"keyboard_arrow_down\"],null],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"component\",[[19,3,[\"expanded\"]]],null,{\"statements\":[[4,\"component\",[[19,4,[\"header\"]]],null,{\"statements\":[[4,\"paper-checkbox\",null,[[\"value\",\"onChange\"],[[19,1,[\"selected\"]],[25,\"action\",[[19,0,[]],\"toggleSelectedCluster\",[19,1,[]]],null]]],{\"statements\":[],\"parameters\":[]},null],[0,\"                    \"],[6,\"div\"],[9,\"class\",\"md-panel-title\"],[7],[0,\"Cluster #\"],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"md-panel-summary\"],[7],[1,[19,1,[\"nodes\",\"length\"]],false],[0,\" Terms / \"],[1,[19,1,[\"genes\",\"length\"]],false],[0,\" Genes\"],[8],[0,\"\\n                    \"],[1,[25,\"cluster-download\",null,[[\"cluster\"],[[19,1,[]]]]],false],[0,\"\\n                    \"],[1,[25,\"paper-icon\",[\"keyboard_arrow_up\"],null],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"component\",[[19,4,[\"content\"]]],null,{\"statements\":[[0,\"\\n                    \"],[2,\" term sub Panel \"],[0,\"\\n\"],[4,\"paper-expansion-panel\",null,[[\"expanded\"],[[25,\"get\",[[25,\"get\",[[20,[\"expandedclusterpanels\",\"content\"]],[25,\"concat\",[[19,2,[]],\"\"],null]],null],\"termsexpanded\"],null]]],{\"statements\":[[4,\"component\",[[19,9,[\"collapsed\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"md-panel-summary\"],[7],[0,\" Terms \"],[8],[0,\"\\n                        \"],[1,[25,\"paper-icon\",[\"keyboard_arrow_down\"],null],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,9,[\"expanded\"]]],null,{\"statements\":[[4,\"component\",[[19,10,[\"header\"]]],null,{\"statements\":[[0,\"                          \"],[6,\"div\"],[9,\"class\",\"md-panel-summary\"],[7],[0,\" Terms \"],[8],[0,\"\\n                          \"],[1,[25,\"paper-icon\",[\"keyboard_arrow_down\"],null],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,10,[\"content\"]]],[[\"class\"],[[25,\"concat\",[\"cluster-\",[19,2,[]]],null]]],{\"statements\":[[4,\"each\",[[19,1,[\"nodes\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"h3\"],[10,\"class\",[26,[\"cluster-menu-offset-text-header term-\",[19,11,[\"term\",\"id\"]]]]],[7],[6,\"strong\"],[7],[4,\"if\",[[19,11,[\"enrichment\",\"medoid\"]]],null,{\"statements\":[[0,\"(centroid) \"]],\"parameters\":[]},null],[6,\"a\"],[10,\"id\",[19,11,[\"term\",\"id\"]],null],[9,\"class\",\"cluster-menu-link-text\"],[10,\"href\",[26,[\"http://amigo.geneontology.org/amigo/term/\",[19,11,[\"term\",\"termid\"]]]]],[9,\"target\",\"_blank\"],[7],[1,[19,11,[\"term\",\"termid\"]],false],[8],[0,\"  [ES=\"],[1,[25,\"round\",[[19,11,[\"enrichment\",\"level\"]]],[[\"decimals\"],[3]]],false],[0,\", FDR=\"],[1,[25,\"exponential-form\",[[19,11,[\"enrichment\",\"pvalue\"]]],null],false],[0,\"]\"],[8],[8],[0,\"\\n\"],[4,\"paper-item\",null,[[\"class\",\"onClick\"],[\"md-3-line cluster-menu-term-item\",[25,\"action\",[[19,0,[]],\"toggleSelectedTerm\",[19,11,[]]],null]]],{\"statements\":[[4,\"if\",[[19,11,[\"enrichment\",\"selected\"]]],null,{\"statements\":[[0,\"                                \"],[1,[25,\"paper-icon\",[\"visibility_off\"],[[\"class\"],[[25,\"concat\",[\"md-avatar-icon\",[25,\"if\",[[19,11,[\"enrichment\",\"selected\"]],\" term-selected\"],null]],null]]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                                \"],[1,[25,\"paper-icon\",[\"visibility\"],[[\"class\"],[[25,\"concat\",[\"md-avatar-icon\",[25,\"if\",[[19,11,[\"enrichment\",\"selected\"]],\" term-selected\"],null]],null]]]],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                              \"],[6,\"div\"],[9,\"class\",\"md-list-item-text\"],[7],[0,\"\\n                                \"],[6,\"h4\"],[7],[0,\"\\n                                  \"],[6,\"strong\"],[7],[1,[19,11,[\"term\",\"name\"]],false],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"p\"],[7],[0,\"\\n                                  \"],[1,[19,11,[\"term\",\"description\"]],false],[0,\" \\n                                \"],[8],[0,\"\\n                              \"],[8],[0,\"\\n\"]],\"parameters\":[13]},null],[0,\"                            \"],[6,\"p\"],[9,\"class\",\"cluster-menu-offset-text\"],[7],[0,\"\\n                              Genes: \\n\"],[4,\"each\",[[19,11,[\"enrichment\",\"genes\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"a\"],[9,\"class\",\"cluster-menu-link-text\"],[10,\"href\",[26,[\"https://www.ncbi.nlm.nih.gov/gene/?term=\",[19,12,[\"geneid\"]]]]],[9,\"target\",\"_blank\"],[7],[1,[19,12,[\"geneid\"]],false],[8],[0,\"\\n\"]],\"parameters\":[12]},null],[0,\"                            \"],[8],[0,\"\\n\"]],\"parameters\":[11]},null]],\"parameters\":[]},null]],\"parameters\":[10]},null]],\"parameters\":[9]},null],[0,\"                      \"],[2,\" Gene sub Panel \"],[0,\"\\n\"],[4,\"paper-expansion-panel\",null,null,{\"statements\":[[4,\"component\",[[19,5,[\"collapsed\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"md-panel-summary\"],[7],[0,\" Genes \"],[8],[0,\"\\n                        \"],[1,[25,\"paper-icon\",[\"keyboard_arrow_down\"],null],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"component\",[[19,5,[\"expanded\"]]],null,{\"statements\":[[4,\"component\",[[19,6,[\"header\"]]],null,{\"statements\":[[0,\"                          \"],[6,\"div\"],[9,\"class\",\"md-panel-summary\"],[7],[0,\" Genes \"],[8],[0,\"\\n                          \"],[1,[25,\"paper-icon\",[\"keyboard_arrow_down\"],null],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"component\",[[19,6,[\"content\"]]],null,{\"statements\":[[4,\"each\",[[19,1,[\"genes\"]]],null,{\"statements\":[[4,\"paper-item\",null,[[\"class\",\"onClick\"],[\"md-2-line\",[25,\"action\",[[19,0,[]],\"toggleSelectedTerm\",[20,[\"node\"]]],null]]],{\"statements\":[[0,\"                              \"],[6,\"div\"],[9,\"class\",\"md-list-item-text\"],[7],[0,\"\\n                                \"],[6,\"p\"],[7],[0,\"\\n                                  \"],[6,\"strong\"],[7],[1,[19,7,[\"geneid\"]],false],[8],[0,\"\\n                                \"],[8],[0,\"\\n                              \"],[8],[0,\"\\n\"]],\"parameters\":[8]},null]],\"parameters\":[7]},null]],\"parameters\":[]},null]],\"parameters\":[6]},null]],\"parameters\":[5]},null],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[0,\"\\n\"]],\"parameters\":[4]},null]],\"parameters\":[3]},null],[0,\"\\n\\n\"]],\"parameters\":[1,2]},null],[0,\"\\n        \"]],\"parameters\":[]},null],[2,\"end scrollabletermlist \"],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "pathway-viz-frontend/templates/visualization.hbs" } });
});
define('pathway-viz-frontend/utils/clamp', ['exports', 'ember-paper/utils/clamp'], function (exports, _clamp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _clamp.default;
    }
  });
});
define('pathway-viz-frontend/utils/key-codes', ['exports', 'ember-frost-core/utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'keyCodes', {
    enumerable: true,
    get: function () {
      return _utils.keyCodes;
    }
  });
});


define('pathway-viz-frontend/config/environment', [], function() {
  var prefix = 'pathway-viz-frontend';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("pathway-viz-frontend/app")["default"].create({"name":"pathway-viz-frontend","version":"1.0.0+46a7d62b"});
}
//# sourceMappingURL=pathway-viz-frontend.map
