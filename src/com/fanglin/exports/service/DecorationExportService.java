/**
 * @File Name		: DecorationExportService.java
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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.exports.vo.DecorationExportVO;

public interface DecorationExportService {

	public List<DecorationExportVO> queryDecorationForComplete(List<Filter> filters) throws FLException;

}
