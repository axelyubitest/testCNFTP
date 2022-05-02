/*
 * @package    CNFPT
* @project      MonCompte
 * @author    <www.cnfpt.fr>
* @copyright  Copyright: (c) 2018 CNFPT
* @license    All right reserved.
*/

/*------------------------------------*\
 COMMON JS
 \*------------------------------------*/
(function ($) {
    $(document).ready(function () {

        $('#navbar-toggler').click(function (e) {
            e.preventDefault();
            $(this).toggleClass('open');

            $('#wrapper').toggleClass('slided');
            $('#sidebar').toggleClass('slided');
        });

        //Scroll to the top of the page
        gotop('.scrolltotop');

        //Auto activate all popovers
        $('[data-toggle="popover"]').popover();

        if ($('#password').length > 0) {
            $('#password').focus(function (e) {
                $('.pwd-alert').show();
            });
        }

        $('input[type="radio"]').prop('indeterminate', true);

        //Contrast
        if(localStorage.getItem('contrast')) {
            $('body').addClass('contrast-active');
        }

        $('#ma-change-contrast').on('click', function (e) {

            if($('body').hasClass('contrast-active')) {
                $('body').removeClass('contrast-active');
                localStorage.removeItem('contrast');

            } else {
                $('body').addClass('contrast-active');
                localStorage.setItem('contrast', 'on');
            }
        });

        //Font resizer
        fontResizer('#inc-font', '#dec-font');

        //Applications menu
        $('.mcc-apps-link').on('click', function(e){
            $(this).parent('.mcc-apps').toggleClass('show');
        });
        $(document).on('click', function (e) {
            if (!$(e.target).hasClass("mcc-apps-link")
                && $(e.target).parents(".mcc-apps").length === 0)
            {
                if($(".mcc-apps").hasClass('show')) {
                    $(".mcc-apps").removeClass('show');
                }
            }
        });

        //Connected user menu
        $('.mc-dropdown-trigger').on('click', function(e){
            $(this).parent('.maa-connected').toggleClass('show');
        });
        $(document).on('click', function (e) {
            if (!$(e.target).hasClass("mcc-apps-link")
                && $(e.target).parents(".maa-connected").length === 0)
            {
                if($(".maa-connected").hasClass('show')) {
                    $(".maa-connected").removeClass('show');
                }
            }
        });

        //Accordion elements
        $('.mcc-accordion').ctaccordion();

        //Add the filename on upload
        $('.custom-file-input').on('change',function(){
            var fileName = $(this).val().replace(/\\/g, '/').replace(/.*\//, '');
            $(".custom-file-label").text(fileName);
        });
    });
}(jQuery));