define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'views/modal',
  'text!templates/modalAddUser.html'
], function($, _, Backbone, UserModel, ModalView, modalAddUserTemplate) {
  'use strict';
  var lastOrg;
  var ModalAddUserView = ModalView.extend({
    className: 'add-user-modal',
    template: _.template(modalAddUserTemplate),
    title: 'Add User',
    okText: 'Add',
    initialize: function(options) {
      this.orgs = options.orgs;
      ModalAddUserView.__super__.initialize.call(this);
    },
    body: function() {
      return this.template({
        orgs: this.orgs.toJSON(),
        lastOrg: lastOrg
      });
    },
    onOk: function() {
      var name = this.$('.name input').val();
      var org = this.$('.org select').val();
      var email = this.$('.email input').val();
      var emailReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

      var networkLink;
      var networkLinks = [];
      var networkLinksTemp = this.$('.network-links input').val().split(',');
      for (var i = 0; i < networkLinksTemp.length; i++) {
        networkLink = $.trim(networkLinksTemp[i]);
        if (networkLink) {
          networkLinks.push(networkLink);
        }
      }

      if (!name) {
        this.setAlert('danger', 'Name can not be empty.', '.form-group.name');
        return;
      }
      if (!email) {
        email = null;
      }
      else if (!emailReg.test(email)) {
        this.setAlert('danger', 'Email is not valid.', '.form-group.email');
        return;
      }
      lastOrg = org;

      this.setLoading('Adding user...');
      var userModel = new UserModel();
      userModel.save({
        organization: org,
        name: name,
        email: email,
        network_links: networkLinks
      }, {
        success: function() {
          this.close(true);
        }.bind(this),
        error: function(model, response) {
          this.clearLoading();
          if (response.responseJSON) {
            this.setAlert('danger', response.responseJSON.error_msg);
          }
          else {
            this.setAlert('danger', this.errorMsg);
          }
        }.bind(this)
      });
    }
  });

  return ModalAddUserView;
});
