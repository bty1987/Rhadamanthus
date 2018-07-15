package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.MbrandVO;
import com.fanglin.utils.Paging;

public interface MbrandService {

	public void pageMbrand(Paging paging, List<Filter> filters);

	public List<MbrandVO> queryMbrand(MbrandVO mbrand);
	
	public List<MbrandVO> queryMbrandByName(MbrandVO mbrand);

	public void addMbrand(MbrandVO mbrand) throws FLException;

	public void updateMbrand(MbrandVO mbrand) throws FLException;

	public void updateMbrandForStatus(MbrandVO mbrand) throws FLException;

}
