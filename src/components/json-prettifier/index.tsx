interface IProps {
  obj: { [params: string]: any } | any[];
}

const renderValue = (value: any) => {
  if (typeof value === "number") {
    return <span>{value}</span>;
  } else if (typeof value === "string") {
    return <span>{value}</span>;
  } else if (typeof value === "boolean") {
    return <span>{value}</span>;
  } else if (typeof value === "object") {
    if (value === null) {
      return <span>{value}</span>;
    } else if (Array.isArray(value)) {
      return value.map((v, index) => {
        return (
          <div key={index}>
            {renderValue(v)}
          </div>
        );
      });
    } else {
      return <span><JSONPrettifier obj={value} /></span>;
    }
  }
}

const JSONPrettifier = (props: IProps) => {
  const jsx = Array.isArray(props.obj)
    ? props.obj.map((value, index) => {
        return (
          <div key={index}>
            {renderValue(value)}
          </div>
        );
      })
    : Object.entries(props.obj).map(([key, value], index) => {
      return (
        <div className="d-flex" key={index}>
          <span>{key}</span>
          :
          <span className="ms-1">
            {renderValue(value)}
          </span>
        </div>
      )
    });

  return (
    <div>
      {jsx}
    </div>
  )
}

export default JSONPrettifier;