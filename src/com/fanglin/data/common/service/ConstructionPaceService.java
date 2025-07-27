package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionPaceVO;
import com.fanglin.utils.Paging;

public interface ConstructionPaceService {

	public void pageConstructionPace(Paging paging, List<Filter> filters, int company) throws FLException;

	public ConstructionPaceVO queryConstructionPace(ConstructionPaceVO constructionPaceVO, int company);

	public int addConstructionPace(ConstructionPaceVO constructionPace, int company);

	public int updateConstructionPace(ConstructionPaceVO constructionPace);

	public int deleteConstructionPace(ConstructionPaceVO constructionPace);

}
