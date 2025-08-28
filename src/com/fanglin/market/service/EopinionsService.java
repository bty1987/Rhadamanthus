package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.vo.EopinionsVO;
import com.fanglin.utils.Paging;

public interface EopinionsService {

	public void pageEopinions(Paging paging, List<Filter> filters);

	public List<EopinionsVO> queryEopinionsByType(EopinionsVO opinionsVO);

	public void addEopinion(EopinionsVO opinionsVO) throws FLException;

	public void updateEopinion(EopinionsVO opinionsVO) throws FLException;

	public void deleteEopinion(EopinionsVO opinionsVO) throws FLException;

}
