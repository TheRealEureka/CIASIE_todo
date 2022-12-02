/**
 * @author: TheRealEureka
 * @date: 2022-12-01
 * @description: Main file for the Vue.js app
 */


let myApp = {
    data() {
        return {
            task : localStorage.getItem('todo') !== null ? JSON.parse(localStorage.getItem('todo')) : [],
            newtask : {name:'', date : '', done : false, edit : false},

        }
    },
    computed: {
        undone() {
            return this.task.filter(function(item, index) {
                item.id = index;
                return !item.done
            });
        },
        done() {
            return this.task.filter(function(item, index) {
                item.id = index;
                return item.done
            });
        }

    },
    methods: {
        deleteExp(index) {
            this.task.splice(index,1);
            this.save();

        },
        save(){

            localStorage.setItem('todo', JSON.stringify(this.task));
        },
        addExp(){
            if(this.newtask.name !== '' && this.newtask.date !== '') {
                this.task.push(this.newtask);
                this.newtask = {name:'', date : '', done : false, edit:false};
                this.save();
            }
        },
        editExp(index){
            if(this.task[index].edit === true) {
                if(this.task.name !== '' && this.task.date !== '') {
                    this.task[index].edit = false;
                    this.save();
                }
            }else{
                this.task[index].edit = true;
            }
        }

    }
}

const app = Vue.createApp(myApp);
app.mount('#container');

