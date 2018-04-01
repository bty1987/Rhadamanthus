package com.fanglin.core.converter;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.apache.struts2.util.StrutsTypeConverter;

import com.opensymphony.xwork2.conversion.TypeConversionException;

public class StringTimestampConverter extends StrutsTypeConverter {
	
	private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	@Override
	@SuppressWarnings("rawtypes")
	public Object convertFromString(Map arg0, String[] arg1, Class arg2) {

		try {
			if (arg1 == null || arg1.length == 0) {
				return null;
			}
//			System.out.println(new Timestamp(sdf.parse(arg1[0]).getTime()));
			return new Timestamp(sdf.parse(arg1[0]).getTime());  
			
		} catch (Exception e) {
			throw new TypeConversionException(e);
		}
	}

	@Override
	@SuppressWarnings("rawtypes")
	public String convertToString(Map arg0, Object arg1) {
		try{
            if(arg1 instanceof Timestamp){
                return sdf.format(new Date(((Timestamp)arg1).getTime()));
            }
            return "";
        }catch(Exception e){
            throw new TypeConversionException(e);
        }
	}
}
