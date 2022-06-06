/**
 * @File Name	: BeanUtil.java
 * @Package		: com.fanglin.utils
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BeanUtil extends org.springframework.beans.BeanUtils {

	public static Object copyPropertie(Object source, Object target) {
		return copy(source, target, null);
	}

	public static Object copyPropertie(Object source, Object target, String... ignores) {
		return copy(source, target, Arrays.asList(ignores));
	}

	public static Object copyPropertie(Object source, Object target, List<String> ignores) {
		return copy(source, target, ignores);
	}

	public static void copyProperties(Object source, Object target) {
		copy(source, target, null);
	}

	public static void copyProperties(Object source, Object target, String... ignores) {
		copy(source, target, Arrays.asList(ignores));
	}

	public static void copyProperties(Object source, Object target, List<String> ignores) {
		copy(source, target, ignores);
	}

	public static Object copy(Object source, Object target, List<String> ignores) {

		if (source == null && target == null) {
			System.out.println("target object and source object are null");
			return null;
		}

		if (source == null && target != null) {
			System.out.println(String.format("source object is null, class of target is %s", target.getClass()));
			return null;
		}

		if (source != null && target == null) {
			System.out.println(String.format("target object is null, class of source is %s", source.getClass()));
			return null;
		}

		if (ignores == null) {
			ignores = new ArrayList<String>();
		}

		PropertyDescriptor[] propertyDescriptors = getPropertyDescriptors(target.getClass());

		for (PropertyDescriptor targetPropertyDescriptor : propertyDescriptors) {

			if (ignores.contains(targetPropertyDescriptor.getName())) continue;

			if (targetPropertyDescriptor.getWriteMethod() == null) continue;

			PropertyDescriptor sourcePropertyDescriptor = getPropertyDescriptor(source.getClass(), targetPropertyDescriptor.getName());

			if (sourcePropertyDescriptor == null || sourcePropertyDescriptor.getReadMethod() == null) continue;

			// System.out.println(sourcePropertyDescriptor.getPropertyType().getSimpleName());
			// System.out.println(targetPropertyDescriptor.getPropertyType().getSimpleName());
			// System.out.println(String.format("%s value type between <%s> and <%s> is different", sourcePropertyDescriptor.getName(), source.getClass().getName(), target.getClass().getName()));

			Method sourceReadMethod = sourcePropertyDescriptor.getReadMethod();

			if (sourceReadMethod == null) continue;

			if (!Modifier.isPublic(sourceReadMethod.getDeclaringClass().getModifiers())) {
				sourceReadMethod.setAccessible(true);
			}

			Object sourceValue = null;

			try {
				sourceValue = sourceReadMethod.invoke(source);
			} catch (Exception e) {
				System.out.println(String.format("get %s value of source object is failed, exception is <%s>", sourcePropertyDescriptor.getName(), e.getMessage()));
				continue;
			}

			if (sourceValue == null) continue;

			Method targetWriteMethod = targetPropertyDescriptor.getWriteMethod();

			if (targetWriteMethod == null) continue;

			if (!Modifier.isPublic(targetWriteMethod.getDeclaringClass().getModifiers())) {
				targetWriteMethod.setAccessible(true);
			}

			try {
				targetWriteMethod.invoke(target, sourceValue);
			} catch (Exception e) {
				System.out.println(String.format("set %s value of target object is failed, exception is <%s>", targetWriteMethod.getName(), e.getMessage()));
				continue;
			}
		}

		return target;
	}

}
