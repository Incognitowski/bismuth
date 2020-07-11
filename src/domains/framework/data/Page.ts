import PagePageable from "@/domains/framework/data/PagePageable";
import PageSort from "@/domains/framework/data/PageSort";

export default class Page<T> {
    totalPages: number = 0;
    totalElements: number = 0;
    last: boolean = false;
    number: number = 0;
    size: number = 0;
    numberOfElements: number = 0;
    first: boolean = false;
    empty: boolean = true;
    content: Array<T> = new Array<T>();
    pageable: PagePageable = new PagePageable();
    sort: PageSort = new PageSort();
}