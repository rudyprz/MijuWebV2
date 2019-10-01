function hide(target) {
  document.getElementById(target).style.display = 'none';
}

function redireccionar(url){
	location.href = url; 
}

function goBack() {
	window.history.back();
}

// TOAST
function closeToast(){
	M.Toast.dismissAll();
}

function errorToast(msg){
	M.toast({
		html: msg, 
		classes: 'rounded red',
		displayLength: Infinity
	});
}

function successToast(msg){
	M.toast({
		html: msg, 
		classes: 'rounded green',
		displayLength: 5000
	});
}

function infoToast(msg){
	M.toast({
		html: msg, 
		classes: 'rounded blue',
		displayLength: Infinity
	});
}

function neutroToast(msg){
	M.toast({
		html: msg, 
		classes: 'rounded',
		displayLength: Infinity
	});
}

function loadingToast(msg){

	var toastHTML = `
		<span>
			${msg}
		</span>
		<div class="preloader-wrapper active toastloader">
			<div class="spinner-layer colortoastloader">
			<div class="circle-clipper left">
				<div class="circle"></div>
			</div><div class="gap-patch">
				<div class="circle"></div>
			</div><div class="circle-clipper right">
				<div class="circle"></div>
			</div>
			</div>
		</div>
	`;
	M.toast({
		html: toastHTML, 
		classes: 'rounded blue',
		displayLength: Infinity
	});
}

function validateHour(startField, closureField, day){
	if((startField != "" && closureField == "") || (startField == "" && closureField != "")){
		closeToast();
		var msg = "Llena los dos horarios del " + day;
		errorToast(msg);
		return false;
	}
	else return true;
}

function isNotEmail(field,field_id,msg){
	if(field == ""){
		closeToast();
		errorToast(msg);
		document.getElementById(field_id).focus();
		return true;
	}
	else return false;
}

function isNotFilled(field,field_id,msg){
	if(field == ""){
		closeToast();
		errorToast(msg);
		document.getElementById(field_id).focus();
		return true;
	}
	else return false;
}

function isUndefined(field,field_id,msg){
	if(field == undefined){
		closeToast();
		errorToast(msg);
		document.getElementById(field_id).focus();
		return true;
	}
	else return false;
}

function isNull(field,field_id,msg){
	if(field == undefined){
		closeToast();
		errorToast(msg);
		document.getElementById(field_id).focus();
		return true;
	}
	else return false;
}