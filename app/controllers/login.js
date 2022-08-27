import Ember from 'ember';

export default Ember.Controller.extend({
    email:"",
    password:"",
    loading:false,
    error:{
        valid:false,
        message:""
    },
    dashboard: Ember.inject.controller('dashboard'),
    actions:{
        login(){
            this.set('loading',true);
            this.set('error',{valid:false,message:""})
            if(!this.email || !this.password ) this.set('error',{valid:true,message:"Fill every fields"})
            else{
                fetch('http://localhost:8080/goodreads/users/login',{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },  
                    body: new URLSearchParams({
                        email:this.email,
                        password:this.password
                    })
                }).then(res => {
                    if(res.status === 202){
                        fetch('http://localhost:8080/goodreads/users/login?'+new URLSearchParams({
                            email: this.email,
                        })).then(res => res.json().then(res => {
                            this.get('dashboard').set('user',res.users);

                            fetch('http://localhost:8080/goodreads/books?'+new URLSearchParams({
                                userId: res.users.id
                            })).then(res => res.json().then(res => {
                                this.get('dashboard').set('userWatchlist',res.books)
                            }));

                            this.transitionTo('dashboard')
                        }))
                    }else{
                        this.set('error',{valid:true,message:"Invalid credentials!!!"})
                    }
                })
            }
            this.set('loading',false)
        }
    }
});
