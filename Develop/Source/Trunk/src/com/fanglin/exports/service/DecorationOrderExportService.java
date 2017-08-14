/**
 * @File Name		: DecorationOrderExportService.java
 * @Package   	: com.fanglin.exports.service
 * @Version		: 1.0
 * @Date			: 2017-8-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.exports.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.exports.vo.DecorationOrderExportVO;

public interface DecorationOrderExportService {
	
	public List<DecorationOrderExportVO> queryDecorationOrderForComplete(List<Filter> filters);

}
