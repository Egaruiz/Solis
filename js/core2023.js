var bl = {

  navHolder : document.getElementById('nav'),
  navItems : document.getElementById('nav').getElementsByTagName('a'),
  lists : document.getElementById('nav').getElementsByTagName('ul'),
  allNavItems : 0,
  allLists : 0,
  openMenus : [],
  pressedNav : [],
  timer : null,
  subMenus : [],
  enlargedPhoto : document.getElementById('enlargedPhoto'),
  thumbsArea : document.getElementById('thumbs'),
  thumbImgs : [],
  formArea : document.getElementById('formCol'),
  quoteForm : document.getElementById('quoteForm'),

  init : function() {
  
    this.util.configEvents();

    this.allNavItems = this.navItems.length;
    this.allLists = this.lists.length;

    this.buildMenuAssociations();

    for (var i=1; i<this.allLists; i++) {
         this.lists[i].style.visibility = 'hidden';
    }

    for (i=0; i<this.allNavItems; i++) {
         this.navItems[i].number = i;
    }

    this.util.addEvent(this.navHolder, 'mouseover', this.displaySubMenu, false);
    this.util.addEvent(this.navHolder, 'focus', this.displaySubMenu, true);
    this.util.addEvent(this.navHolder, 'focusin', this.displaySubMenu, false);
    this.util.addEvent(this.navHolder, 'mouseout', this.setTimer, false);
    this.util.addEvent(this.navHolder, 'blur', this.setTimer, true);
    this.util.addEvent(this.navHolder, 'focusout', this.setTimer, false);  

    if (this.enlargedPhoto && this.thumbsArea) {
    
      this.util.addEvent(window, 'load', this.preloadGalleryImgs, false);       
      this.util.addEvent(this.thumbsArea, 'mouseover', this.changeLargePhoto, false);
      this.util.addEvent(this.thumbsArea, 'click', this.changeLargePhoto, false); 
      this.util.addEvent(this.thumbsArea, 'focus', this.changeLargePhoto, true); 
      this.util.addEvent(this.thumbsArea, 'focusin', this.changeLargePhoto, false); 
    
    }
    
    if (this.formArea && this.quoteForm) {
    
      this.util.addEvent(window, 'load', this.generateSubmitBtn, false);       
      this.util.addEvent(this.quoteForm, 'submit', this.verifyData, false); 
    
    }

  },

  generateSubmitBtn : function() {
  
    var theHolder = document.getElementById('submitHldr');
    var theSubmit = document.createElement('input');
    theSubmit.type = 'submit';
    theSubmit.className = 'auto';
    theSubmit.value = 'SUBMIT';
    theHolder.appendChild(theSubmit);

  },
  
  verifyData : function(evt) {
  
    var err = '';
    
    if (document.getElementById('cf1').value === '') { err += 'Please enter your first name.\n'; }
    if (document.getElementById('cf2').value === '') { err += 'Please enter your last name.\n'; }
    if (document.getElementById('cf3').value === '') { err += 'Please enter your email address.\n'; }

    if (err) {
      alert(err);
      bl.util.stopDefault(evt);
    }

  },
  
  preloadGalleryImgs : function() {
  
    var imgList = bl.thumbsArea.getElementsByTagName('img');
    var allImgs = imgList.length;
    
    for (var i=0; i<allImgs; i++) {
    
      var largerImgName = imgList[i].src.replace('.jpg','-large.jpg');
      var theImg = document.createElement('img');
      theImg.src = largerImgName;
      bl.thumbImgs[bl.thumbImgs.length] = theImg;
    
    }
  
  },

  changeLargePhoto : function(evt) {
  
    var theAnchor = bl.util.findTarget(evt, 'a', this);
    
    if (!theAnchor) { return; }

    bl.util.stopDefault(evt);
    
    theImg = theAnchor.firstChild;
    
    var largerImgName = theImg.src.replace('.jpg','-large.jpg');
    var imgTitle = theImg.alt;

    bl.enlargedPhoto.src = largerImgName;
    bl.enlargedPhoto.alt = imgTitle + ' Enlarged Photo';
    
  },
  
  buildMenuAssociations : function() {
  
    this.subMenus[1] = 'services';
    this.subMenus[2] = 'portfolio';
  
  },

  displaySubMenu : function(evt) {

    var linkChosen = bl.util.findTarget(evt, 'a', this);

    if (!linkChosen) { return; }

    if (bl.timer) { clearTimeout(bl.timer); }

    var menuLvl, menuToShow;
    var num = linkChosen.number;

    if (num <= 6) { menuLvl = 1; }
    if (num > 6) { menuLvl = 2; }

    if (bl.openMenus[menuLvl] && 
        bl.openMenus[menuLvl] === bl.subMenus[num]) { return; }

    if (bl.openMenus[menuLvl]) { bl.closeAllMenus(menuLvl); }

    if (bl.subMenus[num]) {
      menuToShow = document.getElementById(bl.subMenus[num]).style;
      menuToShow.visibility = 'visible';
    }

    bl.openMenus[menuLvl] = bl.subMenus[num];

    if (linkChosen.className) { return; }
    linkChosen.className = 'current';

    if (bl.pressedNav[menuLvl]) { bl.pressedNav[menuLvl].className = ''; }
    bl.pressedNav[menuLvl] = linkChosen;

  },

  setTimer : function() {
    if (bl.timer) { clearTimeout(bl.timer); }
    bl.timer = setTimeout('bl.closeAllMenus(1)',1000);
  },

  closeAllMenus : function(lvl) {

    for (var i=bl.openMenus.length - 1; i>=lvl; i--) {
      if (bl.openMenus[i]) {
        var menuToHide = document.getElementById(bl.openMenus[i]).style;
        menuToHide.visibility = 'hidden';
      }
      bl.openMenus[i] = null;
      if (bl.pressedNav[i]) {
        bl.pressedNav[i].className = '';
        bl.pressedNav[i] = null;
      }
    }
    
  },

  util : {

    configEvents : function() {
    
      if (document.addEventListener) {
    
        this.addEvent = function(el, type, func, capture) {
          el.addEventListener(type, func, capture);  
        };
 
        this.stopBubble = function(evt) { evt.stopPropagation(); };

        this.stopDefault = function(evt) { evt.preventDefault(); };

        this.findTarget = function(evt, targetNode, container) {
          var currentNode = evt.target;
          while (currentNode && currentNode !== container) {
            if (currentNode.nodeName.toLowerCase() === targetNode) {
                return currentNode; break;
            }
            else { currentNode = currentNode.parentNode; }
          };
          return false;
        };
      }
    
      else if (document.attachEvent) {
    
        this.addEvent = function(el, type, func) {
          el["e" + type + func] = func;
          el[type + func] = function() { el["e" + type + func](window.event); };
          el.attachEvent("on" + type, el[type + func]);
        };

        this.stopBubble = function(evt) { evt.cancelBubble = true; };

        this.stopDefault = function(evt) { evt.returnValue = false; };

        this.findTarget = function(evt, targetNode, container) {
          var currentNode = evt.srcElement;
          while (currentNode && currentNode !== container) {
            if (currentNode.nodeName.toLowerCase() === targetNode) {
                return currentNode; break;
            }
            else { currentNode = currentNode.parentNode; }
          };
          return false;
        };
      }
    }
  
  }

};

bl.init();

document.addEventListener("DOMContentLoaded", () => {
  new Mmenu("#menu", {
    offCanvas: {position: 'left-front'},
    navbar : {title: 'Menu'},
    theme : 'white'
  }, {});
});
