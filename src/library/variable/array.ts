declare global {
    interface Array<T> {
        indexOfKey(key: keyof this[0] | "", value: any): number
        findSingle(key: keyof this[0] | "", value: this[0][keyof this[0]]): this[0]
        findMulti(key: keyof this[0] | "", value: this[0][keyof this[0]] | this[0][keyof this[0]][], isLike?: boolean): this
        findMultiForObject(obj: Array<any>, find: any, type: 'number' | 'string'): Array<any>
        orderBy(key: keyof this[0] | "", sort_type: `asc` | `desc`): this
        serializeObject(): object,
        remove(index: number, deleteCount?: number): void;
    }
}

Array.prototype.indexOfKey = function (key, value) {
    return this.map(data => {
        return (key === "")
            ? data
            : (typeof data[key] !== undefined)
                ? data[key]
                : -1;
    }).indexOf(value);
}

Array.prototype.findSingle = function (key, value) {
    return this.find(function(data, index){
        data._index = index;
        return ((key === "") ? data : data[key]) == value
    });
}
Array.prototype.findMulti = function (key, value, isLike = true) {
    let founds = Array();
    this.find(function(data, index){
        let query = (Array.isArray(value) ? value.includes(((key === "") ? data : data[key])) : ((key === "") ? data : data[key]) == value);
        if(query === isLike) founds.push(Object.assign(data, {_index: index}));
    });
    return founds;
}
Array.prototype.orderBy = function (key, sort_type) {
    return this.sort(function (a, b) {
        if (key !== "" && (!a.hasOwnProperty(key) || !b.hasOwnProperty(key))) {
            // property doesn't exist on either object
            return 0;
        }

        let keyA = (key != "") ? a[key] : a;
        let keyB = (key != "") ? b[key] : b;

        const varA = (typeof keyA === 'string')
            ? keyA.toUpperCase() : keyA;
        const varB = (typeof keyB === 'string')
            ? keyB.toUpperCase() : keyB;

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (sort_type === "desc") ? (comparison * -1) : comparison
        );
    });
}
Array.prototype.findMultiForObject = function (obj: Array<any>, find: any, type: 'number' | 'string' = 'string'){
    let query = '';
    let multi_find = false;
    for (const key in find) {
        if (find[key] instanceof Array && find[key].length > 0){
            multi_find = true
            if (type == 'string') query += `[${find[key].map((e:any)=>`'${e}'`)}].includes(a['${key}']) || `
            if (type == "number") query += `[${find[key].map((e:any)=>`${e}`)}].includes(a['${key}']) || `
        }else {
            query += `a['${key}']=='${find[key]}' && `
        }
    }
    query = query.slice(0,-3)
    return obj.filter(e => eval(query));
}
Array.prototype.serializeObject = function () {
    let result: any = {};
    this.forEach((item: {name: string, value: any}) => {
        result[item.name] = item.value;
    })
    return result;
}
Array.prototype.remove = function (index, deleteCount = 1) {
    this.splice(index, deleteCount)
}

export default {}