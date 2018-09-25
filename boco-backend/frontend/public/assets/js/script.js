$(document).on("click", ".nav-item", function() {
	var tab_id = $(this).find('a').attr('data-tab');

	$('ul.tabs li a').removeClass('active');
	$('.tab-content').removeClass('current');

	$(this).find('a').addClass('active');
	$("#"+tab_id).addClass('current');
});


$(".pageScollTop").click(function() {
	$("html, body").animate({ scrollTop: 0 }, "slow");
	return false;
});

var options = {
	data: [
		"Customer #001", 
		"Customer #002",
		"Customer #003",
		"Customer #004",
		"Customer #005"
	]
};

window.showLoader = function() {
	$('#mainDiv').loading();
}

window.hideLoader = function() {
	$('#mainDiv').loading('stop');
}