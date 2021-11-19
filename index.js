var global_array_json = [];
var global_insert_sql_prefix = "";
var global_row = 0;
var global_generated_sql = "";

document
  .getElementById("file")
  .addEventListener("change", handleFileSelect, false);

function handleFileSelect(e) {
  ExcelToJSON(e.target.files[0]);
}

ExcelToJSON = (file) => {
  var reader = new FileReader();

  reader.onload = function (e) {
    let data = e.target.result;
    var workbook = XLSX.read(data, {
      type: "binary",
    });
    workbook.SheetNames.forEach(function (sheetName) {
      let XL_row_object = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[sheetName]
      );
      jQuery("#displayInJson").val(JSON.stringify(XL_row_object));
      global_array_json = JSON.parse(JSON.stringify(XL_row_object));
      global_row = global_array_json.length;
    });
  };

  reader.onerror = (e) => console.log(e);

  reader.readAsBinaryString(file);
};

$("#form").submit(function (e) {
  e.preventDefault();
  global_insert_sql_prefix = $("#receiveInput").val();
  generateSql();
  $("#displayOutput").val(global_generated_sql);
});

generateSql = () => {
  global_array_json.forEach((item) => {
    var text = global_insert_sql_prefix + " (";
    var objLength = Object.keys(item).length;
    for (let i = 0; i < objLength; i++) {
      text = text + Object.values(item)[i];
      if (i != objLength - 1) text = text + ", ";
    }
    text = text + " )" + "\n";
    global_generated_sql = global_generated_sql + text;
  });
};
