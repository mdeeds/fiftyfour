import { readFile, writeFile } from "fs";

export class StorageUtil {
  static save(name: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof (localStorage) === 'undefined') {
        writeFile(`data/${name}.txt`, data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        localStorage.setItem(name, data);
        resolve();
      }
    });
  }

  static async saveObject(name: string, object: Object) {
    await StorageUtil.save(name, JSON.stringify(object));
  }

  static load(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof (localStorage) === 'undefined') {
        return readFile(`data/${name}.txt`, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.toString());
          }
        });
      } else {
        resolve(localStorage.getItem(name));
      }
    });
  }

  static loadObject(name: string): Promise<Object> {
    return new Promise((resolve, reject) => {
      StorageUtil.load(name)
        .then((data) => { resolve(JSON.parse(data)); });
    });
  }
}