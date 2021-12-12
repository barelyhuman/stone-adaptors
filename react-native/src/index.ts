import { InjectorTokens } from "@barelyhuman/stone";
import camelCase from "camelcase";
import { Element } from "stylis";
import { StyleSheet } from "react-native";

type ExpansionRule = [RegExp, (params) => Object];

const DIMENSIONS_REGEX = /(pt|px|em|rem)$/;

const propertiesToExpand: ExpansionRule[] = [
  [
    /^background$/,
    (value) => ({
      backgroundColor: normalizeValue(value),
    }),
  ],
  [
    /^margin$/,
    (value) => ({
      marginTop: normalizeValue(value),
      marginBottom: normalizeValue(value),
      marginRight: normalizeValue(value),
      marginLeft: normalizeValue(value),
    }),
  ],
  [
    /^padding$/,
    (value) => ({
      paddingTop: normalizeValue(value),
      paddingBottom: normalizeValue(value),
      paddingRight: normalizeValue(value),
      paddingLeft: normalizeValue(value),
    }),
  ],
];

/**
 * @name ReactNativeInlineAdaptor
 * @description pluggable adaptor that takes in css
 * parsed tokens and returns a frozen RN stylesheet
 */
export function ReactNativeInlineAdaptor(tokens: InjectorTokens) {
  const ast = tokens.ast;

  // as css only passes per element style, the rules will mostly be of length:1
  if (!(ast && ast[0]?.children)) {
    return;
  }

  let styleObj = {};

  const astIterator = ast[0].children || [];

  (astIterator as Element[]).forEach((cssDeclaration: Element) => {
    console.log({ prop: cssDeclaration.props, val: cssDeclaration.children });

    const camelCasePropName = camelCase(cssDeclaration.props as string);
    let expanderMatched = false;

    propertiesToExpand.forEach((prop: ExpansionRule) => {
      if (!prop[0].test(cssDeclaration.props)) {
        return;
      }

      expanderMatched = true;
      const _styleValue = prop[1](cssDeclaration.children);
      styleObj = Object.assign({}, styleObj, _styleValue);
    });

    if (!expanderMatched) {
      styleObj[camelCasePropName] = normalizeValue(cssDeclaration.children);
    }
  });

  const styles = StyleSheet.create({
    [tokens.classHash]: styleObj,
  });

  return styles[tokens.classHash];
}

function normalizeValue(value) {
  if (!isNaN(value)) {
    return Number(value);
  }

  return (
    (isDimension(value) && normalizeValue(replaceDimension(value, ""))) || value
  );
}

function isDimension(value) {
  return DIMENSIONS_REGEX.test(value);
}

function replaceDimension(value, replacement) {
  return String(value).replace(new RegExp(DIMENSIONS_REGEX, "g"), replacement);
}
