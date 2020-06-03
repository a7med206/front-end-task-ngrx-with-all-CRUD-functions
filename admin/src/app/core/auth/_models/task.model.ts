import { BaseModel } from '../../_base/crud';


export class Task extends BaseModel {
    id?: number;
    TaskName: string;
    apiType: string;
    date: Date;
    time: string;
    description: string;
    userFullName: string;
    userEmail: string;
    active: boolean;
    isDeleted: boolean;
    
    clear(): void {
        this.id = undefined;
        this.TaskName = '';
        this.apiType = '';
        this.date = new Date();
        this.time = '';
        this.description = '';
        this.userFullName = '';
        this.userEmail = '';
        this.isDeleted = false;
        this.active = false;
    }
    removeReadOnly(){
        delete this._isEditMode;
        delete this._userId;
    }
}