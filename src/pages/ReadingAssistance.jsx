import { useEffect, useRef, useState } from "react";
import axios from "axios";

const ReadingAssistance = () => {
  const [selection, setSelection] = useState();
  const [result, setResult] = useState("");
  const [action, setAction] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const con = useRef(null);
  

  useEffect(() => {
    const showPopup = () => {
      const text = document.getSelection
        ? document.getSelection().toString()
        : document.selection.createRange().toString();

      if (text.length >= 2) {
        return setSelection(text);
      } else setSelection(null);
    };

    const el = con.current;

    const setMousePosition = (e) => {
      const x = e.x - 80;
      const y = e.y + 20;
      setMouse({ x, y });
      setAction(null);
      setResult("");
      showPopup();
    };

    window.addEventListener("selectionchange", showPopup);
    el.addEventListener("click", setMousePosition);

    return () => {
      window.removeEventListener("selectionchange", showPopup);
      el.removeEventListener("click", setMousePosition);
    };
  }, []);

  const getData = async () => {
    setResult("loading");
    const url = `${process.env.REACT_APP_API_URL}/ra/${action}`;
    const res = await axios.post(url, { q: selection });
    if (action === "image") setResult(res.data.image_url);
    else setResult(res.data.data);
  };



  useEffect(() => {
    if (!action) return;
    getData();
  }, [action]);

  const setActionType = (e) => {
    const el = e.target.closest("span")
    const type = el.id;
    setAction(type);
  };

  const renderResult = () => {
    if (result === "") return null;
    if (result === "loading") return <p>Loading...</p>;
    if (action === "text") return <p>{result}</p>;
    if (action === "image") return <img src={result} />;
    return <p>Error</p>;
  };

  

  return (
    <div className="p-5 mx-auto overflow-hidden" style={{ maxWidth: "800px", marginBottom: "300px" }}>
      <div
        className={["popup", selection ? "active" : ""].join(" ")}
        style={{ left: mouse.x, top: mouse.y }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-action">
          <span
            className={action === "text" ? "active-action" : ""}
            id="text"
            onClick={setActionType}
          >
            <img src="/icons/text.png" />
          </span>
          <span
            className={action === "image" ? "active-action" : ""}
            id="image"
            onClick={setActionType}
          >
            <img src="/icons/image.png" />
          </span>
        </div>
        <div
          className="popup-detail"
          style={{ display: result ? "block" : "none" }}
        >
          {renderResult()}
        </div>
      </div>
      <div ref={con}>
        <p>
          My father’s family name being Pirrip, and my Christian name Philip, my
          infant tongue could make of both names nothing longer or more explicit
          than Pip. So, I called myself Pip, and came to be called Pip. I give
          Pirrip as my father’s family name, on the authority of his tombstone
          and my sister,—Mrs. Joe Gargery, who married the blacksmith. As I
          never saw my father or my mother, and never saw any likeness of either
          of them (for their days were long before the days of photographs), my
          first fancies regarding what they were like were unreasonably derived
          from their tombstones. The shape of the letters on my father’s, gave
          me an odd idea that he was a square, stout, dark man, with curly black
          hair. From the character and turn of the inscription, “Also Georgiana
          Wife of the Above,” I drew a childish conclusion that my mother was
          freckled and sickly. To five little stone lozenges, each about a foot
          and a half long, which were arranged in a neat row beside their grave,
          and were sacred to the memory of five little brothers of mine,—who
          gave up trying to get a living, exceedingly early in that universal
          struggle,—I am indebted for a belief I religiously entertained that
          they had all been born on their backs with their hands in their
          trousers-pockets, and had never taken them out in this state of
          existence.
        </p>
        <p>
          Ours was the marsh country, down by the river, within, as the river
          wound, twenty miles of the sea. My first most vivid and broad
          impression of the identity of things seems to me to have been gained
          on a memorable raw afternoon towards evening. At such a time I found
          out for certain that this bleak place overgrown with nettles was the
          churchyard; and that Philip Pirrip, late of this parish, and also
          Georgiana wife of the above, were dead and buried; and that Alexander,
          Bartholomew, Abraham, Tobias, and Roger, infant children of the
          aforesaid, were also dead and buried; and that the dark flat
          wilderness beyond the churchyard, intersected with dikes and mounds
          and gates, with scattered cattle feeding on it, was the marshes; and
          that the low leaden line beyond was the river; and that the distant
          savage lair from which the wind was rushing was the sea; and that the
          small bundle of shivers growing afraid of it all and beginning to cry,
          was Pip.
        </p>
        <p>
          “Hold your noise!” cried a terrible voice, as a man started up from
          among the graves at the side of the church porch. “Keep still, you
          little devil, or I’ll cut your throat!”
        </p>
        <p>
          A fearful man, all in coarse grey, with a great iron on his leg. A man
          with no hat, and with broken shoes, and with an old rag tied round his
          head. A man who had been soaked in water, and smothered in mud, and
          lamed by stones, and cut by flints, and stung by nettles, and torn by
          briars; who limped, and shivered, and glared, and growled; and whose
          teeth chattered in his head as he seized me by the chin
        </p>
        <p>
          “Oh! Don’t cut my throat, sir,” I pleaded in terror. “Pray don’t do
          it, sir.” “Tell us your name!” said the man. “Quick!” “Pip, sir.”
          “Once more,” said the man, staring at me. “Give it mouth!” “Pip. Pip,
          sir.” “Show us where you live,” said the man. “Pint out the place!” I
          pointed to where our village lay, on the flat in-shore among the
          alder-trees and pollards, a mile or more from the church.
        </p> 
      </div>
    </div>
  );
};



export default ReadingAssistance;