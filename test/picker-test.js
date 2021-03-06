/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/picker-markup.html!strip');

	require('bootstrap');
	require('fuelux/picker');

	module('Fuel UX Picker');

	test('should be defined on jquery object', function () {
		ok($().find('#picker1').picker(), 'picker method is defined');
	});

	test('should return element', function () {
		var $picker = $(html).find('#picker1');
		ok($picker.picker() === $picker, 'picker should be initialized');
	});

	test('should show and hide as expected - input', function(assert){
		var $picker = $(html).find('#picker1');

		$('body').append($picker);
		$picker.picker();

		var cancelledDone = assert.async();
		var allDone = assert.async();

		var $textInputTrigger = $($picker.find('.picker-trigger')[0]);
		var $otherTrigger = $($picker.find('.picker-trigger')[1]);
		$textInputTrigger.focus().focus();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');

		$picker.one('exited.fu.picker', function(e, helpers){
			ok(1===1, 'default action event (exited) triggered upon external click');
			cancelledDone();
		});

		$('body').click();

		equal($picker.hasClass('showing'), false, 'picker hides when appropriate');

		$textInputTrigger.click();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');

		$textInputTrigger.click();
		equal($picker.hasClass('showing'), true, 'picker continues showing when text input clicked and picker is already showing');

		$otherTrigger.click();
		equal($picker.hasClass('showing'), false, 'picker hides when non-text input clicked and picker is already showing');

		$picker.remove();
		allDone();
	});

	test('should behave as expected - button', function(assert){
		var $picker = $(html).find('#picker2');
		$('body').append($picker);
		$picker.picker();

		var cancelledDone = assert.async();
		var allDone = assert.async();
		$picker.one('exited.fu.picker', function(e, helpers){
			ok(1===1, 'default action event (exited) triggered upon external click');
			cancelledDone();
		});

		$($picker.find('.picker-trigger')[1]).click();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');

		$('body').click();
		equal($picker.hasClass('showing'), false, 'picker hides when appropriate');
		$picker.remove();

		allDone();
	});

	test('show/hide functions should behave as expected', function(assert){
		var $picker = $(html).find('#picker1');
		$('body').append($picker);
		$picker.picker();

		var shownDone = assert.async();
		var hiddenDone = assert.async();
		var allDone = assert.async();

		$picker.one('shown.fu.picker', function(e){
			ok(1===1, 'shown event triggers on show');
			equal(typeof e, 'object', 'event object passed in shown event');
			shownDone();
		});
		$picker.one('hidden.fu.picker', function(e, helpers){
			ok(1===1, 'hidden event triggers on hide');
			equal(typeof e, 'object', 'event object passed in hidden event');
			hiddenDone();
		});

		$picker.picker('show');
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');

		$picker.picker('hide');
		equal($picker.hasClass('showing'), false, 'picker hides when appropriate');

		allDone();

		$picker.remove();
	});

	test('trigger events should fire as expected', function(assert){
		var $picker = $(html).find('#picker1');

		$('body').append($picker);
		$picker.picker();


		var acceptedDone = assert.async();
		var cancelledDone = assert.async();
		var exitedDone = assert.async();
		var allDone = assert.async();

		$picker.one('accepted.fu.picker', function(e, helpers){
			ok(1===1, 'accept event triggers on accept');
			equal(typeof e, 'object', 'event object passed in accept event');
			equal(typeof helpers, 'object', 'helpers object passed in accept event');
			equal((helpers.contents!==undefined), true, 'helpers object contains correct attributes');
			acceptedDone();
		});
		$picker.one('cancelled.fu.picker', function(e, helpers){
			ok(1===1, 'cancel event triggers on cancel');
			equal(typeof e, 'object', 'event object passed in cancel event');
			equal(typeof helpers, 'object', 'helpers object passed in cancel event');
			equal((helpers.contents!==undefined), true, 'helpers object contains correct attributes');
			cancelledDone();
		});
		$picker.on('exited.fu.picker', function(e, helpers){
			ok(1===1, 'exit event triggers on exit');
			equal(typeof e, 'object', 'event object passed in exit event');
			equal(typeof helpers, 'object', 'helpers object passed in exit event');
			equal((helpers.contents!==undefined), true, 'helpers object contains correct attributes');
			exitedDone();
		});


		$picker.find('.picker-trigger')[0].click();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');
		$picker.find('.picker-cancel').click();
		equal($picker.hasClass('showing'), false, 'picker hides when appropriate');
		$picker.find('.picker-trigger')[0].click();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');
		$picker.find('.picker-accept').click();
		equal($picker.hasClass('showing'), false, 'picker hides when appropriate');
		$picker.find('.picker-trigger')[0].click();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');
		$('body').click();
		equal($picker.hasClass('showing'), false, 'picker hides when appropriate');
		allDone();

		$picker.remove();
	});

	test('onAccept function should be called as expected', function(assert){
		var $picker = $(html).find('#picker1');

		var acceptedDone = assert.async();
		$picker.picker({
			onAccept: function(helpers){
				ok(1===1, 'onAccept function called on accept');
				equal(typeof helpers, 'object', 'helpers object passed to onAccept function');
				equal((helpers.contents!==undefined), true, 'helpers object contains correct attributes');
				$picker.picker('hide');
				acceptedDone();
			}
		});

		$picker.find('.picker-trigger')[0].click();
		$picker.find('.picker-accept').click();
	});

	test('onCancel function should be called as expected', function(assert){
		var $picker = $(html).find('#picker1');

		var cancelledDone = assert.async();
		$picker.picker({
			onCancel: function(helpers){
				ok(1===1, 'onCancel function called on cancel');
				equal(typeof helpers, 'object', 'helpers object passed to onCancel function');
				equal((helpers.contents!==undefined), true, 'helpers object contains correct attributes');
				$picker.picker('hide');
				cancelledDone();
			}
		});

		$picker.find('.picker-trigger')[0].click();
		$picker.find('.picker-cancel').click();
	});

	test('onExit function should be called as expected', function(assert){
		var $picker = $(html).find('#picker1');
		$('body').append($picker);

		var exitedDone = assert.async();
		$picker.picker({
			onExit: function(helpers){
				ok(1===1, 'onExit function called on exit');
				equal(typeof helpers, 'object', 'helpers object passed to onExit function');
				equal((helpers.contents!==undefined), true, 'helpers object contains correct attributes');
				$picker.picker('hide');
				exitedDone();
			}
		});

		$picker.find('.picker-trigger')[0].click();
		$('body').click();
	});

	test('Enter and exit keys should trigger appropriate response', function(assert){
		var $picker = $(html).find('#picker1');
		$('body').append($picker);

		var $input  = $($picker.find('input')[0]);
		var e = $.Event("keydown");

		var acceptedDone = assert.async();
		var exitedDone = assert.async();
		$picker.picker({
			onAccept: function(e){
				ok(1===1, 'onAccept function called when enter keypress');
				acceptedDone();
			},
			onExit: function(){
				ok(1===1, 'onExit function called when exit keypress');
				exitedDone();
			}
		});

		e.keyCode = 13;
		$input.trigger(e);
		e.keyCode = 27;
		$input.trigger(e);

		$picker.remove();
	});


	test('externalClickExceptions option should work as expected', function(){
		var $picker = $(html).find('#picker1');

		$('body').append('<div class=".test"><div class=".innerTest"></div></div><div id="test"></div>');
		$('body').append($picker);
		$picker.picker({
			externalClickExceptions: ['.test', '#test']
		});

		$picker.find('.picker-trigger')[0].click();
		$('#test').click();
		equal($picker.hasClass('showing'), true, 'externalClick ignored for specified id');
		$('.test').click();
		equal($picker.hasClass('showing'), true, 'externalClick ignored for specified class');
		$('.innerTest').click();
		equal($picker.hasClass('showing'), true, 'externalClick ignored for child of specified selector');

		$picker.remove();
		$('.test,#test').remove();
	});

	test('explicit option should work as expected', function(){
		var $picker = $(html).find('#picker1');

		$('body').append($picker);
		$picker.picker({
			explicit: true
		});

		$picker.find('.picker-trigger')[0].click();
		$('body').click();
		equal($picker.hasClass('showing'), true, 'externalClick ignored due to not being an explicit accept/cancel action');
		$picker.find('.picker-accept').click();
		equal($picker.hasClass('showing'), false, 'picker not showing after explicit action');

		$picker.remove();
	});

	test('should disable/enable as expected', function(){
		var $picker = $(html).find('#picker1');
		var $trigger = $picker.find('.picker-trigger');

		$picker.picker('disable');
		equal($picker.hasClass('disabled'), true, 'disabled class properly added to element');
		equal($trigger.attr('disabled'), 'disabled', 'disabled attribute properly added to trigger');

		$picker.picker('enable');
		equal($picker.hasClass('disabled'), false, 'disabled class properly removed from element');
		equal($trigger.attr('disabled'), undefined, 'disabled attribute properly removed from trigger');
	});

	test("should destroy control", function () {
		var $el = $(html).find('#picker1');

		equal(typeof( $el.picker('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});
