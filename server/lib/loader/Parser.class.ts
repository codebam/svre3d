import STD from './STD.class';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const floatifyObject = (obj, int) => {
  for(let i in obj) obj[i] = int ? parseFloat(obj[i]) : parseInt(obj[i]);
  return obj;
}
const xyz = {
  x: 0,
  y: 0,
  z: 0
}

export default class Parser {
  parsedFiles: Set<string>;
  yamlSchema: yaml.Schema;
  constructor() {
    this.parsedFiles = new Set();

    this.yamlSchema = new yaml.Schema([
      new yaml.Type('!realpath', {
        kind: 'scalar',
        construct: (data) => this.folderTagHandler(data),
      }),
      new yaml.Type('!int', {
        kind: 'scalar',
        construct: (data) => parseInt(data),
      }),
      new yaml.Type('!float', {
        kind: 'scalar',
        construct: (data) => parseFloat(data),
      }),
      new yaml.Type('!bool', {
        kind: 'scalar',
        construct: (data) => data == 'true' ? true : false,
      }),
      new yaml.Type('!xyz.int', {
        kind: 'mapping',
        construct: (data) => floatifyObject({
          ...xyz,
          ...data
        }, false),
      }),
      new yaml.Type('!xyz', {
        kind: 'mapping',
        construct: (data) => floatifyObject({
          ...xyz,
          ...data
        }, true),
      }),
      new yaml.Type('!import', {
        kind: 'scalar',
        construct: (data) => this.importFile(data),
      }),
      new yaml.Type('!id', {
        kind: 'scalar',
        construct: (data) => this.context.currentID ? this.context.currentID + ':' + data : data,
      }),
      ...(
        STD.getSchemas()
        .map(schema => new yaml.Type('!'+schema.name, {
          kind: 'mapping',
          construct: (data) => ({
            ...schema.values,
            ...data
          }),
        }))
      )
    ]);
  }

  context: Record<string, any> = {};

  folderTagHandler(data) {
    const relativePath = data;
    const absolutePath = path.resolve(path.dirname(this.context.currentFile), relativePath);
    return absolutePath;
  }

  importFile(filename) {
    const currentPath = this.context.currentFile; 
    const file = filename.endsWith('.yaml')
    ? this.parseYAML(this.folderTagHandler(filename))
    : this.lookUpFile(this.folderTagHandler(filename));
    this.context.currentFile = currentPath;
    return file; 
  }

  lookUpFile(filePath){
    this.context.currentFile = filePath;
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
  }

  parseYAML(filePath) {
    if (this.parsedFiles.has(filePath)) {
      return {};
    }
    let fileContent = this.lookUpFile(filePath);

    const data = yaml.load(fileContent, {
      schema: this.yamlSchema
    });

    this.parsedFiles.add(filePath);

    return data;
  }
}
