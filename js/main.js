let apiKey = 'BO-J2r00CO127H9qmxLOiZroCwjr3oH_';

$(document).ready(function(){
	$('#addEventForm').on('submit',function(e){
		let event = {
			name: $('#name').val(),
			date: $('#date').val(),
			location: $('#location').val(),
			type: $('#type').val(),
			description: $('#description').val(),
		}

		//create Event
		createEvent(event);

		e.preventDefault();
	});
});

//before Events Page load
$(document).on('pagebeforeshow','#events',function(){
	getEvents();
});

//before Details Page load
$(document).on('pagebeforeshow','#details',function(){
	getEventDetails();
});

//Delete Event
$(document).on('tap','.delete',function(){
	let eventId = $(this).data('id');
	deleteEvent(eventId);
});

function createEvent(event){
	axios.post('https://api.mlab.com/api/1/databases/eventmobile/collections/events?apiKey='+apiKey,{
		name:event.name,
		date:event.date,
		location:event.location,
		type:event.type,
		description:event.description
	})
	.then(function(response){
		$('name').val('');
		$('date').val('');
		$('location').val('');
		$('type').val('');
		$('description').val('');
		$.mobile.changePage('#events');
	})
	.catch(function(error){
		console.log(error);
	});
}



function getEvents(){
	axios.get('https://api.mlab.com/api/1/databases/eventmobile/collections/events?apiKey='+apiKey)
	.then(function(response){
		let events = response.data;
		let output = '';
		$.each(events,function(index, event){
			output += `
				<li>
					<a onclick="eventClicked('${event._id.$oid}')" href="#">
						<h2>${event.name}</h2>
					</a>
					<a href="#" data-id="${event._id.$oid}" class="delete">
						Delete
					</a>
				</li>
			`;
		});
		$('#eventList').html(output).listview('refresh');
	})
	.catch(function(error){
		console.log(error);
	});
}


function eventClicked(eventId){
	sessionStorage.setItem('eventId',eventId);
	$.mobile.changePage('#details');
}


function getEventDetails(){
	let eventId = sessionStorage.getItem('eventId');

	axios.get('https://api.mlab.com/api/1/databases/eventmobile/collections/events/'+eventId+'?apiKey='+apiKey)
	.then(function(response){
		let event = response.data;
		
		let output = `
			<h3>[${event.type}] ${event.name}</h3>
			<p>Date: ${event.date}</p>
			<p>Location: ${event.location}</p>
			<p>${event.description}</p>
		`;

		$('#eventDetails').html(output);
	})
	.catch(function(error){
		console.log(error);
	});
}


function deleteEvent(eventId){
	axios.delete('https://api.mlab.com/api/1/databases/eventmobile/collections/events/'+eventId+'?apiKey='+apiKey)
	.then(function(response){
		getEvents();
	})
	.catch(function(error){
		console.log(error);
	});
}





