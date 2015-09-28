import Ember from 'ember';

export default Ember.Mixin.create({
  // Overwrite to change the request types on which Form Data is sent
  formDataTypes: ['POST', 'PUT', 'PATCH'],

  // Overwrite to flatten the form data by removing the root
  disableRoot: false,

  ajaxOptions: function(url, type, options) {

    var data;

    if (options && 'data' in options) { data = options.data; }

    var hash = this._super.apply(this, arguments);

    if (typeof FormData !== 'undefined' && data && this.formDataTypes.indexOf(type) >= 0) {
      hash.processData = false;
      hash.contentType = false;
      hash.data = this._getFormData(data);
    }

    return hash;
  },

  _getFormData: function(data) {

    var formData = new FormData();

    Object.keys(data).forEach(function(key) {
      if (data[key] instanceof Blob){
        var extension = data[key].type.split('/')[1],
            filename = data[key].filename || '';
        formData.append(key, data[key], filename);
      }else{
        if (data[key] === true){
          formData.append(key, 'on');
        }else{
          formData.append(key, data[key]);
        }
      }

    }, this);

    return formData;
  }
});
