var long, lat;
if (!localStorage.getItem("lastSearched")) {
    var lastSearched = "";
    getSimple("Dallas");

}
else {
    var lastSearched = localStorage.getItem("lastSearched");
    getSimple(lastSearched);

}

$(document).ready(function () {


    var search = $("#search").click(function () {
        var city = $("#city").val();
        localStorage.setItem("lastSearched", city);
        $("#city").val("");
        getSimple(city);
        $(".search-history").append(/*html*/ `
                    <div class="searched rounded">
                        <h5 class="searched-city" data-city="${city}">${city}</h5>
                    </div>
                `)

    });

    $(".search-history").on("click", ".searched-city", function () {
        var city = $(this).text();
        getSimple(city);
    });


})

function getSimple(city) {

    $(".city-name").text(city);


    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=83cf1afe0f238ef94012fade4104df84"

    $.ajax({
        method: "GET",
        url: queryURL
    }).then(function (response1) {
        $("#temp").text(Math.round(response1.main.temp));
        $("#humid").text(response1.main.humidity);
        $("#wind").text(response1.wind.speed);
        long = response1.coord.lon;
        lat = response1.coord.lat;
        getAdvanced(response1);

    })


}

function getAdvanced(response1) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response1.coord.lat + "&lon=" + response1.coord.lon + "&units=imperial&exclude=current,minutely,hourly,alerts&appid=83cf1afe0f238ef94012fade4104df84"

    $.ajax({
        method: "GET",
        url: queryURL,
    }).then(function (response) {
        var uv = response.daily[0].uvi;
        var $uv = $("#uv");
        $(".date").text(moment.unix(response.daily[0].dt).format("(M/DD/YYYY)"))
        $uv.text(uv);

        if (uv <= 2) {
            $uv.addClass("low")
        }
        else if (uv > 2 && uv <= 5) {
            $uv.addClass("moderate")
        }
        else if (uv > 5 && uv <= 7) {
            $uv.addClass("high")
        }
        else if (uv > 7 && uv <= 10) {
            $uv.addClass("very-high")
        }
        else {
            $uv.addClass("extreme")
        }

        $(".card-container").empty();
        for (var i = 1; i <= 5; i++) {
            var icon = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png"
            $(".card-container").append(/*html*/
                `<div class="fore-card rounded">
                            <h4 class="fore-date">${moment.unix(response.daily[i].dt).format("MM/DD/YYYY")}</h4>
                            <img src="${icon}">
                            <p>Temp: <span id="fore-tmp-1">${Math.round(response.daily[i].temp.day)}&degF</span></p>
                            <p>Humidity: <span id="fore-tmp-1">${response.daily[i].humidity}%</span></p>
                        </div>`
            )
        }

    })
}
