import Ember from 'ember';

export default Ember.Route.extend({
    queryParams:{
        search:{
            refreshModel:true
        },
        current:{
            refreshModel:true
        }
    },

    beforeModel(transition){
        if(!this.controllerFor('dashboard').get('user')){
            transition.abort();
            this.controllerFor('login').set('error',{valid:true,message:'Please login to access those routes'})
            this.transitionTo('login')
        }
    },

    model({search,current}){
        if(current && current!=1) return this.store.query('book',{page:current})
        if(search) return this.store.query('book',{search})
        return this.store.query('book',{})
    },

    setupController: function(controller, model) {
        this._super(controller,model);
        if(model.meta.total) controller.set('total', model.meta.total);
    }

});
