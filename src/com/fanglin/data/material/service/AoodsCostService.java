package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.AoodsCostVO;
import com.fanglin.utils.Paging;

public interface AoodsCostService {

	public void pageAoodsCost(Paging paging, List<Filter> filters, AoodsCostVO aoodsCostVO);
	
	public int addAoodsCost(AoodsCostVO aoodsCostVO) throws FLException;
	
	public int deleteAoodsCost(AoodsCostVO aoodsCostVO);
}
