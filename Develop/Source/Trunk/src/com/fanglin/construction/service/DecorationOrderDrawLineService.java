/**
 * @File Name		: DecorationOrderService
 * @Package   	: com.fanglin.service.decorationOrder
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.HashMap;
import java.util.List;

import com.fanglin.construction.vo.DecorationOrderDrawLineVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface DecorationOrderDrawLineService {
	
	public void pageDecorationOrderByPersonInfo(Paging paging, List<FilterVO> filters);
	
	public List<DecorationOrderDrawLineVO> pageDecorationOrderDrawLine(Paging paging, List<FilterVO> filters);
	
	public HashMap<String, HashMap<String, Integer>> queryDecorationOrderDrawLineForCountByDate(DecorationOrderDrawLineVO decorationOrderDrawLineVO);

	public int applayDecorationOrderDrawLine(DecorationOrderDrawLineVO drawLine) throws FLException;

	public int editDecorationOrderDrawLine(DecorationOrderDrawLineVO drawLine) throws FLException;

	public int saveDecorationOrderDrawLineForStatus(DecorationOrderDrawLineVO drawLine,String userId) throws FLException;

}
