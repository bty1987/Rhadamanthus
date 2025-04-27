package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.FormatPoolVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface FormatPoolService {

	public void pageFormatPool(Paging paging, List<Filter> filters);

	public List<FormatPoolVO> queryFormatPoolByGpid(FormatPoolVO formatPoolVO);

	public List<FormatPoolVO> queryFormatPoolForEnableByGpid(FormatPoolVO formatPoolVO);

	public int addFormatPool(FormatPoolVO formatPoolVO) throws FLException;

	public int updateFormatPoolForStatus(FormatPoolVO formatPoolVO) throws FLException;

}
