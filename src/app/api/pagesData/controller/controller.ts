import { GetPageData } from "./sections/GET/getPageData";

class PagesDataController {
    public readonly GetPageData = new GetPageData()
}

export const pagesDataController = new PagesDataController()