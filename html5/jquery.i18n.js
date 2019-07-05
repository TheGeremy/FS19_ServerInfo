/*!
 * jQuery i18n plugin
 * @requires jQuery v1.1 or later
 *
 * See https://github.com/recurser/jquery-i18n
 *
 * Licensed under the MIT license.
 *
 * Version: 1.1.2 (Fri, 11 Aug 2017 03:52:21 GMT)
 */
(function($) {
  /**
   * i18n provides a mechanism for translating strings using a jscript dictionary.
   *
   */

  var __slice = Array.prototype.slice;

  /*
   * i18n property list
   */
  var i18n = {

    dict: null,
    missingPattern: null,

    /**
     * load()
     *
     * Load translations.
     *
     * @param  property_list i18nDict : The dictionary to use for translation.
     */
    load: function(i18nDict, missingPattern) {
      if (this.dict !== null) {
        $.extend(this.dict, i18nDict);
      } else {
        this.dict = i18nDict;
      }

      if (missingPattern) {
        this.missingPattern = missingPattern;
      }
    },

    /**
     * unload()
     *
     * Unloads translations and clears the dictionary.
     */
    unload: function() {
      this.dict           = null;
      this.missingPattern = null;
    },

    /**
     * _()
     *
     * Looks the given string up in the dictionary and returns the translation if
     * one exists. If a translation is not found, returns the original word.
     *
     * @param  string str           : The string to translate.
     * @param  property_list params.. : params for using printf() on the string.
     *
     * @return string               : Translated word.
     */
    _: function (str) {
      dict = this.dict;
      if (dict && dict.hasOwnProperty(str)) {
        str = dict[str];
      } else if (this.missingPattern !== null) {
        return this.printf(this.missingPattern, str);
      }
      args = __slice.call(arguments);
      args[0] = str;
      // Substitute any params.
      return this.printf.apply(this, args);
    },

    /*
     * printf()
     *
     * Substitutes %s with parameters given in list. %%s is used to escape %s.
     *
     * @param  string str    : String to perform printf on.
     * @param  string args   : Array of arguments for printf.
     *
     * @return string result : Substituted string
     */
    printf: function(str, args) {
      if (arguments.length < 2) return str;
      args = $.isArray(args) ? args : __slice.call(arguments, 1);
      return str.replace(/([^%]|^)%(?:(\d+)\$)?s/g, function(p0, p, position) {
        if (position) {
          return p + args[parseInt(position)-1];
        }
        return p + args.shift();
      }).replace(/%%s/g, '%s');
    }

  };

  /*
   * _t()
   *
   * Allows you to translate a jQuery selector.
   *
   * eg $('h1')._t('some text')
   *
   * @param  string str           : The string to translate .
   * @param  property_list params : Params for using printf() on the string.
   *
   * @return element              : Chained and translated element(s).
  */
  $.fn._t = function(str, params) {
    return $(this).html(i18n._.apply(i18n, arguments));
  };

  $.i18n = i18n;
})(jQuery);


var my_dictionary = {
  // vehicle groups 
  "TRACTORSL":"traktory tredy L",
  "TRACTORSS":"traktory tredy S",
  "TRAILERS":"prívesy",
  "WEIGHTS":"závažia",
  "SUBSOILERS":"podrývače",
  "CUTTERS":"žacie stoly",
  "HARVESTERS":"kombajny",
  "FRONTLOADERS":"predné nakladače",
  "TELELOADERS":"teleskopické nakladače",
  "BALING":"balíková technológia",  
  "MOWERS":"kosačky",
  "WINDROWERS":"riadkovače",
  "PLOWS":"pluhy",  
  "SEEDERS":"sejačky",  
  "FERTILIZERSPREADERS":"rozprašovače",  
  "SPRAYERS":"postrekovače",  
  // vehicles
  "tractor":"traktor",
  "combineDrivable":"kombajn",
  // trailers
  "trailer":"príves",
  "trainTrailer":"vagón",
  "trainTimberTrailer":"vagón",
  "pdlc_andersonPack.extendedBaleLoader":"príves na balíky",  
  // implements
  "implement":"závažie",
  "cultivator":"kutivátor",
  "cutter":"rezák",
  "CORNHEADERS":"žacie stoly na kukuricu",
  "strawBlower":"rozprašovač slamy",  
  "baler":"lis na balíky",
  "mower":"kosačka",
  "windrower":"riadkovačka",
  "plow":"pluh",
  "sowingMachine":"sejačka",
  "spreader":"rozprašovač",
  "waterTrailer":"príves na vodu",
  "sprayer":"postrekovač",
  "implementDynamicMountAttacher":"vidle na balíky",
  "attachableFrontloader":"čelný nakladač",
  // items
  "PALLETS":"palety",
  "pallet":"paleta",
  "BIGBAGS":"palety",
  // filables
  "WOOL":"vlna",
  "ANIMALS":"zvieratá", 
  "HERBICIDE":"herbicíd",
  "FERTILIZER":"umelé hnojivo",  
  "SEEDS":"sejivo",
  "LIME":"vápno",  
  "GRASS_WINDROW":"tráva",  
  "WATER":"voda",
  "diesel":"nafta",
  "WHEAT":"pšenica",
  "STRAW":"slama",  
  "DIESEL AIR":"nafta",
  // names of items vehicles etc...
  "woolPallet":"Pallet Wool"
}

$.i18n.load(my_dictionary);