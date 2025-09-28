package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionPaceNodeVO;
import com.fanglin.utils.Paging;

public interface ConstructionPaceNodeService {

	public void pageConstructionPaceNode(Paging paging, List<Filter> filters, int company, ConstructionPaceNodeVO constructionPaceNode);

	public List<ConstructionPaceNodeVO> queryConstructionPaceNode(ConstructionPaceNodeVO constructionPaceNode);

	public void addConstructionPaceNode(ConstructionPaceNodeVO constructionPaceNodeVO, int company) throws FLException;

	public void updateConstructionPaceNode(ConstructionPaceNodeVO constructionPaceNode) throws FLException;

	public void updateConstructionPaceNodeForStatus(ConstructionPaceNodeVO constructionPaceNode) throws FLException;

}
