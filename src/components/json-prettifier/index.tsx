import styled from "styled-components";

interface IRenderValuesOptions {
  hyperlink?: boolean;
  key?: string;
}

interface IProps {
  obj: { [params: string]: any } | any[];
  options?: IRenderValuesOptions
}

const twitterProfileHyperlink = (value: string) => {
  return `<a href="https://www.twitter.com/${value}" target="_blank">@${value}</a>`;
}

const renderValue = (value: any, options?: IRenderValuesOptions) => {
  const {
    hyperlink = false,
    key
  } = (options || {});

  if (typeof value === "number") {
    return <span className="number">{value}</span>;
  } else if (typeof value === "string") {
    if (hyperlink) {
      if (value.slice(0, 4) === "http") {
        return <a href={value} target="_blank">{value}</a>;
      } else if (value.includes("@")) {
        const ats = [];
        let end = 0, start = value.indexOf("@", end);
        while(start !== -1) {
          end = value.indexOf(" ", start+1); // to-do: consider endline, etc
          ats.push({ start, end, username: value.slice(start+1, end) });
          start = value.indexOf("@", end);
        }

        ats.forEach(at => {
          value = value.replace(`@${at.username}`, twitterProfileHyperlink(at.username));
        });

        return <span dangerouslySetInnerHTML={{ __html: value }} />;
        // to-do: change color for datetime
      } else if (key && (key.toLocaleLowerCase().includes('date') || key.toLocaleLowerCase().includes('time')) || value.slice(-1) === 'Z') {
        return <span className="number">{value}</span>;
      }
      else {
        return <span>{value}</span>
      }
    } else {
      return <span>{value}</span>;
    }
  } else if (typeof value === "boolean") {
    return <span>{value}</span>;
  } else if (typeof value === "object") {
    if (value === null) {
      return <span className="null">null</span>;
    } else if (Array.isArray(value)) {
      return value.map((v, index) => {
        return (
          <div key={index}>
            {renderValue(v, options)}
          </div>
        );
      });
    } else {
      return (
        <>
          {/* {"{"} */}
          <br />
          <JSONPrettifier obj={value} options={options} />
          {/* {"}"} */}
        </>
      );
    }
  }
}

const JSONPrettifier = (props: IProps) => {
  const jsx = Array.isArray(props.obj)
    ? props.obj.map((value, index) => {
        return (
          <div key={index}>
            {renderValue(value, props.options)}
          </div>
        );
      })
    : Object.entries(props.obj).map(([key, value], index) => {
      return (
        <div className="d-flex" key={index}>
          <span>{key}</span>
          :
          <span className="ms-1">
            {renderValue(value, { ...props.options, key })}
          </span>
        </div>
      )
    });

  return (
    <Container>
      {jsx}
    </Container>
  )
}

const Container = styled.div`
  .number {
    color: green;
    font-weight: bold;
  }

  .null {
    color: gray;
  }
`;

export default JSONPrettifier;