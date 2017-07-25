/**
 * @File Name		: ConstructionScheduleService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Paging;

public interface ConstructionService {
	
	public void pageDecorationOrderForConstruction(Paging paging, List<Filter> filters);
	
	public void pageDecorationOrderForSupervisionByUserId(Paging paging, List<Filter> filters, String userId, UserPO userPO);

	public void pageDecorationOrderForQualityByUserId(Paging paging, List<Filter> filters, String userId, UserPO userPO);
	
	public void pageDecorationOrderForAcceptance(Paging paging, List<Filter> filters);
	
	public ConstructionVO queryConstructionById(int cid);
	
	public ConstructionVO queryConstructionByOrderId(ConstructionVO constructionVO, String userId);
	
	public ConstructionVO queryConstructionForWorkerNameByOrderId(ConstructionVO constructionVO);
	
	public void saveOrUpdateConstruction(ConstructionVO constructionVO);
	
	public void saveOrUpdateConstructionByOrderId(ConstructionVO constructionVO);
	
	public int checkConstructionForChanStatus(ConstructionVO constructionVO) throws FLException;
	
	public int checkFirstPayment(ConstructionVO constructionVO) throws FLException;
	
	public int checkSecondPayment(ConstructionVO constructionVO) throws FLException;

	public int checkFinalyPayment(ConstructionVO constructionVO, String userId) throws FLException;

	public void nextConstructionByOrderId(ConstructionVO constructionVO) throws FLException;

}