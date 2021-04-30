import { readFile, readFileSync, writeFile, writeFileSync } from "fs";

export class StorageUtil {
  static save(name: string, data: string) {
    if (typeof (localStorage) === 'undefined') {
      writeFileSync(`data/${name}.txt`, data);
    } else {
      localStorage.setItem(name, data);
    }
  }

  static async saveObject(name: string, object: Object) {
    StorageUtil.save(name, JSON.stringify(object));
  }

  static load(name: string) {
    if (typeof (localStorage) === 'undefined') {
      return readFileSync(`data/${name}.txt`)
    } else {
      return localStorage.getItem(name);
    }
  }

  static loadObject(name: string): Object {
    return JSON.parse(StorageUtil.load(name).toString());
  }
}