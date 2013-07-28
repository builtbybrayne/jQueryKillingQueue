jQueryKillingQueue
==================

JQuery KillingQueue allows you to request callbacks which will optionally wait or be discarded if another callback is already in progress.

This is particularly useful when 

* there are state transition functions which take time to run (e.g. animations)
* and the user may still be able to click (and therefore request some UI behaviour) during that transition
* and you either want to delay that requested behaviour until the transition is complete
* or you just want to throw away the new request if it arrives during the transition
  
# Usage
	var kq = new KillingQueue();
	ks.request(callback,queue);
	
<code>callback</code> is the function you (may or may not) want to run right now.
<code>queue</code> If true the function will be added to a queue of callbacks waiting for the previous functions to complete. (NB: *all* previous functions must complete before this one will run). If False the function will be ignored if the queue is currently in the middle of previous callback

# Example

e.g. You have a UI animation which you want to run and it takes a second or two to complete. You want to request another animation, but the previous animation may (or may not) still be doing its thing. In some cases you want to drop the second requested animation and in other cases you want to wait and run it when the first animation is complete. KillingQueue allows you to choose. 

    var kq = new KillingQueue();

	// This function will run
	// It will occupy the queue for the 2 seconds of its duration
    kq.request(function(){
        $("#animateA").animate({...}},2000));
    });
    
    // This function will run when animateA is complete
    kq.request(function(){
        $("#animateB").animate({...})
    },true);
    
    // This function will never run as it follows too quickly on to animateA and animateB
    kq.request(function(){
        $("#animateC").animate({...})
    });

In this example the animation for A will of run immediately. animateB and animateC are obviously called well before animateA is finished, and do not use any promises/deferreds or callbacks. animateB waits until animateA is complete and then also runs. animateC is dropped and never runs.

# Callbacks 

The callback passed in as the first argument should return a promise. If it does not, then KillingQueue cannot tell when the function completes, so assumes the function completes immediately. 
 
The upshot is that any queued callbacks are then also called immediately. Droppeable callbacks are also more likely to be called as there is a smaller window of time the queue during which the queue is active.

# JQuery
This plugin relies on jQuery's Deferreds to work. It is however not a true jquery plugin as it does not extend jquery.

# Development
This plugin is very simple and only does what I needed it to. There are any number of improvements which it could obviously do with.

I am not actively developing this code. By and large I probably won't implement complicated requests for modifications myself - it's not that complciated a plugin to hack, really! If requests for modifications are simple enough to do I may well just do them. I am also happy to accept pull requests and I encourage forks. 