/**
 * Created by iAboShosha on 7/13/17.
 */
import { Observable } from "rxjs";
import {map} from "rxjs/operators"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BaseModel } from "../models/_base.model";
import { environment } from "../../../../../environments/environment";

//import {AuthenticationService} from "./authentication/authentication.service";
// import {Logger} from "../../core/logger.service";
// import {environment} from "../../../environments/environment";
// const log = new Logger('BaseApiService');


export class BaseApiService<T extends BaseModel> {
    public baseUrl = environment.baseUrl;
    public url = "/";


    constructor(protected http: HttpClient) {

    }

    protected authorization(): HttpHeaders {
        // let token = JSON.parse(localStorage.getItem('currentUser'));

        // if (token) {
            // return new HttpHeaders()
                // .set("Content-Type", "application/json")
                // .set("Accept", "application/json")
                // .set('Authorization', token['id']);
        // } else {
            return new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json");
        // }

    }

    query(query: any) {
        return this.http
            .get<T[]>(this.baseUrl + this.url + '?filter=' + `${query}`, { headers: this.authorization() })
    }

    queryByObject(query: any) {
        return this.http
            .get<T[]>(this.baseUrl + this.url + '?filter=' + `${JSON.stringify(query)}`, { headers: this.authorization() })
    }

    countByObject(query: any) {
        return this.http
            .get<T[]>(this.baseUrl + this.url + '/count'+'?where=' + `${JSON.stringify(query)}`, { headers: this.authorization() })
    }

    get(id: string) {
        return this.http
            .get<T>(this.baseUrl + this.url + `/${id}`, { headers: this.authorization() })
	}
	getWithFilter(id: string , query) {
        return this.http
            .get<T>(this.baseUrl + this.url + `/${id}?filter=${JSON.stringify(query)}`, { headers: this.authorization() })
    }

    save(item: any) {
        return item.id ? this.update(item) : this.add(item);
    }

    add(item: T) {
        return this.http.post<T>(this.baseUrl + this.url, item, { headers: this.authorization() })
    }


    update(item: any) {
        return this.http.patch<T>(this.baseUrl + this.url + `/${item.id}`, item, { headers: this.authorization() })
    }

    //only for POST /users/update Update instances of the model matched by {{where}} from the data source
    updateWithWhere(query: any, item: T) {
        return this.http
            .post<T[]>(this.baseUrl + this.url + '/update?where=' + `${query}`, item, { headers: this.authorization() })
    }

    destroy(id: String): Observable<any> {
        return this.http
            .delete<T>(this.baseUrl + this.url + `/${id}`, { headers: this.authorization() })
    }

//     upload(file: File): Observable<any> {

//         let formData: FormData = new FormData();
//         formData.append('file', file, file.name);
//         let headers = new HttpHeaders();
//         headers.append('path', file.name);
//         // let apiUrl = "/Containers/almodaraj.1/upload";

//         return this.http.post(this.baseUrl + apiUrl, formData).pipe(
//             map(m => {
//                 return {
//                     path: m['result'].files.file[0].providerResponse.location,
//                     originalFilename: m['result'].files.file[0].originalFilename,
//                     name: m['result'].files.file[0].providerResponse.name
//                 }
//             }))
//     }

}
