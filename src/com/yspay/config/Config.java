package com.yspay.config;

/**
 * @author liuj
 * @description 参数配置
 * @date 2019-2-27
 */
public class Config {

	public static final String PASSWORD = "Fanglin1918!";

	public static final String PUBLICKEYPATH = System.getProperty("user.dir") + System.getProperty("file.separator") + "cert" + "/826235152110030.cer";

	public static final String PRIVATEKEYPATH = System.getProperty("user.dir") + System.getProperty("file.separator") + "cert" + "/826235152110030.pfx";

	// public static final String PRIVATEKEYPATH = System.getProperty("user.dir") + "/java_demo" +
	// System.getProperty("file.separator") + "cert" + "/dsf1.pfx";

	public static final String DIVISION_URL = "https://commonapi.ysepay.com/gateway.do";

	public static final String DIVISION_REFUND_URL = "https://commonapi.ysepay.com/gateway.do";

	public static final String REGISTER_URL = "http://10.213.32.58:10011/register_gateway/gateway.do";

	public static final String UPLOAD_IMAGES_URL = "http://10.213.32.58:13021/yspay-upload-service?method=upload";

}
