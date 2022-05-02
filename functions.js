/*
 * @package    CNFPT
* @project      MonCompte
 * @author    <www.cnfpt.fr>
* @copyright  Copyright: (c) 2018 CNFPT
* @license    All right reserved.
*/

/*------------------------------------*\
 FUNCTIONS JS
 \*------------------------------------*/
/**
 *  Scroll to the top of the page
 * @param trigger
 */
function gotop(trigger) {
    //Check if the trigger id exists in the dom
    if ($(trigger).length > 0) {
        //Scroll to top
        $(trigger).hide();
        $(function () {
            $(window).scroll(function () {

                //Go to top button
                if ($(window).scrollTop() > 100) {
                    $('#masterhead .navbar').addClass('affixed');

                    $(trigger).fadeIn(500);
                    $(trigger).animate({bottom: "33px"}, {
                        queue: false,
                        duration: 100,
                        easing: 'easeInOutBack',
                        complete: function () {
                            $(this).find('i').animate({opacity: 1}, {
                                queue: false,
                                duration: 100,
                                easing: 'easeInOutBack'
                            });
                        }
                    });
                } else {
                    $('#masterhead .navbar').removeClass('affixed');
                    $(trigger).fadeOut(500);

                    $(trigger).animate({bottom: 0}, {
                        queue: false,
                        duration: 100,
                        easing: 'easeInOutBack',
                        complete: function () {
                            $(this).find('i').animate({opacity: 0}, {
                                queue: false,
                                duration: 100,
                                easing: 'easeInOutBack'
                            });
                        }
                    });
                }

            });
            // scroll body to 0px on click
            $(trigger).click(function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 1000, 'easeInOutBack');
                return false;
            });
        });
    }
}

/**
 *  Resize the font size
 * @param incTrigger
 * @param decTrigger
 */
function fontResizer(incTrigger, decTrigger) {

    //grab the current class
    var $currentClass = '';

    var $cssClasses = [
        'access-text-1',
        'access-text-2',
        'access-text-3',
        'access-text-4',
        'access-text-5',
        'access-text-6'
    ];

    //Increase font size
    $(incTrigger).click(function () {
        /*console.log('Increasing...');*/
        fontIncreaser($cssClasses, $currentClass);
    });

    $(decTrigger).click(function () {
        /*console.log('Dereasing...');*/
        fontDecreaser($cssClasses, $currentClass)
    });
}

/**
 *
 * @param $cssClasses
 * @param $currentClass
 */
function fontIncreaser($cssClasses, $currentClass) {

    var index = getCurrentIndex();
    var oldindex = index;
    index++;

    if (index >= $cssClasses.length) {
        index = $cssClasses.length - 1;
    }

    localStorage.setItem('text-size', index);
    //console.log('Index...', index);

    $('body').removeClass('access-text-' + oldindex);
    $('body').addClass('access-text-' + index);

}

/**
 *
 * @param $cssClasses
 * @param $currentClass
 */
function fontDecreaser($cssClasses, $currentClass) {

    var index = getCurrentIndex();
    var oldindex = index;
    index--;

    if (index < 0) {
        index = 0;
    }

    localStorage.setItem('text-size', index);
    //console.log('Index...', index);

    $('body').removeClass('access-text-' + oldindex);
    $('body').addClass('access-text-' + index);
}

function getCurrentIndex() {
    var $currentIndex = localStorage.getItem('text-size');

    if (!$currentIndex) {
        $currentIndex = 0;
    }

    return $currentIndex;
}


$.fn.extend({
    ctaccordion: function () {
        $(this).on('shown.bs.collapse', function (e) {
            var targetSelector = $(e.target).data('bs.collapse')._triggerArray[0];
            // get jquery instance of element
            var $clickedBtn = $(targetSelector);

            // console.log('Elt: ', ele.parent('.card'));
            $clickedBtn.closest('.card').addClass('card-collapsed');
        });

        $(this).on('hide.bs.collapse', function (e) {
            var targetSelector = $(e.target).data('bs.collapse')._triggerArray[0];
            // get jquery instance of element
            var $clickedBtn = $(targetSelector);

            $clickedBtn.closest('.card').removeClass('card-collapsed');
        });
    }
});