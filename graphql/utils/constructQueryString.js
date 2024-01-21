function extractFieldFilter(filter) {
  const {
    field, gt, lt, eqStr, eqNum
  } = filter;

  const title = field.content;
  const values = {};

  if (gt) {
    values.gt = gt.content;
  }

  if (lt) {
    values.lt = lt.content;
  }

  if (eqNum) {
    values.eq = eqNum.content;
  } else if (eqStr) {
    values.eq = eqStr.content;
  }

  return [title, values];
}

export default function constructQueryString({
  limit,
  fields,
  sort,
  page,
  others,
}) {
  let queryString = "";

  if (limit) queryString += `limit=${limit}`;

  if (fields) {
    queryString += `${queryString.length === 0 ? "" : "&"}fields=${fields}`;
  }

  if (sort) {
    queryString += `${queryString.length === 0 ? "" : "&"}sort=${sort}`;
  }

  if (page) {
    queryString += `${queryString.length === 0 ? "" : "&"}page=${page}`;
  }

  if (others) {
    others.forEach((filterObj) => {
      const [title, values] = extractFieldFilter(filterObj);
      Object.entries(values).forEach((item) => {
        queryString += `${queryString.length === 0 ? "" : "&"}${title}[${
          item[0]
        }]=${item[1]}`;
      });
    });
  }

  return queryString;
}
