/**
 * @author: TheRealEureka
 * @date: 2022-12-01
 * @description: Main file for the Vue.js app
 */


let myApp = {
    data() {
        return {
            task : localStorage.getItem('todo') !== null ? JSON.parse(localStorage.getItem('todo')) : [],
            list : localStorage.getItem('lists') !== null ? JSON.parse(localStorage.getItem('lists')) : [],
            newlist : {name:'', description:'', edit:false},
            newtask : {name:'', date : '', done : false, edit : false, listid : -1},
            current_list : -1,
            showpopup: false,
        }
    },
    computed: {

    },
    methods: {
        undone(listid) {
            return this.task.filter(function(item, index) {
                item.id = index;
                return !item.done && item.listid === listid;
            });
        },
        done(listid) {
            return this.task.filter(function(item, index) {
                item.id = index;
                return item.done && item.listid === listid;
            });
        },
        deleteExp(index) {
            this.task.splice(index,1);
            this.save();

        },
        save(){

            localStorage.setItem('todo', JSON.stringify(this.task));
            localStorage.setItem('lists', JSON.stringify(this.list));
        },
        addExp(){
            if(this.newtask.name !== '' && this.newtask.date !== '') {
                this.newtask.listid = this.current_list;
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
        },
        checkDate(date){
            let today = new Date();
            let taskDate = new Date(date);
            return today > taskDate;
        },
        startDrag(evt, item) {
            console.log('startDrag', item)
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('itemID', item.id)
        },
        onDrop(evt, list) {
            this.task[evt.dataTransfer.getData('itemID')].listid = list;
            this.save();
        },
        addList(){
            if(this.newlist.name !== '') {
                this.list.push(this.newlist);
                this.newlist = {name:'', description:'', edit:false};
                this.save();
            }
        },
        editList(index){
            if(this.list[index].edit === true) {
                if(this.list.name !== '') {
                    this.list[index].edit = false;
                    this.save();
                }
            }else{
                this.list[index].edit = true;
            }
        },
        deleteList(index) {
            if(confirm('Are you sure you want to delete this list and all the tasks associated?')) {
                this.list.splice(index, 1);
                for (let i = 0; i < this.task.length; i++) {
                    if (this.task[i].listid === index) {
                        this.task.splice(i, 1);
                        i--;
                    }
                }
                this.save();
            }
        }

    }
}

const app = Vue.createApp(myApp);
app.mount('#container');

