import Ember from 'ember';

import FormDataAdapterMixin from 'ember-cli-form-data/mixins/form-data-adapter';

var adapter;

module('FormDataAdapterMixin', {
  setup: function() {
    adapter = Ember.Object.extend({
      ajaxOptions: function(url, type, options) {
        return options;
      }
    }, FormDataAdapterMixin).create();

    window.FormData = function() {
      this.data = [];
      this.append = function(key, value) {
        var object = {};
        object[key] = value;
        this.data.push(object);
      };
    };
  }
});

test('Default FormData Types', function(assert) {
  assert.deepEqual(adapter.get('formDataTypes'), ['POST', 'PUT', 'PATCH']);
});

test('#ajaxOptions', function(assert) {
  var testFormData = new window.FormData();

  testFormData.append('post[id]', 1);
  testFormData.append('post[title]', 'Rails is Omakase');

  var options = {
    data: {
      post: {
        id: 1,
        title: 'Rails is Omakase'
      }
    }
  };

  var hash = adapter.ajaxOptions('/', 'POST', options);

  assert.deepEqual(hash.data, testFormData);
});

test("Don't modify the hash for requests outside formDataTypes", function(assert) {
  var options = {
    data: {
      post: {
        id: 1,
        title: 'Rails is Omakase'
      }
    }
  };

  var hash = adapter.ajaxOptions('/', 'GET', options);

  assert.deepEqual(hash.data, {
    post: {
      id: 1,
      title: 'Rails is Omakase'
    }
  });
});

test('Falsey key gets saved', function(assert) {
  var testFormData = new window.FormData();

  testFormData.append('post[preferred]', false);

  var options = {
    data: {
      post: {
        preferred: false
      }
    }
  };

  var hash = adapter.ajaxOptions('/', 'POST', options);

  assert.deepEqual(hash.data, testFormData);
});

test('Default disableRoot', function(assert) {
  assert.deepEqual(adapter.get('disableRoot'), false);
});

test('#ajaxOptions should exclude root when disableRoot is true', function(assert) {
  var testFormData = new window.FormData();

  // Setup expected form data; note the lack of the 'post' root (post[id])
  testFormData.append('id', 1);
  testFormData.append('title', 'Rails is Omakase');

  var options = {
    data: {
      post: {
        id: 1,
        title: 'Rails is Omakase'
      }
    }
  };

  adapter.set('disableRoot', true);

  var hash = adapter.ajaxOptions('/', 'POST', options);

  assert.deepEqual(hash.data, testFormData);
});
