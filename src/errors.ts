const CODE_MESSAGES: { [index: number]: string } = {
  10000: '账号已存在',
  10001: '账号密码错误',
  20000: '频道名称已存在',
  30000: '栏目名称已存在',
  40000: '时间与其他直播冲突',
};

export default {
  getMessage: (resData: any): string => {
    return CODE_MESSAGES[resData?.code] || resData?.message || resData?.error || '未知错误';
  },
};
