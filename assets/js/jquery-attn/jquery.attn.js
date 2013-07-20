
/* ==================================================================
 * jquery-attn.js v.0.1.1
 * http://bezhermoso.github.io/jquery-attn/
 *===================================================================
 * Copyright 2013 Bezalel Hermoso
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * 
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function($){
    
    $.attn = {};
    
    $.attn.defaults = {
        container: '#attn-container',
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
        target: null,
        classes: '',
        onClose: $.noop,
        onLoad: $.noop,
        fade: null,
        onBeforeClose: $.noop,
        onAfterClose: $.noop,
        commonClass: 'alert',
        closeBtn: '<a class="close">&times;</a>'
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
            
            $(this.element).bind('attn.clear', function(){
                attnContainer.children().each(function(event){
                    $(this).trigger('attn.dismiss');
                });
            });
        }
        
        this.clear = function(){
            return $(this.element).trigger('attn.clear');
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
            itemElem.prependTo(this.options.container);
            var event = jQuery.Event('attn.show');
            itemElem.trigger(event);
            itemElem.data('attnItem', item);
            this._bindItemEvents(itemElem);
            return item;
        }
        
        this._bindItemEvents = function(item){
            var self = this;
            $(item).bind('attn.dismiss', function(event){
                var elem = this;
                var attnItem = $(elem).data('attnItem');
                attnItem.dismiss(event);
            }).bind('attn.remove', function(event){
                var attnItem = $(this).data('attnItem');
                attnItem.remove(event);
            });
        }
        
        this._init(options);
    }
    
    var AttnItem = function(attn, options){
        
        this.options = options;
        this.element = null;
        this.attn = attn;
        this.content = null;
        
        this.toHtmlElement = function(){
            
            var elem = $('<li />');
            this.element = elem;
            
            elem.addClass(this.options.classes + ' ' + this.options.commonClass);
            
            var content = this.options.message;
            
            if($.trim(this.options.target)){
                content = $(this.options.target).clone(true);
                this.content = content;
            }
            
            elem.html(content);
            
            if(this.options.closeBtn){
                var closeBtn = $(this.options.closeBtn);
                closeBtn.prependTo(elem);
                closeBtn.click(function(){
                    $(elem).trigger('attn.dismiss');
                })
            }
            
            if(this.options.fade != null && typeof this.options.fade == 'number'){
                var self = this;
                setTimeout(function(){
                    self.element.trigger('attn.dismiss');
                }, this.options.fade)
            }
            return elem;
        };
        
        this.dismiss = function(event){
           
            event = event ? event : jQuery.Event('attn.dismiss');
            var self = this;
            this.options.onBeforeClose.apply(this, [event]);
            
            if(!event.isDefaultPrevented()){
                
                //if(this.content)
                  //  $(this.content).trigger(event);
                
                $(this.element).fadeOut('fast', function(){
                    self.remove();
                    self.options.onAfterClose.apply(self, [event]);
                });
            }
        };
        
        this.remove = function(event){
            event = event ? event : jQuery.Event('attn.remove');
            //if(this.content)
              //      $(this.content).trigger(event);
            $(this.element).remove();
        }
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