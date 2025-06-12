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
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.utils.Paging;

public interface DecorationService {

	public void pageDecoration(Paging paging, List<Filter> filters, Authentication authentication, List<Short> statuses, Short companyType) throws FLException;

	public void pageDecorationForGeneral(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForCommon(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForCompany(Paging paging, List<Filter> filters, int company, List<Short> statuses) throws FLException;

	public void pageDecorationForGrade(Paging paging, List<Filter> filters, int company) throws FLException;

	public void pageDecorationForCustomer(Paging paging, List<Filter> filters, String customerPhone) throws FLException;

	public void pageDecorationForDesigner(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForDesignerDept(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForDesignerManager(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForSalesman(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForSalesmanDept(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForSalesmanManager(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForQuoter(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForEscorter(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForMaterialer(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public void pageDecorationForBelong(Paging paging, List<Filter> filters, Authentication authentication) throws FLException;

	public List<DecorationVO> queryDecorationByCustomerId(DecorationVO decorationVO, Authentication authentication) throws FLException;

	public List<DecorationVO> queryDecorationForReferByOrderId(DecorationVO decorationVO, Authentication authentication) throws FLException;

	public DecorationVO queryDecorationByOrderId(String orderId) throws FLException;

	public DecorationVO queryDecorationForCommonByOrderId(DecorationVO decorationVO, String userId) throws FLException;

	public DecorationVO checkDecoration(DecorationVO decorationVO, Authentication authentication) throws FLException;

	public void checkDecorationForExist(DecorationVO decorationVO);

	public void createDecoration(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, String userId, int company) throws FLException;

	public void createDecorationForAdvance(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, String userId, int company) throws FLException;

	public void changeDecorationForAdvance(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, String userId) throws FLException;

	public void changeDecorationForCustomer(DecorationVO decorationVO) throws FLException;

	public void changeDecorationForHouse(DecorationVO decorationVO, String userId) throws FLException;

	public void changeDecorationForOrderId(String oldOrderId, String newOrderId, String userId) throws FLException;

	public void changeDecorationForTime(DecorationVO decorationVO, int timeType, Timestamp dateTime, String userId) throws FLException;

	public void changeDecorationForVersionId(DecorationVO decorationVO, String userId) throws FLException;

	public void changeDecorationForPayScale(DecorationVO decorationVO, String userId) throws FLException;

	public void changeDecorationForStatus(DecorationVO decorationVO, String userId) throws FLException;

	public void changeDecorationForRepairStatus(DecorationVO decorationVO) throws FLException;

	public void changeDecorationForType(DecorationVO decorationVO, String userId) throws FLException;

	public void obsoleteDecoration(DecorationVO decorationVO, String userName) throws FLException;

	public void terminalDecoration(DecorationVO decorationVO, List<DecorationPaymentVO> decorationPaymentVOs, String userId, int company) throws FLException;

	public void subDecorationForQuotationTime(DecorationVO decorationVO, String userId) throws FLException;

	public void tranDecoration(DecorationVO decorationVO, int company) throws FLException;

	public void updateDecorationForAdvance(DecorationVO decorationVO, String userId) throws FLException;

	public void updateDecorationForPayScale(DecorationVO decorationVO) throws FLException;

	public void updateDecorationForSaleScale(DecorationVO decorationVO) throws FLException;

}
