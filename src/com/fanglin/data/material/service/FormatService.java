package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.utils.Paging;

public interface FormatService {

	public void pageFormat(Paging paging, List<Filter> filters, int company);

	public List<FormatVO> queryFormatByGid(FormatVO formatVO);

	public List<FormatVO> queryFormatForEnableByGid(FormatVO formatVO);

	public int addFormat(FormatVO formatVO) throws FLException;

	public int updateFormatForStatus(FormatVO formatVO) throws FLException;

}
