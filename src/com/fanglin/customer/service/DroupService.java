package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.DroupVO;
import com.fanglin.utils.Paging;

public interface DroupService {

	public void pageDroup(Paging paging, List<Filter> filters);

	public DroupVO queryDroup(DroupVO droupVO) throws FLException;

	public int bindDroup(DroupVO droup, String userId) throws FLException;

	public int deleteDroup(DroupVO droup);

	public int updateDroup(DroupVO droup) throws FLException;
}
