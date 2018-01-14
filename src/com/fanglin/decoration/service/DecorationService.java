/**
 * @File Name		: DecorationService
 * @Package   	: com.fanglin.service.decoration
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.Paging;

public interface DecorationService {
	
	public void pageDecorationForGeneral(Paging paging, List<Filter> filters, Authentication authentication);
	
	public void pageDecorationForCommon(Paging paging, List<Filter> filters, Authentication authentication);
	
	public void pageDecorationForMaterial(Paging paging, List<Filter> filters, Authentication authentication);
	
	public void pageDecorationForDesigner(Paging paging, List<Filter> filters, Authentication authentication);

	public void pageDecorationForSalesman(Paging paging, List<Filter> filters, Authentication authentication);
	
	public void pageDecorationForBelong(Paging paging, List<Filter> filters, Authentication authentication);
	
	public void pageDecorationForAdvance(Paging paging, List<Filter> filters, Authentication authentication);
	
	public void pageDecorationForQuoter(Paging paging, List<Filter> filters, Authentication authentication);
	
	public void pageDecorationForEscorter(Paging paging, List<Filter> filters, Authentication authentication);
	
	public void pageDecorationForDesignerManager(Paging paging, List<Filter> filters, Authentication authentication);
	
	public void pageDecorationForSalesmanManager(Paging paging, List<Filter> filters, Authentication authentication);
	
	public DecorationVO queryDecorationByVillageIdAHouseNumber(DecorationVO decorationVO, Authentication authentication);
	
	public DecorationVO queryDecorationForCommonByOrderId(DecorationVO decorationVO, String userId) throws FLException;

	public DecorationVO queryDecorationForDesignerByOrderId(DecorationVO decorationVO, String userId) throws FLException;

	public DecorationVO queryDecorationById(String decorationOrderId) throws FLException;
	
	public List<DecorationVO> queryDecorationByCustomerId(DecorationVO decorationVO, Authentication authentication) throws FLException;
	
	public void checkDecorationExist(DecorationVO decorationVO);
	
	public int changeDecorationForAdvance(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO) throws FLException;
	
	public int changeDecorationForOrderId(String oldOrderId, String newOrderId, String userId) throws FLException;
	
	public void changeDecorationForVersionId(DecorationVO decorationVO, String userId);
	
	public void changeDecorationForTime(DecorationVO decorationVO, int timeType, Timestamp dateTime, String userId);
	
	public void changeDecorationForStatus(DecorationVO decorationVO, String userId);
	
	public void changeDecorationForType(DecorationVO decorationVO, String userId);

	public void createDecoration(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, Authentication authentication) throws FLException;

	public int obsoleteDecoration(DecorationVO decorationVO, String userName) throws FLException;

	public int terminalDecoration(DecorationVO decorationVO, float refundValue, float paymentValue, Authentication authentication) throws FLException;
	
	public int subDecorationForQuotationTime(DecorationVO decorationVO, String userId) throws FLException;

	public DecorationVO checkdecoration(Paging paging,List<Filter> filters, Authentication authentication);
	
}
