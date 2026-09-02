const ARTICLES = [
  {
    id: 1,
    slug: "quantum-interconnect-silicon-breakthrough",
    category: "tech",
    categoryLabel: "Quantum Computing",
    title: "Monolithic Silicon Quantum Interconnect Transmits Entangled States at Room Temperature",
    lead: "Engineers bridge the thermal divide, demonstrating low-latency qubit distribution across ordinary fiber networks.",
    date: "September 2, 2026",
    location: "Geneva, Switzerland",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    caption: "Laboratory verification of optical photon interconnects at cryogenic test points.",
    body: `
      <p>Researchers have published verification data demonstrating a room-temperature optical interface capable of shuttling entangled photons directly from silicon-based quantum processors without thermal decodence.</p>
      <p>The achievement addresses one of quantum computing's most stubborn hardware bottlenecks: linking cryogenic processing cores without introducing phase noise or destructive signal attenuation. By modulating trapped ions through standard photonic wave-guides, transmission speeds improved tenfold over prior records.</p>
      <p>International industrial consortiums are already sizing pilot deployments aimed at modular datacenter interconnects, signalling that distributed quantum clusters may emerge far earlier than conservative roadmaps projected.</p>
    `
  },
  {
    id: 2,
    slug: "deep-space-europa-spectrometry-findings",
    category: "science",
    categoryLabel: "Space Exploration",
    title: "Probe Spectrometry Confirms Complex Organic Molecules Emanating from Europa Plumes",
    lead: "Orbiter flybys register anomalous carbon chains and saline signatures across south polar fractures.",
    date: "September 1, 2026",
    location: "Pasadena, USA",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80",
    caption: "Deep space telemetry map outlining chemical plume distribution across Europa's crust.",
    body: `
      <p>Deep-space planetary instruments skimming the fractured crust of Jupiter's moon Europa have detected direct chemical signatures of long-chain hydrocarbons and elevated sulfur balances in active cryovolcanic plumes.</p>
      <p>Data transmitted across the Deep Space Network confirms that interior oceanic plumes are carrying subsurface matter directly into the vacuum, eliminating the requirement for complex mechanical drill platforms in initial reconnaissance phases.</p>
      <p>Astrobiologists note that while the presence of carbon architectures does not constitute direct biological detection, the thermodynamic conditions of Europa's subsurface sea appear structurally suited for sustained energetic chemistry.</p>
    `
  },
  {
    id: 3,
    slug: "global-grid-fusion-pilot-milestone",
    category: "climate",
    categoryLabel: "Clean Power",
    title: "High-Temperature Superconducting Tokamak Delivers Continuous Q>2 Energy Return",
    lead: "Private reactor containment exceeds 100 seconds of net positive plasma stability in breakthrough test run.",
    date: "August 30, 2026",
    location: "Oxford, UK",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    caption: "High-field magnetic coils sustaining contained magnetic confinement fields.",
    body: `
      <p>Next-generation high-temperature superconducting (HTS) magnets have sustained stable deuterium-tritium plasma for over two consecutive minutes, delivering a net power output double the input kinetic requirement.</p>
      <p>The result sets an operational benchmark for commercial tokamak designs. By operating magnetic field strengths exceeding 20 Tesla in compact geometries, capital expenditure projections have dropped significantly compared to legacy gigawatt-scale infrastructure.</p>
      <p>Grid transmission operators are collaborating on dynamic injection tests intended to confirm whether pulsed fusion designs can buffer baseline requirements without disruptive frequency volatility.</p>
    `
  },
  {
    id: 4,
    slug: "semiconductor-lithography-angstrom-frontier",
    category: "economy",
    categoryLabel: "Silicon Markets",
    title: "Foundries Race Past the 10-Angstrom Boundary as High-NA EUV Enters Full Production",
    lead: "Capital expenditures intensify worldwide as hardware fabricators shift toward atomic-scale logic nodes.",
    date: "August 28, 2026",
    location: "Hsinchu, Taiwan",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    caption: "Automated optical wafer processing under hyper-pure cleanroom environments.",
    body: `
      <p>Commercial silicon fabrication has officially crossed into sub-nanometer node production, utilizing second-generation High-NA Extreme Ultraviolet lithography tools to pattern logic circuits near physical atom boundaries.</p>
      <p>The transition alters unit economics across consumer and enterprise silicon markets. Extreme transistor density requires specialized backside power delivery networks and advanced liquid metal heat dissipation to maintain operational stability under heavy compute workloads.</p>
      <p>Market analysts project that control over this specialized lithographic supply chain will remain the dominant strategic axis governing global technology equities throughout the decade.</p>
    `
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ARTICLES;
}
