
import { WXMLFormatConfiguration, Range, TextEdit, Position, TextDocument } from '../wxmlLanguageTypes';
// import { IBeautifyHTMLOptions, html_beautify } from '../beautify/beautify-html';
const wxml_beautify = require("@vdesjs/wxml-beautify").wxml;
import { repeat } from '../utils/strings';


interface IBeautifyWXMLOptions {
  /**
   * indent <head> and <body> sections
   * default false
   */
  indent_inner_html?: boolean;

  /**
   * indentation size
   * default 4
   */
  indent_size?: number; // indentation size,

  /**
   * character to indent with
   * default space
   */
  indent_char?: string; // character to indent with,

  /**
   * add indenting whitespace to empty lines
   * default false
   */
  indent_empty_lines?: boolean; // add indenting whitespace to empty lines

  /**
   * maximum amount of characters per line (0 = disable)
   * default 250
   */
  wrap_line_length?: number;

  /**
   * put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are.
   * "collapse" | "expand" | "end-expand" | "none"
   * default "collapse"
   */
  brace_style?: string;

  /**
   * list of tags, that shouldn't be reformatted
   * defaults to inline tags
   */
  unformatted?: string[];

  /**
   * list of tags, that its content shouldn't be reformatted
   * defaults to pre tag
   */
  content_unformatted?: string[];

  /**
   * "keep"|"separate"|"normal"
   * default normal
   */
  indent_scripts?: 'keep' | 'separate' | 'normal';

  /**
   * whether existing line breaks before elements should be preserved. Only works before elements, not inside tags or for text.
   * default true
   */
  preserve_newlines?: boolean;

  /**
   * maximum number of line breaks to be preserved in one chunk
   * default unlimited
   */
  max_preserve_newlines?: number;

  /**
   * format and indent {{#foo}} and {{/foo}}
   * default false
   */
  indent_handlebars?: boolean;

  /**
   * end with a newline
   * default false
   */
  end_with_newline?: boolean;

  /**
   * List of tags that should have an extra newline before them.
   * default [head,body,/html]
   */
  extra_liners?: string[];

  /**
   * wrap each attribute except first ('force')
   * wrap each attribute except first and align ('force-aligned')
   * wrap each attribute ('force-expand-multiline')
   * multiple attributes are allowed per line, attributes that wrap will align vertically ('aligned-multiple')
   * preserve wrapping of attributes ('preserve')
   * preserve wrapping of attributes but align ('preserve-aligned')
   * wrap only when line length is reached ('auto')
   *
   * default auto
   */
  wrap_attributes?: 'auto' | 'force' | 'force-expand-multiline' | 'force-aligned' | 'aligned-multiple' | 'preserve' | 'preserve-aligned';

  /**
   * Alignment size when using 'force-aligned' | 'aligned-multiple'
   */
  wrap_attributes_indent_size?: number;

  /*
   * end of line character to use
   */
  eol?: string;

  /**
   * List of templating languages (auto,none,django,erb,handlebars,php)
   * default ["auto"] = all in html
   */
  templating?: ('auto' | 'none' | 'django' | 'erb' | 'handlebars' | 'php')[];

  /**
   * Keep text content together between this string
   * default ""
   */
  unformatted_content_delimiter?: string;
}


