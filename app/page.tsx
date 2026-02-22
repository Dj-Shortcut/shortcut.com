import { getHigherDimensionsSets, DESCRIPTION_FALLBACK } from "../lib/higherDimensions";

export default async function Page() {
  const higherDimensionsSets = await getHigherDimensionsSets();

  return (
    <main>
      <section id="mixes" aria-labelledby="mixes-heading">
        <h2 id="mixes-heading">MIXES</h2>

        <ul>
          {higherDimensionsSets.map((set) => (
            <li key={set.url}>
              <article>
                <h3>
                  <a href={set.url} target="_blank" rel="noopener noreferrer">
                    {set.title}
                  </a>
                </h3>

                <p>{set.duration ? `YouTube · ${set.duration}` : "YouTube"}</p>
                <p>{set.description?.trim() ? set.description : DESCRIPTION_FALLBACK}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
