/**
 * @File Name	: DecorationOrderService
 * @Package   	: com.fanglin.service.decorationOrder
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.communion.vo.ConstructionNodeVO;
import com.fanglin.construction.vo.DrawLineVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DrawLineService {

	public List<DrawLineVO> pageDrawLine(Paging paging, List<Filter> filters, int company);

	public List<DrawLineVO> queryDrawLine(List<Filter> filters, int company) throws FLException;

	public List<?> countDrawLine(DrawLineVO drawLineVO, int company);

	public int updateDrawLine(DrawLineVO drawLineVO) throws FLException;

	public int applayDrawLine(DrawLineVO drawLineVO, String userId) throws FLException;

	public int resetDrawLine(DrawLineVO drawLineVO) throws FLException;

	public int successDrawLine(DrawLineVO drawLineVO, List<ConstructionNodeVO> constructionNodes, String userId) throws FLException;

	public int failureDrawLine(DrawLineVO drawLineVO, String userId) throws FLException;

}
