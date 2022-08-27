import Ember from 'ember';

export default Ember.Controller.extend({
    user: null,
    queryParams: ['search','current'],
    search:"",
    total: 0,
    current:1,
    userWatchlist:null,
    page: Ember.computed('total',function() {
        return [...Array(this.get('total')/10).keys()].map(ele => ele+1);
    }),
    backDisable:Ember.computed('current',function(){
        return this.current==1
    }),
    nextDisable:Ember.computed('current',function(){
        return this.current==(this.total/10)
    }),
    watchlist:Ember.computed('model','userWatchlist',function(){
        return this.get('model').map(ele => {
            return {
                title:ele.get('title'),
                id:ele.id,
                description:ele.get('description'),
                author:ele.get('author'),
                genre:ele.get('genre'),
                watched: this.userWatchlist.some(watch => watch.id==ele.id)
            }
        })
    }),
    actions:{
        goBack(){
            this.transitionTo('dashboard',{queryParams:{current:this.current-1}})
        },
        goNext(){
            this.transitionTo('dashboard',{queryParams:{current:this.current+1}})
        },
        logout(){
            this.set('user',null);
            this.transitionTo('login')
        },
        watchlist(bookId){
            fetch('http://localhost:8080/goodreads/books',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                },  
                body: new URLSearchParams({
                    userId:this.user.id,
                    bookId:bookId
                })
            }).then(res => {
                fetch('http://localhost:8080/goodreads/books?'+new URLSearchParams({
                    userId: this.user.id
                })).then(res => res.json().then(res => {
                    this.set('userWatchlist',res.books);
                }));
            })
        }
    }
});
