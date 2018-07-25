
const PERSON_HEIGHT = 1.75;
const FRIG_V = 1.33984375;
const TRUCK_V = 61.8;
const HOUSE_V = 600;
const PLANE_V = 68796;
const PLANE_C_V = 2024022;

/** This size is in m^3 */
function setCO2volume(volume) {
  // Set person to 1x1
  let totalHeight = Math.cbrt(volume);
  let personCount = totalHeight / PERSON_HEIGHT;
  $("#person #container").text(`[${personCount}] people`);
  
  // Check type of visual
  let f_volumeRatio = volume / FRIG_V; 
  let t_volumeRatio = volume / TRUCK_V;
  let h_volumeRatio = volume / HOUSE_V;
  let p_volumeRatio = volume / PLANE_V;
  let pc_volumeRatio = volume / PLANE_C_V;
  
  let type = "frig";
  let typeAmount = (f_volumeRatio);
  
  if (pc_volumeRatio > 1) {
    type = "plane-carrier";
    typeAmount = (pc_volumeRatio);
  } else if (p_volumeRatio > 1) {
    type = "plane";
    typeAmount = (p_volumeRatio);
  } else if (h_volumeRatio > 1) {
    type = "house";
    typeAmount = (h_volumeRatio);
  } else if (t_volumeRatio > 1) {
    type = "truck";
    typeAmount = (t_volumeRatio);
  }
  
  // Set amount
  let $amountContainer = $("#amount #container");
  $amountContainer.empty();
  $amountContainer.append(`<div>Total of: ${typeAmount.toFixed(2)} ${type}s</div>`)
  for (let i = 0; i < Math.round(typeAmount); i++) {
    $amountContainer.append(`<div class="${type}"></div>`)
  }
}

function setCO2Weight(weight) {
  setCO2volume(weight * 19.278);
}

setCO2Weight(1000000);