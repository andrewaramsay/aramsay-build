/**
 * @fileoverview Rule to require authenticate middleware on every route ('anonymous' is a valid authentication strategy)
 * @author Andrew Ramsay
 * @copyright 2016 Andrew Ramsay. All rights reserved.
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (ruleContext) {

  return {
    CallExpression(node) {

      if (node.callee.type !== 'MemberExpression') {
        return;
      }

      if (!(/[Rr]outer$/).test(node.callee.object.name)) {
        return;
      }

      if (!(/get|post|delete|put|patch/).test(node.callee.property.name)) {
        return;
      }

      if (!node.arguments) {
        return;
      }

      let foundAuthenticate = false;
      node.arguments.forEach(function (argument) {
        if (argument.type !== 'CallExpression' || !argument.callee) {
          return;
        }

        if (argument.callee.type === 'Identifier' && argument.callee.name === 'authenticate') {
          foundAuthenticate = true;
        }

        if (argument.callee.type === 'MemberExpression' && argument.callee.property.name === 'authenticate') {
          foundAuthenticate = true;
        }
      });

      if (!foundAuthenticate) {
        ruleContext.report({
          message: "No implicit anonymous access: use authenticate('anonymous') or specify strategy.",
          node
        });
      }

    }
  };

};

module.exports.schema = [
  // JSON Schema for rule options goes here
];
