
const DEFAULT_OPTIONS = {
  syntax: {
    startSymbol: '{',
    endSymbol: '}',
    delimiter: '|'
  }
};


const _ = require('lodash');

export default Spinner;

function Spinner (source: any, options?: any) {

  var tree: any = [];

  options = _.merge({}, DEFAULT_OPTIONS, options);

  const spinner = {
    countVariations: countVariations,
    unspin: unspin,
    unspinRandom: unspinRandom
  };

  compileSource();


  return spinner;


  function countVariations () {
    return countVariationsInSequence(tree);
  }

  function unspinRandom (limit: any, unique: any) {
    return unspin(true, limit, unique);
  }

  function unspin (random?: any, limit?: any, unique?: any) {
    if (random) {
      if ('undefined' === typeof limit) {
        limit = 1;
      }
      if (unique) {
        var variationsCount = countVariations();
        if (limit > variationsCount) {
          throw new Error('Variation space can not accommodate ' + variationsCount + ' variations');
        }
        var variations = [];
        while (variations.length < limit) {
          variations.push(getRandomVariation());
          variations = _.uniq(variations);
        }
        return variations;
      } else {
        return _.times(limit, function () {
          return getRandomVariation();
        });
      }
    } else {
      return unspinSequence(tree);
    }

    function getRandomVariation () {
      return unspinSequence(tree, true)[0];
    }

  }

  function compileSource () {
    if (!options.dontSplitLines) {
        if (source.indexOf("\n") > -1) {
            source = "{" + source.split("\n").join("|") + "}";
        }
    }
    tree = parseSequence(source);
  }


  function parseSequence (string: any) {

    var isParsingSpin = false;
    var sequence: any = [];
    var fragment: any = '';
    var level = 0;

    for (var i = 0; i < string.length; i++) {
      var char = string[i];
      switch (char) {
        case options.syntax.startSymbol:
          if (!isParsingSpin) {
            closeFragment();
            isParsingSpin = true;
          }
          level++;
          fragment += char;
          break;
        case options.syntax.endSymbol:
          fragment += char;
          if (isParsingSpin) {
            level--;
            if (0 == level) {
              isParsingSpin = false;
              sequence.push(parseSpin(fragment));
              fragment = '';
            }
          }
          break;
        default:
          fragment += char;
      }
    }

    closeFragment();

    return sequence;


    function closeFragment () {
      if (fragment.length > 0) {
        sequence.push(fragment);
        fragment = '';
      }
    }

  }

  function parseSpin (string: any) {

    var spin: any = [];
    var level = 0;
    var fragment = '';
    var isComplexFragment = false;

    for (var i = 0; i < string.length; i++) {
      var char = string[i];
      var isFirstChar = (0 == i);
      var isLastChar = (string.length - 1 == i);
      if (isFirstChar || isLastChar) {
        continue;
      }
      switch (char) {
        case options.syntax.startSymbol:
          level++;
          fragment += char;
          isComplexFragment = true;
          break;
        case options.syntax.endSymbol:
          level--;
          fragment += char;
          break;
        case options.syntax.delimiter:
          if (0 == level) {
            closeFragment();
          } else {
            fragment += char;
          }
          break;
        default:
          fragment += char;
      }
    }

    closeFragment();

    return spin;

    function closeFragment () {
      if (isComplexFragment) {
        spin.push(parseSequence(fragment));
      } else {
        spin.push(fragment);
      }
      fragment = '';
      isComplexFragment = false;
    }

  }

  function countVariationsInSequence (sequence: any) {
    var count = 1;
    _.forEach(sequence, function (element: any) {
      var isSpin = ('object' === typeof element);
      if (isSpin) {
        count *= countVariationsInSpin(element);
      }
    });
    return count;
  }

  function countVariationsInSpin (spin: any) {
    var count = 0;
    _.forEach(spin, function (element: any) {
      var isSequence = ('object' === typeof element);
      if (isSequence) {
        count += countVariationsInSequence(element);
      } else {
        count++;
      }
    });
    return count;
  }

  function unspinSequence (sequence: any, random: any = false) {

    var variations = [''];

    _.forEach(sequence, function (element: any) {
      var isSpin = ('object' === typeof element);
      if (isSpin) {
        multiplyVariations(unspinSpin(element, random));
      } else {
        extendVariations(element);
      }
    });

    return variations;

    function multiplyVariations (multipliers: any) {
      var result: any = [];
      _.forEach(variations, function (string: any) {
        _.forEach(multipliers, function (string2: any) {
          result.push(string + string2);
        });
      });
      variations = result;
    }

    function extendVariations (extension: any) {
      _.forEach(variations, function (string: any, key: any) {
        variations[key] = string + extension;
      })
    }

  }

  function unspinSpin (spin: any, random: any) {

    var variations: any = [];

    if (random) {
      handleElement(_.sample(spin));
      return variations;
    } else {
      _.forEach(spin, handleElement);
    }

    return variations;


    function handleElement (element: any) {
      var isSequence = ('object' === typeof element);
      if (isSequence) {
        variations = variations.concat(unspinSequence(element, random));
      } else {
        variations.push(element);
      }
    }

  }

}
