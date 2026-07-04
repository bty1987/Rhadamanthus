package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.construction.vo.ConstructionProfileVO;
import com.fanglin.utils.Paging;

public interface ConstructionProfileService {

	public void pageConstructionProfile(Paging paging, List<Filter> filters, int company);

	public List<ConstructionProfileVO> queryConstructionProfileByCid(ConstructionProfileVO constructionProfileVO) throws FLException;

	public List<ConstructionProfileVO> queryConstructionProfileByOrderId(ConstructionProfileVO constructionProfileVO) throws FLException;

	public ConstructionProfileVO queryConstructionProfileByCpid(ConstructionProfileVO constructionProfileVO) throws FLException;

	public int addConstructionProfile(ConstructionProfileVO constructionProfileVO, String userId, int company) throws FLException;

	public int makeConstructionProfile(ConstructionProfileVO constructionProfileVO, String userId, int company) throws FLException;

	public void handleConstructionProfile(ConstructionProfileVO constructionProfileVO) throws FLException;

}
