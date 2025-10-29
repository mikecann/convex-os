/**
 * @typedef {import("@typescript-eslint/utils").TSESTree.Node} Node
 * @typedef {import("@typescript-eslint/utils").TSESTree.Identifier} Identifier
 * @typedef {import("@typescript-eslint/utils").TSESTree.VariableDeclarator} VariableDeclarator
 * @typedef {import("@typescript-eslint/utils").TSESTree.FunctionDeclaration} FunctionDeclaration
 */

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Discourage hoisting of event handlers that are only used once in JSX; prefer inlining.",
      recommended: false,
    },
    messages: {
      preferInlineHandler:
        "Handler '{{name}}' is only used once as a JSX prop. Inline it where it's used.",
    },
    schema: [],
  },

  /**
   * @param {import("eslint").Rule.RuleContext} context
   * @returns {import("eslint").Rule.RuleListener}
   */
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    /**
     * Check if a node is inside a React component (function/arrow function)
     * @param {Node} node
     * @returns {boolean}
     */
    function isInsideComponent(node) {
      let current = node.parent;
      while (current) {
        if (
          current.type === "FunctionDeclaration" ||
          current.type === "FunctionExpression" ||
          current.type === "ArrowFunctionExpression"
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    /**
     * Report if the identifier is only used once and in a JSX prop
     * @param {Identifier} identifier
     * @param {Node} declarationNode
     */
    function reportIfSingleUse(identifier, declarationNode) {
      // Get the scope where this variable is declared
      const scope = sourceCode.getScope(declarationNode);
      
      // Find the variable in the scope or parent scopes
      let variable = null;
      let currentScope = scope;
      while (currentScope) {
        variable = currentScope.set.get(identifier.name);
        if (variable) break;
        currentScope = currentScope.upper;
      }

      if (!variable) return;

      // Count *read* references (using as value), not definitions
      // Filter out the declaration itself
      const reads = variable.references.filter(
        (ref) => ref.isRead() && ref.identifier !== identifier
      );

      // Only report if there's exactly one usage
      if (reads.length !== 1) return;

      const ref = reads[0];
      const refNode = ref.identifier;
      const parent = refNode.parent;

      // Check if the single read is used as a JSX attribute value
      // Pattern: <Component onClick={handleX} />
      const isJsxPropValue =
        parent?.type === "JSXExpressionContainer" &&
        parent.parent?.type === "JSXAttribute";

      if (!isJsxPropValue) return;

      // Report the hoisted handler
      context.report({
        node: identifier,
        messageId: "preferInlineHandler",
        data: { name: identifier.name },
      });
    }

    return {
      /**
       * Check variable declarations like: const handleX = () => {...}
       * @param {VariableDeclarator} node
       */
      VariableDeclarator(node) {
        if (node.id.type !== "Identifier") return;
        if (!node.init) return;
        if (!isInsideComponent(node)) return;

        // Only check function expressions and arrow functions
        const isFn =
          node.init.type === "ArrowFunctionExpression" ||
          node.init.type === "FunctionExpression";

        if (!isFn) return;

        reportIfSingleUse(node.id, node);
      },

      /**
       * Check function declarations like: function handleX() {...}
       * @param {FunctionDeclaration} node
       */
      FunctionDeclaration(node) {
        if (!node.id) return;
        if (!isInsideComponent(node)) return;

        reportIfSingleUse(node.id, node);
      },
    };
  },
};

