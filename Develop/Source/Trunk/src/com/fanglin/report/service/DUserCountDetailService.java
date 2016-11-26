/**
 * @File Name		: DUserCountDetailService.java
 * @Package   	: com.fanglin.report.service
 * @Version		: 1.0
 * @Date			: 2016-11-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.service;

import java.text.ParseException;
import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.vo.DUserCountDetailVO;

public interface DUserCountDetailService {
	
	public List<DUserCountDetailVO> queryDUserCountDetail(List<FilterVO> filters, String userId) throws FLException, ParseException; 
	
}
