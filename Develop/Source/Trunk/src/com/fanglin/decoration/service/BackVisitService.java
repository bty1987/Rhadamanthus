/**
 * @File Name		: BackVisitService
 * @Package   	: com.fanglin.service.decorationOrder;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.BackVisitVO;
import com.fanglin.utils.Paging;

public interface BackVisitService {
	
	public void pageBackVisitByOrderId(Paging paging,List<Filter> filters, BackVisitVO backVisitVO);
	
	public List<BackVisitVO> queryBackVisitByOrderId(BackVisitVO backVisitVO);
	
	public void addBackVisit(BackVisitVO backVisitVO, String userId) throws FLException;

	public void deleteBackVisitById(BackVisitVO orderDesignPicture);

}
