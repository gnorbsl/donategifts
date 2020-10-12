// im not sure if this is the cleanest way to append dynamic data to modal
// when modal is called, check what button called it and extract info like url and child name from it
$('#wishCardDonateModal').on('show.bs.modal', function (event) {
    // get reference to button that opened the modal
    let button = $(event.relatedTarget);
    // extract values from button that contain child name / amazonlink
    let amazonUrl = button[0].dataset.valueUrl;
    let childName = button[0].dataset.valueName;
    let wishCardId = button[0].dataset.valueWishcardid;
    let modalWarningMessage = ` Hello, before proceeding we want to make sure that you are certain that you want to donate. 
        Since we can not follow the donation process from Amazon we trust that you will follow the process to the end 
        and buy the selected item for ${childName}. Once you click on the "Donate gift" button you will be redirected to Amazon and we will 
        inform ${childName} that the gift is on its way. If for some reason you are unable to place the order on Amazon but you have clicked 
        on the donate gift button send us an email.
        Thank you very much :)`;
    // get modal reference and replace text
    modal = $(this);
    modal.find('.modal-body').html(modalWarningMessage);
    // set  redirect on a ref element
    let donationRedirect = document.getElementById("redirectAmazonUrl");
    // set a "test id"
    donationRedirect.setAttribute("wishCardId", wishCardId);
    donationRedirect.href = amazonUrl;

});

// reference to donate button inside modal
$('#blabtn').on('click', lockWishCard);

function lockWishCard() {
    // get reference to element and id
    let refA = document.getElementById("redirectAmazonUrl");
    let wishCardId = refA.getAttribute("wishCardId");
    $.ajax({
        type: "POST",
        url:  "/wishcards/lock",
        data: {
            wishCardId,
        },
        success: function(response, textStatus, xhr) {

            console.log(response)

        },
        error: function(response, textStatus, errorThrown) {
           console.log(response)

        }
    });
}
