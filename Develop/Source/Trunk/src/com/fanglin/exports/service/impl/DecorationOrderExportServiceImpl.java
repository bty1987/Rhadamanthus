/**
 * @File Name		: DecorationOrderExportServiceImpl.java
 * @Package   	: com.fanglin.exports.service.impl
 * @Version		: 1.0
 * @Date			: 2017-8-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.exports.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationBelongInfoPO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.exports.service.DecorationOrderExportService;
import com.fanglin.exports.vo.DecorationOrderExportVO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.Arith;

@Service("decorationOrderExportService")
@Transactional(readOnly=true)
public class DecorationOrderExportServiceImpl implements DecorationOrderExportService {
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private AdvancePaymentDao advancePaymentDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private DecorationBelongDao decorationBelongDao;

	@Override
	public List<DecorationOrderExportVO> queryDecorationOrderForComplete(List<Filter> filters) {
		
		List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.queryDecorationOrder(filters);
		
		List<DecorationOrderExportVO> decorationOrderExportVOs = new ArrayList<DecorationOrderExportVO>();
		
		if(decorationOrderPOs.size() == 0){
			return decorationOrderExportVOs;
		}
		
		List<String> orderIds = new ArrayList<String>();
		Map<String, DecorationOrderPO> decorationOrderMap = new HashMap<String, DecorationOrderPO>();
		Map<String, DecorationOrderExportVO> decorationOrderExportMap = new HashMap<String, DecorationOrderExportVO>();
		String orderId;
		for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
			orderId = decorationOrderPO.getOrderId();
			
			DecorationOrderExportVO decorationOrderExportVO = new DecorationOrderExportVO();
			
			decorationOrderExportVO.setOrderId(decorationOrderPO.getOrderId());
			decorationOrderExportVO.setOrderAddr(decorationOrderPO.getVillagePO().getVillageName() + " " + decorationOrderPO.getHouseNumber());
			decorationOrderExportVO.setContractTime(decorationOrderPO.getContractTime());
			decorationOrderExportVO.setNotSalesmanRate(decorationOrderPO.getNotSalesmanRate());
			decorationOrderExportVO.setContractPrice(decorationOrderPO.getOrderTotalPrice());
			decorationOrderExportVO.setUnpayPayment(decorationOrderPO.getOrderTotalPrice());
			decorationOrderExportVO.setSalesmanType(decorationOrderPO.getSalesmanType());
			decorationOrderExportVO.setHouseArea(decorationOrderPO.getHouseArea());
			
			if(decorationOrderPO.getSupervisorPO() != null){
				decorationOrderExportVO.setSupervisor(decorationOrderPO.getSupervisorPO().getCurrentName());
			}
			
			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCid(decorationOrderPO.getCustomerPO().getId(), decorationOrderPO.getCompany());
			if(advancePaymentPO != null){
				decorationOrderExportVO.setAdvancePayment(advancePaymentPO.getBalance());
			}else{
				decorationOrderExportVO.setAdvancePayment(0f);
			}
			
			if(DecorationOrderPO.STATUS_WASTE_STR.equals(decorationOrderPO.getStatus())){
				decorationOrderExportVO.setGiveup(decorationOrderPO.getStatus());
			}else{
				decorationOrderExportVO.setGiveup("");
			}
			
			orderIds.add(orderId);
			decorationOrderMap.put(orderId, decorationOrderPO);
			decorationOrderExportMap.put(orderId, decorationOrderExportVO);
		}
		
		List<QuotationPO> quotationPOs = quotationDao.queryQuotationForDefaultByOrderIds(orderIds);
		
		for(QuotationPO quotationPO: quotationPOs){
		    	
			DecorationOrderExportVO decorationOrderExportVO = decorationOrderExportMap.get(quotationPO.getDecorationOrder().getOrderId());
			
			decorationOrderExportVO.setDiscount(quotationPO.getDiscount());
			decorationOrderExportVO.setLatexCut(quotationPO.getLatexCut());
			decorationOrderExportVO.setManageRate(quotationPO.getManageRate());
			decorationOrderExportVO.setManagePrice(quotationPO.getManagePrice());
			decorationOrderExportVO.setTrafficPrice(quotationPO.getTrafficPrice());
			
			if(quotationPO.getManageRate() == 0){
				decorationOrderExportVO.setNotSalesmanCut(0f);
				decorationOrderExportVO.setAchievement(0f);
			}else{
				decorationOrderExportVO.setNotSalesmanCut((float) Arith.mul(Arith.div(quotationPO.getManagePrice(), quotationPO.getManageRate()), decorationOrderExportVO.getNotSalesmanRate()));
				decorationOrderExportVO.setAchievement(Arith.sub(decorationOrderExportVO.getContractPrice(), decorationOrderExportVO.getNotSalesmanCut()));
			}
		}
		
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderIds(orderIds);
		
		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			DecorationOrderExportVO decorationOrderExportVO = decorationOrderExportMap.get(decorationPaymentPO.getDecorationOrderPO().getOrderId());
			
			DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
			
			if(DecorationPaymentPO.PAYMENTTYPE_FIRST_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setFirstPayment(decorationPaymentPO.getReferMoney());
				
				if(decorationReceiptPO != null){
					decorationOrderExportVO.setFirstCollectTime(decorationReceiptPO.getCollectTime());
	
					if(decorationReceiptPO.getCollectTime() != null){
						decorationOrderExportVO.setUnpayPayment(Arith.sub(decorationOrderExportVO.getUnpayPayment(), decorationPaymentPO.getReferMoney()));
					}
				}
			}else if(DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setFirstSecondPayment(decorationPaymentPO.getReferMoney());
				
				if(decorationReceiptPO != null){
					decorationOrderExportVO.setFirstSecondCollectTime(decorationReceiptPO.getCollectTime());
					
					if(decorationReceiptPO.getCollectTime() != null){
						decorationOrderExportVO.setUnpayPayment(Arith.sub(decorationOrderExportVO.getUnpayPayment(), decorationPaymentPO.getReferMoney()));
					}
				}
			}else if(DecorationPaymentPO.PAYMENTTYPE_SECOND_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setSecondPayment(decorationPaymentPO.getReferMoney());
				
				if(decorationReceiptPO != null){
					decorationOrderExportVO.setSecondCollectTime(decorationReceiptPO.getCollectTime());
					
					if(decorationReceiptPO.getCollectTime() != null){
						decorationOrderExportVO.setUnpayPayment(Arith.sub(decorationOrderExportVO.getUnpayPayment(), decorationPaymentPO.getReferMoney()));
					}
				}
			}else if(DecorationPaymentPO.PAYMENTTYPE_FINAL_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setThirdPayment(decorationPaymentPO.getReferMoney());
				
				if(decorationReceiptPO != null){
					decorationOrderExportVO.setThirdCollectTime(decorationReceiptPO.getCollectTime());
					
					if(decorationReceiptPO.getCollectTime() != null){
						decorationOrderExportVO.setUnpayPayment(Arith.sub(decorationOrderExportVO.getUnpayPayment(), decorationPaymentPO.getReferMoney()));
					}
				}
			}else if(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setPenalty(decorationPaymentPO.getReferMoney());
			}else if(DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setDesignPayment(decorationPaymentPO.getReferMoney());
				decorationOrderExportVO.setDesignPaymentStatus(decorationPaymentPO.getPaymentStatus());
			}
		}
		
		List<DecorationBelongInfoPO> orderBelongInfoPOs = decorationBelongDao.queryOrderBelongInfoByOrderIds(orderIds);
		
		for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
			
			try {
				DecorationOrderExportVO decorationOrderExportVO = (DecorationOrderExportVO) decorationOrderExportMap.get(orderBelongInfoPO.getDecorationOrderPO().getOrderId()).clone();
				
				UserPO belongUserPO = orderBelongInfoPO.getBelongUserPO();
				DepartmentPO departmentPO = orderBelongInfoPO.getBelongDeptPO();
				DepartmentPO regionPO = orderBelongInfoPO.getBelongRegionPO();
				
				decorationOrderExportVO.setUserId(belongUserPO.getUserId());
				decorationOrderExportVO.setOperateUserId(belongUserPO.getOldUserId());
				decorationOrderExportVO.setOperateUserName(belongUserPO.getCurrentName());
				
				if(departmentPO != null){
					decorationOrderExportVO.setDepartmentId(departmentPO.getDeptId());
					decorationOrderExportVO.setDepartment(departmentPO.getDeptName());
				}else{
					decorationOrderExportVO.setDepartmentId("");
					decorationOrderExportVO.setDepartment("");
				}
				
				if(regionPO != null){
					decorationOrderExportVO.setRegionId(regionPO.getDeptId());
					decorationOrderExportVO.setRegion(regionPO.getDeptName());
				}else{
					decorationOrderExportVO.setRegionId("");
					decorationOrderExportVO.setRegion("");
				}
				
				decorationOrderExportVO.setRate(orderBelongInfoPO.getBelongRate());
				decorationOrderExportVO.setOperateType(orderBelongInfoPO.getBelongType());
				
				if(orderBelongInfoPO.getBelongRate() < 1){
					decorationOrderExportVO.setMerge("合尺");
				}else{
					decorationOrderExportVO.setMerge("");
				}
				
				decorationOrderExportVOs.add(decorationOrderExportVO);
			} catch (CloneNotSupportedException e) {
				e.printStackTrace();
			}
		}
		
		return decorationOrderExportVOs;
	}

}
