/**
 * @File Name		: SubjectInfoUtil.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2015-12-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.utils;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.fanglin.finance.po.SubjectPO;

public class SubjectInfoUtil {
	
	private static final String configFilePathName = "/subjectInfo.xml";
	
	private static Document document;
	
	static {
		try{
			SAXReader saxReader = new SAXReader();
			
			InputStream is = SubjectInfoUtil.class.getResourceAsStream(configFilePathName);
			
			document = saxReader.read(is);
		}catch (Exception e) {
			throw new RuntimeException("config-file cannot be load: " + configFilePathName);
		}
	}
	
	public static Map<String, SubjectPO> getSubjectInfos(){
		
		Element root = document.getRootElement();
		
		Map<String, SubjectPO> subjectPOs = new HashMap<String, SubjectPO>();
		
		for(Iterator<?> oi = root.elementIterator(); oi.hasNext();){
			Element oe = (Element) oi.next();
			
			SubjectPO subjectPO = new SubjectPO();
			
			for(Iterator<?> ti = oe.elementIterator(); ti.hasNext();){
				Element te = (Element) ti.next();
				
				String name = te.attributeValue("name");
				String value = te.getText();
				
				if(name.equals(SubjectPO.COLUMN_SID_STR)){
					subjectPO.setSid(Long.valueOf(value));
				}else if(name.equals(SubjectPO.COLUMN_NAME_STR)){
					subjectPO.setName(value);
				}else if(name.equals(SubjectPO.COLUMN_ONECODE_STR)){
					subjectPO.setOneCode(value);
				}else if(name.equals(SubjectPO.COLUMN_TWOCODE_STR)){
					subjectPO.setTwoCode(value);
				}else if(name.equals(SubjectPO.COLUMN_THRCODE_STR)){
					subjectPO.setThrCode(value);
				}else if(name.equals(SubjectPO.COLUMN_DIRECTION_STR)){
					subjectPO.setDirection(Short.valueOf(value));
				}
			}
			
			subjectPOs.put(String.valueOf(subjectPO.getSid()), subjectPO);
		}
		
		return subjectPOs;
	}
	
	public static void main(String[] args) {
		Map<String, SubjectPO> subjectInfos = SubjectInfoUtil.getSubjectInfos();
		System.out.println(subjectInfos.size());
	}
}
