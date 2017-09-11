/**
 * @File Name		: DecorationContractServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationBelongInfoPO;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.report.service.DecorationRankService;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;

@Service("decorationContractService")
@Transactional(readOnly=true)
public class DecorationContractServiceImpl implements DecorationContractService {

	@Autowired
	private DecorationContractDao decorationContractDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private DecorationBelongDao orderBelongInfoDao;
	
	@Autowired
	private DecorationRankService decorationRankService;
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private DecorationOperateDao decorationOperateDao;
	
	@Autowired
	private AddReduceDao addReduceDao;	
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public DecorationContractVO queryDecorationContractByOrderId(DecorationContractVO decorationContractVO) throws FLException{
		
		String orderId = decorationContractVO.getOrderId();
		
		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(orderId);
		
		if(decorationContractPO != null){
			BeanUtil.copyProperties(decorationContractPO, decorationContractVO);
		}
		
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentForBaseByOrderId(orderId);
		Map<String, String> payments = new HashMap<String, String>();
		
		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			payments.put(decorationPaymentPO.getPaymentType(), Float.valueOf(decorationPaymentPO.getReferMoney()).toString());
		}
		
		decorationContractVO.setPayments(payments);
		decorationContractVO.setPaymentRates(Arrays.asList(SystemConfig.getInt("firstRate"), SystemConfig.getInt("firstSecondRate"), SystemConfig.getInt("secondRate"), SystemConfig.getInt("lastRate")));
		
		return decorationContractVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public DecorationContractVO queryDecorationContractForQuotationByOrderId(DecorationContractVO decorationContractVO)  throws FLException{
		
		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(decorationContractVO.getOrderId());
		
		if(decorationContractPO != null){
			BeanUtil.copyProperties(decorationContractPO, decorationContractVO);
			
			if(decorationContractPO.getOrderTotalPrice() == 0f && decorationContractPO.getDecorationOrderPO() != null){
				decorationContractPO.setOrderTotalPrice(decorationContractPO.getDecorationOrderPO().getOrderTotalPrice());
				
				decorationContractDao.update(decorationContractPO);
			}
		}else{
			decorationContractVO.setTemplateHtml(SystemConfig.getString("contractPath"));
		}
		
		return decorationContractVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveDecorationContract(DecorationContractVO decorationContractVO) throws FLException{
		
		List<String> noUpdateStatus = Arrays.asList(new String[]{DecorationOrderPO.STATUS_SIGNED_STR, DecorationOrderPO.STATUS_COMPLETED_STR, DecorationOrderPO.STATUS_WASTE_STR, DecorationOrderPO.STATUS_TERMINATION_STR}); // 已签约, 已完工, 废单, 合同终止
		
		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(decorationContractVO.getOrderId());
		
		if(decorationContractPO != null){
			if(noUpdateStatus.contains(decorationContractPO.getDecorationOrderPO().getStatus())){
				throw new FLException(140005, "订单合同不能修改");
			}
		}else{
			decorationContractPO = new DecorationContractPO();
		}
	
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationContractVO.getOrderId());
		
		StringBuffer contractCode= new StringBuffer(SystemConfig.getString("contractStartWith", "FLJ-"));
		contractCode.append(decorationOrderPO.getOrderId());
		contractCode.append("-");
		contractCode.append(decorationOrderPO.getDesignerPO().getDept().getContractPrefix());
		
		decorationContractPO.setAdditionalInfo(decorationContractVO.getAdditionalInfo());
		decorationContractPO.setEndTime(decorationContractVO.getEndTime());
		decorationContractPO.setStartTime(decorationContractVO.getStartTime());
		decorationContractPO.setDecorationOrderPO(decorationOrderPO);
		decorationContractPO.setContractCode(contractCode.toString());
		decorationContractPO.setWorkingDuration(decorationContractVO.getWorkingDuration());
		decorationContractPO.setTemplateHtml(SystemConfig.getString("contractPath", "decorationContract1.html"));
		decorationContractPO.setSignTime(DateUtil.getDateToTimestamp(new Date()));
	
		decorationContractDao.saveOrUpdate(decorationContractPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int signDecorationContract(DecorationContractVO decorationContractVO, Authentication authentication) throws FLException{
		
		List<String> noUpdateStatus = Arrays.asList(new String[]{DecorationOrderPO.STATUS_SIGNED_STR, DecorationOrderPO.STATUS_COMPLETED_STR, DecorationOrderPO.STATUS_WASTE_STR, DecorationOrderPO.STATUS_TERMINATION_STR}); // 已签约, 已完工, 废单, 合同终止
		List<Object> noPaymentStatus = Arrays.asList(new Object[]{null, DecorationPaymentPO.PAYMENTTYPE_ADVANCE_STR, DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR, DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR});
		
		boolean resignFlag = false;
		String orderId = decorationContractVO.getOrderId();
		String userId = authentication.getUserId();
				
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(noUpdateStatus.contains(decorationOrderPO.getStatus())){
			throw new FLException(140005, "订单合同不能修改");
		}
		
		if(noPaymentStatus.contains(decorationOrderPO.getPaymentStatus())){
			throw new FLException(140006, "订单没有进行款项交付,不能签订合同");
		}
		
		if(approvalDao.countApprovalForInitByIdent(orderId) > 0){
			throw new FLException(140037, "订单存在未处理审批项");
		}
		
		int decorationOrderCompany = decorationOrderPO.getCompany();
		
		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(orderId);
		
		if(decorationContractPO == null){
			decorationContractPO = new DecorationContractPO();
			decorationContractPO.setDecorationOrderPO(decorationOrderPO);
		}
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		
		if(quotationPO == null){
			throw new FLException(140008, "订单没有报价信息");
		}
		
		if(Math.abs(quotationPO.getTotalPrice() - decorationOrderPO.getOrderTotalPrice()) > 100){
			throw new FLException(140009, "报价金额不等于合同金额");
		}
		
		if(DecorationOrderPO.STATUS_RESIGNED_STR.equals(decorationOrderPO.getStatus())){
			resignFlag = true;
		}
		
		//更新归属信息的部门和大区
		List<DecorationBelongInfoPO> designerOrderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR);
		for(DecorationBelongInfoPO orderBelongInfoPO: designerOrderBelongInfoPOs){
			orderBelongInfoPO.setBelongDeptPO(orderBelongInfoPO.getBelongUserPO().getDept());
			orderBelongInfoPO.setBelongRegionPO(orderBelongInfoPO.getBelongUserPO().getDept().getFatherDept());
			
			orderBelongInfoDao.update(orderBelongInfoPO);
		}
		
		List<DecorationBelongInfoPO> salemsanOrderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR);
		for(DecorationBelongInfoPO orderBelongInfoPO: salemsanOrderBelongInfoPOs){
			orderBelongInfoPO.setBelongDeptPO(orderBelongInfoPO.getBelongUserPO().getDept());
			orderBelongInfoPO.setBelongRegionPO(orderBelongInfoPO.getBelongUserPO().getDept().getFatherDept());
			
			orderBelongInfoDao.update(orderBelongInfoPO);
		}
		
		decorationOrderPO.setStatus(DecorationOrderPO.STATUS_SIGNED_STR);
		decorationOrderPO.setContractCode(decorationContractPO.getContractCode());
		decorationOrderPO.setContractUserId(userId);
		
		if(!resignFlag){
			decorationOrderPO.setContractTime(DateUtil.getDateToTimestamp(new Date()));
		}
		
		decorationOrderDao.update(decorationOrderPO);
		
		UserPO operater = userDao.queryUserByUserId(userId);
		
		DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
		decorationOperatePO.setDecorationOrder(decorationOrderPO);
		decorationOperatePO.setOperater(operater);
		decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
		decorationOperatePO.setDes("签订合同");
		decorationOperatePO.setValue(decorationOrderPO.getOrderTotalPrice());
		
		if(!resignFlag){
			
			float orderTotalPrice = decorationOrderPO.getOrderTotalPrice();
			float managePrice = quotationPO.getManagePrice();
			float manageRate = quotationPO.getManageRate();
			float notSalesmanRate = decorationOrderPO.getNotSalesmanRate();
			
			double achievement = 0f;
			
			if(manageRate != 0){
				achievement = Arith.div(managePrice, manageRate);
			}
			
			float rank = Math.round(Arith.sub(orderTotalPrice, Arith.mul(notSalesmanRate, achievement)));
			
			UserPO userPO = decorationOrderPO.getDesignerPO();
			DepartmentPO departmentPO = userPO.getDept();
			DepartmentPO regionPO = userPO.getDept().getFatherDept();
			
			String designerId = userPO.getUserId();
			String designerName = userPO.getUserName();
			
			String departmentId = departmentPO.getDeptId();
			String departmentName = departmentPO.getDeptName();
			
			String regionId = regionPO.getDeptId();
			String regionName = regionPO.getDeptName();
			
			String currentTimeStr = DateUtil.current("yyyy-MM-dd");
			
			String notCountDesignDepartmentId = SystemConfig.getString("notCountDesignDepartmentId", "");
			String notCountDecorationContractUserId = SystemConfig.getString("notCountDecorationContractUserId", "");
			
			if(notCountDesignDepartmentId.indexOf(designerId) == -1 && notCountDecorationContractUserId.indexOf(userId) == -1){ // 部分部门不参与业绩统计
				decorationRankService.updateDecorationDesignerRank(designerId, designerName, rank, currentTimeStr, decorationOrderCompany);
				decorationRankService.updateDecorationDesignerDepartmentRank(departmentId, departmentName, rank, currentTimeStr, decorationOrderCompany);
				decorationRankService.updateDecorationDesignerRegionRank(regionId, regionName, rank, currentTimeStr, decorationOrderCompany);
			}
			
			decorationOperatePO.setType(DecorationOperatePO.TYPE_SIGN_DECORATION_ORDER_INT);
		}else{
			decorationOperatePO.setType(DecorationOperatePO.TYPE_SIGNED_DECORATION_ORDER_INT);
		}
		
		decorationOperateDao.save(decorationOperatePO);
		
		// 生成业务员对应设计师的合同额信息
		DecorationOperateServiceImpl.makeDecorationOperateForDecorationContract(decorationOperateDao, decorationOrderPO, salemsanOrderBelongInfoPOs, designerOrderBelongInfoPOs, operater, decorationOrderPO.getOrderTotalPrice(), 1, decorationOperatePO.getType());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int resignDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException {
		
		String orderId = decorationContractVO.getOrderId();
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);

		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(!DecorationOrderPO.STATUS_SIGNED_STR.equals(decorationOrderPO.getStatus())){
			throw new FLException(140027, "订单状态不能重签合同");
		}
		
		if(approvalDao.countApprovalForInitByIdent(orderId) > 0){
			throw new FLException(140037, "订单存在未处理审批项");
		}
		
		if(addReduceDao.countAddReduceByOrderId(orderId)>0){
			throw new FLException(140041, "订单存在增减项,不能重新签单");
		}
		
		decorationOrderPO.setStatus(DecorationOrderPO.STATUS_RESIGNED_STR);
		
		decorationOrderDao.update(decorationOrderPO);
		
		UserPO operater = userDao.queryUserByUserId(userId);
		
		DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
		decorationOperatePO.setDecorationOrder(decorationOrderPO);
		decorationOperatePO.setOperater(operater);
		decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationOperatePO.setType(DecorationOperatePO.TYPE_RESIGN_DECORATION_ORDER_INT);
		decorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
		decorationOperatePO.setValue(-decorationOrderPO.getOrderTotalPrice());
		decorationOperatePO.setDes("重签合同");
		
		decorationOperateDao.save(decorationOperatePO);
		
		List<DecorationBelongInfoPO> designerOrderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR);
		List<DecorationBelongInfoPO> salemsanOrderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR);
		
		DecorationOperateServiceImpl.makeDecorationOperateForDecorationContract(decorationOperateDao, decorationOrderPO, salemsanOrderBelongInfoPOs, designerOrderBelongInfoPOs, operater, decorationOrderPO.getOrderTotalPrice(), -1, decorationOperatePO.getType());
		
		return 0;
	}

}
