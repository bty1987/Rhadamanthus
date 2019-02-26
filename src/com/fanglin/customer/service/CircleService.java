package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CirclePO;
import com.fanglin.customer.vo.CircleDrawingVO;
import com.fanglin.customer.vo.CircleVO;
import com.fanglin.utils.Paging;

public interface CircleService {
	
	public List<CircleVO> queryDecorationCircle(List<CircleVO> circleVOs,List<CirclePO> circlePOs);
	
	public void pageCircleByUnionId(Paging paging,List<Filter> filters,String unionId);
	
	public void pageCircleByOrderId(Paging paging,List<Filter> filters,CircleVO circleVO);
	
	public int addCircle(CircleVO circleVO,List<CircleDrawingVO> circleDrawingVOs,String userId) throws FLException;
	
	public int updateCircleForPraise(CircleVO circleVO) throws FLException;

}
