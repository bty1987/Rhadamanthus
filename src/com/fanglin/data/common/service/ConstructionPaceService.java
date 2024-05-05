package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionPaceVO;
import com.fanglin.utils.Paging;

public interface ConstructionPaceService {

	public void pageConstructionPace(Paging paging, List<Filter> filters);

	public List<ConstructionPaceVO> queryConstructionPace();

	public void addConstructionPace(ConstructionPaceVO constructionPace) throws FLException;

	public void updateConstructionPace(ConstructionPaceVO constructionPace) throws FLException;

	public void updateConstructionPaceForStatus(ConstructionPaceVO constructionPace) throws FLException;

}
