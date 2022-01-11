import httpService from "./http.service";
const commentEndpoint = "comment/";

const commentService = {
    create: async (content) => {
        const { data } = await httpService.put(`${commentEndpoint}${content._id}`, content);
        return data;
    },
    getAll: async (pageId) => {
      const { data } = await httpService.get(`${commentEndpoint}`, {
        params: {
          orderBy: `"pageId"`,
          equalTo: `"${pageId}"`
        }
      });
      return data;
    },
    remove: async (id) => {
      const { data } = await httpService.delete(`${commentEndpoint}${id}`);
      return data;
    }
};
export default commentService;
