
jQuery(function($){
    
    $('body').attn({
        container: '#attn-container'
    });
    
    $('body').attn('success', '<strong>Welcome, stranger!</strong>');
    
    $('#show-error-message').click(function(){
        $('body').attn('error', '<strong>Access unauthorized!</strong>');
    });
    
    $('#show-warning-message').click(function(){
        $('body').attn('warning', '<strong>Caution:</strong> wet floor.');
    });
    
    $('#show-info-message').click(function(){
        $('body').attn('info', 'An email has been sent to your email address.');
    });
    
//    
//    $('body').attn('success', 'Success message');
//    $('body').attn('error', 'Error message - Will fade out in 3 seconds', 3000);
//    $('body').attn('warning', 'Warning message - Will fade out in 5 seconds.', {
//        fade: 5000
//    });
//    $('body').attn('info', {
//        message: 'Info message - will fade out in 7 seconds',
//        fade: 7000
//    });
//    
//    $('body').attn('warning', {
//        message: 'See what happens when you close me.',
//        onBeforeClose: function(event){
//            var prompt = confirm('Tada! This is kind of lame. But you can actually do whatever you want here!\n\nPress OK to continue removal of attention item. Click Cancel to skip.');
//            if(!prompt){
//                event.preventDefault();
//            }
//        },
//        onAfterClose: function(){
//            $('body').attn('clear');
//            $('body').attn('success', '<strong><em>Alors, au revoir!</em></strong>');
//        }
//    });
//    
//    var forgotPassItem = $('body').attn('error', {
//        target: '#forgot-password-feedback',
//        classes: 'alert-error alert-block'
//    });
//    
//    $('#forgot-password-feedback button').click(function(){
//        forgotPassItem.dismiss();
//        $('body').attn('success', 'A password reset link was sent to your email address.');
//    });
    
});

