import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

type TTimer = NodeJS.Timer | null;

interface IProps {
  text: string;
  font?: string;
  size?: number;
  blinkingInterval?: number;
  typingInterval?: number;
  color: string;
}

const TextareaDynamic = (props: IProps) => {
  const blinkingIntervalId = useRef<TTimer>();
  const typingIntervalId = useRef<TTimer>();
  const [isFilled, setIsFilled] = useState<boolean>(true);
  const [text, setText] = useState<string>("");

  // to-do: pause between line breaks
  useEffect(() => {
    blinkingIntervalId.current = setInterval(() => {
      setIsFilled(v => !v);
    }, props.blinkingInterval || 500);
    return () => {
      clearInterval(blinkingIntervalId.current as NodeJS.Timer);
    }
  }, [props.size]);

  useEffect(() => {
    typingIntervalId.current = setInterval(() => {
      setText(t => {
        if (t.length < props.text.length) {
          if (t.length === props.text.indexOf('<br>', t.length)) {
            return `${t}<br>`;
          } else {
            return `${t}${props.text[t.length]}`;
          }
        } else {
          clearInterval(typingIntervalId.current as NodeJS.Timer);
          typingIntervalId.current = null;
          return t;
        }
      });
    }, props.typingInterval || 50);
    return () => {
      if (typingIntervalId.current) {
        clearInterval(typingIntervalId.current);
      }
    }
  }, []); // to-do: consider changes in props.text

  const processText = useMemo(() => {
    const draft = text.split('<br>');
    const lastElement = `
      <div style="display: inline-flex;">
        ${draft.slice(-1)}
      <div class="ms-1" style="height: 1.2em; width: 1ch;${isFilled ? ` background: ${props.color} !important;` : ''}" />
    `;
    draft.splice(-1, 1, lastElement);
    return draft.join('<br>');
  }, [isFilled, text, props.color]);

  return (
    <div className="p-2">
      <Container className="d-inline-flex">
        <div dangerouslySetInnerHTML={{__html: processText}} />
        {/* <Rect className="m-1" color={props.color} isFilled={isFilled} /> */}
      </Container>
    </div>
  );
}

const Container = styled.div`
  font-family: "Courier New";
`

const Rect = styled.div<{
  color: string;
  isFilled: boolean;
}>`
  height: 1.2em;
  width: 1ch;
  ${({ color, isFilled }) => isFilled ? `background: ${color} !important;` : ''}
`;

export default TextareaDynamic;