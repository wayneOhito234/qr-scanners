(function () {
  const menu = window.MENUS[document.body.dataset.menu];
  const nav = document.getElementById("nav");
  const content = document.getElementById("content");
  const search = document.getElementById("search");

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const fmt = (n) => "KSh " + n.toLocaleString("en-KE");

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderPrice(price) {
    const wrap = el("div", "price");
    if (typeof price === "number") {
      wrap.textContent = fmt(price);
    } else if (Array.isArray(price)) {
      wrap.classList.add("multi");
      price.forEach(([label, p]) => {
        const row = el("span");
        row.append(el("small", null, label + " "), fmt(p));
        wrap.append(row);
      });
    } else {
      wrap.classList.add("multi");
      [["Cow milk", price.cow], ["Camel milk", price.camel]].forEach(([label, p]) => {
        const row = el("span");
        row.append(el("small", null, label + " "), fmt(p));
        wrap.append(row);
      });
    }
    return wrap;
  }

  menu.sections.forEach((section) => {
    const id = slug(section.title);
    const link = el("a", "chip", section.title);
    link.href = "#" + id;
    nav.append(link);

    const sec = el("section", "section");
    sec.id = id;
    sec.append(el("h2", null, section.title));
    if (section.note) sec.append(el("p", "note", section.note));

    const list = el("ul", "items");
    section.items.forEach((item) => {
      const li = el("li", "item");
      const info = el("div", "info");
      info.append(el("h3", null, item.name));
      if (item.tags) info.append(el("p", "tags", item.tags));
      if (item.desc) info.append(el("p", "desc", item.desc));
      if (item.rec) info.append(el("p", "rec", "Recommended with: " + item.rec));
      li.append(info, renderPrice(item.price));
      li.dataset.search = [item.name, item.desc, item.tags, item.rec, section.title].join(" ").toLowerCase();
      list.append(li);
    });
    sec.append(list);
    content.append(sec);
  });

  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    content.querySelectorAll(".section").forEach((sec) => {
      let visible = 0;
      sec.querySelectorAll(".item").forEach((li) => {
        const match = !q || li.dataset.search.includes(q);
        li.hidden = !match;
        if (match) visible++;
      });
      sec.hidden = visible === 0;
    });
    document.getElementById("empty").hidden = !!content.querySelector(".section:not([hidden])");
  });
})();
