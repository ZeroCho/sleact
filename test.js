name1 = 'name1';
console.log(this, this.name1, global.name1);
const objectA = {
    name1: 'objectA.name1',
    getname: function(){
        name1 = "aaa";
        const name2 = 'name2';
        console.log(`this.name1: ${this.name1}`);
        function fullname() {
            // this: global
            console.log(`>> name1:${name1}, name2:${name2}, this.name1:${this.name1}, this.name2:${this.name2}, this`, this);
            return `>>>> objectA.name1 + name2: ${objectA.name1} ${name2}`;
        };
        return fullname();
    },
}

console.log(objectA.getname());
