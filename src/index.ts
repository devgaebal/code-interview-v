import * as xmlparser from 'xml-parser';
// xmlParser cannot do any basic xml sanity checks
//   but does have type definition for nodes

import * as fastXmlParser from 'fast-xml-parser';
// fastXmlParser can validate basic xml sanity.
//    but does not have a valid type definition for nodes :(

/*
validator's isValidXML function receives a string, checks if a string is a valid xml, and returns a boolean.

<a /> => true
<a></a> => true
<a>test</a> => true
<a><b></b></a> => true
<a></a><b></b> => true

<a> => false
<<a></a> => false
<a><b></a></b> => false

IMPORTANT: Please note that we have our own internal rules about validity.
1. A node cannot contain a node with the same tag. ex) <a><a></a></a> => false
2. A node cannot be followed by a node with the same tag. ex) <a></a><a></a> => false
3. An xml cannot be more than 2 levels deep. ex) <a><b><c><d></d></c></b></a> => false

IMPORTANT: Feel free to use open source libraries you find necessary.
IMPORTANT: Don't worry about XML declaration, node attributes, or unicode characters.

For further examples, please check basic_spec.js file.

DO NOT MODIFY
*/

/*
@param xmlString: a string, possibly a valid xml string
@return boolean;
*/
// exports.isValidXML = xmlString => {
export const isValidXML = xmlString => {
  if (xmlString.length === 0) {
    return false;
  }
  try {
    if (fastXmlParser.validate(xmlString) !== true) {
      throw new Error("Invalid XML");
    }
    // add temporary roots (xmlparser can't handle multiple roots...)
    const parsedXML = xmlparser('<__TEMPROOT__>' + xmlString + '</__TEMPROOT__>');
    
    traverse(parsedXML.root);
  }
  catch(e) {
    return false;
  }
  return true;
  // TODO: FILL ME
};

export function traverse(
  node: xmlparser.Node, 
  parentNode?: xmlparser.Node,
  depth: number = 0,
) {
  console.log('node:', node);
  // 1. A node cannot contain a node with the same tag
  if (parentNode && parentNode.name == node.name) {
    throw new Error("A node cannot contain a node with the same tag");
  }
  // 2. A node cannot be followed by a node with the same tag. ex) <a></a><a></a> => false
  for (let i=0; i <node.children.length ; i++) {
    const childNode = node.children[i];
    const nextChildNode = node.children[i+1];
    if (nextChildNode) {
      if (childNode.name === nextChildNode.name) {
        throw new Error("A node cannot be followed by a node with the same tag. ex) <a></a><a></a> => false")
      }
    }
  }
  // 3. An xml cannot be more than 2 levels deep
  if (depth > 2) {
    throw new Error("An xml cannot be more than 2 levels deep")
  }
  node.children.map((childNode) => {
    traverse(childNode, node, depth + 1)
  })
}