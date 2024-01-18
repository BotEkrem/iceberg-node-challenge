import {validate} from "class-validator";
import {ErrorObject} from "@/misc/interfaces/errorObject";

export async function validation<T>(dto: any): Promise<T | ErrorObject> {
  return new Promise((resolve, reject) => {
    validate(dto).then(errors => {
      if (errors.length > 0) {
        reject({
          errors: errors.map((v, i) => {
            return v["constraints"][Object.keys(v["constraints"])[0]]
          })
        });
      } else {
        resolve(dto);
      }
    });
  })
}

export async function validationCheck<T>(dto: any): Promise<T | ErrorObject> {
  return await validation<T>(dto).catch((errors) => errors)
}