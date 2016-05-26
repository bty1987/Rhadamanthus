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

import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Paging;

public interface ConstructionScheduleService {
	
	public void pageDecorationOrderForConstructionSchedule(Paging paging, List<FilterVO> filters);
	
	public void pageDecorationOrderForConstructionScheduleByPlace(Paging paging, List<FilterVO> filters, String userId);
	
	public void pageDecorationOrderForSupervisionByUserId(Paging paging, List<FilterVO> filters, String userId, UserPO userPO);

	public void pageDecorationOrderForQualityByUserId(Paging paging, List<FilterVO> filters, String userId, UserPO userPO);
	
	public void pageDecorationOrderForAcceptance(Paging paging, List<FilterVO> filters);
	
	public ConstructionScheduleVO queryConstructionScheduleById(int csId);
	
	public ConstructionScheduleVO queryConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO, String userId);
	
	public ConstructionScheduleVO queryConstructionScheduleForWorkerNameByOrderId(ConstructionScheduleVO constructionScheduleVO);
	
	public void saveOrUpdateConstructionSchedule(ConstructionScheduleVO constructionScheduleVO);
	
	public void saveOrUpdateConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO);
	
	public int checkConstructionScheduleForChanStatus(ConstructionScheduleVO constructionScheduleVO) throws FLException;
	
	public int checkFirstPayment(ConstructionScheduleVO constructionScheduleVO) throws FLException;
	
	public int checkSecondPayment(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public int checkFinalyPayment(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException;

	public void nextConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO) throws FLException;

}