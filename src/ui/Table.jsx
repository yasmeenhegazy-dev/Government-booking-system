function Table({ headers, data, render }) {
  return (
    <div className="table-reponsive p-2 rounded-4 bg-white">
      <table class="table ">
        <thead>
          <tr>
            {headers.map((heading) => (
              <th scope="col">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map(render)}</tbody>
      </table>
    </div>
  );
}

export default Table;
