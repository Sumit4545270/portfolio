/**
 * Per-section background variants. All pure CSS — no JavaScript, no frame loop,
 * no measurable runtime cost. They share one ink palette and one masking rule,
 * so the set reads as a single system rather than seven unrelated textures.
 *
 * Each sits behind `.fx-content`, is clipped by `.fx-layer`, and is hidden from
 * assistive technology. Nothing here is interactive or informative.
 */
export type BackdropVariant =
  | 'none'
  | 'flow'
  | 'nodes'
  | 'pipeline'
  | 'timeline'
  | 'constellation'
  | 'connected'

export function SectionBackdrop({ variant }: { variant: BackdropVariant }) {
  if (variant === 'none') return null

  return (
    <div className="fx-layer fx-layer-section" aria-hidden="true">
      {variant === 'flow' && (
        <>
          <div className="fx-sheet fx-flow" />
          <div className="fx-flow-sweep" />
          <div className="fx-glow -top-24 left-[8%] h-64 w-64 bg-accent/[0.05]" />
        </>
      )}

      {variant === 'nodes' && (
        <>
          <div className="fx-sheet fx-nodes" />
          <div className="fx-glow top-1/3 -right-20 h-72 w-72 bg-accent/[0.045]" />
        </>
      )}

      {variant === 'pipeline' && (
        <>
          <div className="fx-sheet fx-pipeline" />
          <div className="fx-pipeline-sweep" />
          <div className="fx-glow -top-16 right-[12%] h-72 w-72 bg-accent/[0.05]" />
        </>
      )}

      {variant === 'timeline' && (
        <>
          <div className="fx-sheet fx-timeline" />
          <div className="fx-timeline-sweep" />
        </>
      )}

      {variant === 'constellation' && (
        <>
          <div className="fx-sheet fx-constellation" />
          <div className="fx-glow bottom-0 left-1/4 h-64 w-64 bg-[color:var(--fx-violet)]" />
        </>
      )}

      {variant === 'connected' && (
        <>
          <div className="fx-sheet fx-connected" />
          <div className="fx-glow -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 bg-accent/[0.06]" />
        </>
      )}
    </div>
  )
}
