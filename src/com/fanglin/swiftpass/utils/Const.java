package com.fanglin.swiftpass.utils;

import java.text.SimpleDateFormat;

public final class Const {

	public static final String CHARSET = "UTF-8"; // 编码字符集：UTF-8

	public static final String POST_HEAD_KEY = "Authorization"; // 发送请求时head中的认证信息KEY

	public static final SimpleDateFormat FORMATTER_TIME = new SimpleDateFormat("yyyyMMddHHmmss"); // 时间格式化器

	public static final String SIGN_TYPE = "RSA"; // 签名加密类型：RSA

	public static final String SIGN_ALGORITHMS = "SHA256WithRSA"; // 加密算法

	public static final String ALGORITHM_EC = "EC"; // EC算法

	public static final String ALGORITHM_SM3_WITH_SM2 = "SM3WithSM2"; // SM3WithSM2算法

	public static final String RESP_EXCEPTION_CODE = "\"code\":\"OPEN"; // 异常返回码前缀

}
