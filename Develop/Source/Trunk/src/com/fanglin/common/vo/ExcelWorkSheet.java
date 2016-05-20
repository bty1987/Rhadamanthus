package com.fanglin.common.vo;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.FatalBeanException;
import org.springframework.util.Assert;

import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

public class ExcelWorkSheet<T> {
	
	private String sheetName;
	
	private List<T> data = new ArrayList<T>(); // 数据行
	
	private List<String> columns; // 列名
	
	private List<Integer> propertyTypes; // 属性转换类型
	
	private List<String> propertyNames; // 属性名称 与上面的propertyTypes结合使用 一一对应关系

	public String getSheetName(){
		return sheetName;
	}

	public void setSheetName(String sheetName){
		this.sheetName = sheetName;
	}

	public List<T> getData(){
		return data;
	}

	public void setData(List<T> data){
		this.data = data;
	}

	public List<String> getColumns(){
		return columns;
	}

	public void setColumns(List<String> columns){
		this.columns = columns;
	}

	public void setPropertyNames(List<String> propertyNames){
		this.propertyNames = propertyNames;
	}

	public List<String> getPropertyNames(){
		return propertyNames;
	}

	public void setPropertyTypes(List<Integer> propertyTypes){
		this.propertyTypes = propertyTypes;
	}

	public List<Integer> getPropertyTypes(){
		return propertyTypes;
	}

	public String getIndexPropertyValue(Object obj, int index){

		Assert.notNull(obj, "Target must not be null");
		String valueString = null;
		PropertyDescriptor propertyDescriptor = BeanUtil.getPropertyDescriptor(obj.getClass(), propertyNames.get(index));
		
		try {
			Method readMethod = propertyDescriptor.getReadMethod();
			if(!Modifier.isPublic(readMethod.getDeclaringClass().getModifiers())){
				readMethod.setAccessible(true);
			}
			Object value = readMethod.invoke(obj);

			if(value instanceof Date){
				Date date = (Date) value;
				valueString = DateUtil.getDateToDateString(date, "yyyy-MM-dd HH:mm:ss");
			}else{
				valueString = value == null ? "" : value.toString();  
			}

		}catch(Throwable ex){
			ex.printStackTrace();
			throw new FatalBeanException("get property value fail", ex);
		}

		return valueString;
	}

}
