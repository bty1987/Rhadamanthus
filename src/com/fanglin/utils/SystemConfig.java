/**
 * @File Name	: SystemConfig.java
 * @Package		: com.fanglin.utils 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 获得配置文件内容的工具类
 */ 

package com.fanglin.utils;

import java.util.Properties;

public class SystemConfig {

	private static String configFilePathName = "/sysconfig.properties";

	private static Properties prop;
	
	public static final String DEBUG_FALSE_STR = "false";
	
	public static final String DEBUG_TRUE_STR = "true";
	
	public static final String DEBUG_ERROR_STR = "error";

	static {
		try {
			prop = EncryptConfigLoader.load(configFilePathName);
		} catch (Throwable e) {
			// 兜底: EncryptConfigLoader 加载/解密失败时, 使用原有方式直接读取配置文件
			try {
				java.io.InputStream is = SystemConfig.class.getResourceAsStream(configFilePathName);
				if (is == null) {
					throw new RuntimeException("config-file cannot be load: " + configFilePathName);
				}
				prop = new Properties();
				prop.load(is);
				is.close();
			} catch (Exception ex) {
				throw new RuntimeException("config-file cannot be load: " + configFilePathName, ex);
			}
		}
	}

	public static String getString(String key){
		return prop.getProperty(key);
	}

	public static String getString(String key, String defaultValue){
		return prop.getProperty(key, defaultValue);
	}

	public static boolean getBoolean(String key){
		String tempValue = getString(key);
		return Boolean.valueOf(tempValue).booleanValue();
	}

	public static boolean getBoolean(String key, boolean defaultValue){
		String tempValue = getString(key, "" + defaultValue);
		return Boolean.valueOf(tempValue).booleanValue();
	}

	public static double getDouble(String key){
		String tempValue = getString(key);
		return Double.parseDouble(tempValue);
	}

	public static double getDouble(String key, double defaultValue){
		String tempValue = getString(key, "" + defaultValue);
		return Double.parseDouble(tempValue);
	}

	public static float getFloat(String key){
		String tempValue = getString(key);
		return Float.parseFloat(tempValue);
	}

	public static float getFloat(String key, float defaultValue){
		String tempValue = getString(key, "" + defaultValue);
		return Float.parseFloat(tempValue);
	}

	public static int getInt(String key){
		String tempValue = getString(key);
		return Integer.parseInt(tempValue);
	}

	public static int getInt(String key, int defaultValue){
		String tempValue = getString(key, "" + defaultValue);
		return Integer.parseInt(tempValue);
	}

	public static long getLong(String key){
		String tempValue = getString(key);
		return Long.parseLong(tempValue);
	}

	public static long getLong(String key, long defaultValue){
		String tempValue = getString(key, "" + defaultValue);
		return Long.parseLong(tempValue);
	}
}
