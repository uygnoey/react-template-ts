import _ from 'lodash';
import React, { ReactComponentElement } from 'react';

export const isArray = (obj: any): boolean => (Object.prototype.toString.call(obj) === '[object Array]');

export const isObject = (obj: any): boolean => (Object.prototype.toString.call(obj) === '[object Object]');

export const objectflatify = (data: object): object => {
  const qs = (obj: object, p: object | string | null = null): object => {
    const _k = (k: string): string => {
      return (p == null) ? k : isArray(obj) ? `${p}[${k}]` : `${p}.${k}`;
      // return (p == null) ? k : isArray(obj) ? `${p}` : `${p}.${k}`;
    };

    let o: object = {};
    for (let [key, val] of Object.entries(obj)) {
      val = typeof val === 'number' ? val.toString() : val;
      o = Object.assign(o,
        isArray(val) ? qs(val, _k(key)) : isObject(val) ? qs(val, _k(key)) : {
          [_k(key)]: val,
        },
      );
    }

    return o;
  };

  return qs(_.cloneDeep(data));
};

export const unqsify = (qs: string): object => {
  const o: any = {};

  if (qs.length === 0) {
    return o;
  }

  for (const pairs of qs.split('&')) {
    const item: string[] = pairs.split('=');
    o[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
  }

  return o;
};

export const defaultPage = (): object => ({
  page: 1,
  skipCount: 0,
  maxResultCount: 10,
  sortby: 'created',
  order: 'desc',
  // sortby: ["created", "updated"],
  // order: ["desc", "desc"]
});

type PageObject = {
  currentPage: number, skipCount: number, maxResultCount: number, totalCount: number
};

export const pageTotalCount = (totalCount: number, maxResultCount: number): number => Math.floor(totalCount <= maxResultCount ? 1 : totalCount / maxResultCount + (totalCount % maxResultCount > 0 ? 1 : 0));

export const pagingObj = (endPageCount: number, maxResultCount: number, totalCount: number): Array<PageObject> => _pagingObj(0, 0, endPageCount, maxResultCount, totalCount);

export const _pagingObj = (startPageCount: number, skipCount: number, endPageCount: number, maxResultCount: number, totalCount: number): Array<PageObject> => {
  const result = [];
  for (let i = startPageCount; i < endPageCount; i++) {
    result.push({
      currentPage: i + 1,
      skipCount,
      maxResultCount,
      totalCount,
    });

    skipCount += maxResultCount;
  }

  return result;
};

export const currentPage = (totalCount: number, skipCount: number, maxResultCount: number): PageObject => ({
  currentPage: Math.floor(skipCount / maxResultCount + 1),
  skipCount,
  maxResultCount,
  totalCount,
});

export const languageParser = (t: any, trans_code: string): string => {
  const trans = _.toString(t(trans_code));
  return (trans === trans_code || trans === '') ? trans_code : trans;
};
export const languageParserWithData = (t: any, trans_code: string, data: object): string => {
  const trans = _.toString(t(trans_code, data));
  return (trans === trans_code || trans === '') ? `${trans_code}, {data: ${JSON.stringify(data)}}` : trans;
};

type CodeList = {
  code: string, name: string, order: number
};
type CommonCode = {
  group_code: string, codes: Array<CodeList>
};
export const getCodeList = (commonCode: Array<CommonCode>, groupCode: string): Array<CodeList> => {
  const codeList: Array<CodeList> = _.get(_.find(commonCode, c => c.group_code === groupCode), 'codes', []);
  return codeList.map((c: CodeList) => {
    return {
      code: c.code,
      name: c.name,
      order: c.order,
    };
  });
};

export const getCodeName = (codeList: Array<CodeList>, code: string): string => {
  const codeObj = _.find(codeList, c => c.code === code);
  return _.get(codeObj, 'name', code);
};

export const numberFormat = (val: number): string => {
  const valString: string = val.toString();
  const underPoint: number = _.indexOf(valString, '.', 0);
  const split: string[] = _.split(valString, '.');

  let result: string = _.toString(split[0]).replace(/(-?\d)(?=(\d{3})+(?!\d))/g, '$1,');
  if (underPoint > -1) {
    result += `.${split[1]}`;
  }

  return result;
};

export const numberFormatToOnlyNum = (val: string): number => Number(_.toString(val).replace(/[^\d.]/g, ''));

export const emailReg = (email: string): boolean => {
  const rule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return rule.test(email);
};

export const pad = (n: number, width: number): string => {
  const target: string = n.toString();
  return target.length >= width ? target : new Array(width - target.length + 1).join('0') + target;
};

export const RequiredTag = (): ReactComponentElement<any> => <sup className="text-danger">*</sup>;

export const GetLocale = (): string => {
  if (window.navigator.languages) {
    return window.navigator.languages[0];
  } else {
    return window.navigator.language;
  }
};
