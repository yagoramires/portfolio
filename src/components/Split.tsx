import { Fragment, type CSSProperties, type ElementType } from 'react';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** extra delay before the first word, in ms */
  delay?: number;
  /** reveal on page load instead of when scrolled into view */
  load?: boolean;
  /** letters lean toward the cursor (hover devices only) */
  prox?: boolean;
};

/** Masked word-by-word rise. `\n` in the text becomes a line break. */
export function Split({ text, as: Tag = 'span', className, id, delay, load, prox }: Props) {
  let w = 0;
  return (
    <Tag
      id={id}
      className={className}
      aria-label={text.replace(/\s+/g, ' ')}
      data-split={load ? 'load' : ''}
      data-prox={prox ? '' : undefined}
      style={delay ? ({ '--split-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {text.split('\n').map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line
            .split(' ')
            .filter(Boolean)
            .map((word, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <span aria-hidden="true" className="split-mask">
                  <span className="split-word" style={{ '--w': w++ } as CSSProperties}>
                    {prox
                      ? [...word].map((ch, ci) => (
                          <span key={ci} className="prox-char">
                            {ch}
                          </span>
                        ))
                      : word}
                  </span>
                </span>
              </Fragment>
            ))}
        </Fragment>
      ))}
    </Tag>
  );
}
