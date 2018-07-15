package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.VustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface VustomerService {
	
	public void pageVustomer(Paging paging, List<Filter> filters);
	
	public void pageVustomerByUnionId(Paging paging, List<Filter> filters, String unionId);
	
	public List<VustomerVO> queryVustomerByUnionId(VustomerVO vustomerVO);
	
	public void addVustomer(VustomerVO vustomerVO);
	
	public void updateVustomer(VustomerVO vustomerVO) throws FLException;

	public void deleteVustomer(VustomerVO vustomerVO);

	public List<?> countVustomerByUnionId(VustomerVO vustomerVO);
	
}
