import type { Language } from "../data";
import { ubuntuFlows, ubuntuPortFlow } from "../ubuntu-data";
import "./ubuntu-diagram.css";

export default function UbuntuDiagram({ id, lang }: { id: string; lang: Language }) {
  if (id === "ubuntu-port") {
    const flow = ubuntuPortFlow[lang];
    return <figure className="ubuntu-flow" aria-labelledby={`${id}-caption`}>
      <figcaption id={`${id}-caption`}>{flow.caption}</figcaption>
      <div className="ubuntu-port-start">{flow.start}</div>
      <div className="ubuntu-flow-down" aria-hidden="true">↓</div>
      <div className="ubuntu-port-check">{flow.check}</div>
      <div className="ubuntu-flow-down" aria-hidden="true">↓</div>
      <div className="ubuntu-port-question">{flow.question}</div>
      <div className="ubuntu-port-branches">
        <div className="ubuntu-port-retry">
          <span className="ubuntu-branch-label">{flow.yes}</span>
          <div className="ubuntu-flow-down" aria-hidden="true">↓</div>
          <p>{flow.retry}</p>
          <span className="ubuntu-loop-arrow" aria-hidden="true">↶</span>
        </div>
        <div className="ubuntu-port-available">
          <span className="ubuntu-branch-label">{flow.no}</span>
          <div className="ubuntu-flow-down" aria-hidden="true">↓</div>
          <p>{flow.open}</p>
          <p className="ubuntu-port-race">{flow.race}</p>
          <div className="ubuntu-flow-down" aria-hidden="true">↓</div>
          <p className="ubuntu-port-finish">{flow.finish}</p>
        </div>
      </div>
    </figure>;
  }

  const flow = ubuntuFlows[id]?.[lang];
  if (!flow) return null;
  return <figure className="ubuntu-flow" aria-labelledby={`${id}-caption`}>
    <figcaption id={`${id}-caption`}>{flow.caption}</figcaption>
    <ol className="ubuntu-flow-steps">
      {flow.steps.map(step => <li key={step.title}>
        <strong>{step.title}</strong>
        <span>{step.detail}</span>
      </li>)}
    </ol>
  </figure>;
}
