'use client';

interface Props {
  hint: string;
}

export default function MemorableGenerator({ hint }: Props) {
  if (!hint) return null;

  return (
    /* HOOK[memo] */
    <div className="C-memo">
      <div className="C-memo-top">─── picture ───</div>
      <div className="C-memo-body">{hint}</div>
    </div>
  );
}
