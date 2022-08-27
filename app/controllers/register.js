import Ember from 'ember';

export default Ember.Controller.extend({
    name:"",
    email:"",
    password:"",
    repeat:"",
    loading:false,
    error:{
        valid:false,
        message:""
    },
    actions:{
        register(){
            this.set('loading',true);
            this.set('error',{valid:false,message:""})
            if(!this.name || !this.email || !this.password || !this.repeat) this.set('error',{valid:true,message:"Fill every fields"})
            else if(this.password!==this.repeat) this.set('error',{valid:true,message:"passwords doesn't match"})
            else{
                fetch('http://localhost:8080/goodreads/users/register',{
                method:"POST",
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                },  
                body: new URLSearchParams({
                    name:this.name,
                    email:this.email,
                    password:this.password
                })
            })
            }
            this.set('loading',false)
        }
    }
});
