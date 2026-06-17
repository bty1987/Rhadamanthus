package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.PointAccountVO;
import com.fanglin.utils.Paging;

public interface PointAccountService {

	public void pagePointAccount(Paging paging, List<Filter> filters);

	public PointAccountVO queryPointAccount(PointAccountVO pointAccountVO);

	public PointAccountVO createPointAccount(PointAccountVO pointAccountVO, int company, String userId) throws FLException;

	public PointAccountVO grantPoint(PointAccountVO pointAccountVO, String userId) throws FLException;

	public PointAccountVO consumePoint(PointAccountVO pointAccountVO, String userId) throws FLException;

}
