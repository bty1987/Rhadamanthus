/**
 * @File Name		: DecorationOrderService
 * @Package   	: com.fanglin.service.decorationOrder
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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.vo.DecorationOrderExportVO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.utils.Paging;

public interface DecorationOrderService {
	
	public void pageDecorationOrderForGeneral(Paging paging, List<FilterVO> filters, String userId);
	
	public void pageDecorationOrderForCommon(Paging paging, List<FilterVO> filters, String userId);
	
	public void pageDecorationOrderForMaterial(Paging paging, List<FilterVO> filters, String userId);
	
	public void pageDecorationOrderForDesigner(Paging paging, List<FilterVO> filters, String userId);

	public void pageDecorationOrderForSalesman(Paging paging, List<FilterVO> filters, String userId);
	
	public void pageDecorationOrderForBelong(Paging paging, List<FilterVO> filters, String userId);
	
	public DecorationOrderVO queryDecorationOrderByVillageIdAHouseNumber(DecorationOrderVO decorationOrderVO);
	
	public int queryDecorationOrderForCondition(String userId);
	
	public DecorationOrderVO queryDecorationOrderForCommonByOrderId(DecorationOrderVO decorationOrderVO, String userId) throws FLException;

	public DecorationOrderVO queryDecorationOrderForSignedByCustomerId(DecorationOrderVO decorationOrderVO) throws FLException;
	
	public DecorationOrderVO queryDecorationOrderForDesignerByOrderId(DecorationOrderVO decorationOrderVO, String userId) throws FLException;

	public DecorationOrderVO queryDecorationOrderById(String decorationOrderId) throws FLException;
	
	public List<DecorationOrderExportVO> queryDecorationOrderForComplete(List<FilterVO> filters);
	
	public void checkDecorationOrderExist(DecorationOrderVO decorationOrderVO);
	
	public int changeDecorationOrderForAdvance(DecorationOrderVO decorationOrderVO) throws FLException;
	
	public int changeDecorationOrderForOrderId(String oldOrderId, String newOrderId, String userId) throws FLException;
	
	public void changeDecorationOrderForVersionId(DecorationOrderVO decorationOrderVO, String userId);
	
	public void changeDecorationOrderForTime(DecorationOrderVO decorationOrderVO, int timeType, Timestamp dateTime, String userId);
	
	public void changeDecorationOrderForStatus(DecorationOrderVO decorationOrderVO, String userId);

	public void createDecorationOrder(DecorationOrderVO decorationOrderVO) throws FLException;

	public void createDecorationOrderForMaterial(DecorationOrderVO decorationOrderVO) throws FLException;
	
	public int obsoleteDecorationOrder(DecorationOrderVO decorationOrderVO, String userName) throws FLException;

	public int terminalDecorationOrder(DecorationOrderVO decorationOrderVO, float refundValue, float paymentValue, String userId) throws FLException;
	
	public int subDecorationOrderForQuotationTime(DecorationOrderVO decorationOrderVO, String userName) throws FLException;
	
}
