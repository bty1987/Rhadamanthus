/*
 * @File Name	: BeanUtil.java
 * @Package		：com.fanglin.utils
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: VO与PO相互转换的工具类
 */

package com.fanglin.utils;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.List;

import org.springframework.beans.BeansException;
import org.springframework.beans.FatalBeanException;
import org.springframework.util.Assert;

public class BeanUtil extends org.springframework.beans.BeanUtils {

	public static void copyProperties(Object source, Object target, List<String> ignores){
		
		if(source == null){
			target = null;
			return;
		}
		
		Assert.notNull(target, "Target must not be null");
		Class<?> actualEditable = target.getClass();
		PropertyDescriptor[] targetPds = getPropertyDescriptors(actualEditable);
		
		for(PropertyDescriptor targetPd: targetPds){
			if(!ignores.contains(targetPd.getName())){
				if(targetPd.getWriteMethod() != null){
					PropertyDescriptor sourcePd = getPropertyDescriptor(source.getClass(), targetPd.getName());
					if(sourcePd != null && sourcePd.getReadMethod() != null){
						try {
							Method readMethod = sourcePd.getReadMethod();
							
							if(!Modifier.isPublic(readMethod.getDeclaringClass().getModifiers())){
								readMethod.setAccessible(true);
							}
							Object value = readMethod.invoke(source);
							// 这里判断以下value是否为空 当然这里也能进行一些特殊要求的处理 例如绑定时格式转换等等
							if(value != null){
								Method writeMethod = targetPd.getWriteMethod();
								if(!Modifier.isPublic(writeMethod.getDeclaringClass().getModifiers())){
									writeMethod.setAccessible(true);
								}
								writeMethod.invoke(target, value);
							}
						} catch (Throwable ex){
							throw new FatalBeanException("Could not copy properties from source to target", ex);
						}
					}
				}
			}
		}
	}
	
	public static void copyProperties(Object source, Object target) throws BeansException {
		
		if(source == null){
			target = null;
			return;
		}
		
		Assert.notNull(target, "Target must not be null");
		Class<?> actualEditable = target.getClass();
		PropertyDescriptor[] targetPds = getPropertyDescriptors(actualEditable);
		
		for(PropertyDescriptor targetPd: targetPds){
			if(targetPd.getWriteMethod() != null){
				PropertyDescriptor sourcePd = getPropertyDescriptor(source.getClass(), targetPd.getName());
				
				if(sourcePd != null && sourcePd.getReadMethod() != null){
					
					try {
						Method readMethod = sourcePd.getReadMethod();
						
						if(!Modifier.isPublic(readMethod.getDeclaringClass().getModifiers())){
							readMethod.setAccessible(true);
						}
						Object value = readMethod.invoke(source);
						// 这里判断以下value是否为空 当然这里也能进行一些特殊要求的处理 例如绑定时格式转换等等
						
						if(value != null){
							Method writeMethod = targetPd.getWriteMethod();
							if(!Modifier.isPublic(writeMethod.getDeclaringClass().getModifiers())){
								writeMethod.setAccessible(true);
							}
							writeMethod.invoke(target, value);
						}
					} catch (Throwable ex){
						throw new FatalBeanException(	"Could not copy properties from source to target",	ex);
					}
				}
			}
		}
	}

}
