/**
 * @File Name		: DecorationOrderService
 * @Package   	: com.fanglin.service.decorationOrder
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.drawline.service;

import java.util.HashMap;
import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.drawline.vo.DrawLineVO;
import com.fanglin.utils.Paging;

public interface DrawLineService {
	
	public List<DrawLineVO> pageDrawLine(Paging paging, List<FilterVO> filters);
	
	public List<DrawLineVO> queryDrawLine(List<FilterVO> filters);
	
	public HashMap<String, HashMap<String, Integer>> countDrawLineByDate(DrawLineVO decorationOrderDrawLineVO);

	public int applayDrawLine(DrawLineVO drawLine, String userId) throws FLException;

	public int resetDrawLine(DrawLineVO drawLine) throws FLException;

	public int updateDrawLineForStatus(DrawLineVO drawLine, String userId) throws FLException;

}
