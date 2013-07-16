
(function($){
    
    $.attn = {};
    
    $.attn.defaults = {
        container: '#attn-container',
        closeBtn: '<a class="close">&times;</a>',
        itemTypes: {
            success: {
                classes: 'alert-success'
            },
            error: {
                classes: 'alert-error'
            },
            info: {
                classes: 'alert-info'
            },
            warning: {
                classes: 'alert-warning'
            }
        }
    };
    
    $.attn.itemDefaults = {
        message: '',
        classes: '',
        onClose: $.noop,
        onLoad: $.noop,
        fade: null,
        
        commonClass: 'alert'
    };
    
    var Attn = function(element, options)
    {
        this.element = element;
        
        this.options = {};
        
        this.items = [];
        
        this._init = function(options){
            
            this.options = 
                        $.extend(
                            {}, 
                            $.attn.defaults, 
                            options, 
                            true
                        );
                            
            var attnContainer = $(this.options.container, this.element);
            
            if(attnContainer.length == 0){                
                attnContainer = $('<ul />');
                this.options.container = attnContainer;
                attnContainer.prependTo(this.element);
            }
            var self = this;
            $.each(this.options.itemTypes, function(i, itemOptions){
                
                itemOptions = $.extend({}, $.attn.itemDefaults, itemOptions, true);
                self.options.itemTypes[i] = itemOptions;
            });
            
            attnContainer.addClass('attn-container');
        }
        
        this.isValidItemType = function(type){
            
            var isValid = false;
            
            $.each(this.options.itemTypes, function(itemType, itemOptions){
                isValid = isValid || type == itemType;
            });
            
            return isValid;
        }
        
        this.getItemTypeOptions = function(itemType, options){
            
            options.type = itemType;
            
            if(this.options.itemTypes[itemType] != undefined){
                
                var itemOptions = this.options.itemTypes[itemType];
                
                if(options != undefined){
                    return $.extend({}, itemOptions, options, true);
                }else{
                    return $.extend({}, itemOptions, true);
                }
                
            }else{
                $.error('"' + itemType + '" is not a recognized item type.');
                return false;
            }
            
        };
        
        this.addItemFacade = function(itemType, args){
            
            var item;
            
            if(args.length > 0){
                
                       var fade = null;
                       var onClose = null;
                       var message = null;
                       var tmpOptions = {};
                       
                       $.each(args, function(i, arg){
                           
                           switch(typeof arg){
                               case "number":
                                   fade = arg;
                                   break;
                               case "function":
                                   onClose = arg;
                                   break;
                               case "string":
                                   message = arg;
                                   break;
                               case "object":
                                   tmpOptions = arg;
                           }
                       });
                       
                       if(fade !== null) tmpOptions.fade = fade;
                       if(onClose !== null) tmpOptions.onClose = onClose;
                       if(message !== null) tmpOptions.message = message;
                       
                       var options = this.getItemTypeOptions(itemType, tmpOptions);
                       
                       item = new AttnItem(this, options);
                       
            }
            
            if(item){
                return this.addItem(item);
            }else{
                return this;
            }
            
        }
        
        this.addItem = function(item){
            var itemElem = item.toHtmlElement();
            itemElem.appendTo(this.options.container);
            itemElem.data('attnItem', item);
            this._bindItemEvents(itemElem);
            
            return item;
        }
        
        this._bindItemEvents = function(item){
            
            $(item).bind('attn.close', function(){
                var elem = this;
                $(elem).fadeOut('fast', function(){
                    $(this).remove();
                });
            });
            
        }
        
        this._init(options);
    }
    
    var AttnItem = function(attn, options){
        
        this.options = options;
        this.element = null;
        this.attn = attn;
        
        this.toHtmlElement = function(){
            var elem = $('<li />');
            this.element = elem;
            
            elem.addClass(this.options.classes + ' ' + this.options.commonClass);
            elem.html(this.options.message);
            if(this.attn.options.closeBtn){
                var closeBtn = $(this.attn.options.closeBtn);
                closeBtn.prependTo(elem);
                closeBtn.click(function(){
                    $(elem).trigger('attn.close');
                })
            }
            
            if(this.options.fade != null && typeof this.options.fade == 'number'){
                var self = this;
                setTimeout(function(){
                    self.element.trigger('attn.close');
                }, this.options.fade)
            }
            return elem;
        };
    };
    
    
    var methods = {
        
    };
    
    $.fn.attn = function(method){
        
        var elem = this;
        
        if(typeof method == 'object'){
            
            var attn = new Attn(elem, method);
            $(elem).data('attnObject', attn);
            return elem;
            
        }else if(typeof method == 'string'){
            
            var attn = $(elem).data('attnObject');
            
            if(attn != null){
                if(attn[method] != undefined){
                   if(typeof attn[method] == 'function'){
                        
                        return attn[method]
                                .apply(
                                    attn, 
                                    Array.prototype.slice.call(arguments, 1)
                                );
                    }
                }else if(attn.isValidItemType(method)){
                    
                    return attn.addItemFacade
                            .call(
                                attn,
                                method,
                                Array.prototype.slice.call(arguments, 1)
                            );
                    
                } else {
                    $.error('Method "' 
                            + method 
                            + '" does not exist in $.attn.');
                }
            }else{
                $.error('$.attn plugin is not yet initialized for this element.');
            }
        }
    };
    
})(jQuery);