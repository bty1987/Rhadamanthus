package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.ConstructionNodeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionNodeService {

	public void pageConstructionNode(Paging paging, List<Filter> filters, int company);

	public List<ConstructionNodeVO> queryConstructionNode(int company);

	public List<ConstructionNodeVO> queryConstructionNodeByOrderId(String orderId) throws FLException;

	public void addConstructionNode(ConstructionNodeVO constructionNodeVO);

	public void updateConstructionNode(ConstructionNodeVO constructionNodeVO) throws FLException;

	public void updateConstructionNodeForStatus(ConstructionNodeVO constructionNodeVO);

}
