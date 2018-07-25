
const PERSON_HEIGHT = 1.75;
const FRIG_V = 1.33984375;
const TRUCK_V = 61.8;
const HOUSE_V = 600;
const PLANE_V = 68796;
const PLANE_C_V = 2024022;

/** This size is in m^3 */
function setCO2volumeOld(volume) {
  // Set person to 1x1
  
  // Check type of visual
  let f_volumeRatio = volume / FRIG_V; 
  let t_volumeRatio = volume / TRUCK_V;
  let h_volumeRatio = volume / HOUSE_V;
  let p_volumeRatio = volume / PLANE_V;
  let pc_volumeRatio = volume / PLANE_C_V;
  
  let type = "fridge";
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
  let $amountContainerDay = $("#amountDay #containerDay");
  $("#totalAmountDay").text(`Total of: ${typeAmount.toFixed(2)} ${type}s per day`);
  $amountContainerDay.empty();
  for (let i = 0; i < Math.round(typeAmount); i++) {
    $amountContainerDay.append(`<div class="${type}"></div>`)
  }

  typeAmount = typeAmount*30;
  let $amountContainerMonth = $("#amountMonth #containerMonth");
  $("#totalAmountMonth").text(`Total of: ${typeAmount.toFixed(2)} ${type}s per month`);
  $amountContainerMonth.empty();
  for (let i = 0; i < Math.round(typeAmount); i++) {
    $amountContainerMonth.append(`<div class="${type}"></div>`)
  }

  typeAmount = typeAmount*12;
  let $amountContainerYear = $("#amountYear #containerYear");
  $("#totalAmountYear").text(`Total of: ${typeAmount.toFixed(2)} ${type}s per year`);
  $amountContainerYear.empty();
  for (let i = 0; i < Math.round(typeAmount); i++) {
    $amountContainerYear.append(`<div class="${type}"></div>`)
  }

}
function setCO2volume(volume, timeline) {
  // Set person to 1x1
  
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
  let $amountContainer = $("#container"+timeline);
  $("#totalAmount"+timeline).text(`Size of ${typeAmount.toFixed(2)} ${type}s per ` +timeline);
  $amountContainer.empty();
  for (let i = 0; i < Math.round(typeAmount); i++) {
    $amountContainer.append(`<div class="${type}"></div>`)
  }

}

function setCO2Weight(weight) {
  setCO2volume(weight * 19.278, "Day");
  setCO2volume(weight * 19.278 *30, "Month");
  setCO2volume(weight * 19.278 *365, "Year");
}

