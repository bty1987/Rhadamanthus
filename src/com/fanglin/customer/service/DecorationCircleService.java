package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.DecorationCirclePO;
import com.fanglin.customer.vo.DecorationCirclePictureVO;
import com.fanglin.customer.vo.DecorationCircleVO;
import com.fanglin.utils.Paging;

public interface DecorationCircleService {
	
	public List<DecorationCircleVO> queryDecorationCircle(List<DecorationCircleVO> decorationCircleVOs,List<DecorationCirclePO> decorationCirclePOs);
	
	public void queryDecorationCircleByUnionId(Paging paging,List<Filter> filters,String unionId);
	
	public void queryDecorationCircleByOrderId(Paging paging,List<Filter> filters,DecorationCircleVO decorationCircleVO);
	
	public int addDecorationCircle(DecorationCircleVO decorationCircleVO,List<DecorationCirclePictureVO> decorationCirclePictureVOs,String userId) throws FLException;
	
	public int updateDecorationCircleForLike(DecorationCircleVO decorationCircleVO) throws FLException;

}
