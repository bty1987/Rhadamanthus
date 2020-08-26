package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.RevisitVO;
import com.fanglin.utils.Paging;

public interface RevisitService {
	
	public void pageRevisit(Paging paging, List<Filter> filters);
	
    public List<RevisitVO> queryRevisitByOrderId(RevisitVO revisitVO);
   
    public List<RevisitVO> queryRevisitForAepair(RevisitVO revisitVO);
   
    public List<RevisitVO> queryRevisitForComplain(RevisitVO revisitVO);
    
	public void visitRevisit(RevisitVO revisitVO,String userId);
}
