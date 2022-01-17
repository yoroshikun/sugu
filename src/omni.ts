import Omni from "./components/SOmni.svelte";

// Inject Omni in every tab, this can be optimized
const body = document.body;
const target = document.createElement("div");
target.id = "omni";

body.appendChild(target);

const app = new Omni({
  target,
});

// document.addEventListener("DOMContentLoaded", initOmni); (this would be nicer to have but seems bugged?)
