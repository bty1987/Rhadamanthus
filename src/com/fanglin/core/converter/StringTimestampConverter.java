package com.fanglin.core.converter;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.struts2.util.StrutsTypeConverter;

import com.opensymphony.xwork2.conversion.TypeConversionException;

public class StringTimestampConverter extends StrutsTypeConverter {
	
	@Override
	@SuppressWarnings("rawtypes")
	public Object convertFromString(Map arg0, String[] arg1, Class arg2) {

		try {
			
//			String rexp1 = "((\\d{2}(([02468][048])|([13579][26]))[\\-]((((0?[13578])|(1[02]))[\\-]((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-]((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-]((0?[1-9])|([1-2][0-9])))))|(\\d{2}(([02468][1235679])|([13579][01345789]))[\\-]((((0?[13578])|(1[02]))[\\-]((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-]((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-]((0?[1-9])|(1[0-9])|(2[0-8]))))))";
			String rexp1 = "\\d{4}-\\d{2}-\\d{2}";
			
//			String rexp2 = "((\\d{2}(([02468][048])|([13579][26]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])))))|(\\d{2}(([02468][1235679])|([13579][01345789]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\\s((([0-1][0-9])|(2?[0-3]))\\:([0-5]?[0-9])((\\s)|(\\:([0-5]?[0-9])))))";
			String rexp2 = "\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}";
			
		    Pattern r = Pattern.compile(rexp1);
		    Pattern r2 = Pattern.compile(rexp2);
		 
		    Matcher m = r.matcher(arg1[0]);
		    Matcher m2 = r2.matcher(arg1[0]);
		    
			if (arg1 == null || arg1.length == 0) {
				return null;
			}
			
			if(m.matches()){
				return new Timestamp(new SimpleDateFormat("yyyy-MM-dd").parse(arg1[0]).getTime());  
			}
			
			if(m2.matches()){
				return new Timestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(arg1[0]).getTime());  
			}
			
			return null;
			
		} catch (Exception e) {
			throw new TypeConversionException(e);
		}

	}

	@Override
	@SuppressWarnings("rawtypes")
	public String convertToString(Map arg0, Object arg1) {
		try{
            if(arg1 instanceof Timestamp){
                return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(((Timestamp)arg1).getTime()));
            }
            return "";
        }catch(Exception e){
            throw new TypeConversionException(e);
        }
	}
	
}
