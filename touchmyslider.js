/*
 * Touch My Slider - https://github.com/davesters81/TouchMySlider
 * Create touch slide-able panels not unlike the iPhone or Android launchers
 *
 * @author David Corona - http://www.lovesmesomecode.com
 * @version 0.1
 *
 * For right now, this plugin in dependent upon ZeptoJS, HammerJS and iScroll to work
 *
 The Unlicense:
 This is free and unencumbered software released into the public domain.

 Anyone is free to copy, modify, publish, use, compile, sell, or
 distribute this software, either in source code form or as a compiled
 binary, for any purpose, commercial or non-commercial, and by any
 means.

 In jurisdictions that recognize copyright laws, the author or authors
 of this software dedicate any and all copyright interest in the
 software to the public domain. We make this dedication for the benefit
 of the public at large and to the detriment of our heirs and
 successors. We intend this dedication to be an overt act of
 relinquishment in perpetuity of all present and future rights to this
 software under copyright law.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

 For more information, please refer to <http://unlicense.org/>
 */

(function($) {

    var methods = {
        init: function(options) {
            return this.each(function() {
                var el = this;
                var nav_id = $(el).attr('id') + '_nav';
                var navbar_id = $(el).attr('id') + '_navbar';

                var dragging = false;
                var drag_ended = false;
                var dont_click = false;
                var org_drag_pos = 0;
                var last_drag_pos = 0;
                var settings;
                var drag_min = 0;
                var active_panel;
                var vertScrollers = [];

                settings = $.extend({
                    width : $(el).width(),
                    dragMin: 0.25,
                    recoverSpeed: 500,
                    navContainer: 'parent',
                    onItemClick: null,
                    startingPanel: 0,
                    navType: 'bullets', // options: bullets, navbar, both, none
                    scrollVert: false,
                    contentHeight: $(el).height(),
                    navbarWidthPercentage: 0.5
                }, options);


                $(el).find('.panel').each(function() {
                    $(this).css({ width: settings.width, height: settings.contentHeight });
                    if (settings.scrollVert) {
                        vertScrollers.push(new iScroll(this, {
                            vScroll: true,
                            vScrollbar: true,
                            hScroll: false,
                            hScrollbar: false,
                            lockDirection: true
                        }));
                    }
                });
                $(el).css({ width: $(el).children().length * settings.width });

                if (settings.navType == 'bullets' || settings.navType == 'both') {
                    if (settings.navContainer != 'parent') {
                        $(settings.navContainer).append('<div id="' + nav_id + '" class="slider_nav"></div>');
                    } else {
                        $(el).parent().append('<div id="' + nav_id + '" class="slider_nav"></div>');
                    }
                    $(el).find('.panel').each(function(index) {
                        $('#' + nav_id).append('<div class="bullet"></div>');
                    });
                    $('#' + nav_id).css({ width: $('#' + nav_id).find('.bullet').length * 20, left: settings.width / 2, marginLeft: -(($('#' + nav_id).find('.bullet').length * 20) / 2) });
                }
                if (settings.navType == 'navbar' || settings.navType == 'both') {
                    if (settings.navContainer != 'parent') {
                        $(settings.navContainer).append('<div class="navbar_container"><div id="' + navbar_id + '" class="slider_navbar"></div></div>');
                    } else {
                        $(el).parent().append('<div class="navbar_container"><div id="' + navbar_id + '" class="slider_navbar"></div></div>');
                    }
                    $(el).find('.panel').each(function(index) {
                        $('#' + navbar_id).append('<a class="label" href="javascript://" data-id="' + index + '" style="width: ' + (settings.width * settings.navbarWidthPercentage).toString() + 'px">' + $(this).attr('data-nav-name') + '</a>');
                    });
                    $('#' + navbar_id + ' .label').hammer({ prevent_default: true }).bind('tap', function(evt) {
                        go_to_slide($(this).attr('data-id'));
                    });
                }

                $(el).hammer({
                    prevent_default: true
                })
                    .bind('dragstart', on_slider_drag_start)
                    .bind('drag', on_slider_drag)
                    .bind('dragend', on_slider_drag_end);

                var panelLeft = 0 - (settings.startingPanel * settings.width);
                $(el).css({ transform: 'translate3d(' + panelLeft + 'px, 0px, 0px)', '-webkit-transform': 'translate3d(' + panelLeft + 'px, 0px, 0px)' });
                if (settings.navType == 'bullets' || settings.navType == 'both') $('#' + nav_id).find('.bullet').eq(settings.startingPanel).addClass('active');
                if (settings.navType == 'navbar' || settings.navType == 'both') {
                    $('#' + navbar_id).find('.label').eq(settings.startingPanel).addClass('active');
                    var navbarleft = (settings.width / 2) - ((settings.startingPanel * (settings.width * settings.navbarWidthPercentage)) + ((settings.width * settings.navbarWidthPercentage) / 2));
                    $('#' + navbar_id).css({ transform: 'translate3d(' + navbarleft + 'px, 0px, 0px)', '-webkit-transform': 'translate3d(' + navbarleft + 'px, 0px, 0px)'   });
                }

                active_panel = $(el).children().eq(settings.startingPanel).addClass('active');

                $(el).find('.link').hammer({ prevent_default: true }).bind('tap', function(evt) {
                    if (dont_click) {
                        evt.preventDefault();
                        return false;
                    }
                    settings.onItemClick($(this).attr('data-id'));
                });

                drag_min = settings.width * settings.dragMin;

                // INTERNAL FUNCTIONS
                function on_slider_drag_start(evt) {
                    if (drag_ended || dragging) return;

                    if (evt.direction == 'left' || evt.direction == 'right') {
                        dragging = true;
                        var curr_index = $(active_panel).index();
                        org_drag_pos = 0 - (curr_index * settings.width);
                    }
                }

                function on_slider_drag(evt) {
                    if (!dragging || drag_ended) return;

                    last_drag_pos = org_drag_pos + evt.distanceX;
                    $(el).css({ transform: 'translate3d(' + last_drag_pos + 'px, 0px, 0px)', '-webkit-transform': 'translate3d(' + last_drag_pos + 'px, 0px, 0px)' });
                }

                function on_slider_drag_end(evt) {
                    if (!dragging || drag_ended) return;
                    drag_ended = true;

                    var dir = "";
                    var drag_diff = 0;

                    if ((evt.direction == 'left' || evt.direction == 'right') && last_drag_pos < org_drag_pos) {
                        drag_diff = org_drag_pos - last_drag_pos;
                        dir = "right";
                    } else if ((evt.direction == 'left' || evt.direction == 'right') && last_drag_pos > org_drag_pos) {
                        drag_diff = last_drag_pos - org_drag_pos;
                        dir = "left";
                    }
                    change_panel(dir, drag_diff, last_drag_pos);
                    org_drag_pos = 0;
                }

                function change_panel(dir, drag_diff, end_drag_pos) {
                    var curr_index = $(active_panel).index();
                    var new_index = 0;
                    var panel_count = $(el).find('.panel').length - 1;
                    var speed = settings.recoverSpeed;

                    if (dir == "left" && curr_index > 0 && Math.abs(drag_diff) >= drag_min) {
                        new_index = curr_index - 1;
                    } else if (dir == "right" && curr_index < panel_count && Math.abs(drag_diff) >= drag_min) {
                        new_index = curr_index + 1;
                    } else {
                        new_index = curr_index;
                    }

                    if (curr_index != new_index) {
                        speed = speed - (speed * (drag_diff / speed));
                        $(active_panel).removeClass('active');
                        active_panel = $(el).find('.panel').eq(new_index).addClass('active');
                        update_nav(new_index);
                    }
                    var newpos = 0 - (new_index * settings.width);

                    if (newpos == end_drag_pos) {
                        dragging = false;
                        drag_ended = false;
                        dont_click = false;
                    } else {
                        var panelLeft = 0 - (new_index * settings.width);
                        $(el).animate({ transform: 'translate3d(' + panelLeft + 'px, 0px, 0px)', '-webkit-transform': 'translate3d(' + panelLeft + 'px, 0px, 0px)' }, speed, 'swing', function() {
                            dragging = false;
                            drag_ended = false;
                            dont_click = false;
                        });
                    }
                }

                function go_to_slide(id) {
                    if ($(active_panel).index() == id) return;

                    $(active_panel).removeClass('active');
                    active_panel = $(el).find('.panel').eq(id).addClass('active');
                    update_nav(id);
                    var newpos = 0 - (id * settings.width);

                    $(el).animate({ transform: 'translate3d(' + newpos + 'px, 0px, 0px)', '-webkit-transform': 'translate3d(' + newpos + 'px, 0px, 0px)' }, (settings.recoverSpeed / 2), 'swing');
                }

                function update_nav(id) {
                    if (settings.navType == 'bullets' || settings.navType == 'both') {
                        $('#' + nav_id).find('.bullet').removeClass('active');
                        $('#' + nav_id).find('.bullet').eq(id).addClass('active');
                    }
                    if (settings.navType == 'navbar' || settings.navType == 'both') {
                        $('#' + navbar_id).find('.label').removeClass('active');
                        var navbarpos = (settings.width / 2) - ((id * (settings.width * settings.navbarWidthPercentage)) + ((settings.width * settings.navbarWidthPercentage) / 2));
                        $('#' + navbar_id).animate({ transform: 'translate3d(' + navbarpos + 'px, 0px, 0px)', '-webkit-transform': 'translate3d(' + navbarpos + 'px, 0px, 0px)' }, (settings.recoverSpeed / 2), 'swing', function() {
                            $('#' + navbar_id).find('.label').eq(id).addClass('active');
                        });
                    }
                }
            });
        },

        dispose: function() {
            return this.each(function() {
                var nav_id = $(this).attr('id') + '_nav';
                var navbar_id = $(this).attr('id') + '_navbar';

                if ($('#' + nav_id).length > 0) $('#' + nav_id).remove();
                if ($('#' + navbar_id).length > 0) {
                    $('#' + navbar_id + ' .label').off();
                    $('#' + navbar_id).parent().remove();
                }
                $(this).find('.link').off();
                $(this).off();
            });
        }
    }

    $.fn.touchMySlider = function(method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        }
    }

})(Zepto)