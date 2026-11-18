ISIS SANS 101 - phone app notes
================================

The course is now a "progressive web app": the same website, laid out for phones and
tablets, that people can add to their home screen and open without a signal.
Your pages are still ordinary HTML files and you edit them exactly as before.


PUTTING IT ONLINE
-----------------
Upload the whole folder, keeping this layout:

    index.html
    manifest.webmanifest        (new: app name, colours, icons)
    sw.js                       (new: offline copy)
    LICENSE.txt
    icons/                      (new: home-screen icons)
    html_pages/                 (your pages, nav.js, plus new app.css and app.js)
    images/
    videos/                     (not in this zip - keep your existing videos folder)

It must be served from an https:// address. Installing and offline use do not work
from a file opened straight off a disk, or from plain http://.


INSTALLING ON A PHONE
---------------------
iPhone / iPad : open the site in Safari, tap Share, then "Add to Home Screen".
Android       : open the site in Chrome, tap the menu, then "Install app"
                (or "Add to Home screen").
There is also an "Add to home screen" button at the bottom of the Menu on phones.


WHEN YOU EDIT THE COURSE
------------------------
- Changing an existing page: nothing extra to do. Phones fetch the newest page
  whenever they are online.
- Adding or renaming a page:
    1. include the phone block in its <head> (copy it from any other page; it starts
       with the comment "Phone app:") and <script src="nav.js"></script> before </body>;
    2. add the page to the "groups" list in html_pages/nav.js (as before);
    3. add the file to the CORE list in sw.js and change VERSION to 'sans101-v2'
       (then v3, and so on) so phones save the new page for offline use.
- Phone-only styling lives in html_pages/app.css. Phone-only behaviour lives in
  html_pages/app.js. Neither changes the desktop layout.


WORKS OFFLINE / NEEDS A SIGNAL
------------------------------
Offline : every page, the interactive tools, the instrument photos, and the plotting
          libraries and fonts (saved the first time the app is opened online).
Online  : the videos, links to other websites, and the cuvette / sandwich-cell
          pictures on the beamtime page, which are loaded from other websites.
          Saving copies of those pictures into images/ would make them work offline.
