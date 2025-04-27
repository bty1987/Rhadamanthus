package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.ColorPoolVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ColorPoolService {

	public void pageColorPool(Paging paging, List<Filter> filters);

	public List<ColorPoolVO> queryColorPoolByGpid(ColorPoolVO colorPoolVO);

	public List<ColorPoolVO> queryColorPoolForEnableByGpid(ColorPoolVO colorPoolVO);

	public int addColorPool(ColorPoolVO colorPoolVO) throws FLException;

	public int updataColorPoolForStatus(ColorPoolVO colorPoolVO) throws FLException;

}
