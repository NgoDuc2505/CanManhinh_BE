import { Injectable } from "@nestjs/common";
import { objectTest, objectTestAndId } from "./const/const.type";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  getTest(): string[] {
    return ["test this API", "test array"];
  }

  getObject(): objectTest {
    try {
      const data = {
        name: "ngo minh duc",
        age: 22
      };
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  testParam(id: string): objectTestAndId{
    try{
      const data = {
        name: "ngo minh duc",
        age: 22,
        id : id
      };
      return data;
    }catch(e){
      console.log(e)
    }
  }
}
