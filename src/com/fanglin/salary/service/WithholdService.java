package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.WithholdVO;
import com.fanglin.utils.Paging;

public interface WithholdService {
	
	public void pageWithhold(Paging paging,List<Filter> filters);
	
	public List<WithholdVO> queryWithhold(WithholdVO withhold);
	
	public int addWithhold(WithholdVO withhold, String userId)throws FLException;
	
	public int updateWithholdForStatus(WithholdVO withhold, String userId)throws FLException;

}
