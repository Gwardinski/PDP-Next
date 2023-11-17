import { post } from "../server/requests";

export type LinkFormType = {
  link: string;
};

export const linksFormRequest = async (form: LinkFormType) => {
  const endpoint = "/api/links/";
  await post<LinkFormType>({ endpoint, data: form });
};
