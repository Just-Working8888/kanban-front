import axios from "axios";

export default axios.create({
  baseURL: "https://kanban-server-psi.vercel.app/api/v1",
});
