
jQuery(function($){
    
    $('body').attn({});
    
    $('body').attn('error', 'Error message - Will fade out in 3 seconds', 3000);
    $('body').attn('success', {
        message: 'Success message'
    });
    $('body').attn('warning', 'Warning message - Will fade out in 5 seconds.', {
        fade: 5000
    });
    $('body').attn('info', 'Info message - Will fade in 7 seconds', 7000);
    
});

