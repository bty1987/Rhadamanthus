package com.yspay.config;


public class Config {

	public static final String PASSWORD = "Fanglin1918!";

	public static final String PUBLICKEYPATH = System.getProperty("user.dir") + System.getProperty("file.separator") + "cert" + "/826235152110030.cer";

	public static final String PRIVATEKEYPATH = System.getProperty("user.dir") + System.getProperty("file.separator") + "cert" + "/826235152110030.pfx";

	// public static final String PRIVATEKEYPATH = System.getProperty("user.dir") + "/java_demo" +
	// System.getProperty("file.separator") + "cert" + "/dsf1.pfx";

	public static final String DIVISION_URL = "https://commonapi.ysepay.com/gateway.do";

	public static final String DIVISION_REFUND_URL = "https://commonapi.ysepay.com/gateway.do";

	public static final String NOTIFY_URL = "";

}
