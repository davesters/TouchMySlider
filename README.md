TouchMySlider v0.1
=============

Create touch slide-able panels not unlike the iPhone or Android launchers.

This plugin was built for use in a mobile PhoneGap I was developing.  Hopefully someone can get some use out of it.

This plugin is dependent on the following third-party libraries:
[Zepto][1]
[HammerJS][2]
[iScroll Lite][3]

You can probably make this work in jQuery by just changing the wrapper object name to jQuery.

More info here: [http://www.lovesmesomecode.com/mobile/make-fast-mobile-websites-and-phonegap-apps-you-can/][4]

## Use

HTML:

    <div id="details_slider" class="slider">
        <div class="panel" data-nav-name="Panel 1"></div>
        <div class="panel" data-nav-name="Panel 2"></div>
        <div class="panel" data-nav-name="Panel 3"></div>
        <div class="panel" data-nav-name="Panel 4"></div>
    </div>

Javascript:

    $(element).touchMySlider(options);

If you are using this in a single page PhoneGap app, or mobile website, be sure to call this when you are done with it.

    $(element).touchMySlider('dispose');

This will remove all event listeners, clear out variables and destroy any generated html.

## Options

**width** - The width of the panels.  Defaults to the width of the element it was called on.

**dragMin** - Percentage of the panel width the user must drag past for it to change panels.  Defaults to 25%. Anything below this will snap back.

**recoverSpeed** - How fast the panels should transition. The plugin will adjust this speed depending on how far the user has already drug the panel. Defaults to 500 milliseconds.

**navContainer** - The element for the plugin to attach any nav elements to. Defaults to the parent element.

**onItemClick** - An event handler that is called when a link in a panel is clicked that has a class of `link`. Useful for when creating a grid of icons or similar items. It will pass back the value of a `data-id` attribute that you can add to the link element.

**startingPanel** - The panel to start on.  Defaults to 0, or the first panel.

**navType** - The type of navigation indicator to use. The options are either 'bullets', 'navbar' or 'none'.  The bullets are white dots at the bottom of the panels.  Very similar to the iPhone launch screen.  The 'navbar' is a bar that runs across the top of the panels to indicate what panel you are on, and will show a portion of the adjacent panel titles. Attach a `data-nav-name` attribute to the `panel` elements with the title that will show in the navbar.  Default to 'bullets'.

**scrollVert** - True or false to indicate if the plugin should activate a vertical iScroll container in each panel. Handy if your content is long. Defaults to false,

**contentHeight** - The height of the visible panel area. Defaults to the height of the element it was called on.,

**navbarWidthPercentage** - The percentage width of the navbar titles.  This can be tweaked depending on how long your panel titles are so they display properly.  Defaults to 0.5, or 50% the panel width;

Try it out.  Let me know if there are any major bugs. I will be updating this as I use it in more apps. For now, have at it.