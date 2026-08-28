/**
 * @File Name	: ConstructionService.java
 * @Package   	: com.fanglin.service.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.construction.vo.QualiterVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionService {

	public void pageConstruction(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public void pageConstructionForSupervision(Paging paging, List<Filter> filters, String userId) throws FLException;

	public void pageConstructionForAcceptance(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public void pageConstructionForBase(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public ConstructionVO queryConstructionById(int cid) throws FLException;

	public ConstructionVO queryConstructionByOrderId(ConstructionVO constructionVO) throws FLException;

	public void updateConstructionByOrderId(ConstructionVO constructionVO, List<QualiterVO> qualiters, String userId) throws FLException;

	public int updateConstructionByCid(ConstructionVO constructionVO) throws FLException;

	public int updateConstructionForAdvance(ConstructionVO constructionVO, String userId) throws FLException;

	public int openConstruction(ConstructionVO constructionVO) throws FLException;

	public int lockConstruction(ConstructionVO constructionVO, String userId) throws FLException;

	public int balanceConstruction(ConstructionVO constructionVO, String userId) throws FLException;

	public int rejectConstructionForBalance(ConstructionVO constructionVO, String userId) throws FLException;

}