$.ajax({
    url: "./xml/geography.xml",
    dataType: "xml"
}).done((data) => {
    geography_data = data;
    // console.log(geography_data);
    // let climate = "jungle";

    // let data_set;

    // $(geography_data).find("item").each((index, element) => {
    //     // console.log(element.children[1].textContent);
    //     // console.log(this);

    //     console.log($(element).find("name"));


    //     // if (element.name == climate) data_set = element;
    // })
    // console.log(data_set);


}).fail(() => {
    console.error("ajax failed on preload");
});

$.ajax({
    url: "./xml/legendary_items.xml",
    dataType: "xml"
}).done((data) => {
    legendary_items = data;
    // console.log(legendary_items);
    // $(legendary_items).find("item").each((index, element) => {
    //     console.log(element, index);

    //     $(element).find("related_ethics").find("ethic").each((ind, ele) => {
    //         console.log(ele, ind);
    //         // return false;
    //     })
    // })

}).fail(() => {
    console.error("ajax failed on preload");
});