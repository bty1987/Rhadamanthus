/*
 * @File Name	: SpringApplicationContext.java
 * @Package		：com.fanglin.utils 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * Describing	: spring的ApplicationContextAware封装
 */ 

package com.fanglin.utils;


import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringApplicationContext implements ApplicationContextAware {

	private static ApplicationContext appContext;

	private SpringApplicationContext(){
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		appContext = applicationContext;

	}

	public static Object getBean(String beanName){
		return appContext.getBean(beanName);
	}

}
