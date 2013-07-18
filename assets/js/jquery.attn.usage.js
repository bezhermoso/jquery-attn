
jQuery(function($){
    
    $('body').attn({});
    
    $('body').attn('success', 'Success message');
    $('body').attn('error', 'Error message - Will fade out in 3 seconds', 3000);
    $('body').attn('warning', 'Warning message - Will fade out in 5 seconds.', {
        fade: 5000
    });
    $('body').attn('info', {
        message: 'Info message - will fade out in 7 seconds',
        fade: 7000
    });
    
    $('body').attn('warning', {
        message: 'See what happens when you close me.',
        onClose: function(){
            alert('Tada! This is kind of lame. But you can actually do whatever you want here!');
        }
    });
});

