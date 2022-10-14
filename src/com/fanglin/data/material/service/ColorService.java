package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.utils.Paging;

public interface ColorService {

	public void pageColor(Paging paging, List<Filter> filters, int company);

	public List<ColorVO> queryColorByGid(ColorVO colorVO);

	public List<ColorVO> queryColorForEnableByGid(ColorVO colorVO);

	public int addColor(ColorVO colorVO) throws FLException;

	public int updataColorForStatus(ColorVO colorVO) throws FLException;

}
