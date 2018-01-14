package com.fanglin.data.construction.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.construction.vo.ConstructionNodeCompanyVO;
import com.fanglin.data.construction.vo.ConstructionNodeVO;
import com.fanglin.utils.Paging;

public interface ConstructionNodeService {

	public void pageConstructionNode(Paging paging, List<Filter> filters);
	
	public List<ConstructionNodeVO> queryConstructionNode(ConstructionNodeVO constructionNode);

	public List<ConstructionNodeVO> queryConstructionNodeByCid(ConstructionNodeCompanyVO constructionNodeCompany) throws FLException;
	
	public void addConstructionNode(ConstructionNodeVO constructionNodeVO);
	
	public void updateConstructionNodeForStatus(ConstructionNodeVO constructionNodeVO);
	
	public void updateConstructionNodeCompany(ConstructionNodeCompanyVO constructionNodeCompany, List<Long> cnids) throws FLException;
}