export function format(document: TextDocument, range: Range | undefined, options: WXMLFormatConfiguration): TextEdit[] {
  let value = document.getText();
  let includesEnd = true;
  let initialIndentLevel = 0;
  const tabSize = options.tabSize || 2;
  if (range) {
    let startOffset = document.offsetAt(range.start);

    // include all leading whitespace iff at the beginning of the line
    let extendedStart = startOffset;
    while (extendedStart > 0 && isWhitespace(value, extendedStart - 1)) {
      extendedStart--;
    }
    if (extendedStart === 0 || isEOL(value, extendedStart - 1)) {
      startOffset = extendedStart;
    } else {
      // else keep at least one whitespace
      if (extendedStart < startOffset) {
        startOffset = extendedStart + 1;
      }
    }

    // include all following whitespace until the end of the line
    let endOffset = document.offsetAt(range.end);
    let extendedEnd = endOffset;
    while (extendedEnd < value.length && isWhitespace(value, extendedEnd)) {
      extendedEnd++;
    }
    if (extendedEnd === value.length || isEOL(value, extendedEnd)) {
      endOffset = extendedEnd;
    }
    range = Range.create(document.positionAt(startOffset), document.positionAt(endOffset));

    // Do not modify if substring starts in inside an element
    // Ending inside an element is fine as it doesn't cause formatting errors
    const firstHalf = value.substring(0, startOffset);
    if (new RegExp(/.*[<][^>]*$/).test(firstHalf)) {
      //return without modification
      value = value.substring(startOffset, endOffset);
      return [{
        range: range,
        newText: value
      }];
    }

    includesEnd = endOffset === value.length;
    value = value.substring(startOffset, endOffset);

    if (startOffset !== 0) {
      const startOfLineOffset = document.offsetAt(Position.create(range.start.line, 0));
      initialIndentLevel = computeIndentLevel(document.getText(), startOfLineOffset, options);
    }
  } else {
    range = Range.create(Position.create(0, 0), document.positionAt(value.length));
  }
  const wxmlOptions: IBeautifyWXMLOptions = {
    indent_size: tabSize,
    indent_char: options.insertSpaces ? ' ' : '\t',
    indent_empty_lines: getFormatOption(options, 'indentEmptyLines', false),
    wrap_line_length: getFormatOption(options, 'wrapLineLength', 120),
    unformatted: getTagsFormatOption(options, 'unformatted', void 0),
    content_unformatted: getTagsFormatOption(options, 'contentUnformatted', void 0),
    indent_inner_html: getFormatOption(options, 'indentInnerHtml', false),
    preserve_newlines: getFormatOption(options, 'preserveNewLines', true),
    max_preserve_newlines: getFormatOption(options, 'maxPreserveNewLines', 32786),
    indent_handlebars: getFormatOption(options, 'indentHandlebars', false),
    end_with_newline: includesEnd && getFormatOption(options, 'endWithNewline', false),
    extra_liners: getTagsFormatOption(options, 'extraLiners', void 0),
    wrap_attributes: getFormatOption(options, 'wrapAttributes', 'auto'),
    wrap_attributes_indent_size: getFormatOption(options, 'wrapAttributesIndentSize', void 0),
    eol: '\n',
    indent_scripts: getFormatOption(options, 'indentScripts', 'normal'),
    templating: getTemplatingFormatOption(options, 'all'),
    unformatted_content_delimiter: getFormatOption(options, 'unformattedContentDelimiter', ''),
  };

  let result = wxml_beautify(trimLeft(value), wxmlOptions);
  if (initialIndentLevel > 0) {
    const indent = options.insertSpaces ? repeat(' ', tabSize * initialIndentLevel) : repeat('\t', initialIndentLevel);
    result = result.split('\n').join('\n' + indent);
    if (range.start.character === 0) {
      result = indent + result; // keep the indent
    }
  }
  return [{
    range: range,
    newText: result
  }];
}

function trimLeft(str: string) {
  return str.replace(/^\s+/, '');
}

function getFormatOption(options: WXMLFormatConfiguration, key: keyof WXMLFormatConfiguration, dflt: any): any {
  if (options && options.hasOwnProperty(key)) {
    const value = options[key];
    if (value !== null) {
      return value;
    }
  }
  return dflt;
}

function getTagsFormatOption(options: WXMLFormatConfiguration, key: keyof WXMLFormatConfiguration, dflt: string[] | undefined): string[] | undefined {
  const list = <string>getFormatOption(options, key, null);
  if (typeof list === 'string') {
    if (list.length > 0) {
      return list.split(',').map(t => t.trim().toLowerCase());
    }
    return [];
  }
  return dflt;
}

function getTemplatingFormatOption(options: WXMLFormatConfiguration, dflt: string): ('auto' | 'none' | 'django' | 'erb' | 'handlebars' | 'php')[] | undefined {
  const value = getFormatOption(options, 'templating', dflt);
  if (value === true) {
    return ['auto'];
  }
  return ['none'];
}

function computeIndentLevel(content: string, offset: number, options: WXMLFormatConfiguration): number {
  let i = offset;
  let nChars = 0;
  const tabSize = options.tabSize || 4;
  while (i < content.length) {
    const ch = content.charAt(i);
    if (ch === ' ') {
      nChars++;
    } else if (ch === '\t') {
      nChars += tabSize;
    } else {
      break;
    }
    i++;
  }
  return Math.floor(nChars / tabSize);
}

function getEOL(document: TextDocument): string {
  const text = document.getText();
  if (document.lineCount > 1) {
    const to = document.offsetAt(Position.create(1, 0));
    let from = to;
    while (from > 0 && isEOL(text, from - 1)) {
      from--;
    }
    return text.substr(from, to - from);
  }
  return '\n';
}

function isEOL(text: string, offset: number) {
  return '\r\n'.indexOf(text.charAt(offset)) !== -1;
}

function isWhitespace(text: string, offset: number) {
  return ' \t'.indexOf(text.charAt(offset)) !== -1;
}


