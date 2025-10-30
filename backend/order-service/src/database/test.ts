class UserClass <T>{
  constructor(item:T){
    console.log(item);
  }
}

interface User{
  name:string;
  age:number
}

const user = new UserClass<User>({name: 'John', age: 30});