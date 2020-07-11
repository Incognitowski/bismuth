import PageSort from "@/domains/framework/data/PageSort";
import Page from "@/domains/framework/data/Page";

export default class PagePageable {
    offset: number = 0;
    pageSize: number = 10;
    pageNumber: number = 1;
    paged: boolean = true;
    unpaged: boolean = false;
    sort: PageSort = new PageSort();
}