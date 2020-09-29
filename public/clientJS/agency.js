$(document).ready(function () {
  $(".signup-agency").submit(function (e) {
    e.preventDefault();

    var agencyName = $("#agencyName").val();
    var agencyWebsite = $("#agencyWebsite").val();
    var agencyPhone = $("#agencyPhone").val();
    var agencyBio = $("#agencyBio").val();

    $.ajax({
      type: "POST",
      url: "/agency",
      data: {
        agencyName,
        agencyWebsite,
        agencyPhone,
        agencyBio,
      },
      statusCode: {
        409: function (responseObject, textStatus, jqXHR) {
          alert(responseObject.responseText);
        },
        200: function (responseObject, textStatus, errorThrown) {
          location.replace(responseObject);
        },
      },
    });
  });
});
