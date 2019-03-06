'use strict';

define('pathway-viz-frontend/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/cluster-download.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/cluster-download.js should pass ESLint\n\n');
  });

  QUnit.test('components/download-options.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/download-options.js should pass ESLint\n\n');
  });

  QUnit.test('components/term-ontology.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/term-ontology.js should pass ESLint\n\n30:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n76:35 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n76:35 - \'$\' is not defined. (no-undef)\n78:15 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n78:15 - \'$\' is not defined. (no-undef)\n110:15 - \'transform\' is already defined. (no-redeclare)\n171:15 - \'transform\' is already defined. (no-redeclare)\n172:15 - \'node_objects\' is already defined. (no-redeclare)\n383:9 - \'markerlayer\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/usage-instructions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/usage-instructions.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/application.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/index.js should pass ESLint\n\n21:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n22:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n37:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n38:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n40:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n44:31 - Unnecessary escape character: \\<. (no-useless-escape)\n44:33 - Unnecessary escape character: \\>. (no-useless-escape)\n73:57 - Unexpected control character(s) in regular expression: \\x0a. (no-control-regex)');
  });

  QUnit.test('controllers/visualization.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/visualization.js should pass ESLint\n\n20:10 - \'scheduleOnce\' is defined but never used. (no-unused-vars)\n61:13 - \'i\' is already defined. (no-redeclare)\n198:13 - \'event\' is already defined. (no-redeclare)\n236:9 - Unexpected console statement. (no-console)');
  });

  QUnit.test('helpers/exponential-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/exponential-form.js should pass ESLint\n\n');
  });

  QUnit.test('initializers/navigation.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/navigation.js should pass ESLint\n\n');
  });

  QUnit.test('initializers/store.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/store.js should pass ESLint\n\n');
  });

  QUnit.test('models/enrichment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/enrichment.js should pass ESLint\n\n');
  });

  QUnit.test('models/gene.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/gene.js should pass ESLint\n\n');
  });

  QUnit.test('models/ontology.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/ontology.js should pass ESLint\n\n');
  });

  QUnit.test('models/run.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/run.js should pass ESLint\n\n');
  });

  QUnit.test('models/term.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/term.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/visualization.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/visualization.js should pass ESLint\n\n');
  });

  QUnit.test('services/navigation.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/navigation.js should pass ESLint\n\n');
  });
});
define('pathway-viz-frontend/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('pathway-viz-frontend/tests/helpers/ember-power-select', ['exports', 'ember-power-select/test-support/helpers'], function (exports, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.selectChoose = exports.touchTrigger = exports.nativeTouch = exports.clickTrigger = exports.typeInSearch = exports.triggerKeydown = exports.nativeMouseUp = exports.nativeMouseDown = exports.findContains = undefined;
  exports.default = deprecatedRegisterHelpers;


  function deprecateHelper(fn, name) {
    return function () {
      (true && !(false) && Ember.deprecate('DEPRECATED `import { ' + name + ' } from \'../../tests/helpers/ember-power-select\';` is deprecated. Please, replace it with `import { ' + name + ' } from \'ember-power-select/test-support/helpers\';`', false, { until: '1.11.0', id: 'ember-power-select-test-support-' + name }));

      return fn.apply(undefined, arguments);
    };
  }

  var findContains = deprecateHelper(_helpers.findContains, 'findContains');
  var nativeMouseDown = deprecateHelper(_helpers.nativeMouseDown, 'nativeMouseDown');
  var nativeMouseUp = deprecateHelper(_helpers.nativeMouseUp, 'nativeMouseUp');
  var triggerKeydown = deprecateHelper(_helpers.triggerKeydown, 'triggerKeydown');
  var typeInSearch = deprecateHelper(_helpers.typeInSearch, 'typeInSearch');
  var clickTrigger = deprecateHelper(_helpers.clickTrigger, 'clickTrigger');
  var nativeTouch = deprecateHelper(_helpers.nativeTouch, 'nativeTouch');
  var touchTrigger = deprecateHelper(_helpers.touchTrigger, 'touchTrigger');
  var selectChoose = deprecateHelper(_helpers.selectChoose, 'selectChoose');

  function deprecatedRegisterHelpers() {
    (true && !(false) && Ember.deprecate("DEPRECATED `import registerPowerSelectHelpers from '../../tests/helpers/ember-power-select';` is deprecated. Please, replace it with `import registerPowerSelectHelpers from 'ember-power-select/test-support/helpers';`", false, { until: '1.11.0', id: 'ember-power-select-test-support-register-helpers' }));

    return (0, _helpers.default)();
  }

  exports.findContains = findContains;
  exports.nativeMouseDown = nativeMouseDown;
  exports.nativeMouseUp = nativeMouseUp;
  exports.triggerKeydown = triggerKeydown;
  exports.typeInSearch = typeInSearch;
  exports.clickTrigger = clickTrigger;
  exports.nativeTouch = nativeTouch;
  exports.touchTrigger = touchTrigger;
  exports.selectChoose = selectChoose;
});
define('pathway-viz-frontend/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'pathway-viz-frontend/tests/helpers/start-app', 'pathway-viz-frontend/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Ember.RSVP.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };
});
define('pathway-viz-frontend/tests/helpers/start-app', ['exports', 'pathway-viz-frontend/app', 'pathway-viz-frontend/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes.autoboot = true;
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('pathway-viz-frontend/tests/integration/components/cluster-download-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('cluster-download', 'Integration | Component | cluster download', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "ktpqpwJ5",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"cluster-download\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "FQVBnP4V",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"cluster-download\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pathway-viz-frontend/tests/integration/components/download-options-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('download-options', 'Integration | Component | download options', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "46kE1clE",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"download-options\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "6m5b5tjO",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"download-options\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pathway-viz-frontend/tests/integration/components/term-ontology-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('term-ontology', 'Integration | Component | term ontology', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "QHUZ5Bv6",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"term-ontology\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "UbukOrOD",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"term-ontology\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pathway-viz-frontend/tests/integration/components/usage-instructions-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('usage-instructions', 'Integration | Component | usage instructions', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "uX0qp5wL",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"usage-instructions\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "SogW/L07",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"usage-instructions\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pathway-viz-frontend/tests/integration/helpers/exponential-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('exponential-form', 'helper:exponential-form', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "EcgYuZNG",
      "block": "{\"symbols\":[],\"statements\":[[1,[25,\"exponential-form\",[[20,[\"inputValue\"]]],null],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('pathway-viz-frontend/tests/test-helper', ['pathway-viz-frontend/app', 'pathway-viz-frontend/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('pathway-viz-frontend/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/cluster-download-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/cluster-download-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/download-options-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/download-options-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/term-ontology-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/term-ontology-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/usage-instructions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/usage-instructions-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/exponential-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/exponential-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/adapters/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/visualization-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/visualization-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/initializers/navigation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/navigation-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/initializers/store-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/store-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/enrichment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/enrichment-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/gene-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/gene-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/ontology-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/ontology-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/run-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/run-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/term-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/term-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/visualization-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/visualization-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/navigation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/navigation-test.js should pass ESLint\n\n');
  });
});
define('pathway-viz-frontend/tests/unit/adapters/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });
});
define('pathway-viz-frontend/tests/unit/controllers/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('pathway-viz-frontend/tests/unit/controllers/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:index', 'Unit | Controller | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('pathway-viz-frontend/tests/unit/controllers/visualization-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:visualization', 'Unit | Controller | visualization', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('pathway-viz-frontend/tests/unit/initializers/navigation-test', ['pathway-viz-frontend/initializers/navigation', 'qunit', 'pathway-viz-frontend/tests/helpers/destroy-app'], function (_navigation, _qunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Initializer | navigation', {
    beforeEach: function beforeEach() {
      var _this = this;

      Ember.run(function () {
        _this.application = Ember.Application.create();
        _this.application.deferReadiness();
      });
    },
    afterEach: function afterEach() {
      (0, _destroyApp.default)(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _navigation.initialize)(this.application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('pathway-viz-frontend/tests/unit/initializers/store-test', ['pathway-viz-frontend/initializers/store', 'qunit', 'pathway-viz-frontend/tests/helpers/destroy-app'], function (_store, _qunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Initializer | store', {
    beforeEach: function beforeEach() {
      var _this = this;

      Ember.run(function () {
        _this.application = Ember.Application.create();
        _this.application.deferReadiness();
      });
    },
    afterEach: function afterEach() {
      (0, _destroyApp.default)(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _store.initialize)(this.application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('pathway-viz-frontend/tests/unit/models/enrichment-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('enrichment', 'Unit | Model | enrichment', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('pathway-viz-frontend/tests/unit/models/gene-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('gene', 'Unit | Model | gene', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('pathway-viz-frontend/tests/unit/models/ontology-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('ontology', 'Unit | Model | ontology', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('pathway-viz-frontend/tests/unit/models/run-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('run', 'Unit | Model | run', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('pathway-viz-frontend/tests/unit/models/term-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('term', 'Unit | Model | term', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('pathway-viz-frontend/tests/unit/routes/index-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('pathway-viz-frontend/tests/unit/routes/visualization-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:visualization', 'Unit | Route | visualization', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('pathway-viz-frontend/tests/unit/services/navigation-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:navigation', 'Unit | Service | navigation', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
require('pathway-viz-frontend/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
