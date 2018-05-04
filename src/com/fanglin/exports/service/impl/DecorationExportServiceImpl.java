/**
 * @File Name		: DecorationExportServiceImpl.java
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

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.exports.service.DecorationExportService;
import com.fanglin.exports.vo.DecorationExportVO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.Arith;

@Service("decorationExportService")
@Transactional(readOnly=true)
public class DecorationExportServiceImpl implements DecorationExportService {
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private AdvancePaymentDao advancePaymentDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private DecorationBelongDao decorationBelongDao;

	@Override
	public List<DecorationExportVO> queryDecorationForComplete(List<Filter> filters) {
		
		List<DecorationPO> decorationPOs = decorationDao.queryDecoration(filters);
		
		List<DecorationExportVO> decorationExportVOs = new ArrayList<DecorationExportVO>();
		
		if(decorationPOs.size() == 0){
			return decorationExportVOs;
		}
		
		List<String> orderIds = new ArrayList<String>();
		Map<String, DecorationPO> decorationMap = new HashMap<String, DecorationPO>();
		Map<String, DecorationExportVO> decorationExportMap = new HashMap<String, DecorationExportVO>();
		String orderId;
		for(DecorationPO decorationPO: decorationPOs){
			orderId = decorationPO.getOrderId();
			
			DecorationExportVO decorationExportVO = new DecorationExportVO();
			
			decorationExportVO.setOrderId(decorationPO.getOrderId());
			decorationExportVO.setOrderAddr(decorationPO.getHouse().getVillage().getName() + " " + decorationPO.getHouse().getHouseNumber());
			decorationExportVO.setContractTime(decorationPO.getContractTime());
			decorationExportVO.setNotSalesmanRate(decorationPO.getNotSalesmanRate());
			decorationExportVO.setContractPrice(decorationPO.getOrderTotalPrice());
			decorationExportVO.setUnpayPayment(decorationPO.getOrderTotalPrice());
			decorationExportVO.setSalesmanType(decorationPO.getSalesmanType());
			decorationExportVO.setHouseArea(decorationPO.getHouse().getBuildArea());
			
			if(decorationPO.getSupervisor() != null){
				decorationExportVO.setSupervisor(decorationPO.getSupervisor().getCurrentName());
			}
			
			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCid(decorationPO.getCustomer().getCid(), decorationPO.getCompany());
			if(advancePaymentPO != null){
				decorationExportVO.setAdvancePayment(advancePaymentPO.getBalance());
			}else{
				decorationExportVO.setAdvancePayment(0f);
			}
			
			if(DecorationPO.STATUS_WASTE_STR.equals(decorationPO.getStatus())){
				decorationExportVO.setGiveup(decorationPO.getStatus());
			}else{
				decorationExportVO.setGiveup("");
			}
			
			orderIds.add(orderId);
			decorationMap.put(orderId, decorationPO);
			decorationExportMap.put(orderId, decorationExportVO);
		}
		
		List<QuotationPO> quotationPOs = quotationDao.queryQuotationForDefaultByOrderIds(orderIds);
		
		for(QuotationPO quotationPO: quotationPOs){
		    	
			DecorationExportVO decorationExportVO = decorationExportMap.get(quotationPO.getOrderId());
			
			decorationExportVO.setDiscount(quotationPO.getDiscount());
			decorationExportVO.setManageRate(quotationPO.getManageRate());
			decorationExportVO.setManagePrice(quotationPO.getManagePrice());
			decorationExportVO.setTrafficPrice(quotationPO.getTrafficPrice());
			
			if(quotationPO.getManageRate() == 0){
				decorationExportVO.setNotSalesmanCut(0f);
				decorationExportVO.setAchievement(0f);
			}else{
				decorationExportVO.setNotSalesmanCut((float) Arith.mul(Arith.div(quotationPO.getManagePrice(), quotationPO.getManageRate()), decorationExportVO.getNotSalesmanRate()));
				decorationExportVO.setAchievement(Arith.sub(decorationExportVO.getContractPrice(), decorationExportVO.getNotSalesmanCut()));
			}
		}
		
		List<DecorationBelongPO> decorationBelongPOs = decorationBelongDao.queryOrderBelongInfoByOrderIds(orderIds);
		
		for(DecorationBelongPO decorationBelongPO: decorationBelongPOs){
			
			try {
				DecorationExportVO decorationExportVO = (DecorationExportVO) decorationExportMap.get(decorationBelongPO.getOrderId()).clone();
				
				UserPO belongUserPO = decorationBelongPO.getBelonger();
				DepartmentPO departmentPO = decorationBelongPO.getDepartment();
				DepartmentPO regionPO = decorationBelongPO.getRegion();
				
				decorationExportVO.setUserId(belongUserPO.getUserId());
				decorationExportVO.setOperateUserId(belongUserPO.getOldUserId());
				decorationExportVO.setOperateUserName(belongUserPO.getCurrentName());
				
				if(departmentPO != null){
					decorationExportVO.setDepartmentId(departmentPO.getDeptId());
					decorationExportVO.setDepartment(departmentPO.getDeptName());
				}else{
					decorationExportVO.setDepartmentId("");
					decorationExportVO.setDepartment("");
				}
				
				if(regionPO != null){
					decorationExportVO.setRegionId(regionPO.getDeptId());
					decorationExportVO.setRegion(regionPO.getDeptName());
				}else{
					decorationExportVO.setRegionId("");
					decorationExportVO.setRegion("");
				}
				
				decorationExportVO.setRate(decorationBelongPO.getRate());
				decorationExportVO.setOperateType(decorationBelongPO.getType() == DecorationBelongPO.BELONGTYPE_DESIGN_INT ? "设计" : "业务");
				
				if(decorationBelongPO.getRate() < 1){
					decorationExportVO.setMerge("合尺");
				}else{
					decorationExportVO.setMerge("");
				}
				
				decorationExportVOs.add(decorationExportVO);
			} catch (CloneNotSupportedException e) {
				e.printStackTrace();
			}
		}
		
		return decorationExportVOs;
	}

}
