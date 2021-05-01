import { rejects } from "assert";
import { readFile, readFileSync, writeFileSync } from "fs";

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

  static loadArrayBuffer(fileName: string): Promise<ArrayBuffer> {
    if (typeof XMLHttpRequest === 'undefined') {
      return new Promise((resolve, reject) => {
        readFile(`dist/${fileName}`, {}, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }

        });
      });
    } else {
      return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = async () => {
          if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
              resolve(xhttp.response);
            } else {
              rejects(xhttp.response);
            }
          }

          xhttp.open("GET", fileName, true);
          xhttp.responseType = 'arraybuffer';
          xhttp.send();
        };
      });
    }
  }
}