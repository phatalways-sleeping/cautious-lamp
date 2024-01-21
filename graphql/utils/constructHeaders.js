export default function constructHeaders({ token }) {
  return {
    Authorization: `Bearer ${token}`,
  };
}
