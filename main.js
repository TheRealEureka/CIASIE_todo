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
            newtask : {name:'', date :new Date().toLocaleDateString().split('/').reverse().join('-'), done : false, important : false, edit : false, listid : -1},
            current_list : -1,
            showpopup: false,
        }
    },
    computed: {
        getDesc() {
            if(this.current_list !==-1){
                return this.list[this.current_list].description;
            }else{
                return "Default list"
            }
        },

    },
    methods: {

        undone(listid) {
            let r = this.task.filter(function(item, index) {
                item.id = index;
                return !item.done && item.listid === listid;
            });
            r.sort(function(a, b) {
                return (b.important - a.important);
            });
            return r
        },
        done(listid) {
            return this.task.filter(function(item, index) {
                item.id = index;
                return item.done && item.listid === listid;
            });
        },
        changeTaskValue(id,attribut, value) {
            this.task[id][attribut] = value;
            this.save()
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
                this.newtask = {name:'', date : new Date().toLocaleDateString().split('/').reverse().join('-'), done : false, important : false, edit:false};
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
        countTasks(listid){
            return this.task.filter(function(item) {
                return item.listid === listid;
            }).length;
        },
        checkDate(date){
            let today = new Date();
            let taskDate = new Date(date);
            taskDate.setDate(taskDate.getDate()+1);

            return today > taskDate;
        },
        startDragTask(evt, item) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('itemID', item.id)
        },
        onDropTask(evt, list) {
            this.task[evt.dataTransfer.getData('itemID')].listid = list;
            this.dragAnimationTask(evt, false);
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
                if(this.current_list === index) {
                    this.current_list = -1;
                }
                this.list.splice(index, 1);
                for (let i = 0; i < this.task.length; i++) {
                    if (this.task[i].listid === index) {
                        this.task.splice(i, 1);
                        i--;
                    }
                }
                this.save();
            }
        },
        dragAnimationTask(evt, enter =true) {
            if(enter) {
                evt.target.style.backgroundColor = 'rgba(0,0,0,0.2)';
                evt.target.style.scale = '1.1';
            }else{
                evt.target.style.backgroundColor = 'rgba(0,0,0,0)';
                evt.target.style.scale = '1';
            }
        },
        startDragList(evt, id) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('ListID', id)
        },
        onDropList(evt, id) {
            let moved = evt.dataTransfer.getData('ListID');
            if(id !== moved){
                let temp = this.list[moved];
                this.list[moved] = this.list[id];
                this.list[id] = temp;
                this.dragAnimationList(evt, false);
                this.save();
            }

        },
        dragAnimationList(index, evt, enter =true) {
            if(evt.target) {
                let list = evt.target.closest('tr');
                if (enter) {
                    list.style.borderBottom = '2px solid blue';
                } else {
                    list.style.borderBottom = '';
                }
            }
        }


    }
}

const app = Vue.createApp(myApp);
app.mount('#container');

