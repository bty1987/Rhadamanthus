package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ChatingVO;
import com.fanglin.utils.Paging;

public interface ChatingService {

	public void pageChating(Paging paging, List<Filter> filters, int company);

	public List<ChatingVO> queryChating(int company) throws FLException;

	public int addChating(ChatingVO chating, int company) throws FLException;

	public int updateChating(ChatingVO chating) throws FLException;

	public int updateChatingForStatus(ChatingVO chating) throws FLException;

	public int deleteChating(ChatingVO chating) throws FLException;

}
